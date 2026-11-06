/**
 * Master Seed Orchestrator
 * Executes all domain seed scripts in sequential dependency order
 */

import { execSync } from 'child_process';
import path from 'path';

const seeds = [
    'seed.ts',              // 1. Root admin user & service profiles
    'seed-clients.ts',      // 2. Client companies & client users
    'seed-employees.ts',    // 3. CSIRT analysts and internal employees
    'seed-industries.ts',   // 4. Industry assessment templates
    'seed-assessment.ts',   // 5. Security assessment questionnaires
    'seed-certifications.ts',// 6. Certification tiers
    'seed-ctf.ts',          // 7. CTF challenges & categories
    'seed-lms.ts',          // 8. Learning programs and courses
    'seed-csirt.ts',        // 9. CSIRT incidents & Threat Intel
];

console.log('🚀 Iniciando Master Seeding de NUMU Security Platform...\n');

for (const seed of seeds) {
    const seedPath = path.join(__dirname, seed);
    console.log(`▶️ Ejecutando: ${seed}...`);
    try {
        execSync(`npx ts-node --compiler-options "{\\"module\\":\\"CommonJS\\"}" "${seedPath}"`, {
            stdio: 'inherit',
            cwd: path.join(__dirname, '..')
        });
        console.log(`✅ Completado: ${seed}\n`);
    } catch (error) {
        console.warn(`⚠️ Advertencia: ${seed} finalizó con errores o registros duplicados. Continuando...\n`);
    }
}

console.log('🎉 Master Seeding finalizado con éxito.');
