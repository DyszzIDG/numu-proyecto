<?php
/**
 * Theme NUMU Cyber - Configuration
 * 
 * Enterprise cybersecurity theme for NUMU Education Platform
 * Based on Boost theme with custom branding and dark mode
 *
 * @package    theme_numu_cyber
 * @copyright  2026 NUMU Group
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

defined('MOODLE_INTERNAL') || die();

$THEME->name = 'numu_cyber';
$THEME->parents = ['boost'];
$THEME->sheets = ['numu_cyber'];
$THEME->editor_sheets = [];
$THEME->usefallback = true;

$THEME->scss = function ($theme) {
    return theme_numu_cyber_get_main_scss_content($theme);
};

$THEME->layouts = [
    'base' => array(
        'file' => 'columns2.php',
        'regions' => array(),
    ),
    'standard' => array(
        'file' => 'columns2.php',
        'regions' => array('side-pre'),
        'defaultregion' => 'side-pre',
    ),
    'course' => array(
        'file' => 'columns2.php',
        'regions' => array('side-pre'),
        'defaultregion' => 'side-pre',
        'options' => array('langmenu' => true),
    ),
    'coursecategory' => array(
        'file' => 'columns2.php',
        'regions' => array('side-pre'),
        'defaultregion' => 'side-pre',
    ),
    'incourse' => array(
        'file' => 'columns2.php',
        'regions' => array('side-pre'),
        'defaultregion' => 'side-pre',
    ),
    'frontpage' => array(
        'file' => 'frontpage.php',
        'regions' => array('side-pre'),
        'defaultregion' => 'side-pre',
        'options' => array('nonavbar' => true),
    ),
    'admin' => array(
        'file' => 'columns2.php',
        'regions' => array('side-pre'),
        'defaultregion' => 'side-pre',
    ),
    'mydashboard' => array(
        'file' => 'columns2.php',
        'regions' => array('side-pre'),
        'defaultregion' => 'side-pre',
    ),
    'mypublic' => array(
        'file' => 'columns2.php',
        'regions' => array('side-pre'),
        'defaultregion' => 'side-pre',
    ),
    'login' => array(
        'file' => 'login.php',
        'regions' => array(),
        'options' => array('langmenu' => true),
    ),
    'popup' => array(
        'file' => 'columns1.php',
        'regions' => array(),
        'options' => array('nofooter' => true, 'nonavbar' => true),
    ),
    'frametop' => array(
        'file' => 'columns1.php',
        'regions' => array(),
        'options' => array('nofooter' => true, 'nonavbar' => true),
    ),
    'embedded' => array(
        'file' => 'embedded.php',
        'regions' => array(),
    ),
    'maintenance' => array(
        'file' => 'maintenance.php',
        'regions' => array(),
    ),
    'print' => array(
        'file' => 'columns1.php',
        'regions' => array(),
        'options' => array('nofooter' => true, 'nonavbar' => false),
    ),
    'redirect' => array(
        'file' => 'embedded.php',
        'regions' => array(),
    ),
    'report' => array(
        'file' => 'columns2.php',
        'regions' => array('side-pre'),
        'defaultregion' => 'side-pre',
    ),
    'secure' => array(
        'file' => 'secure.php',
        'regions' => array('side-pre'),
        'defaultregion' => 'side-pre'
    ),
];

$THEME->enable_dock = false;
$THEME->yuicssmodules = array();
$THEME->rendererfactory = 'theme_overridden_renderer_factory';
$THEME->requiredblocks = '';
$THEME->addblockposition = BLOCK_ADDBLOCK_POSITION_FLATNAV;
$THEME->iconsystem = \core\output\icon_system::FONTAWESOME;
$THEME->haseditswitch = true;
$THEME->usescourseindex = true;

// Logo settings
$THEME->supportscssoptimisation = false;
$THEME->yuicssmodules = array();
$THEME->prescsscallback = 'theme_numu_cyber_get_pre_scss';

$THEME->activityheaderconfig = [
    'notitle' => false,
];
