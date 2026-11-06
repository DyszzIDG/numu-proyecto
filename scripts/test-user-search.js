require('dotenv').config();
const axios = require('axios');

const MOODLE_URL = process.env.MOODLE_URL || 'http://localhost:8080';
const TOKEN = process.env.MOODLE_WS_TOKEN;

const BASE_URL = `${MOODLE_URL}/webservice/rest/server.php`;

async function testSearch(searchType, searchValue) {
    try {
        console.log(`\n🔍 Buscando por ${searchType}: ${searchValue}`);

        const response = await axios.get(BASE_URL, {
            params: {
                wstoken: TOKEN,
                wsfunction: 'core_user_get_users',
                moodlewsrestformat: 'json',
                'criteria[0][key]': searchType,
                'criteria[0][value]': searchValue
            }
        });

        if (response.data.exception) {
            console.error(`   ❌ Error: ${response.data.message}`);
            return null;
        }

        const users = response.data.users || response.data;

        if (!users || users.length === 0) {
            console.log(`   ❌ No encontrado`);
            return null;
        }

        console.log(`   ✅ Encontrado!`);
        console.log(`      ID: ${users[0].id}`);
        console.log(`      Username: ${users[0].username}`);
        console.log(`      Email: ${users[0].email}`);
        console.log(`      Nombre: ${users[0].firstname} ${users[0].lastname}`);
        return users[0];

    } catch (error) {
        console.error(`   ❌ Error HTTP: ${error.message}`);
        return null;
    }
}

async function runTests() {
    console.log('='.repeat(60));
    console.log('PRUEBA DE BÚSQUEDA DE USUARIOS EN MOODLE');
    console.log('='.repeat(60));

    // Probar diferentes búsquedas
    await testSearch('email', 'dyszzoff@gmail.com');
    await testSearch('username', 'ivangiorda');
    await testSearch('firstname', 'Ivan');
    await testSearch('lastname', 'Giorda');
    await testSearch('idnumber', '');

    console.log('\n' + '='.repeat(60));
}

runTests();
