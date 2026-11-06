import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding industries...');

    // Get existing categories
    const categories = await prisma.assessmentCategory.findMany({
        orderBy: { order: 'asc' }
    });

    if (categories.length === 0) {
        console.error('❌ No assessment categories found. Please run main seed first.');
        return;
    }

    // Define 6 industries
    const industries = [
        {
            name: 'Fintech & Banca',
            slug: 'fintech',
            icon: '💳',
            description: 'Instituciones financieras, fintechs, procesadores de pago y servicios bancarios digitales',
            regulatoryFocus: 'PCI-DSS, SOX, GLBA, Basel III, regulaciones bancarias locales',
            order: 1
        },
        {
            name: 'Salud & Healthcare',
            slug: 'healthcare',
            icon: '🏥',
            description: 'Hospitales, clínicas, telemedicina, dispositivos médicos y sistemas de salud',
            regulatoryFocus: 'HIPAA, HITECH, FDA 21 CFR Part 11, regulaciones de datos de salud',
            order: 2
        },
        {
            name: 'E-commerce & Retail',
            slug: 'ecommerce',
            icon: '🛒',
            description: 'Tiendas online, marketplaces, retail digital y plataformas de comercio electrónico',
            regulatoryFocus: 'PCI-DSS, leyes de protección al consumidor, GDPR/LGPD',
            order: 3
        },
        {
            name: 'Tecnología & SaaS',
            slug: 'technology',
            icon: '💻',
            description: 'Empresas de software, SaaS, desarrollo de aplicaciones y servicios cloud',
            regulatoryFocus: 'SOC 2, ISO 27001, GDPR/LGPD, contratos de procesamiento de datos',
            order: 4
        },
        {
            name: 'Manufactura & Industrial',
            slug: 'manufacturing',
            icon: '🏭',
            description: 'Manufactura, industria 4.0, IoT industrial y cadenas de suministro',
            regulatoryFocus: 'IEC 62443, NIST CSF, protección de propiedad intelectual',
            order: 5
        },
        {
            name: 'Educación',
            slug: 'education',
            icon: '🎓',
            description: 'Instituciones educativas, e-learning, universidades y plataformas educativas',
            regulatoryFocus: 'FERPA, COPPA, protección de datos de menores',
            order: 6
        }
    ];

    // Create industries
    for (const industryData of industries) {
        const industry = await prisma.industry.upsert({
            where: { slug: industryData.slug },
            update: industryData,
            create: industryData
        });

        console.log(`✓ Created industry: ${industry.name}`);

        // Create industry-specific questions based on industry type
        await createIndustryQuestions(industry, categories);

        // Create benchmarks
        await createBenchmarks(industry);
    }

    console.log('✅ Industry seeding completed!');
}

async function createIndustryQuestions(industry: any, categories: any[]) {
    const questions = getQuestionsForIndustry(industry.slug, categories);

    for (const categoryQuestions of questions) {
        // Validate categoryId exists
        if (!categoryQuestions.categoryId) {
            console.warn(`  ⚠ Skipping category with missing ID for ${industry.name}`);
            continue;
        }

        // Create or link industry category
        const industryCategory = await prisma.industryCategory.upsert({
            where: {
                industryId_categoryId: {
                    industryId: industry.id,
                    categoryId: categoryQuestions.categoryId
                }
            },
            update: {
                weight: categoryQuestions.weight,
                description: categoryQuestions.description
            },
            create: {
                industryId: industry.id,
                categoryId: categoryQuestions.categoryId,
                weight: categoryQuestions.weight,
                description: categoryQuestions.description
            }
        });

        // Create questions
        for (let i = 0; i < categoryQuestions.questions.length; i++) {
            const q = categoryQuestions.questions[i];
            await prisma.industryQuestion.create({
                data: {
                    industryId: industry.id,
                    industryCategoryId: industryCategory.id,
                    text: q.text,
                    description: q.description || null,
                    type: (q as any).type || 'yes_no',
                    weight: (q as any).weight || 10,
                    order: i + 1,
                    regulationReference: (q as any).regulationReference || null,
                    complianceLevel: (q as any).complianceLevel || 'recommended',
                    riskLevel: (q as any).riskLevel || 'medium',
                    bestPractice: (q as any).bestPractice || null,
                    implementationGuide: (q as any).implementationGuide || null
                }
            });
        }
    }

    console.log(`  ✓ Created ${questions.reduce((sum, cat) => sum + cat.questions.length, 0)} questions for ${industry.name}`);
}

