
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';

export async function GET(req: Request) {
    try {
        // Get user session for personalized data
        const session = await getServerSession();
        const userId = session?.user?.id;

        // Fetch raw counts for general stats
        const usersCount = await prisma.user.count();

        // Use raw queries because Prisma Client generation might be locked/stale
        const coursesCountResult: any = await prisma.$queryRaw`SELECT COUNT(*)::int as count FROM "Course"`;
        const coursesCount = coursesCountResult[0]?.count || 0;

        const certsCountResult: any = await prisma.$queryRaw`SELECT COUNT(*)::int as count FROM "Enrollment" WHERE progress = 100`;
        const certificationsCount = certsCountResult[0]?.count || 0;

        const completionResult: any = await prisma.$queryRaw`SELECT AVG(progress)::float as avg FROM "Enrollment"`;
        const completionRate = Math.round(completionResult[0]?.avg || 0);

        // Fetch user-specific stats if logged in
        let userStats = {
            activeCourses: 4,
            pendingTasks: 7,
            averageGrade: 8.5,
            studyHours: 32
        };

        let myCourses: any[] = [];

        if (userId) {
            // Get user's active enrollments
            const enrollments = await prisma.enrollment.findMany({
                where: {
                    userId: userId,
                    status: 'active'
                },
                include: {
                    course: {
                        include: {
                            program: true
                        }
                    }
                },
                take: 10
            });

            // Calculate user stats
            userStats.activeCourses = enrollments.length;
            userStats.averageGrade = enrollments.length > 0
                ? Math.round((enrollments.reduce((sum, e) => sum + (e.progress || 0), 0) / enrollments.length) / 10) / 10
                : 8.5;

            // Mock pending tasks and study hours for now
            userStats.pendingTasks = Math.floor(Math.random() * 10) + 5;
            userStats.studyHours = enrollments.reduce((sum, e) => sum + 8, 0); // 8 hours per course average

            // Map enrollments to course cards
            const gradientColors = [
                'from-purple-300 to-blue-300',
                'from-orange-200 to-pink-200',
                'from-blue-200 to-cyan-200',
                'from-pink-300 to-purple-300',
                'from-green-200 to-teal-200',
                'from-yellow-200 to-orange-200'
            ];

            myCourses = enrollments.map((enrollment, index) => {
                const progress = enrollment.progress || 0;
                const totalModules = 12; // Mock value
                const currentModule = Math.floor((progress / 100) * totalModules);

                return {
                    id: enrollment.course.id,
                    title: enrollment.course.title,
                    professor: enrollment.course.instructor || 'Instructor',
                    progress: progress,
                    status: progress >= 80 ? 'Casi completo' : 'En progreso',
                    currentModule: currentModule,
                    totalModules: totalModules,
                    students: Math.floor(Math.random() * 50) + 20,
                    hours: Math.floor(Math.random() * 30) + 20,
                    gradientColor: gradientColors[index % gradientColors.length]
                };
            });
        }

        // Fetch Programs with specific counts via SQL
        const programsData: any = await prisma.$queryRaw`
            SELECT 
                p.slug,
                (SELECT COUNT(*)::int FROM "Course" c WHERE c."programId" = p.id) as courses,
                (SELECT COUNT(*)::int FROM "Enrollment" e 
                 JOIN "Course" c ON e."courseId" = c.id 
                 WHERE c."programId" = p.id) as students
            FROM "Program" p
        `;

        const platformStats = programsData.reduce((acc: any, p: any) => {
            acc[p.slug] = {
                students: p.students || 0,
                courses: p.courses || 0
            };
            return acc;
        }, {});

        // Fetch "Active Courses" for general view
        const activeCoursesResult: any = await prisma.$queryRaw`
            SELECT 
                c.id, 
                c.title, 
                e.progress, 
                e."enrolledAt" 
            FROM "Enrollment" e 
            JOIN "Course" c ON e."courseId" = c.id 
            WHERE e.status = 'active' 
            ORDER BY e."enrolledAt" DESC 
            LIMIT 3
        `;

        const activeCourses = activeCoursesResult.map((row: any) => ({
            id: row.id,
            title: row.title,
            module: 'Módulo en curso', // Placeholder
            progress: row.progress,
            lastAccess: 'Reciente',
            totalModules: 10,
            completedModules: Math.floor((row.progress / 100) * 10),
            nextLesson: 'Siguiente lección'
        }));

        return NextResponse.json({
            stats: {
                students: usersCount,
                courses: coursesCount,
                certifications: certificationsCount,
                completion: completionRate
            },
            userStats: userStats,
            myCourses: myCourses,
            platforms: platformStats,
            activeCourses
        });

    } catch (error) {
        console.error('Error fetching education dashboard stats:', error);
        return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
    }
}
