"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";


export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    // Rutas que NO deben tener Sidebar (son servicios standalone o el dashboard principal)
    const fullScreenRoutes = [
        "/dashboard",
        "/dashboard/escaneo",
        "/dashboard/manual-scans",
        "/dashboard/ai-scans",
        "/dashboard/ivan-scans",
        "/dashboard/unified-scan",
        "/dashboard/admin-central"
    ];

    const shouldHideSidebar = fullScreenRoutes.some(route => pathname === route || pathname.startsWith(`${route}/`));

    return (
        <div className="min-h-screen bg-[#050505] text-white flex flex-col">
            {!shouldHideSidebar && <Sidebar />}

            <main className={`${!shouldHideSidebar ? 'ml-64' : ''} ${shouldHideSidebar ? 'p-0' : 'p-8'} min-h-screen relative overflow-x-auto min-w-0 flex-1 flex flex-col transition-all duration-300`}>
                {/* Ambient background effects */}
                <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
                    <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[100px]" />
                    <div className="absolute bottom-[-10%] right-[20%] w-[400px] h-[400px] bg-green-600/5 rounded-full blur-[100px]" />
                </div>

                <div className="relative z-10 flex-1">
                    {children}
                </div>


            </main>
        </div>
    );
}
