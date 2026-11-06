<?php
defined('MOODLE_INTERNAL') || die();

$user_initials = substr($USER->firstname, 0, 1) . substr($USER->lastname, 0, 1);
$user_fullname = fullname($USER);

// Mock Stats Data
$stats = [
    ['icon' => 'fa-users', 'value' => '4', 'label' => 'Cursos Activos', 'color_class' => 'text-primary'],
    ['icon' => 'fa-check-square', 'value' => '7', 'label' => 'Tareas Pendientes', 'color_class' => 'text-warning'],
    ['icon' => 'fa-chart-line', 'value' => '8.5', 'label' => 'Promedio General', 'color_class' => 'text-success'],
    ['icon' => 'fa-clock', 'value' => '32', 'label' => 'Horas de Estudio', 'color_class' => 'text-info'],
];

// Mock Courses Data
$courses = [
    [
        'title' => 'Matemáticas Avanzadas',
        'prof' => 'Prof. María González',
        'progress' => 75,
        'modules' => '9/12',
        'students' => 32,
        'hours' => 24,
        'badge_text' => 'En progreso',
        'style' => 'background: linear-gradient(135deg, #d8b4fe, #93c5fd);'
    ],
    [
        'title' => 'Programación Web',
        'prof' => 'Prof. Carlos Ruiz',
        'progress' => 60,
        'modules' => '9/15',
        'students' => 28,
        'hours' => 36,
        'badge_text' => 'En progreso',
        'style' => 'background: linear-gradient(135deg, #fdba74, #f9a8d4);'
    ],
    [
        'title' => 'Historia del Arte',
        'prof' => 'Prof. Ana Martínez',
        'progress' => 90,
        'modules' => '9/10',
        'students' => 45,
        'hours' => 20,
        'badge_text' => 'Casi completo',
        'style' => 'background: linear-gradient(135deg, #bfdbfe, #a5f3fc);'
    ],
    [
        'title' => 'Física Cuántica',
        'prof' => 'Prof. Roberto Silva',
        'progress' => 45,
        'modules' => '5/12',
        'students' => 18,
        'hours' => 30,
        'badge_text' => 'En progreso',
        'style' => 'background: linear-gradient(135deg, #f9a8d4, #d8b4fe);'
    ]
];

$templatecontext = [
    'sitename' => format_string($SITE->shortname),
    'logo_url' => $OUTPUT->image_url('logo', 'theme_numu_cyber')->out(),
    'user_initials' => $user_initials,
    'user_fullname' => $user_fullname,
    'user_role' => 'Estudiante',
    'stats' => $stats,
    'courses' => $courses,
    'home_url' => $CFG->wwwroot . '/my',
    'is_home_active' => true
];

echo $OUTPUT->doctype();
?>
<html <?php echo $OUTPUT->htmlattributes(); ?>>

<head>
    <title>
        <?php echo $PAGE->title; ?>
    </title>
    <link rel="shortcut icon" href="<?php echo $OUTPUT->favicon(); ?>" />
    <?php echo $OUTPUT->standard_head_html() ?>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <style>
        .custom-sidebar {
            width: 260px;
            min-height: 100vh;
            background: linear-gradient(180deg, #1e3a8a 0%, #172554 100%);
            color: white;
        }

        .custom-nav-link {
            color: rgba(255, 255, 255, 0.7);
            padding: 12px 20px;
            display: flex;
            align-items: center;
            text-decoration: none;
            transition: all 0.2s;
            border-radius: 8px;
            margin-bottom: 4px;
        }

        .custom-nav-link:hover,
        .custom-nav-link.active {
            background: rgba(255, 255, 255, 0.1);
            color: white;
        }

        .custom-nav-link i {
            width: 24px;
        }

        .dashboard-container {
            background-color: #f8fafc;
            min-height: 100vh;
        }

        .stat-card {
            background: white;
            border-radius: 12px;
            padding: 24px;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
            border: 1px solid #e2e8f0;
        }

        .course-card {
            border-radius: 16px;
            padding: 24px;
            color: #1e293b;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            transition: transform 0.2s;
            position: relative;
            overflow: hidden;
        }

        .course-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        }

        .progress-circle {
            width: 60px;
            height: 60px;
            position: absolute;
            top: 20px;
            right: 20px;
        }

        .badge-status {
            background: rgba(255, 255, 255, 0.9);
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
            display: inline-block;
            margin-bottom: 24px;
        }
    </style>
</head>

<body <?php echo $OUTPUT->body_attributes(); ?>>
    <?php echo $OUTPUT->standard_top_of_body_html() ?>

    <?php
    // Main content placeholder - required by Moodle
    echo $OUTPUT->main_content();
    ?>

    <?php echo $OUTPUT->render_from_template('theme_numu_cyber/dashboard_page', $templatecontext); ?>

    <?php echo $OUTPUT->standard_end_of_body_html() ?>
</body>

</html>