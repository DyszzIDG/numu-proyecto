"use client";

import { ProfileSidebar } from "@/components/profile/ProfileSidebar";
import { ReactNode } from "react";
import { Navbar } from "@/components/layout/Navbar"; // Assuming there is a main Navbar we might want? Or maybe just the sidebar.

// If we are already inside a main layout that has Navbar, we might not need it.
// But typically Profile page is standalone or within main app structure.
// Let's assume standalone-ish layout for now, or just the content wrapper.

export default function ProfileLayout({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen bg-black text-white flex flex-col">
            {/* Ensure we have a navbar or back button if needed, but for now just the container */}
            <div className="flex-1 flex pt-16"> {/* Add padding top if fixed navbar exists */}
                <ProfileSidebar />
                <main className="flex-1 p-8 overflow-y-auto h-[calc(100vh-4rem)]">
                    {children}
                </main>
            </div>
        </div>
    );
}
