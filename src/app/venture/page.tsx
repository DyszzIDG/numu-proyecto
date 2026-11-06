import { Rocket, TrendingUp, Users, ArrowUpRight, Globe } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function VenturePage() {
    return (
        <div className="bg-[#050505] min-h-screen text-white selection:bg-green-500/30">
            <Navbar />

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-4 overflow-hidden">
                <div className="absolute top-0 right-[20%] w-[600px] h-[600px] bg-green-600/10 blur-[120px] pointer-events-none" />

                <div className="max-w-7xl mx-auto relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-green-500/20 bg-green-900/10 text-green-400 text-sm font-mono mb-6">
                        <Rocket className="w-4 h-4" />
                        <span>INNOVATION LAB & INCUBATOR</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
                        NUMU <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">VENTURES</span>
                    </h1>
                    <p className="text-xl text-zinc-400 mb-10 max-w-2xl mx-auto leading-relaxed">
                        Construimos, financiamos y escalamos la próxima generación de startups de ciberseguridad. Convertimos ideas disruptivas en unicornios tecnológicos.
                    </p>
                    <div className="flex justify-center gap-4">
                        <button className="bg-green-600 hover:bg-green-500 text-black font-bold px-8 py-4 rounded-lg flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(34,197,94,0.5)]">
                            <TrendingUp className="w-5 h-5" />
                            APLICAR AHORA
                        </button>
                        <button className="border border-white/20 hover:bg-white/5 px-8 py-4 rounded-lg font-medium transition-colors">
                            PORTAFOLIO
                        </button>
                    </div>
                </div>
            </section>

            {/* Portfolio Grid */}
            <section className="py-20 px-4 bg-white/[0.02]">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-between mb-12">
                        <h2 className="text-3xl font-bold">PORTAFOLIO SELECCIONADO</h2>
                        <div className="flex gap-2">
                            <span className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-sm text-zinc-400">Inversiones Activas</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { name: "StealthSec", cat: "AI Security", desc: "Detección de amenzas basada en LLMs autónomos.", stage: "Seed" },
                            { name: "BlockChainGuard", cat: "Web3", desc: "Auditoría automatizada de Smart Contracts.", stage: "Series A" },
                            { name: "QuantumShield", cat: "Cryptography", desc: "Cifrado post-cuántico para banca.", stage: "Pre-Seed" },
                        ].map((startup, idx) => (
                            <div key={idx} className="group p-8 rounded-2xl bg-[#0A0A0A] border border-white/10 hover:border-green-500/50 transition-all hover:-translate-y-2">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-xl font-bold font-mono">
                                        {startup.name[0]}
                                    </div>
                                    <div className="px-3 py-1 rounded-full border border-white/10 text-xs font-mono bg-white/5">
                                        {startup.stage}
                                    </div>
                                </div>
                                <h3 className="text-2xl font-bold mb-2 group-hover:text-green-400 transition-colors">{startup.name}</h3>
                                <p className="text-green-500 text-sm font-mono mb-4">{startup.cat}</p>
                                <p className="text-zinc-400 mb-6">
                                    {startup.desc}
                                </p>
                                <div className="pt-6 border-t border-white/10 flex justify-between items-center text-sm text-zinc-500">
                                    <span className="flex items-center gap-2">
                                        <Globe className="w-4 h-4" /> Global
                                    </span>
                                    <ArrowUpRight className="w-5 h-5 group-hover:text-white transition-colors" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
