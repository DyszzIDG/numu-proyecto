import NotificationBell from '@/components/portal/NotificationBell';

export default function PortalLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="relative">
            {/* 
               If we wanted a persistent header across all portal pages, we could add it here.
               However, most pages have their own headers. 
               For now, we will just float the bell or wrap children.
               A better approach is to have a layout that puts the bell in a fixed position or a header.
               
               Let's create a minimal header or just a fixed bell.
            */}
            {/* Top Bar for Portal */}
            <div className="fixed top-0 right-0 p-4 z-50">
                <div className="bg-black/50 backdrop-blur-md border border-white/10 rounded-full p-1 shadow-lg">
                    <NotificationBell />
                </div>
            </div>

            {children}
        </div>
    );
}
