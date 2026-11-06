<?php
/**
 * Theme NUMU Cyber - Settings
 *
 * @package    theme_numu_cyber
 * @copyright  2026 NUMU Group
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

defined('MOODLE_INTERNAL') || die();

if ($ADMIN->fulltree) {
    // Logo file setting
    $name = 'theme_numu_cyber/logo';
    $title = get_string('logo', 'theme_numu_cyber');
    $description = get_string('logodesc', 'theme_numu_cyber');
    $setting = new admin_setting_configstoredfile($name, $title, $description, 'logo');
    $setting->set_updatedcallback('theme_reset_all_caches');
    $settings->add($setting);

    // Compact logo file setting
    $name = 'theme_numu_cyber/compactlogo';
    $title = get_string('compactlogo', 'theme_numu_cyber');
    $description = get_string('compactlogodesc', 'theme_numu_cyber');
    $setting = new admin_setting_configstoredfile($name, $title, $description, 'compactlogo');
    $setting->set_updatedcallback('theme_reset_all_caches');
    $settings->add($setting);
}
