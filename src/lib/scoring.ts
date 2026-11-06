// Scoring utility functions for security assessment

export interface CategoryScore {
    categoryId: string;
    categoryName: string;
    score: number;
    maxScore: number;
    percentage: number;
}

export interface AssessmentResult {
    overallScore: number;
    maturityLevel: string;
    categoryScores: CategoryScore[];
    recommendations: string[];
}

const MATURITY_LEVELS = {
    initial: { min: 0, max: 25, label: 'Inicial', color: 'red' },
    developing: { min: 26, max: 50, label: 'En Desarrollo', color: 'orange' },
    defined: { min: 51, max: 75, label: 'Definido', color: 'yellow' },
    managed: { min: 76, max: 90, label: 'Gestionado', color: 'green' },
    optimized: { min: 91, max: 100, label: 'Optimizado', color: 'cyan' }
};

export function calculateScore(answers: any[], categories: any[]): AssessmentResult {
    // Calculate score per category
    const categoryScores: CategoryScore[] = categories.map(category => {
        const categoryQuestions = category.questions;
        const categoryAnswers = answers.filter(a =>
            categoryQuestions.some((q: any) => q.id === a.questionId)
        );

        const earnedPoints = categoryAnswers.reduce((sum, a) => sum + a.points, 0);
        const maxPoints = categoryQuestions.reduce((sum: number, q: any) => sum + q.weight, 0);
        const percentage = maxPoints > 0 ? (earnedPoints / maxPoints) * 100 : 0;

        return {
            categoryId: category.id,
            categoryName: category.name,
            score: earnedPoints,
            maxScore: maxPoints,
            percentage: Math.round(percentage)
        };
    });

    // Calculate overall score
    const totalEarned = categoryScores.reduce((sum, c) => sum + c.score, 0);
    const totalMax = categoryScores.reduce((sum, c) => sum + c.maxScore, 0);
    const overallScore = totalMax > 0 ? Math.round((totalEarned / totalMax) * 100) : 0;

    // Determine maturity level
    const maturityLevel = Object.entries(MATURITY_LEVELS).find(
        ([_, level]) => overallScore >= level.min && overallScore <= level.max
    )?.[0] || 'initial';

    // Generate recommendations
    const recommendations = generateRecommendations(categoryScores, overallScore);

    return {
        overallScore,
        maturityLevel,
        categoryScores,
        recommendations
    };
}

function generateRecommendations(categoryScores: CategoryScore[], overallScore: number): string[] {
    const recommendations: string[] = [];

    // Overall recommendations
    if (overallScore < 50) {
        recommendations.push('Su organización necesita implementar controles de seguridad básicos de manera urgente.');
        recommendations.push('Considere contratar un consultor de seguridad para establecer un programa de seguridad.');
    } else if (overallScore < 75) {
        recommendations.push('Su organización tiene una base de seguridad sólida, pero hay áreas que requieren mejora.');
        recommendations.push('Implemente un programa de mejora continua de seguridad.');
    } else {
        recommendations.push('Su organización tiene un programa de seguridad maduro. Mantenga las buenas prácticas.');
        recommendations.push('Considere obtener certificaciones de seguridad como ISO 27001.');
    }

    // Category-specific recommendations
    const weakCategories = categoryScores.filter(c => c.percentage < 60);
    weakCategories.forEach(category => {
        switch (category.categoryName) {
            case 'Application Security':
                recommendations.push('Implemente pruebas de seguridad automatizadas (SAST/DAST) en su ciclo de desarrollo.');
                recommendations.push('Capacite a desarrolladores en prácticas de codificación segura (OWASP Top 10).');
                break;
            case 'Incident Management':
                recommendations.push('Desarrolle y pruebe un plan de respuesta a incidentes.');
                recommendations.push('Implemente herramientas de detección y monitoreo (SIEM, IDS/IPS).');
                break;
            case 'Network Security':
                recommendations.push('Implemente segmentación de red y firewalls de próxima generación.');
                recommendations.push('Realice escaneos de vulnerabilidades de red regularmente.');
                break;
            case 'Physical Security':
                recommendations.push('Mejore los controles de acceso físico a instalaciones críticas.');
                recommendations.push('Implemente sistemas de vigilancia y monitoreo ambiental.');
                break;
            case 'Audit & Compliance':
                recommendations.push('Documente políticas y procedimientos de seguridad.');
                recommendations.push('Realice auditorías de seguridad periódicas.');
                break;
            case 'Data Protection':
                recommendations.push('Implemente cifrado de datos en reposo y en tránsito.');
                recommendations.push('Establezca procedimientos de backup y recuperación.');
                break;
            case 'Access Management':
                recommendations.push('Implemente autenticación multifactor (MFA) en todos los sistemas.');
                recommendations.push('Revise y actualice permisos de acceso regularmente.');
                break;
            case 'Security Operations':
                recommendations.push('Establezca un programa de gestión de vulnerabilidades.');
                recommendations.push('Implemente un proceso de gestión de parches.');
                break;
        }
    });

    return recommendations.slice(0, 10); // Limit to top 10 recommendations
}

export function getMaturityLevelInfo(level: string) {
    return MATURITY_LEVELS[level as keyof typeof MATURITY_LEVELS] || MATURITY_LEVELS.initial;
}
