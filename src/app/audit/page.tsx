import { Shield, FileCheck, Lock, Scale, CheckSquare } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function AuditPage() {
    return (
        <div className="bg-[#050505] min-h-screen text-white selection:bg-blue-500/30">
            <Navbar />

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-4 overflow-hidden">
                <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-600/10 blur-[100px] pointer-events-none" />

                <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row items-center gap-16">
                    <div className="md:w-1/2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/20 bg-blue-900/10 text-blue-400 text-sm font-mono mb-6">
                            <Shield className="w-4 h-4" />
                            <span>GOVERNANCE, RISK & COMPLIANCE</span>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight leading-tight">
                            ASEGURANDO EL <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-600">ESTÁNDAR DE ORO</span>
                        </h1>
                        <p className="text-xl text-zinc-400 mb-8 leading-relaxed">
                            Servicios integrales de auditoría y consultoría para alinear su organización con los estándares internacionales más rigurosos.
                        </p>
                        <button className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 py-4 rounded-lg flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(37,99,235,0.5)]">
                            <FileCheck className="w-5 h-5" />
                            SOLICITAR AUDITORÍA
                        </button>
                    </div>

                    {/* Badges Grid */}
                    <div className="md:w-1/2 grid grid-cols-2 gap-4">
                        {["ISO 27001", "NIST CSF", "GDPR", "PCI DSS", "SOC 2", "HIPAA"].map((badge) => (
                            <div key={badge} className="p-6 rounded-xl bg-white/5 border border-white/10 flex flex-col items-center justify-center text-center hover:bg-white/10 hover:border-blue-500/30 transition-all group">
                                <Shield className="w-10 h-10 text-zinc-600 group-hover:text-blue-400 mb-3 transition-colors" />
                                <span className="font-bold font-mono text-zinc-300 group-hover:text-white transition-colors">{badge}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Services List */}
            <section className="py-20 bg-black/20 border-t border-white/5">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <ServiceCard
                            icon={CheckSquare}
                            title="Gap Analysis"
                            description="Evaluación inicial detallada para identificar brechas entre su estado actual y los requisitos normativos."
                        />
                        <ServiceCard
                            icon={Lock}
                            title="Implementación"
                            description="Acompañamiento en el diseño y despliegue de controles de seguridad, políticas y procedimientos."
                        />
                        <ServiceCard
                            icon={Scale}
                            title="Auditoría Interna"
                            description="Verificación independiente del cumplimiento antes de la certificación oficial."
                        />
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}

function ServiceCard({ icon: Icon, title, description }: any) {
    return (
        <div className="p-8 rounded-2xl bg-[#0A0A0A] border border-white/10 hover:border-blue-500/50 transition-all group">
            <div className="w-12 h-12 rounded-lg bg-blue-900/20 flex items-center justify-center text-blue-400 mb-6 group-hover:scale-110 transition-transform">
                <Icon className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-white">{title}</h3>
            <p className="text-zinc-400 leading-relaxed">
                {description}
            </p>
        </div>
    )
}
