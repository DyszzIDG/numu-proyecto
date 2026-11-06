require('dotenv').config();
const axios = require('axios');

const MOODLE_URL = process.env.MOODLE_URL || 'http://localhost:8080';
const TOKEN = process.env.MOODLE_WS_TOKEN;

if (!TOKEN) {
    console.error('❌ Error: MOODLE_WS_TOKEN is missing in .env');
    process.exit(1);
}

const BASE_URL = `${MOODLE_URL}/webservice/rest/server.php`;

async function callMoodle(functionName, params = {}) {
    try {
        const response = await axios.get(BASE_URL, {
            params: {
                wstoken: TOKEN,
                wsfunction: functionName,
                moodlewsrestformat: 'json',
                ...params
            }
        });

        if (response.data.exception) {
            console.error(`❌ Function ${functionName} FAILED:`);
            console.error(`   Error Code: ${response.data.errorcode}`);
            console.error(`   Message: ${response.data.message}`);
            if (response.data.debuginfo) console.error(`   Debug: ${response.data.debuginfo}`);
            return false;
        }

        console.log(`✅ Function ${functionName} SUCCESS`);
        return true;
    } catch (error) {
        console.error(`❌ HTTP Error calling ${functionName}:`, error.message);
        return false;
    }
}

async function testConnection() {
    console.log(`🔍 Testing Moodle Connection...`);
    console.log(`   URL: ${MOODLE_URL}`);
    console.log(`   Token: ${TOKEN.substring(0, 5)}...`);

    // 1. Validar Info del Sitio (Check básico)
    const siteInfo = await callMoodle('core_webservice_get_site_info');

    // 2. Validar Permisos de Usuario (El que falla)
    const userCheck = await callMoodle('core_user_get_users', {
        'criteria[0][key]': 'email',
        'criteria[0][value]': 'admin@numu.com' // Email dummy
    });

    if (siteInfo && userCheck) {
        console.log('\n🎉 ¡TODO ESTÁ CORRECTO! El token funciona.');
    } else {
        console.log('\n⚠️  El token es válido pero faltan permisos o servicios.');
        console.log('   Asegúrate de agregar las funciones al servicio externo en Moodle.');
    }
}

testConnection();
