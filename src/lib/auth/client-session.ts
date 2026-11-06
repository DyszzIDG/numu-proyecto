// Client session management utilities
export interface ClientSession {
    id: string;
    email: string;
    companyId: string;
    companyName: string;
}

const CLIENT_SESSION_KEY = 'numu_client_session';

export function setClientSession(session: ClientSession): void {
    if (typeof window !== 'undefined') {
        localStorage.setItem(CLIENT_SESSION_KEY, JSON.stringify(session));
    }
}

export function getClientSession(): ClientSession | null {
    if (typeof window !== 'undefined') {
        const sessionData = localStorage.getItem(CLIENT_SESSION_KEY);
        if (sessionData) {
            try {
                return JSON.parse(sessionData);
            } catch {
                return null;
            }
        }
    }
    return null;
}

export function clearClientSession(): void {
    if (typeof window !== 'undefined') {
        localStorage.removeItem(CLIENT_SESSION_KEY);
    }
}

export function isClientAuthenticated(): boolean {
    return getClientSession() !== null;
}
