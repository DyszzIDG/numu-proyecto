<?php
/**
 * NUMU Integration Plugin - API Endpoints
 *
 * Provides REST API for integration with NUMU Dashboard
 *
 * @package    local_numu_integration
 * @copyright  2026 NUMU Group
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

require_once('../../../config.php');
require_once($CFG->dirroot . '/local/numu_integration/lib.php');

// Verify API key
$api_key = $_SERVER['HTTP_X_API_KEY'] ?? '';
if ($api_key !== $CFG->numu_api_key) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

$action = required_param('action', PARAM_ALPHA);

header('Content-Type: application/json');

switch ($action) {
    case 'sync_user':
        sync_user_from_numu();
        break;

    case 'get_user_progress':
        get_user_progress();
        break;

    case 'get_team_analytics':
        get_team_analytics();
        break;

    case 'enroll_user':
        enroll_user_in_course();
        break;

    default:
        http_response_code(400);
        echo json_encode(['error' => 'Invalid action']);
}

/**
 * Sync user from NUMU Dashboard
 */
function sync_user_from_numu()
{
    global $DB, $CFG;

    $data = json_decode(file_get_contents('php://input'), true);

    $required = ['email', 'firstname', 'lastname', 'role'];
    foreach ($required as $field) {
        if (empty($data[$field])) {
            http_response_code(400);
            echo json_encode(['error' => "Missing field: $field"]);
            return;
        }
    }

    // Check if user exists
    $user = $DB->get_record('user', ['email' => $data['email'], 'deleted' => 0]);

    if ($user) {
        // Update existing user
        $user->firstname = $data['firstname'];
        $user->lastname = $data['lastname'];
        $user->modified = time();
        $DB->update_record('user', $user);
    } else {
        // Create new user
        $user = new stdClass();
        $user->auth = 'manual';
        $user->confirmed = 1;
        $user->mnethostid = $CFG->mnet_localhost_id;
        $user->email = $data['email'];
        $user->username = strtolower($data['email']);
        $user->firstname = $data['firstname'];
        $user->lastname = $data['lastname'];
        $user->password = hash_internal_user_password(bin2hex(random_bytes(16)));
        $user->timecreated = time();
        $user->timemodified = time();

        $user->id = $DB->insert_record('user', $user);
    }

    // Assign role
    assign_numu_role($user->id, $data['role']);

    echo json_encode([
        'success' => true,
        'user_id' => $user->id,
        'email' => $user->email
    ]);
}

/**
 * Get user progress across all courses
 */
function get_user_progress()
{
    global $DB;

    $email = required_param('email', PARAM_EMAIL);

    $user = $DB->get_record('user', ['email' => $email, 'deleted' => 0]);
    if (!$user) {
        http_response_code(404);
        echo json_encode(['error' => 'User not found']);
        return;
    }

    $courses = enrol_get_users_courses($user->id, true);
    $progress_data = [];

    foreach ($courses as $course) {
        $completion = new completion_info($course);
        $percentage = progress_get_course_progress_percentage($course, $user->id);

        // Get grade
        $grade_item = grade_item::fetch(['courseid' => $course->id, 'itemtype' => 'course']);
        $grade = null;
        if ($grade_item) {
            $grade_grade = new grade_grade(['itemid' => $grade_item->id, 'userid' => $user->id]);
            $grade = $grade_grade->finalgrade ? round($grade_grade->finalgrade, 2) : null;
        }

        // Check for certificate
        $certificate_url = get_certificate_url($course->id, $user->id);

        $progress_data[] = [
            'course_id' => $course->id,
            'course_name' => $course->fullname,
            'progress' => $percentage ? round($percentage, 2) : 0,
            'grade' => $grade,
            'completed' => $completion->is_course_complete($user->id),
            'certificate_url' => $certificate_url,
            'last_access' => $DB->get_field(
                'user_lastaccess',
                'timeaccess',
                ['userid' => $user->id, 'courseid' => $course->id]
            )
        ];
    }

    echo json_encode([
        'user_id' => $user->id,
        'email' => $user->email,
        'fullname' => fullname($user),
        'courses' => $progress_data
    ]);
}

/**
 * Get team analytics
 */
