import ServiceLanding from '@/components/services/ServiceLanding';
import { TrendingUp, Users, Target, Phone, Mail, Calendar } from 'lucide-react';

export default function VentasPage() {
    return (
        <ServiceLanding
            title="Ventas"
            subtitle="CRM y gestión comercial inteligente"
            description="Sistema completo de gestión de ventas con seguimiento de oportunidades, pipeline visual y automatización de procesos comerciales para maximizar tus conversiones."
            heroGradient="from-orange-600 to-red-600"
            features={[
                {
                    icon: <Users className="w-12 h-12" />,
                    title: "Gestión de Clientes",
                    description: "Base de datos centralizada de clientes y prospectos con historial completo de interacciones."
                },
                {
                    icon: <TrendingUp className="w-12 h-12" />,
                    title: "Pipeline de Ventas",
                    description: "Visualización del embudo de ventas con seguimiento de oportunidades por etapa."
                },
                {
                    icon: <Target className="w-12 h-12" />,
                    title: "Gestión de Oportunidades",
                    description: "Seguimiento detallado de cada oportunidad de negocio con probabilidad de cierre."
                },
                {
                    icon: <Phone className="w-12 h-12" />,
                    title: "Seguimiento de Contactos",
                    description: "Registro de llamadas, reuniones y comunicaciones con clientes potenciales."
                },
                {
                    icon: <Mail className="w-12 h-12" />,
                    title: "Automatización de Marketing",
                    description: "Campañas de email marketing y seguimiento automatizado de leads."
                },
                {
                    icon: <Calendar className="w-12 h-12" />,
                    title: "Agenda y Tareas",
                    description: "Calendario integrado con recordatorios y asignación de tareas al equipo de ventas."
                }
            ]}
            benefits={[
                "Aumento de conversión con seguimiento estructurado de leads",
                "Visibilidad completa del pipeline y proyección de ventas",
                "Mejora en la colaboración del equipo comercial",
                "Automatización de tareas repetitivas y seguimientos",
                "Análisis de métricas de ventas y desempeño del equipo",
                "Integración con herramientas de comunicación y marketing"
            ]}
            useCases={[
                {
                    title: "Gestión de Leads",
                    description: "Captura, calificación y seguimiento de leads desde múltiples fuentes."
                },
                {
                    title: "Ventas B2B",
                    description: "Gestión de ciclos de venta largos con múltiples stakeholders y etapas."
                },
                {
                    title: "Renovaciones y Upselling",
                    description: "Seguimiento de renovaciones de contratos y oportunidades de venta cruzada."
                },
                {
                    title: "Reportes de Ventas",
                    description: "Análisis de desempeño del equipo comercial y cumplimiento de metas."
                },
                {
                    title: "Gestión de Cotizaciones",
                    description: "Creación y seguimiento de propuestas comerciales y cotizaciones."
                },
                {
                    title: "Análisis de Conversión",
                    description: "Métricas de conversión por etapa del funnel y fuente de leads."
                }
            ]}
            panelLink="/servicios/ventas/panel"
            panelButtonText="Acceder al Panel de Ventas"
        />
    );
}
