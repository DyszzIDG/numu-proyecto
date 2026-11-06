require('dotenv').config();
const axios = require('axios');

const MOODLE_URL = process.env.MOODLE_URL || 'http://localhost:8080';
const TOKEN = process.env.MOODLE_WS_TOKEN;

const BASE_URL = `${MOODLE_URL}/webservice/rest/server.php`;

async function testAlternativeMethod() {
    console.log('='.repeat(60));
    console.log('PROBANDO MÉTODO ALTERNATIVO: core_user_get_users_by_field');
    console.log('='.repeat(60));
    console.log('');

    try {
        const response = await axios.get(BASE_URL, {
            params: {
                wstoken: TOKEN,
                wsfunction: 'core_user_get_users_by_field',
                moodlewsrestformat: 'json',
                'field': 'email',
                'values[0]': 'dyszzoff@gmail.com'
            }
        });

        console.log('📦 Respuesta completa:');
        console.log(JSON.stringify(response.data, null, 2));
        console.log('');

        if (response.data.exception) {
            console.error(`❌ Error: ${response.data.message}`);
            return;
        }

        if (!response.data || response.data.length === 0) {
            console.log('❌ No se encontró ningún usuario');
            return;
        }

        console.log(`✅ Usuario encontrado!`);
        console.log(`   ID: ${response.data[0].id}`);
        console.log(`   Username: ${response.data[0].username}`);
        console.log(`   Email: ${response.data[0].email}`);
        console.log(`   Nombre: ${response.data[0].firstname} ${response.data[0].lastname}`);

    } catch (error) {
        if (error.response) {
            console.error(`❌ HTTP ${error.response.status}`);
            console.error(JSON.stringify(error.response.data, null, 2));
        } else {
            console.error(`❌ Error:`, error.message);
        }
    }
}

testAlternativeMethod();
