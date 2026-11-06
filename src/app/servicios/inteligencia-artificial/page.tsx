import ServiceLanding from '@/components/services/ServiceLanding';
import { Brain, MessageSquare, Sparkles, Zap, Code, Database } from 'lucide-react';

export default function InteligenciaArtificialPage() {
    return (
        <ServiceLanding
            title="Inteligencia Artificial"
            subtitle="Soluciones avanzadas de IA para transformar tu negocio"
            description="Aprovecha el poder de la inteligencia artificial con nuestros modelos de lenguaje, automatización inteligente y análisis predictivo para impulsar la innovación en tu organización."
            heroGradient="from-purple-600 to-pink-600"
            features={[
                {
                    icon: <MessageSquare className="w-12 h-12" />,
                    title: "LLM (Modelos de Lenguaje)",
                    description: "Acceso a modelos de lenguaje avanzados para procesamiento de texto, generación de contenido y análisis semántico."
                },
                {
                    icon: <Sparkles className="w-12 h-12" />,
                    title: "NMUSUITE",
                    description: "Suite completa de herramientas de IA integradas para automatización y optimización de procesos."
                },
                {
                    icon: <Zap className="w-12 h-12" />,
                    title: "Automatización Inteligente",
                    description: "Workflows automatizados con IA para reducir tareas repetitivas y aumentar la eficiencia."
                },
                {
                    icon: <Brain className="w-12 h-12" />,
                    title: "Análisis Predictivo",
                    description: "Modelos de machine learning para predicción de tendencias y toma de decisiones informadas."
                },
                {
                    icon: <Code className="w-12 h-12" />,
                    title: "Generación de Código",
                    description: "Asistentes de IA para desarrollo de software y generación automática de código."
                },
                {
                    icon: <Database className="w-12 h-12" />,
                    title: "Procesamiento de Datos",
                    description: "Análisis y procesamiento inteligente de grandes volúmenes de datos estructurados y no estructurados."
                }
            ]}
            benefits={[
                "Aumento de productividad mediante automatización inteligente",
                "Reducción de costos operativos con optimización de procesos",
                "Toma de decisiones basada en datos y análisis predictivo",
                "Mejora en la experiencia del cliente con chatbots y asistentes virtuales",
                "Escalabilidad y adaptabilidad a las necesidades del negocio",
                "Integración sencilla con sistemas existentes"
            ]}
            useCases={[
                {
                    title: "Atención al Cliente",
                    description: "Chatbots inteligentes para soporte 24/7 y resolución automática de consultas frecuentes."
                },
                {
                    title: "Análisis de Documentos",
                    description: "Procesamiento automático de contratos, facturas y documentos legales con extracción de información clave."
                },
                {
                    title: "Marketing Personalizado",
                    description: "Generación de contenido personalizado y segmentación inteligente de audiencias."
                },
                {
                    title: "Desarrollo de Software",
                    description: "Asistencia en programación, revisión de código y generación de documentación técnica."
                },
                {
                    title: "Recursos Humanos",
                    description: "Screening de candidatos, análisis de CV y recomendaciones de contratación."
                },
                {
                    title: "Investigación y Desarrollo",
                    description: "Análisis de literatura científica y generación de hipótesis para proyectos de I+D."
                }
            ]}
            panelLink="/servicios/inteligencia-artificial/panel"
            panelButtonText="Acceder al Panel de IA"
        />
    );
}
