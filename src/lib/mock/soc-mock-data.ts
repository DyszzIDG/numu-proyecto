// Mock data for SOC 24/7 Panel

export interface SOCIncident {
    id: string;
    title: string;
    severity: 'critical' | 'high' | 'medium' | 'low';
    status: 'open' | 'investigating' | 'contained' | 'resolved';
    assignedTo: string;
    createdAt: Date;
    updatedAt: Date;
    description: string;
    affectedSystems: string[];
}

export interface SOCEvent {
    id: string;
    timestamp: Date;
    type: 'malware' | 'intrusion' | 'anomaly' | 'policy_violation' | 'vulnerability';
    severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
    source: string;
    destination?: string;
    message: string;
    details: Record<string, any>;
}

export interface SOCMetrics {
    eventsPerSecond: number;
    activeAlerts: number;
    openIncidents: number;
    systemsMonitored: number;
    threatsBlocked: number;
    avgResponseTime: string;
}

export interface ThreatLocation {
    country: string;
    city: string;
    lat: number;
    lng: number;
    count: number;
    type: string;
}

// Mock Incidents
export const mockIncidents: SOCIncident[] = [
    {
        id: 'INC-2024-001',
        title: 'Intento de fuerza bruta detectado en servidor SSH',
        severity: 'high',
        status: 'investigating',
        assignedTo: 'Juan Pérez',
        createdAt: new Date(Date.now() - 1000 * 60 * 30),
        updatedAt: new Date(Date.now() - 1000 * 60 * 5),
        description: 'Múltiples intentos de acceso SSH desde IP sospechosa',
        affectedSystems: ['srv-prod-01', 'srv-prod-02']
    },
    {
        id: 'INC-2024-002',
        title: 'Malware detectado en estación de trabajo',
        severity: 'critical',
        status: 'contained',
        assignedTo: 'María González',
        createdAt: new Date(Date.now() - 1000 * 60 * 120),
        updatedAt: new Date(Date.now() - 1000 * 60 * 15),
        description: 'Trojan bancario detectado en equipo del departamento de finanzas',
        affectedSystems: ['WS-FIN-042']
    },
    {
        id: 'INC-2024-003',
        title: 'Tráfico anómalo hacia dominio sospechoso',
        severity: 'medium',
        status: 'open',
        assignedTo: 'Carlos Rodríguez',
        createdAt: new Date(Date.now() - 1000 * 60 * 45),
        updatedAt: new Date(Date.now() - 1000 * 60 * 10),
        description: 'Comunicación detectada con dominio asociado a C2',
        affectedSystems: ['WS-DEV-015']
    },
    {
        id: 'INC-2024-004',
        title: 'Escaneo de puertos detectado',
        severity: 'low',
        status: 'resolved',
        assignedTo: 'Ana Martínez',
        createdAt: new Date(Date.now() - 1000 * 60 * 180),
        updatedAt: new Date(Date.now() - 1000 * 60 * 60),
        description: 'Escaneo de puertos desde IP externa bloqueada',
        affectedSystems: ['Firewall-01']
    }
];

// Mock Events
export const mockEvents: SOCEvent[] = [
    {
        id: 'EVT-001',
        timestamp: new Date(Date.now() - 1000 * 30),
        type: 'intrusion',
        severity: 'high',
        source: '192.168.1.100',
        destination: '10.0.0.50',
        message: 'Intento de acceso no autorizado bloqueado',
        details: { port: 22, protocol: 'SSH', attempts: 15 }
    },
    {
        id: 'EVT-002',
        timestamp: new Date(Date.now() - 1000 * 60),
        type: 'malware',
        severity: 'critical',
        source: 'WS-FIN-042',
        message: 'Malware detectado y puesto en cuarentena',
        details: { malwareType: 'Trojan.Banker', action: 'quarantined' }
    },
    {
        id: 'EVT-003',
        timestamp: new Date(Date.now() - 1000 * 90),
        type: 'anomaly',
        severity: 'medium',
        source: 'WS-DEV-015',
        destination: 'suspicious-domain.com',
        message: 'Comunicación con dominio sospechoso detectada',
        details: { bytes: 1024000, connections: 5 }
    },
    {
        id: 'EVT-004',
        timestamp: new Date(Date.now() - 1000 * 120),
        type: 'policy_violation',
        severity: 'low',
        source: 'WS-HR-008',
        message: 'Violación de política de uso de USB',
        details: { device: 'USB Storage', action: 'blocked' }
    },
    {
        id: 'EVT-005',
        timestamp: new Date(Date.now() - 1000 * 150),
        type: 'vulnerability',
        severity: 'info',
        source: 'srv-web-01',
        message: 'Vulnerabilidad crítica detectada en Apache',
        details: { cve: 'CVE-2024-1234', severity: 'critical' }
    }
];

// Mock Metrics
export const mockMetrics: SOCMetrics = {
    eventsPerSecond: 1247,
    activeAlerts: 23,
    openIncidents: 8,
    systemsMonitored: 342,
    threatsBlocked: 1856,
    avgResponseTime: '12 min'
};

// Mock Threat Locations
export const mockThreatLocations: ThreatLocation[] = [
    { country: 'China', city: 'Beijing', lat: 39.9042, lng: 116.4074, count: 145, type: 'Brute Force' },
    { country: 'Russia', city: 'Moscow', lat: 55.7558, lng: 37.6173, count: 98, type: 'Malware' },
    { country: 'USA', city: 'New York', lat: 40.7128, lng: -74.0060, count: 67, type: 'Scanning' },
    { country: 'Brazil', city: 'São Paulo', lat: -23.5505, lng: -46.6333, count: 54, type: 'Phishing' },
    { country: 'India', city: 'Mumbai', lat: 19.0760, lng: 72.8777, count: 43, type: 'DDoS' },
    { country: 'Germany', city: 'Berlin', lat: 52.5200, lng: 13.4050, count: 32, type: 'Intrusion' }
];

// Helper function to generate random event
export function generateRandomEvent(): SOCEvent {
    const types: SOCEvent['type'][] = ['malware', 'intrusion', 'anomaly', 'policy_violation', 'vulnerability'];
    const severities: SOCEvent['severity'][] = ['critical', 'high', 'medium', 'low', 'info'];
    const sources = ['192.168.1.100', '10.0.0.50', 'WS-DEV-015', 'srv-prod-01', 'WS-FIN-042'];
    const messages = [
        'Intento de acceso no autorizado detectado',
        'Tráfico anómalo detectado',
        'Malware en cuarentena',
        'Escaneo de puertos bloqueado',
        'Violación de política detectada'
    ];

    return {
        id: `EVT-${Date.now()}`,
        timestamp: new Date(),
        type: types[Math.floor(Math.random() * types.length)],
        severity: severities[Math.floor(Math.random() * severities.length)],
        source: sources[Math.floor(Math.random() * sources.length)],
        message: messages[Math.floor(Math.random() * messages.length)],
        details: {}
    };
}