async function createBenchmarks(industry: any) {
    const currentYear = new Date().getFullYear();

    const benchmarks = [
        { metric: 'average_score', value: 68.5, sampleSize: 150 },
        { metric: 'median_score', value: 72.0, sampleSize: 150 },
        { metric: 'top_quartile', value: 85.0, sampleSize: 38 }
    ];

    for (const benchmark of benchmarks) {
        await prisma.industryBenchmark.upsert({
            where: {
                industryId_metric_year_quarter_categoryId: {
                    industryId: industry.id,
                    metric: benchmark.metric,
                    year: currentYear,
                    quarter: null as any,
                    categoryId: null as any
                }
            },
            update: benchmark,
            create: {
                industryId: industry.id,
                ...benchmark,
                year: currentYear
            }
        });
    }
}

function getQuestionsForIndustry(slug: string, categories: any[]) {
    const categoryMap: any = {};
    categories.forEach(cat => {
        categoryMap[cat.name] = cat.id;
    });

    console.log(`  📋 Available categories:`, Object.keys(categoryMap));

    switch (slug) {
        case 'fintech':
            return getFintechQuestions(categoryMap);
        case 'healthcare':
            return getHealthcareQuestions(categoryMap);
        case 'ecommerce':
            return getEcommerceQuestions(categoryMap);
        case 'technology':
            return getTechnologyQuestions(categoryMap);
        case 'manufacturing':
            return getManufacturingQuestions(categoryMap);
        case 'education':
            return getEducationQuestions(categoryMap);
        default:
            return [];
    }
}

