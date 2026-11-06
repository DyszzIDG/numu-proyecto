export interface CSIRTKpi {
    title: string;
    value: string;
    change: string;
    color: string;
    iconName: string;
}

export interface SeverityBreakdown {
    label: string;
    value: number;
    color: string;
}

export interface ThreatTypeMetric {
    name: string;
    value: number;
}

export interface CountryMetric {
    country: string;
    values: number;
}

export interface RecentIncidentItem {
    id: string;
    type: string;
    severity: string;
    status: string;
    time: string;
    analyst: string;
    sla: string;
}

export interface ToolStatusItem {
    name: string;
    status: string;
    color: string;
}

export interface TeamStatusItem {
    name: string;
    value: string;
    status: string;
}

export interface CSIRTOverviewData {
    kpis: CSIRTKpi[];
    incidentBreakdown: SeverityBreakdown[];
    threatTypeData: ThreatTypeMetric[];
    originToDestData: CountryMetric[];
    recentIncidents: RecentIncidentItem[];
    toolsStatus: ToolStatusItem[];
    teamStatus: TeamStatusItem[];
}
