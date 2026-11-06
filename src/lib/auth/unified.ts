/**
 * Unified Authentication Helper
 * Supports both NextAuth sessions (User model) and Employee sessions
 */

import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';
import { cookies } from 'next/headers';

const prisma = new PrismaClient();

export interface AuthenticatedUser {
    id: string;
    email: string;
    role: string;
    type: 'user' | 'employee';
}

interface EmployeeSessionData {
    id: string;
    email: string;
    role: string;
    expiresAt?: number;
}

/**
 * Get authenticated user from either NextAuth session or Employee session cookie
 */
export async function getAuthenticatedUser(): Promise<AuthenticatedUser | null> {
    try {
        // Try NextAuth session first
        const session = await getServerSession(authOptions);
        if (session?.user?.email) {
            const user = await prisma.user.findUnique({
                where: { email: session.user.email },
            });

            if (user) {
                return {
                    id: user.id,
                    email: user.email || '',
                    role: user.role,
                    type: 'user',
                };
            }
        }

        // Try employee session cookie
        const cookieStore = cookies();
        const employeeSessionCookie = cookieStore.get('employee_session');

        if (employeeSessionCookie?.value) {
            try {
                const employeeSession: EmployeeSessionData = JSON.parse(employeeSessionCookie.value);

                // Validate session structure
                if (!employeeSession.id || !employeeSession.email || !employeeSession.role) {
                    console.warn('[AUTH] Invalid employee session structure');
                    return null;
                }

                // Check expiration if present
                if (employeeSession.expiresAt && employeeSession.expiresAt < Date.now()) {
                    console.warn('[AUTH] Employee session expired');
                    return null;
                }

                // Verify employee exists and is active
                const employee = await prisma.employee.findUnique({
                    where: { id: employeeSession.id },
                });

                if (employee && employee.isActive && employee.email === employeeSession.email) {
                    return {
                        id: employee.id,
                        email: employee.email,
                        role: employee.role,
                        type: 'employee',
                    };
                } else {
                    console.warn('[AUTH] Employee session validation failed');
                }
            } catch (parseError) {
                console.error('[AUTH] Error parsing employee session cookie:', parseError);
            }
        }

        return null;
    } catch (error) {
        console.error('[AUTH] Error in getAuthenticatedUser:', error);
        return null;
    }
}