function getFintechQuestions(categoryMap: any) {
    return [
        {
            categoryId: categoryMap['Gobernanza y Gestión de Riesgos'],
            weight: 25,
            description: 'Gobernanza específica para instituciones financieras con enfoque en cumplimiento regulatorio',
            questions: [
                {
                    text: '¿Tiene un oficial de cumplimiento (Compliance Officer) designado?',
                    description: 'Requerido por la mayoría de reguladores financieros',
                    regulationReference: 'SOX Section 404, regulaciones bancarias locales',
                    complianceLevel: 'required',
                    riskLevel: 'critical',
                    weight: 15,
                    bestPractice: 'El Compliance Officer debe reportar directamente al CEO o Board',
                    implementationGuide: 'Designar un ejecutivo senior con autoridad y presupuesto adecuado'
                },
                {
                    text: '¿Realiza evaluaciones de riesgo de lavado de dinero (AML)?',
                    description: 'Evaluación de riesgos de AML/CFT',
                    regulationReference: 'FATF Recommendations, regulaciones AML locales',
                    complianceLevel: 'required',
                    riskLevel: 'critical',
                    weight: 15,
                    bestPractice: 'Evaluaciones trimestrales con scoring automatizado',
                    implementationGuide: 'Implementar sistema KYC/AML automatizado'
                },
                {
                    text: '¿Tiene un programa de gestión de riesgo de terceros (TPRM)?',
                    description: 'Gestión de riesgos de proveedores críticos',
                    regulationReference: 'OCC Bulletin 2013-29',
                    complianceLevel: 'required',
                    riskLevel: 'high',
                    weight: 12
                }
            ]
        },
        {
            categoryId: categoryMap['Protección de Datos'],
            weight: 30,
            description: 'Protección de datos financieros sensibles y cumplimiento PCI-DSS',
            questions: [
                {
                    text: '¿Cumple con PCI-DSS para el procesamiento de tarjetas?',
                    description: 'Cumplimiento del estándar de seguridad de datos de la industria de tarjetas de pago',
                    regulationReference: 'PCI-DSS v4.0',
                    complianceLevel: 'required',
                    riskLevel: 'critical',
                    weight: 20,
                    bestPractice: 'Certificación PCI-DSS Level 1 con QSA',
                    implementationGuide: 'Contratar QSA certificado, implementar tokenización'
                },
                {
                    text: '¿Encripta datos de tarjetas en reposo y en tránsito?',
                    description: 'Cifrado de PAN (Primary Account Number)',
                    regulationReference: 'PCI-DSS Requirement 3',
                    complianceLevel: 'required',
                    riskLevel: 'critical',
                    weight: 15
                },
                {
                    text: '¿Implementa tokenización o cifrado de extremo a extremo (E2EE)?',
                    description: 'Reducción del alcance PCI mediante tokenización',
                    regulationReference: 'PCI-DSS Requirement 3.4',
                    complianceLevel: 'recommended',
                    riskLevel: 'high',
                    weight: 12,
                    bestPractice: 'Tokenización con proveedor PCI Level 1',
                    implementationGuide: 'Evaluar proveedores como Stripe, Adyen o solución propia'
                },
                {
                    text: '¿Tiene controles de acceso basados en roles para datos financieros?',
                    description: 'RBAC para acceso a datos sensibles',
                    regulationReference: 'PCI-DSS Requirement 7',
                    complianceLevel: 'required',
                    riskLevel: 'high',
                    weight: 10
                }
            ]
        },
        {
            categoryId: categoryMap['Seguridad de Aplicaciones'],
            weight: 20,
            description: 'Seguridad de aplicaciones financieras y APIs',
            questions: [
                {
                    text: '¿Realiza pruebas de penetración en aplicaciones de banca/pagos?',
                    description: 'Pentesting de aplicaciones críticas',
                    regulationReference: 'PCI-DSS Requirement 11.3',
                    complianceLevel: 'required',
                    riskLevel: 'high',
                    weight: 15,
                    bestPractice: 'Pentesting anual por firma certificada + bug bounty',
                    implementationGuide: 'Contratar pentester certificado (OSCP, CEH)'
                },
                {
                    text: '¿Implementa autenticación multifactor (MFA) para transacciones?',
                    description: 'MFA obligatorio para operaciones financieras',
                    regulationReference: 'PSD2 SCA, PCI-DSS Requirement 8.3',
                    complianceLevel: 'required',
                    riskLevel: 'critical',
                    weight: 15
                },
                {
                    text: '¿Tiene límites y monitoreo de transacciones en tiempo real?',
                    description: 'Detección de fraude en tiempo real',
                    complianceLevel: 'required',
                    riskLevel: 'high',
                    weight: 12,
                    bestPractice: 'Sistema de scoring de fraude con ML',
                    implementationGuide: 'Implementar reglas de negocio + machine learning'
                }
            ]
        },
        {
            categoryId: categoryMap['Respuesta a Incidentes'],
            weight: 15,
            description: 'Respuesta a incidentes financieros y fraude',
            questions: [
                {
                    text: '¿Tiene procedimientos para reportar incidentes a reguladores?',
                    description: 'Notificación obligatoria de brechas a autoridades',
                    regulationReference: 'Regulaciones bancarias locales, GDPR Art. 33',
                    complianceLevel: 'required',
                    riskLevel: 'critical',
                    weight: 15
                },
                {
                    text: '¿Mantiene registros forenses de transacciones por el tiempo requerido?',
                    description: 'Retención de logs para auditorías',
                    regulationReference: 'SOX, regulaciones bancarias (típicamente 7 años)',
                    complianceLevel: 'required',
                    riskLevel: 'high',
                    weight: 12
                }
            ]
        }
    ];
}

