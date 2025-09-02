export type UserRole = 'cluster_lead' | 'convoy_commander' | 'security_officer' | 'field_logistics';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  roleTitle: { en: string; ar: string };
  clearanceLevel: string;
  organization: string;
  avatarInitials: string;
  avatarColor: string;
  sessionStartedAt: string;
  token: string;
}

export const DEMO_PERSONAS: Record<UserRole, UserProfile> = {
  cluster_lead: {
    id: 'usr-aid-01',
    name: 'Abdlrrahman Shibani',
    email: 'abdlrrahman.shibani@gmail.com',
    role: 'cluster_lead',
    roleTitle: { en: 'Humanitarian Logistics Cluster Director', ar: 'مدير مجموعة الخدمات اللوجستية الإنسانية' },
    clearanceLevel: 'Level 4 — Mission Dispatch & Resource Sign-Off',
    organization: 'UN Logistics Cluster Libya',
    avatarInitials: 'AS',
    avatarColor: 'bg-amber-600',
    sessionStartedAt: new Date().toISOString(),
    token: 'jwt-aid-lead-880'
  },
  convoy_commander: {
    id: 'usr-convoy-02',
    name: 'Mahmoud Al-Werfally',
    email: 'm.werfally@un-fleet.org',
    role: 'convoy_commander',
    roleTitle: { en: 'Field Convoy Lead & Route Commander', ar: 'قائد القافلة الميدانية ومسؤول المسار' },
    clearanceLevel: 'Level 3 — Fleet Dispatch & Corridor Checkpoints',
    organization: 'Emergency Fleet Logistics Unit',
    avatarInitials: 'MW',
    avatarColor: 'bg-emerald-600',
    sessionStartedAt: new Date().toISOString(),
    token: 'jwt-aid-fleet-330'
  },
  security_officer: {
    id: 'usr-undss-03',
    name: 'Sarah Lindqvist (UNDSS)',
    email: 's.lindqvist@undss.org',
    role: 'security_officer',
    roleTitle: { en: 'UNDSS Field Security Risk Advisor', ar: 'مستشار إدارة المخاطر الأمنية الميدانية' },
    clearanceLevel: 'Level 3 — Threat Level Overrides & Escort Flags',
    organization: 'UN Department of Safety & Security',
    avatarInitials: 'SL',
    avatarColor: 'bg-rose-600',
    sessionStartedAt: new Date().toISOString(),
    token: 'jwt-aid-sec-990'
  },
  field_logistics: {
    id: 'usr-field-04',
    name: 'Depot Warehouse Officer',
    email: 'logistics.sabha@wfp-ly.org',
    role: 'field_logistics',
    roleTitle: { en: 'Regional Cargo & Cold-Chain Custodian', ar: 'مسؤول الشحنات الإقليمية وسلسلة التبريد' },
    clearanceLevel: 'Level 2 — Cargo Manifest & Thermal Monitoring',
    organization: 'Regional Humanitarian Relief Depot',
    avatarInitials: 'WH',
    avatarColor: 'bg-slate-600',
    sessionStartedAt: new Date().toISOString(),
    token: 'jwt-aid-wh-110'
  }
};
