import { ClientSidebar } from "@/components/client/ClientSidebar";

export default function ClientLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
            <ClientSidebar />
            <main className="ml-64 p-8 min-h-screen">
                {children}
            </main>
        </div>
    );
}
