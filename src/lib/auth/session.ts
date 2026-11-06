// Simple session management for employee portal
// In production, use JWT or next-auth

export interface EmployeeSession {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    departmentId: string | null;
}

const SESSION_KEY = 'employee_session';

export function setEmployeeSession(employee: EmployeeSession) {
    if (typeof window !== 'undefined') {
        localStorage.setItem(SESSION_KEY, JSON.stringify(employee));
    }
}

export function getEmployeeSession(): EmployeeSession | null {
    if (typeof window !== 'undefined') {
        const session = localStorage.getItem(SESSION_KEY);
        return session ? JSON.parse(session) : null;
    }
    return null;
}

export function clearEmployeeSession() {
    if (typeof window !== 'undefined') {
        localStorage.removeItem(SESSION_KEY);
    }
}

export function isAuthenticated(): boolean {
    return getEmployeeSession() !== null;
}

export function hasRole(allowedRoles: string[]): boolean {
    const session = getEmployeeSession();
    if (!session) return false;
    return allowedRoles.includes(session.role);
}
