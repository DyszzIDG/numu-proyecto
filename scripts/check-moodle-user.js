require('dotenv').config();
const axios = require('axios');

const MOODLE_URL = process.env.MOODLE_URL || 'http://localhost:8080';
const TOKEN = process.env.MOODLE_WS_TOKEN;

if (!TOKEN) {
    console.error('❌ Error: MOODLE_WS_TOKEN is missing in .env');
    process.exit(1);
}

const BASE_URL = `${MOODLE_URL}/webservice/rest/server.php`;

async function checkUserByEmail(email) {
    try {
        console.log(`🔍 Buscando usuario con email: ${email}`);

        const response = await axios.get(BASE_URL, {
            params: {
                wstoken: TOKEN,
                wsfunction: 'core_user_get_users',
                moodlewsrestformat: 'json',
                'criteria[0][key]': 'email',
                'criteria[0][value]': email
            }
        });

        if (response.data.exception) {
            console.error(`❌ Error: ${response.data.message}`);
            return;
        }

        const users = response.data.users || response.data;

        if (!users || users.length === 0) {
            console.log('❌ No se encontró ningún usuario con ese email');
            console.log('');
            console.log('Posibles causas:');
            console.log('  1. La cuenta no está confirmada (revisa Mailhog)');
            console.log('  2. El email tiene mayúsculas/minúsculas diferentes');
            console.log('  3. La cuenta fue eliminada');
            return;
        }

        console.log(`✅ Usuario encontrado:`);
        console.log(`   ID: ${users[0].id}`);
        console.log(`   Username: ${users[0].username}`);
        console.log(`   Email: ${users[0].email}`);
        console.log(`   Nombre: ${users[0].firstname} ${users[0].lastname}`);
        console.log(`   Confirmado: ${users[0].confirmed !== undefined ? (users[0].confirmed ? 'Sí' : 'NO') : 'N/A'}`);

    } catch (error) {
        if (error.response) {
            console.error(`❌ HTTP ${error.response.status}`);
            console.error(`   Response:`, error.response.data);
        } else {
            console.error(`❌ Error:`, error.message);
        }
    }
}

// Probar con el email del usuario
checkUserByEmail('dyszzoff@gmail.com');
