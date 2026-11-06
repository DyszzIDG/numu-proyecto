import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

interface FeedbackData {
    scanId: string;
    commandGenerated: string;
    userRating: 'positive' | 'negative';
    userCorrection?: string;
    comments?: string;
}

// POST /api/feedback - Submit feedback
export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const feedback: FeedbackData = await req.json();

        // Store feedback in database (you'll need to create a Feedback model)
        // For now, we'll log it and return success
        console.log('Feedback received:', {
            userId: user.id,
            ...feedback,
            timestamp: new Date()
        });

        // In a real implementation, you would:
        // 1. Store feedback in database
        // 2. Aggregate feedback data
        // 3. Retrain model periodically when enough feedback is collected
        // 4. Use feedback to improve intent parser

        return NextResponse.json({
            success: true,
            message: 'Feedback recorded successfully'
        });
    } catch (error) {
        console.error('Error recording feedback:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// GET /api/feedback/stats - Get feedback statistics
export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Mock statistics - in real implementation, query from database
        const stats = {
            totalFeedback: 150,
            positiveRating: 127,
            negativeRating: 23,
            satisfactionRate: 84.7,
            commonCorrections: [
                { issue: 'Wrong tool selected', count: 8 },
                { issue: 'Missing flags', count: 6 },
                { issue: 'Incorrect target parsing', count: 5 }
            ],
            improvementTrend: [
                { month: 'Jan', accuracy: 78 },
                { month: 'Feb', accuracy: 82 },
                { month: 'Mar', accuracy: 85 }
            ]
        };

        return NextResponse.json({ stats });
    } catch (error) {
        console.error('Error fetching feedback stats:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