function getHealthcareQuestions(categoryMap: any) {
    return [
        {
            categoryId: categoryMap['Protección de Datos'],
            weight: 35,
            description: 'Protección de información de salud protegida (PHI) según HIPAA',
            questions: [
                {
                    text: '¿Cumple con HIPAA para protección de datos de pacientes?',
                    description: 'Cumplimiento del Health Insurance Portability and Accountability Act',
                    regulationReference: 'HIPAA Privacy Rule, Security Rule',
                    complianceLevel: 'required',
                    riskLevel: 'critical',
                    weight: 20,
                    bestPractice: 'Certificación HIPAA con auditoría anual',
                    implementationGuide: 'Implementar controles técnicos, físicos y administrativos de HIPAA'
                },
                {
                    text: '¿Encripta PHI (Protected Health Information) en reposo y tránsito?',
                    description: 'Cifrado de datos de salud',
                    regulationReference: 'HIPAA Security Rule §164.312(a)(2)(iv)',
                    complianceLevel: 'required',
                    riskLevel: 'critical',
                    weight: 15
                },
                {
                    text: '¿Tiene acuerdos BAA (Business Associate Agreement) con proveedores?',
                    description: 'Contratos HIPAA con terceros que procesan PHI',
                    regulationReference: 'HIPAA §164.502(e)',
                    complianceLevel: 'required',
                    riskLevel: 'critical',
                    weight: 15,
                    bestPractice: 'BAA firmado antes de compartir cualquier PHI',
                    implementationGuide: 'Usar template de BAA estándar, revisar con legal'
                },
                {
                    text: '¿Implementa controles de acceso mínimo necesario a registros médicos?',
                    description: 'Principio de mínimo privilegio para PHI',
                    regulationReference: 'HIPAA Minimum Necessary Standard',
                    complianceLevel: 'required',
                    riskLevel: 'high',
                    weight: 12
                },
                {
                    text: '¿Mantiene audit logs de acceso a registros de pacientes?',
                    description: 'Trazabilidad de acceso a PHI',
                    regulationReference: 'HIPAA §164.312(b)',
                    complianceLevel: 'required',
                    riskLevel: 'high',
                    weight: 10
                }
            ]
        },
        {
            categoryId: categoryMap['Control de Acceso'],
            weight: 25,
            description: 'Control de acceso a sistemas de salud y registros médicos',
            questions: [
                {
                    text: '¿Requiere autenticación única por usuario (no cuentas compartidas)?',
                    description: 'Identificación única de usuarios que acceden a PHI',
                    regulationReference: 'HIPAA §164.312(a)(2)(i)',
                    complianceLevel: 'required',
                    riskLevel: 'high',
                    weight: 15
                },
                {
                    text: '¿Implementa cierre automático de sesión en estaciones de trabajo?',
                    description: 'Timeout de sesión para prevenir acceso no autorizado',
                    regulationReference: 'HIPAA §164.312(a)(2)(iii)',
                    complianceLevel: 'required',
                    riskLevel: 'medium',
                    weight: 10,
                    bestPractice: 'Timeout de 5-15 minutos según criticidad',
                    implementationGuide: 'Configurar en AD/SSO y aplicaciones clínicas'
                }
            ]
        },
        {
            categoryId: categoryMap['Respuesta a Incidentes'],
            weight: 20,
            description: 'Respuesta a brechas de datos de salud',
            questions: [
                {
                    text: '¿Tiene procedimientos para notificar brechas de PHI en 60 días?',
                    description: 'Notificación obligatoria de brechas HIPAA',
                    regulationReference: 'HIPAA Breach Notification Rule',
                    complianceLevel: 'required',
                    riskLevel: 'critical',
                    weight: 15,
                    bestPractice: 'Notificación a HHS, pacientes afectados y medios si >500 personas',
                    implementationGuide: 'Crear playbook específico para brechas HIPAA'
                }
            ]
        }
    ];
}

