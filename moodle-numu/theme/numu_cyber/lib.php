<?php
/**
 * Theme NUMU Cyber - Library Functions
 *
 * @package    theme_numu_cyber
 * @copyright  2026 NUMU Group
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

defined('MOODLE_INTERNAL') || die();

/**
 * Get SCSS to prepend.
 *
 * @param theme_config $theme The theme config object.
 * @return string
 */
function theme_numu_cyber_get_main_scss_content($theme)
{
    global $CFG;

    $scss = '';
    $filename = !empty($theme->settings->preset) ? $theme->settings->preset : null;
    $fs = get_file_storage();

    $context = context_system::instance();
    $scss .= file_get_contents($CFG->dirroot . '/theme/boost/scss/preset/default.scss');
    $scss .= file_get_contents($CFG->dirroot . '/theme/boost/scss/boost.scss');
    $scss .= file_get_contents($CFG->dirroot . '/theme/numu_cyber/scss/numu_cyber.scss');

    return $scss;
}

/**
 * Serves any files associated with the theme settings.
 *
 * @param stdClass $course
 * @param stdClass $cm
 * @param context $context
 * @param string $filearea
 * @param array $args
 * @param bool $forcedownload
 * @param array $options
 * @return bool
 */
function theme_numu_cyber_pluginfile($course, $cm, $context, $filearea, $args, $forcedownload, array $options = array())
{
    if ($context->contextlevel == CONTEXT_SYSTEM) {
        $theme = theme_config::load('numu_cyber');
        return $theme->setting_file_serve($filearea, $args, $forcedownload, $options);
    } else {
        send_file_not_found();
    }
}

/**
 * Get the user preference for dark mode.
 *
 * @return bool
 */
function theme_numu_cyber_get_dark_mode_preference()
{
    return get_user_preferences('theme_numu_cyber_darkmode', true);
}

/**
 * Get pre-SCSS content.
 *
 * @param theme_config $theme The theme config object.
 * @return string
 */
function theme_numu_cyber_get_pre_scss($theme)
{
    return '';
}

