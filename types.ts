
import React from 'react';

export type Department = 'PEDIATRICS' | 'SURGERY' | 'COLORECTAL';

export enum AgentCategory {
  MONITORING = "환자 모니터링",
  CONVERSATIONAL = "의료 상담 지원",
  REPORTING = "의료진 보고",
  TRIAGE = "홈케어 트리아제",
}

export enum AgentType {
  MONITORING_VITAL_SIGNS = "MONITORING_VITAL_SIGNS",
  MONITORING_VENTILATOR = "MONITORING_VENTILATOR",
  CONVERSATIONAL_CHATBOT = "CONVERSATIONAL_CHATBOT",
  REPORTING_SUMMARY = "REPORTING_SUMMARY",
  MANAGEMENT_TRIAGE = "MANAGEMENT_TRIAGE",
}

export interface BehavioralRule {
  id: string;
  condition: string;
  matchType: 'any' | 'all';
  responses: string[];
  escalation: 'none' | 'nurse_alert' | 'doctor_review';
  tags?: string[];
  isDeletable?: boolean;
}

export interface EMRDataPoints {
  vitals: boolean;
  ventilatorData: boolean;
  labResults: boolean;
  medications: boolean;
  allergies: boolean;
  consultationNotes: boolean;
}

export interface EMRIntegrationConfig {
  enabled: boolean;
  dataPoints: Partial<EMRDataPoints>;
}

export interface MedicalLiteratureSearchConfig {
  enabled: boolean;
  databases: {
    pubmed: boolean;
    medline: boolean;
    cochrane: boolean;
  };
  searchScope: 'abstracts' | 'full_text';
  recency: '1y' | '5y' | 'all';
}

export interface EvaluationMetricConfig {
  enabled: boolean;
  rougeScoreThreshold: number; // 0-100
  factualityScoreThreshold: number; // 0-100
  evaluationAction: 'log' | 'flag' | 'alert';
}

export interface NotificationPreferences {
  enabled: boolean;
  sound: boolean;
  push: boolean;
  email: boolean;
}

export interface MonitoringConfig {
  parameters: {
    spo2: boolean;
    heartRate: boolean;
    respRate: boolean;
    ventilatorPressure: boolean;
  };
  spo2Threshold: number;
  alertSensitivity: 'low' | 'medium' | 'high';
  emrIntegration: EMRIntegrationConfig;
  notificationPreferences: NotificationPreferences;
}

export interface VentilatorConfig {
  parameters: {
    tidalVolume: boolean;
    peakInspiratoryPressure: boolean;
    respiratoryRate: boolean;
    leakPercentage: boolean;
    peep: boolean;
    drivingPressure: boolean;
    fio2?: boolean;
    minuteVolume?: boolean;
    ieRatio?: boolean;
  };
  lowTidalVolumeThreshold: number; // in mL/kg
  highTidalVolumeThreshold: number; // in mL/kg
  pipThreshold: number; // in cmH2O
  minRespiratoryRateThreshold: number; // in breaths/min
  maxRespiratoryRateThreshold: number; // in breaths/min
  leakThreshold: number; // in %
  peepThreshold: number; // in cmH2O (low threshold)
  drivingPressureThreshold: number; // in cmH2O (high threshold)
  alertProfile: 'standard' | 'pediatric' | 'sensitive';
  knowledgeSourceIds: string[];
  emrIntegration: EMRIntegrationConfig;
  literatureSearch: MedicalLiteratureSearchConfig;
  evaluation: EvaluationMetricConfig;
  notificationPreferences: NotificationPreferences;
}

export interface TriageCriteria {
  id: string;
  level: 'red' | 'yellow' | 'green';
  description: string;
  symptoms: string[];
  action: string;
}

export interface TriageConfig {
  protocols: TriageCriteria[];
  autoAlertGuardian: boolean;
  knowledgeSourceIds: string[];
  emrIntegration: EMRIntegrationConfig;
  notificationPreferences: NotificationPreferences;
}

export enum KnowledgeSourceType {
  PROTOCOL = "병원 프로토콜",
  GUIDELINE = "임상 가이드라인",
  RECOMMENDATION = "임상 진료 권장사항",
  TEXTBOOK = "의학 교과서",
  PRO = "환자 보고 결과 (PROs)",
  CUSTOM = "사용자 정의",
}

export interface KnowledgeSource {
  id: string;
  name: string;
  type: string;
  description?: string;
  url?: string;
  enabled: boolean;
  isDeletable: boolean;
}

export interface ChatbotConfig {
  persona: 'clinical' | 'empathetic' | 'direct';
  knowledgeSourceIds: string[];
  rules: BehavioralRule[];
  literatureSearch: MedicalLiteratureSearchConfig;
  evaluation: EvaluationMetricConfig;
}

export interface ReportingConfig {
  frequency: 'daily' | 'twice_daily' | 'on_demand';
  content: {
    vitalTrends: boolean;
    alertsLog: boolean;
    guardianSymptoms: boolean;
    medicationAdherence: boolean;
  };
  format: 'bullet' | 'narrative' | 'table';
  emrIntegration: EMRIntegrationConfig;
  literatureSearch: MedicalLiteratureSearchConfig;
  evaluation: EvaluationMetricConfig;
}

export type AgentConfig = MonitoringConfig | ChatbotConfig | ReportingConfig | VentilatorConfig | TriageConfig;

export interface Agent<T extends AgentConfig> {
  id: string;
  name: string;
  description: string;
  category: AgentCategory;
  type: AgentType;
  icon: React.ComponentType<{ className?: string }>;
  config: T;
  enabled: boolean;
}

export interface AgentTemplate {
  id: string;
  name: string;
  agentType: AgentType;
  config: AgentConfig;
}

export interface ComplicationRisk {
  score: number;
  level: 'Low' | 'Moderate' | 'High' | 'Critical';
  label: string;
  trend: 'increasing' | 'decreasing' | 'stable';
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: '남' | '여';
  department: Department;
  diagnosis: string;
  status: string; 
  complicationRisk?: ComplicationRisk; 
  recurrenceRisk?: ComplicationRisk;
}

export type AlertSeverity = 'info' | 'warning' | 'critical';

export interface Alert {
  id: string;
  timestamp: number;
  severity: AlertSeverity;
  message: string;
  agentName: string;
  patientId: string;
  patientName: string;
  isRead: boolean;
}