function getEcommerceQuestions(categoryMap: any) {
    return [
        {
            categoryId: categoryMap['Protección de Datos'],
            weight: 30,
            description: 'Protección de datos de clientes y cumplimiento PCI-DSS',
            questions: [
                {
                    text: '¿Cumple con PCI-DSS para procesamiento de pagos online?',
                    description: 'Cumplimiento PCI para e-commerce',
                    regulationReference: 'PCI-DSS v4.0',
                    complianceLevel: 'required',
                    riskLevel: 'critical',
                    weight: 20
                },
                {
                    text: '¿Usa pasarelas de pago certificadas PCI (no almacena datos de tarjetas)?',
                    description: 'Reducción de alcance PCI mediante outsourcing',
                    regulationReference: 'PCI-DSS SAQ A',
                    complianceLevel: 'recommended',
                    riskLevel: 'high',
                    weight: 15,
                    bestPractice: 'Usar Stripe, PayPal, Mercado Pago u otro PSP Level 1',
                    implementationGuide: 'Integrar vía iFrame o redirect, nunca tocar PAN'
                },
                {
                    text: '¿Implementa HTTPS en todo el sitio (no solo checkout)?',
                    description: 'Cifrado de extremo a extremo',
                    regulationReference: 'PCI-DSS Requirement 4',
                    complianceLevel: 'required',
                    riskLevel: 'high',
                    weight: 12
                }
            ]
        },
        {
            categoryId: categoryMap['Seguridad de Aplicaciones'],
            weight: 25,
            description: 'Seguridad de plataforma e-commerce',
            questions: [
                {
                    text: '¿Protege contra ataques de scraping y bots maliciosos?',
                    description: 'Protección contra scraping de precios y fraude',
                    complianceLevel: 'recommended',
                    riskLevel: 'medium',
                    weight: 10,
                    bestPractice: 'Cloudflare Bot Management o similar',
                    implementationGuide: 'Implementar rate limiting, CAPTCHA, fingerprinting'
                },
                {
                    text: '¿Valida y sanitiza inputs en formularios de checkout?',
                    description: 'Prevención de inyección SQL/XSS en checkout',
                    regulationReference: 'PCI-DSS Requirement 6.5',
                    complianceLevel: 'required',
                    riskLevel: 'high',
                    weight: 15
                }
            ]
        }
    ];
}

function getTechnologyQuestions(categoryMap: any) {
    return [
        {
            categoryId: categoryMap['Seguridad de Aplicaciones'],
            weight: 30,
            description: 'Seguridad en el ciclo de desarrollo de software',
            questions: [
                {
                    text: '¿Implementa SAST/DAST en el pipeline CI/CD?',
                    description: 'Análisis estático y dinámico de código',
                    complianceLevel: 'recommended',
                    riskLevel: 'high',
                    weight: 15,
                    bestPractice: 'SAST en cada commit, DAST en staging',
                    implementationGuide: 'Integrar SonarQube, Snyk, o GitHub Advanced Security'
                },
                {
                    text: '¿Realiza escaneo de dependencias y vulnerabilidades (SCA)?',
                    description: 'Software Composition Analysis',
                    complianceLevel: 'recommended',
                    riskLevel: 'high',
                    weight: 15,
                    bestPractice: 'Escaneo automatizado con alertas en Slack',
                    implementationGuide: 'Dependabot, Snyk, o WhiteSource'
                },
                {
                    text: '¿Tiene un programa de divulgación responsable de vulnerabilidades?',
                    description: 'Responsible disclosure policy',
                    complianceLevel: 'recommended',
                    riskLevel: 'medium',
                    weight: 10,
                    bestPractice: 'security.txt + bug bounty program',
                    implementationGuide: 'Publicar security.txt, considerar HackerOne/Bugcrowd'
                }
            ]
        },
        {
            categoryId: categoryMap['Seguridad en la Nube'],
            weight: 25,
            description: 'Seguridad de infraestructura cloud',
            questions: [
                {
                    text: '¿Implementa IaC (Infrastructure as Code) con revisión de seguridad?',
                    description: 'Terraform/CloudFormation con security scanning',
                    complianceLevel: 'recommended',
                    riskLevel: 'medium',
                    weight: 12,
                    bestPractice: 'Terraform + Checkov/tfsec en CI/CD',
                    implementationGuide: 'Versionar IaC en Git, escanear con policy-as-code'
                },
                {
                    text: '¿Usa secretos manager para credenciales (no hardcoded)?',
                    description: 'Gestión centralizada de secretos',
                    complianceLevel: 'required',
                    riskLevel: 'critical',
                    weight: 15,
                    bestPractice: 'AWS Secrets Manager, HashiCorp Vault, o Azure Key Vault',
                    implementationGuide: 'Migrar todos los secretos, rotar periódicamente'
                }
            ]
        }
    ];
}

