require('dotenv').config();
const axios = require('axios');

const MOODLE_URL = process.env.MOODLE_URL || 'http://localhost:8080';
const TOKEN = process.env.MOODLE_WS_TOKEN;
const BASE_URL = `${MOODLE_URL}/webservice/rest/server.php`;

async function checkEmail(email) {
    console.log(`🔍 Buscando: ${email}`);

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
        console.log('   ❌ No encontrado\n');
        return false;
    }

    console.log('   ✅ ENCONTRADO!');
    console.log(`   ID: ${users[0].id}`);
    console.log(`   Username: ${users[0].username}`);
    console.log(`   Email: ${users[0].email}\n`);
    return true;
}

async function test() {
    console.log('='.repeat(50));
    await checkEmail('dyszzofi@gmail.com');  // Con "i"
    await checkEmail('dyszzoff@gmail.com');  // Sin "i"
    console.log('='.repeat(50));
}

test();
