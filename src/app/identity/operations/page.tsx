"use client";

import ModuleDashboard from '@/components/modules/ModuleDashboard';

export default function IdentityPage() {
    const modules = [
        { title: "Autenticaciones", description: "Detección de logins sospechosos", status: "active" as const },
        { title: "Movimientos Laterales", description: "Rastreo de propagación interna", status: "active" as const },
        { title: "Privileged Accounts", description: "Gestión de accesos privilegiados (PAM)", status: "active" as const },
        { title: "Brute Force", description: "Detección de intentos masivos de acceso", status: "active" as const },
        { title: "Impossible Travel", description: "Alertas por geolocalización inverosímil", status: "active" as const },
        { title: "MFA Fatigue", description: "Protección contra bombardeo de notificaciones", status: "active" as const },
        { title: "AD Health", description: "Estado de salud de Active Directory", status: "active" as const },
        { title: "User Lifecycle", description: "Altas, bajas y modificaciones de usuarios", status: "active" as const },
        { title: "Shadow IT", description: "Descubrimiento de cuentas no autorizadas", status: "active" as const },
        { title: "Password Audit", description: "Auditoría de fortaleza de contraseñas", status: "active" as const },
    ];

    return (
        <ModuleDashboard
            title="Protección de Identidad"
            description="IAM Security y detección de anomalías en credenciales para prevenir el robo de identidad."
            breadcrumbs={[
                { label: 'Servicios', href: '/dashboard' },
                { label: 'Ciberseguridad', href: '/cybersecurity' },
                { label: 'Identidad', href: '/identity/operations' }
            ]}
            modules={modules}
        />
    );
}
