import { Trophy, Flag, Crosshair, Users, ArrowRight } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function CTFPage() {
    return (
        <div className="bg-[#050505] min-h-screen text-white selection:bg-cyan-500/30">
            <Navbar />

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-4 overflow-hidden">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-cyan-500/5 blur-[100px] pointer-events-none" />

                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="flex flex-col md:flex-row items-center gap-12">
                        <div className="md:w-1/2">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/20 bg-cyan-900/10 text-cyan-400 text-sm font-mono mb-6">
                                <Flag className="w-4 h-4" />
                                <span>COMPETITION STATUS: ACTIVE</span>
                            </div>
                            <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
                                NUMU <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">CTF</span>
                            </h1>
                            <p className="text-xl text-zinc-400 mb-8 leading-relaxed">
                                Pon a prueba tus habilidades de hacking ético. Resuelve desafíos de criptografía, web exploitation, forense y más. Compite contra la élite mundial y escala en el ranking.
                            </p>
                            <div className="flex gap-4">
                                <button className="bg-cyan-600 hover:bg-cyan-500 text-black font-bold px-8 py-4 rounded-lg flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(6,182,212,0.5)]">
                                    <Crosshair className="w-5 h-5" />
                                    UNIRSE A LA BATALLA
                                </button>
                                <button className="border border-white/20 hover:bg-white/5 px-8 py-4 rounded-lg font-medium transition-colors">
                                    VER RANKING
                                </button>
                            </div>
                        </div>

                        {/* Mock Leaderboard Preview */}
                        <div className="md:w-1/2 w-full">
                            <div className="bg-black/40 border border-cyan-500/20 p-6 rounded-2xl backdrop-blur-xl relative">
                                <div className="absolute -top-4 -right-4 w-20 h-20 bg-cyan-500/20 blur-2xl rounded-full" />
                                <h3 className="text-xl font-mono text-cyan-400 mb-4 flex items-center gap-2">
                                    <Trophy className="w-5 h-5 text-yellow-500" />
                                    TOP HACKERS
                                </h3>
                                <div className="space-y-3">
                                    {[
                                        { rank: 1, user: "ZeroCool", score: 15400, color: "text-amber-400" },
                                        { rank: 2, user: "AcidBurn", score: 14200, color: "text-zinc-300" },
                                        { rank: 3, user: "CerealKiller", score: 13850, color: "text-amber-700" },
                                        { rank: 4, user: "LordNikon", score: 12100, color: "text-zinc-500" },
                                    ].map((player) => (
                                        <div key={player.rank} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5 hover:border-cyan-500/30 transition-colors">
                                            <div className="flex items-center gap-4">
                                                <span className={`font-mono font-bold w-6 ${player.color}`}>#{player.rank}</span>
                                                <span className="font-medium text-white">{player.user}</span>
                                            </div>
                                            <span className="font-mono text-cyan-400">{player.score.toLocaleString()} PTS</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Categories Section */}
            <section className="py-20 bg-black/20">
                <div className="max-w-7xl mx-auto px-4">
                    <h2 className="text-3xl font-bold mb-12 text-center">CATEGORÍAS DESAFÍO</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {["Web Exploitation", "Cryptography", "Reverse Engineering", "Forensics"].map((cat) => (
                            <div key={cat} className="group p-6 rounded-xl bg-gradient-to-br from-white/5 to-transparent border border-white/10 hover:border-cyan-500/50 hover:from-cyan-900/20 transition-all cursor-crosshair">
                                <h3 className="text-xl font-bold mb-2 group-hover:text-cyan-400 transition-colors">{cat}</h3>
                                <p className="text-sm text-zinc-500 mb-4">5 Active Challenges</p>
                                <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden">
                                    <div className="bg-cyan-500 h-full w-[45%]" />
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
