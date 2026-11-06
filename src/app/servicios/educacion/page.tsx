import ServiceLanding from '@/components/services/ServiceLanding';
import { GraduationCap, BookOpen, Trophy, Users, Award, Target } from 'lucide-react';

export default function EducacionPage() {
    return (
        <ServiceLanding
            title="AKADEMY"
            subtitle="Plataforma integral de formación y capacitación"
            description="Soluciones educativas especializadas en ciberseguridad, tecnología y desarrollo profesional con programas certificados y plataformas interactivas de aprendizaje."
            heroGradient="from-green-600 to-teal-600"
            features={[
                {
                    icon: <BookOpen className="w-12 h-12" />,
                    title: "Integración Moodle",
                    description: "Plataforma LMS completa con cursos estructurados, seguimiento de progreso y certificaciones."
                },
                {
                    icon: <Trophy className="w-12 h-12" />,
                    title: "CTF (Capture The Flag)",
                    description: "Competencias de ciberseguridad con desafíos prácticos y ranking de participantes."
                },
                {
                    icon: <Users className="w-12 h-12" />,
                    title: "Programas Ministeriales",
                    description: "Capacitación especializada para Ministerio de Seguridad Pública y entidades gubernamentales."
                },
                {
                    icon: <GraduationCap className="w-12 h-12" />,
                    title: "Convenios Universitarios",
                    description: "Programas académicos en colaboración con universidades para formación profesional."
                },
                {
                    icon: <Award className="w-12 h-12" />,
                    title: "Certificaciones",
                    description: "Programas de certificación reconocidos en ciberseguridad y tecnologías de la información."
                },
                {
                    icon: <Target className="w-12 h-12" />,
                    title: "Formación Personalizada",
                    description: "Cursos adaptados a las necesidades específicas de cada organización."
                }
            ]}
            benefits={[
                "Formación práctica con laboratorios virtuales y escenarios reales",
                "Certificaciones reconocidas internacionalmente",
                "Instructores expertos con experiencia en la industria",
                "Plataforma de aprendizaje accesible 24/7",
                "Seguimiento personalizado del progreso de estudiantes",
                "Contenido actualizado con las últimas tendencias tecnológicas"
            ]}
            useCases={[
                {
                    title: "Capacitación Corporativa",
                    description: "Programas de formación en ciberseguridad para equipos de TI y seguridad de empresas."
                },
                {
                    title: "Formación Gubernamental",
                    description: "Cursos especializados para personal del sector público en seguridad y tecnología."
                },
                {
                    title: "AKADEMY Universitaria",
                    description: "Programas académicos complementarios para estudiantes de carreras tecnológicas."
                },
                {
                    title: "Competencias CTF",
                    description: "Eventos de hacking ético y competencias de seguridad para estudiantes y profesionales."
                },
                {
                    title: "Certificación Profesional",
                    description: "Preparación para certificaciones internacionales en ciberseguridad."
                },
                {
                    title: "Desarrollo de Talento",
                    description: "Programas de identificación y desarrollo de talento en tecnología y seguridad."
                }
            ]}
            panelLink="/servicios/educacion/panel"
            panelButtonText="Acceder al Panel de AKADEMY"
        />
    );
}
