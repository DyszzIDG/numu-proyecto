import { NextRequest, NextResponse } from 'next/server';
import { parseIntent, validateTarget } from '@/lib/ai/intent-parser';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { prompt, target } = body;

        // Validación básica
        if (!prompt || typeof prompt !== 'string') {
            return NextResponse.json(
                { error: 'Prompt is required and must be a string' },
                { status: 400 }
            );
        }

        // Parse la intención usando pattern matching
        const result = parseIntent(prompt, target);

        // Validar el target si existe
        if (result.target) {
            const validation = validateTarget(result.target);
            if (!validation.valid) {
                return NextResponse.json(
                    { error: validation.reason },
                    { status: 400 }
                );
            }

            // Agregar warning si es necesario
            if (validation.reason) {
                result.explanation += ` ${validation.reason}`;
            }
        }

        // Si la confianza es baja, podríamos llamar a Claude API aquí
        // como fallback (implementar después)
        if (result.confidence < 50) {
            // TODO: Implementar fallback con Claude API
            result.explanation += ' ⚠️ Confianza baja. Considera reformular tu pregunta.';
        }

        return NextResponse.json(result);

    } catch (error) {
        console.error('Error analyzing intent:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
