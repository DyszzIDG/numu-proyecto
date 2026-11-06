require('dotenv').config();
const axios = require('axios');

const MOODLE_URL = process.env.MOODLE_URL || 'http://localhost:8080';
const TOKEN = process.env.MOODLE_WS_TOKEN;
const BASE_URL = `${MOODLE_URL}/webservice/rest/server.php`;

async function checkEmail(email) {
    console.log(`🔍 Buscando en Moodle: ${email}\n`);

    const response = await axios.get(BASE_URL, {
        params: {
            wstoken: TOKEN,
            wsfunction: 'core_user_get_users',
            moodlewsrestformat: 'json',
            'criteria[0][key]': 'email',
            'criteria[0][value]': email
        }
    });

    const users = response.data.users || response.data;

    if (!users || users.length === 0) {
        console.log('❌ NO ENCONTRADO en Moodle');
        console.log('   El usuario NO existe o NO está confirmado\n');
        return false;
    }

    console.log('✅ ENCONTRADO en Moodle!');
    console.log(`   ID: ${users[0].id}`);
    console.log(`   Username: ${users[0].username}`);
    console.log(`   Email: ${users[0].email}`);
    console.log(`   Nombre: ${users[0].firstname} ${users[0].lastname}\n`);
    return true;
}

checkEmail('ivangiorda123@gmail.com');