function get_team_analytics()
{
    global $DB;

    $total_users = $DB->count_records('user', ['deleted' => 0, 'suspended' => 0]) - 1; // Exclude admin

    // Active users (last 7 days)
    $week_ago = time() - (7 * 24 * 60 * 60);
    $active_7days = $DB->count_records_select(
        'user',
        'deleted = 0 AND suspended = 0 AND lastaccess > ?',
        [$week_ago]
    );

    // Active users (last 30 days)
    $month_ago = time() - (30 * 24 * 60 * 60);
    $active_30days = $DB->count_records_select(
        'user',
        'deleted = 0 AND suspended = 0 AND lastaccess > ?',
        [$month_ago]
    );

    // Course completions
    $sql = "SELECT COUNT(*) FROM {course_completions} WHERE timecompleted IS NOT NULL";
    $completions = $DB->count_records_sql($sql);

    // Average grade
    $sql = "SELECT AVG(finalgrade) as avg_grade FROM {grade_grades} 
            WHERE finalgrade IS NOT NULL AND finalgrade > 0";
    $avg_grade = $DB->get_field_sql($sql);

    // Certificates issued
    $certificates = 0; // Implement based on certificate plugin

    // Courses by category
    $categories = $DB->get_records_sql("
        SELECT c.id, c.name, COUNT(co.id) as course_count
        FROM {course_categories} c
        LEFT JOIN {course} co ON co.category = c.id
        GROUP BY c.id, c.name
    ");

    echo json_encode([
        'total_users' => $total_users,
        'active_users_7d' => $active_7days,
        'active_users_30d' => $active_30days,
        'courses_completed' => $completions,
        'avg_score' => $avg_grade ? round($avg_grade, 2) : 0,
        'certificates_issued' => $certificates,
        'categories' => array_values($categories),
        'timestamp' => time()
    ]);
}

/**
 * Enroll user in course
 */
function enroll_user_in_course()
{
    global $DB;

    $data = json_decode(file_get_contents('php://input'), true);

    $email = $data['email'] ?? '';
    $course_id = $data['course_id'] ?? 0;

    $user = $DB->get_record('user', ['email' => $email, 'deleted' => 0]);
    if (!$user) {
        http_response_code(404);
        echo json_encode(['error' => 'User not found']);
        return;
    }

    $course = $DB->get_record('course', ['id' => $course_id]);
    if (!$course) {
        http_response_code(404);
        echo json_encode(['error' => 'Course not found']);
        return;
    }

    // Enroll user
    $enrol = enrol_get_plugin('manual');
    $instances = enrol_get_instances($course->id, true);
    $manualinstance = null;
    foreach ($instances as $instance) {
        if ($instance->enrol === 'manual') {
            $manualinstance = $instance;
            break;
        }
    }

    if ($manualinstance) {
        $enrol->enrol_user($manualinstance, $user->id, 5); // Student role
        echo json_encode([
            'success' => true,
            'message' => 'User enrolled successfully'
        ]);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Manual enrollment not enabled']);
    }
}

/**
 * Assign NUMU role to user
 */
function assign_numu_role($userid, $role_name)
{
    global $DB;

    $role_mapping = [
        'student' => 5,
        'instructor' => 3,
        'soc_analyst' => 5, // Custom role (create manually)
        'ciso' => 1
    ];

    $roleid = $role_mapping[$role_name] ?? 5;
    $context = context_system::instance();

    role_assign($roleid, $userid, $context->id);
}

/**
 * Get certificate URL if available
 */
function get_certificate_url($courseid, $userid)
{
    // Implement based on certificate plugin installed
    // This is a placeholder
    return null;
}

/**
 * Get course progress percentage
 */
function progress_get_course_progress_percentage($course, $userid)
{
    $completion = new completion_info($course);

    if (!$completion->is_enabled()) {
        return null;
    }

    $modules = $completion->get_activities();
    if (empty($modules)) {
        return null;
    }

    $completed = 0;
    foreach ($modules as $module) {
        $data = $completion->get_data($module, false, $userid);
        if ($data->completionstate != COMPLETION_INCOMPLETE) {
            $completed++;
        }
    }

    return (count($modules) > 0) ? ($completed / count($modules)) * 100 : 0;
}