function getManufacturingQuestions(categoryMap: any) {
    return [
        {
            categoryId: categoryMap['Seguridad de Infraestructura'],
            weight: 30,
            description: 'Seguridad de sistemas OT/ICS e Industria 4.0',
            questions: [
                {
                    text: '¿Segmenta redes IT y OT (tecnología operacional)?',
                    description: 'Separación de redes corporativas y de producción',
                    regulationReference: 'IEC 62443-3-3',
                    complianceLevel: 'required',
                    riskLevel: 'critical',
                    weight: 20,
                    bestPractice: 'DMZ entre IT y OT con firewall industrial',
                    implementationGuide: 'Implementar Purdue Model (niveles 0-5)'
                },
                {
                    text: '¿Implementa controles de acceso físico a sistemas de control industrial?',
                    description: 'Protección física de PLCs, SCADA, HMIs',
                    regulationReference: 'IEC 62443-2-1',
                    complianceLevel: 'required',
                    riskLevel: 'high',
                    weight: 15
                },
                {
                    text: '¿Monitorea anomalías en tráfico de red OT?',
                    description: 'Detección de intrusiones en redes industriales',
                    complianceLevel: 'recommended',
                    riskLevel: 'high',
                    weight: 12,
                    bestPractice: 'IDS/IPS específico para protocolos industriales',
                    implementationGuide: 'Nozomi Networks, Claroty, o Dragos'
                }
            ]
        },
        {
            categoryId: categoryMap['Protección de Datos'],
            weight: 25,
            description: 'Protección de propiedad intelectual y diseños',
            questions: [
                {
                    text: '¿Protege diseños CAD y propiedad intelectual?',
                    description: 'DLP para archivos de diseño',
                    complianceLevel: 'recommended',
                    riskLevel: 'high',
                    weight: 15,
                    bestPractice: 'DLP + clasificación de datos + watermarking',
                    implementationGuide: 'Implementar DLP en endpoints y email'
                }
            ]
        }
    ];
}

function getEducationQuestions(categoryMap: any) {
    return [
        {
            categoryId: categoryMap['Protección de Datos'],
            weight: 35,
            description: 'Protección de datos de estudiantes según FERPA/COPPA',
            questions: [
                {
                    text: '¿Cumple con FERPA para protección de registros educativos?',
                    description: 'Family Educational Rights and Privacy Act',
                    regulationReference: 'FERPA 20 U.S.C. § 1232g',
                    complianceLevel: 'required',
                    riskLevel: 'critical',
                    weight: 20,
                    bestPractice: 'Políticas claras de acceso y divulgación',
                    implementationGuide: 'Capacitar staff, implementar controles de acceso'
                },
                {
                    text: '¿Cumple con COPPA si tiene usuarios menores de 13 años?',
                    description: 'Children\'s Online Privacy Protection Act',
                    regulationReference: 'COPPA 15 U.S.C. §§ 6501–6506',
                    complianceLevel: 'required',
                    riskLevel: 'critical',
                    weight: 20,
                    bestPractice: 'Consentimiento parental verificable',
                    implementationGuide: 'Implementar age gate + parental consent flow'
                },
                {
                    text: '¿Limita la recopilación de datos personales de estudiantes?',
                    description: 'Minimización de datos de menores',
                    complianceLevel: 'required',
                    riskLevel: 'high',
                    weight: 15,
                    bestPractice: 'Solo recopilar datos estrictamente necesarios',
                    implementationGuide: 'Revisar formularios, eliminar campos innecesarios'
                }
            ]
        },
        {
            categoryId: categoryMap['Control de Acceso'],
            weight: 25,
            description: 'Control de acceso a sistemas educativos',
            questions: [
                {
                    text: '¿Implementa SSO para estudiantes y profesores?',
                    description: 'Single Sign-On para plataformas educativas',
                    complianceLevel: 'recommended',
                    riskLevel: 'medium',
                    weight: 12,
                    bestPractice: 'Google Workspace for Education o Microsoft 365 Education',
                    implementationGuide: 'Integrar LMS con proveedor SSO'
                }
            ]
        }
    ];
}

main()
    .catch((e) => {
        console.error('❌ Error seeding industries:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
