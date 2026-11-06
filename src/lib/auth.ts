/**
 * Authentication Configuration
 * NextAuth configuration for the application
 */

import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// JWT secret with fallback to NEXTAUTH_SECRET to prevent build crashes
const JWT_SECRET = process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET || 'numu-jwt-secret-key-fallback';

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    console.warn('[AUTH] Missing credentials');
                    return null;
                }

                try {
                    // 1. Try to find user in standard User table (Unified System)
                    const user = await prisma.user.findUnique({
                        where: { email: credentials.email },
                        include: { userProfile: true }
                    });

                    if (user && user.password) {
                        // Verify password
                        const isValid = await bcrypt.compare(credentials.password, user.password);
                        if (isValid) {
                            console.info(`[AUTH] User login successful: ${user.email}`);

                            // Create UserProfile if it doesn't exist (using transaction to prevent race conditions)
                            let userProfileId = user.userProfile?.id;
                            if (!userProfileId) {
                                try {
                                    const newProfile = await prisma.$transaction(async (tx) => {
                                        // Check again inside transaction
                                        const existingProfile = await tx.userProfile.findUnique({
                                            where: { userId: user.id }
                                        });

                                        if (existingProfile) {
                                            return existingProfile;
                                        }

                                        return await tx.userProfile.create({
                                            data: { userId: user.id }
                                        });
                                    });
                                    userProfileId = newProfile.id;
                                    console.info(`[AUTH] Created user profile for: ${user.email}`);
                                } catch (error) {
                                    console.error('[AUTH] Error creating user profile:', error);
                                    // Continue without profile - non-critical
                                }
                            }

                            return {
                                id: user.id,
                                email: user.email || '',
                                name: user.name || '',
                                role: user.role,
                                userProfileId: userProfileId
                            };
                        } else {
                            console.warn(`[AUTH] Invalid password for user: ${credentials.email}`);
                        }
                    }

                    // 2. Fallback: Try to find employee (CSIRT/Internal Legacy)
                    const employee = await prisma.employee.findUnique({
                        where: { email: credentials.email },
                        include: { department: true }
                    });

                    if (employee && employee.password) {
                        const isValid = await bcrypt.compare(credentials.password, employee.password);
                        if (isValid) {
                            if (!employee.isActive) {
                                console.warn(`[AUTH] Inactive employee attempted login: ${credentials.email}`);
                                return null;
                            }

                            console.info(`[AUTH] Employee login successful: ${employee.email}`);
                            return {
                                id: employee.id,
                                email: employee.email,
                                name: `${employee.firstName} ${employee.lastName}`,
                                role: employee.role,
                            };
                        } else {
                            console.warn(`[AUTH] Invalid password for employee: ${credentials.email}`);
                        }
                    }

                    console.warn(`[AUTH] User not found: ${credentials.email}`);
                    return null;
                } catch (error) {
                    console.error('[AUTH] Database error during authentication:', error);
                    return null;
                }
            },
        }),
    ],
    session: {
        strategy: 'jwt',
        maxAge: 24 * 60 * 60, // 24 hours
    },
    pages: {
        signIn: '/auth/login',
    },
    callbacks: {
        async jwt({ token, user, account }) {
            if (user) {
                token.id = user.id;
                token.email = user.email;
                token.role = user.role;
                if ('userProfileId' in user) {
                    token.userProfileId = user.userProfileId as string;
                }

                // Sign a backend-compatible token
                try {
                    const backendToken = jwt.sign(
                        {
                            id: user.id || token.id,
                            email: user.email || token.email,
                            role: user.role || token.role
                        },
                        JWT_SECRET,
                        { expiresIn: '24h' }
                    );
                    token.accessToken = backendToken;
                } catch (error) {
                    console.error('[AUTH] Error signing backend token:', error);
                }
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
                session.user.email = token.email as string;
                session.user.role = token.role as string;
                if (token.userProfileId) {
                    (session.user as any).userProfileId = token.userProfileId as string;
                }
                session.accessToken = token.accessToken as string;
            }
            return session;
        },
    },
};
