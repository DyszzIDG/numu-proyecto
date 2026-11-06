<?php
/**
 * Moodle Configuration - NUMU Education Module
 * Enterprise-grade configuration for cybersecurity training platform
 */

unset($CFG);
global $CFG;
$CFG = new stdClass();

// ============================================================================
// DATABASE CONFIGURATION (PostgreSQL)
// ============================================================================
$CFG->dbtype    = 'pgsql';
$CFG->dblibrary = 'native';
$CFG->dbhost    = getenv('MOODLE_DATABASE_HOST') ?: 'postgres';
$CFG->dbname    = getenv('MOODLE_DATABASE_NAME') ?: 'moodle_numu';
$CFG->dbuser    = getenv('MOODLE_DATABASE_USER') ?: 'moodle_user';
$CFG->dbpass    = getenv('MOODLE_DATABASE_PASSWORD') ?: 'numu_secure_2026';
$CFG->prefix    = 'mdl_';
$CFG->dboptions = array(
    'dbpersist' => false,
    'dbsocket'  => false,
    'dbport'    => '5432',
    'dbcollation' => 'utf8mb4_unicode_ci',
);

// ============================================================================
// PATHS AND DIRECTORIES
// ============================================================================
$CFG->wwwroot   = 'http://localhost:8080';
$CFG->dataroot  = '/var/www/moodledata';
$CFG->directorypermissions = 02777;
$CFG->admin     = 'admin';

// ============================================================================
// SESSION CONFIGURATION (Redis)
// ============================================================================
$CFG->session_handler_class = '\core\session\redis';
$CFG->session_redis_host = 'redis';
$CFG->session_redis_port = 6379;
$CFG->session_redis_auth = 'numu_redis_2026';
$CFG->session_redis_database = 0;
$CFG->session_redis_prefix = 'numu_sess_';
$CFG->session_redis_acquire_lock_timeout = 120;
$CFG->session_redis_lock_expire = 7200;

// ============================================================================
// PERFORMANCE OPTIMIZATION
// ============================================================================
// Cache
$CFG->cachejs = true;
$CFG->yuicomboloading = true;
$CFG->enablecaching = true;

// Theme
$CFG->theme = 'numu_cyber';
$CFG->themedir = '';
$CFG->themedesignermode = false; // Set to true during theme development

// Language
$CFG->lang = 'es';
$CFG->langotherroot = '';
$CFG->langmenu = 1;

// ============================================================================
// SECURITY CONFIGURATION
// ============================================================================
// Password Policy
$CFG->passwordpolicy = true;
$CFG->minpasswordlength = 12;
$CFG->minpassworddigits = 2;
$CFG->minpasswordlower = 2;
$CFG->minpasswordupper = 2;
$CFG->minpasswordnonalphanum = 2;
$CFG->maxconsecutiveidentchars = 0;

// Login Security
$CFG->lockoutthreshold = 5;
$CFG->lockoutwindow = 1800; // 30 minutes
$CFG->lockoutduration = 3600; // 1 hour

// File Security
$CFG->maxbytes = 104857600; // 100MB max file upload
$CFG->disableupdateautodeploy = true;
$CFG->disableupdatenotifications = false;

// SSL/TLS (for production)
// $CFG->sslproxy = true;
// $CFG->reverseproxy = true;

// ============================================================================
// EMAIL CONFIGURATION
// ============================================================================
$CFG->noreplyaddress = 'noreply@numu.com';
$CFG->emailfromvia = 0;

// SMTP Configuration (uncomment for production)
// $CFG->smtphosts = 'smtp.gmail.com:587';
// $CFG->smtpsecure = 'tls';
// $CFG->smtpauthtype = 'LOGIN';
// $CFG->smtpuser = 'your-email@numu.com';
// $CFG->smtppass = 'your-password';

// ============================================================================
// DEBUGGING (Development Only)
// ============================================================================
$CFG->debug = (E_ALL | E_STRICT); // Change to 0 in production
$CFG->debugdisplay = 1; // Change to 0 in production
$CFG->debugsmtp = false;
$CFG->perfdebug = 15;
$CFG->debugpageinfo = 1;

// ============================================================================
// BACKUP AND RESTORE
// ============================================================================
$CFG->backup_auto_active = 1;
$CFG->backup_auto_weekdays = '0,1,2,3,4,5,6';
$CFG->backup_auto_hour = 2;
$CFG->backup_auto_minute = 0;
$CFG->backup_auto_storage = 1;
$CFG->backup_auto_destination = '/var/www/moodledata/backups';

// ============================================================================
// CRON CONFIGURATION
// ============================================================================
$CFG->cronclionly = false;
$CFG->cronremotepassword = 'numu_cron_secret_2026';

// ============================================================================
// EXTERNAL INTEGRATION (NUMU Dashboard)
// ============================================================================
$CFG->custommenuitems = "
Dashboard NUMU|https://numu.com/dashboard
Mis Cursos|/my/
Certificados|/badges/mybadges.php
Soporte|https://numu.com/support
";

// Alternate login URL (for SSO future implementation)
// $CFG->alternateloginurl = 'https://numu.com/sso/moodle';

// ============================================================================
// CUSTOM SETTINGS
// ============================================================================
// NUMU Integration API
$CFG->numu_api_endpoint = 'http://localhost:3000/api/moodle';
$CFG->numu_api_key = 'numu_integration_key_2026';
$CFG->numu_webhook_secret = 'numu_webhook_secret_2026';

// Analytics
$CFG->enableanalytics = true;
$CFG->analyticsenabled = true;

// Mobile App
$CFG->enablemobilewebservice = 1;

// ============================================================================
// DO NOT MODIFY BELOW THIS LINE
// ============================================================================
require_once(__DIR__ . '/../lib/setup.php');
