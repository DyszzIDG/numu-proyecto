async function testIntent() {
    console.log('🧠 Testing AI Intent Analysis...');

    const prompt = 'Escanea los puertos de scanme.nmap.org';

    try {
        const response = await fetch('http://localhost:3100/api/ai/analyze-intent', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt })
        });

        if (!response.ok) {
            const err = await response.text();
            throw new Error(`API Error: ${response.status} ${err}`);
        }

        const data = await response.json();
        console.log('✅ Intent analyzed successfully!');
        console.log('Input:', prompt);
        console.log('Result:', JSON.stringify(data, null, 2));

    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
}

testIntent();
