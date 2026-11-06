'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function LegacyAIScanRedirect() {
    const router = useRouter();

    useEffect(() => {
        router.replace('/dashboard/unified-scan?tab=ai');
    }, [router]);

    return (
        <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center text-white">
            <Loader2 className="w-10 h-10 text-cyan-500 animate-spin mb-4" />
            <h2 className="text-xl font-bold">Redirigiendo al Super Escáner...</h2>
            <p className="text-zinc-500">Hemos movido esta herramienta a una ubicación mejor.</p>
        </div>
    );
}
