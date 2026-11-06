import React from "react";
import Navbar from "../components/layout/Navbar";
import PortalHero from "../components/sections/PortalHero";
import PortalAbout from "../components/sections/PortalAbout";
import PortalSolutions from "../components/sections/PortalSolutions";
import PortalAreas from "../components/sections/PortalAreas";
import PortalTrust from "../components/sections/PortalTrust";
import Footer from "../components/layout/Footer";
import MainScene from "../components/3d/MainScene";

export default function Home() {
    return (
        <main className="min-h-screen bg-black relative">
            <div className="fixed inset-0 z-0">
                <MainScene />
            </div>
            <div className="relative z-10">
                <Navbar />
                <PortalHero />
                <PortalAbout />
                <PortalSolutions />
                <PortalAreas />
                <PortalTrust />
                <Footer />
            </div>
        </main>
    );
}
