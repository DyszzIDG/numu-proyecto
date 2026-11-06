'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function RedirectPage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === 'authenticated' && session?.user) {
            const role = session.user.role;

            // Role-based redirection logic
            switch (role) {
                case 'admin':
                    router.push('/dashboard/csirt-admin');
                    break;
                case 'analyst':
                    router.push('/dashboard/csirt-analyst');
                    break;
                case 'company':
                case 'viewer':
                    router.push('/dashboard/vista-empresa');
                    break;
                default:
                    router.push('/dashboard');
            }
        } else if (status === 'unauthenticated') {
            router.push('/csirt/login');
        }
    }, [status, session, router]);

    return (
        <div className="min-h-screen bg-black flex items-center justify-center">
            <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
                <p className="text-gray-400">Redirigiendo según tu rol...</p>
            </div>
        </div>
    );
}
