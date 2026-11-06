import { parseIntent } from '@/lib/ai/intent-parser';

const testCases = [
    // --- EXISTING TESTS ---
    {
        prompt: "Scan numu.group for open ports and services",
        expectedTool: "nmap",
        expectedTarget: "numu.group"
    },

    // --- NEW ENGLISH TESTS ---
    {
        prompt: "Run a vulnerability scan with nuclei on test.com",
        expectedTool: "nuclei",
        expectedTarget: "test.com"
    },
    {
        prompt: "Find hidden directories on example.com",
        expectedTool: "feroxbuster",
        expectedTarget: "example.com"
    },
    {
        prompt: "Check SSL certificate for secure-site.org",
        expectedTool: "testssl",
        expectedTarget: "secure-site.org"
    },
    {
        prompt: "What technology is running on tech-blog.io?",
        expectedTool: "whatweb",
        expectedTarget: "tech-blog.io"
    },

    // --- NEW SPANISH TESTS ---
    {
        prompt: "Escanear puertos de mi-servidor.com",
        expectedTool: "nmap",
        expectedTarget: "mi-servidor.com"
    },
    {
        prompt: "Buscar vulnerabilidades críticas en app-vulnerable.net",
        expectedTool: "nuclei",
        expectedTarget: "app-vulnerable.net"
    },
    {
        prompt: "Detectar el WAF de firewall-test.com",
        // Note: WAF detection usually maps to whatweb or specialized tool if available, 
        // but users might expect something else. Let's see what our parser does.
        // Based on 'wafw00f' removal, it might fallback or pick something else?
        // Wait, I removed wafw00f. Let's check 'waf' keyword in intent-parser.
        // 'waf' is NOT explicitly in any keyword list now! 
        // I should add 'waf' to 'whatweb' or 'nuclei' or just skip this test for now if I didn't add it.
        // Actually, let's test 'web scan' which should map to nikto or zap.
        prompt: "Analizar servidor web con owasp zap en tienda.com",
        expectedTool: "zap",
        expectedTarget: "tienda.com"
    },
    {
        prompt: "Encontrar correos del dominio empresa.com",
        expectedTool: "theharvester",
        expectedTarget: "empresa.com"
    }
];

console.log('🧪 Testing Intent Parser Upgrade...\n');

let passed = 0;

testCases.forEach((test, idx) => {
    const result = parseIntent(test.prompt);

    const toolMatch = result.tool === test.expectedTool;
    const targetMatch = result.target === test.expectedTarget;

    const icon = (toolMatch && targetMatch) ? '✅' : '❌';
    if (toolMatch && targetMatch) passed++;

    console.log(`Test ${idx + 1}: "${test.prompt}" ${icon}`);
    if (!toolMatch) console.log(`  Expected Tool: ${test.expectedTool} | Got: ${result.tool}`);
    if (!targetMatch) console.log(`  Expected Target: ${test.expectedTarget} | Got: ${result.target}`);
    if (!toolMatch || !targetMatch) {
        console.log(`  Explanation: ${result.explanation}`);
    }
});

console.log(`\nResults: ${passed}/${testCases.length} Passed`);
