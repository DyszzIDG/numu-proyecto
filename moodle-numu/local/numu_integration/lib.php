<?php
/**
 * NUMU Integration Plugin - Library Functions
 *
 * @package    local_numu_integration
 * @copyright  2026 NUMU Group
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

defined('MOODLE_INTERNAL') || die();

/**
 * Send webhook to NUMU Dashboard when course is completed
 */
function local_numu_integration_course_completed($event)
{
    global $CFG, $DB;

    $data = $event->get_data();
    $userid = $data['relateduserid'];
    $courseid = $data['courseid'];

    $user = $DB->get_record('user', ['id' => $userid]);
    $course = $DB->get_record('course', ['id' => $courseid]);

    if (!$user || !$course) {
        return;
    }

    // Get grade
    $grade_item = grade_item::fetch(['courseid' => $courseid, 'itemtype' => 'course']);
    $grade = null;
    if ($grade_item) {
        $grade_grade = new grade_grade(['itemid' => $grade_item->id, 'userid' => $userid]);
        $grade = $grade_grade->finalgrade ? round($grade_grade->finalgrade, 2) : null;
    }

    $webhook_data = [
        'event' => 'course_completed',
        'user_id' => $user->id,
        'email' => $user->email,
        'course_id' => $course->id,
        'course_name' => $course->fullname,
        'completion_date' => time(),
        'grade' => $grade,
        'timestamp' => time()
    ];

    send_numu_webhook($webhook_data);
}

/**
 * Send webhook to NUMU Dashboard
 */
function send_numu_webhook($data)
{
    global $CFG;

    if (empty($CFG->numu_api_endpoint)) {
        return;
    }

    $url = $CFG->numu_api_endpoint . '/webhook';

    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: application/json',
        'X-Webhook-Secret: ' . $CFG->numu_webhook_secret
    ]);

    $response = curl_exec($ch);
    $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($http_code !== 200) {
        debugging("NUMU webhook failed: HTTP $http_code", DEBUG_DEVELOPER);
    }
}
