async function testScan() {
    console.log('🚀 Initiating test scan...');

    try {
        const response = await fetch('http://localhost:3100/api/tools/execute', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                tool: 'nmap',
                target: 'scanme.nmap.org', // Use a safe target
                options: {
                    flags: ['-F'] // Fast scan
                },
                generatedBy: 'test-script'
            })
        });

        if (!response.ok) {
            const err = await response.text();
            throw new Error(`API Error: ${response.status} ${err}`);
        }

        const data = await response.json();
        console.log('✅ Scan initiated successfully!');
        console.log('Response:', JSON.stringify(data, null, 2));

    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
}

testScan();
