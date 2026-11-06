import React from "react";
import Navbar from "../../components/layout/Navbar";
import Hero from "../../components/sections/Hero";
import About from "../../components/sections/About";
import Services from "../../components/sections/Services";
import News from "../../components/sections/News";
import Footer from "../../components/layout/Footer";

export default function CybersecurityPage() {
    return (
        <main className="min-h-screen bg-cyber-dark text-foreground selection:bg-cyber-primary selection:text-black">
            <Navbar />
            <Hero />
            <About />
            <Services />
            <News />
            <Footer />
        </main>
    );
}
