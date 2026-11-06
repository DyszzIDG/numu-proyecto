import ServiceLanding from '@/components/services/ServiceLanding';
import { DollarSign, TrendingUp, PieChart, CreditCard, FileText, BarChart3 } from 'lucide-react';

export default function FinanzasPage() {
    return (
        <ServiceLanding
            title="Finanzas"
            subtitle="Gestión financiera integral y transparente"
            description="Sistema completo de gestión financiera con reportes en tiempo real, facturación automatizada y análisis de rentabilidad para optimizar los recursos de tu organización."
            heroGradient="from-emerald-600 to-green-600"
            features={[
                {
                    icon: <DollarSign className="w-12 h-12" />,
                    title: "Gestión de Ingresos",
                    description: "Control detallado de ingresos por servicio, cliente y período con proyecciones financieras."
                },
                {
                    icon: <CreditCard className="w-12 h-12" />,
                    title: "Facturación Automatizada",
                    description: "Generación automática de facturas, recibos y documentos tributarios con integración contable."
                },
                {
                    icon: <PieChart className="w-12 h-12" />,
                    title: "Análisis de Costos",
                    description: "Seguimiento de gastos operativos y análisis de rentabilidad por servicio y proyecto."
                },
                {
                    icon: <FileText className="w-12 h-12" />,
                    title: "Reportes Financieros",
                    description: "Informes ejecutivos con estados financieros, flujo de caja y balance general."
                },
                {
                    icon: <TrendingUp className="w-12 h-12" />,
                    title: "Proyecciones y Presupuestos",
                    description: "Herramientas de planificación financiera con análisis de tendencias y escenarios."
                },
                {
                    icon: <BarChart3 className="w-12 h-12" />,
                    title: "Dashboard Ejecutivo",
                    description: "Visualización en tiempo real de KPIs financieros y métricas de desempeño."
                }
            ]}
            benefits={[
                "Visibilidad completa de la salud financiera de la organización",
                "Reducción de errores mediante automatización de procesos",
                "Cumplimiento de normativas fiscales y contables",
                "Toma de decisiones informadas con datos en tiempo real",
                "Optimización de flujo de caja y gestión de tesorería",
                "Integración con sistemas bancarios y plataformas de pago"
            ]}
            useCases={[
                {
                    title: "Control de Suscripciones",
                    description: "Gestión de pagos recurrentes y renovaciones automáticas de servicios."
                },
                {
                    title: "Facturación por Proyectos",
                    description: "Facturación detallada por horas, hitos o entregables de proyectos específicos."
                },
                {
                    title: "Análisis de Rentabilidad",
                    description: "Evaluación de márgenes de ganancia por servicio, cliente o línea de negocio."
                },
                {
                    title: "Presupuestos Departamentales",
                    description: "Asignación y seguimiento de presupuestos por área o departamento."
                },
                {
                    title: "Reportes Ejecutivos",
                    description: "Informes financieros para junta directiva y stakeholders."
                },
                {
                    title: "Auditoría y Compliance",
                    description: "Trazabilidad completa de transacciones para auditorías internas y externas."
                }
            ]}
            panelLink="/servicios/finanzas/panel"
            panelButtonText="Acceder al Panel de Finanzas"
        />
    );
}
