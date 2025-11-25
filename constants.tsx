
import React from 'react';
import { Agent, AgentCategory, AgentType, MonitoringConfig, ChatbotConfig, ReportingConfig, VentilatorConfig, AgentConfig, KnowledgeSourceType, EMRIntegrationConfig, KnowledgeSource, MedicalLiteratureSearchConfig, BehavioralRule, EvaluationMetricConfig, Patient, Department, ComplicationRisk, NotificationPreferences } from './types';

// HeroIcons as React Components
const ChartBarIcon: React.FC<{ className?: string }> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
  </svg>
);

const ChatBubbleLeftRightIcon: React.FC<{ className?: string }> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193l-3.72 3.72a1.05 1.05 0 0 1-1.485 0l-3.72-3.72a2.11 2.11 0 0 1-1.98-2.193v-4.286c0-.97.616-1.813 1.5-2.097M16.5 6.75v1.875a1.5 1.5 0 0 1-1.5 1.5h-1.5a1.5 1.5 0 0 1-1.5-1.5V6.75m4.5 0a3 3 0 0 0-3-3h-1.5a3 3 0 0 0-3 3m-3.75 0H7.5m9 12.75h3.75m-3.75 0a3 3 0 0 1-3-3V12m-3.75 0V12m-3.75 0a3 3 0 0 0-3 3m0 0h3.75" />
  </svg>
);

const DocumentTextIcon: React.FC<{ className?: string }> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
  </svg>
);

const SignalIcon: React.FC<{ className?: string }> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.288 15.038a5.25 5.25 0 0 1 7.424 0M5.136 12.006a8.25 8.25 0 0 1 13.728 0M2.013 8.948a12.75 12.75 0 0 1 19.974 0M12 18.75h.008v.008H12v-.008Z" />
    </svg>
);

const PresentationChartLineIcon: React.FC<{ className?: string }> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" />
  </svg>
);


const DEFAULT_EMR_INTEGRATION_CONFIG: EMRIntegrationConfig = {
    enabled: false,
    dataPoints: {}
};

const DEFAULT_LITERATURE_SEARCH_CONFIG: MedicalLiteratureSearchConfig = {
    enabled: false,
    databases: {
        pubmed: true,
        medline: false,
        cochrane: false,
    },
    searchScope: 'abstracts',
    recency: '5y',
};

export const DEFAULT_EVALUATION_METRIC_CONFIG: EvaluationMetricConfig = {
    enabled: false,
    rougeScoreThreshold: 70,
    factualityScoreThreshold: 95,
    evaluationAction: 'flag',
};

const DEFAULT_NOTIFICATION_PREFERENCES: NotificationPreferences = {
    enabled: true,
    sound: true,
    push: true,
    email: false,
};

const DEFAULT_BEHAVIORAL_RULES: BehavioralRule[] = [
    {
      id: 'system-rule-1',
      condition: '25.11.20, 수술',
      matchType: 'all',
      responses: [
        "2025년 11월 20일 수술 기록에 대해서는 현재 EMR 정보 연계가 되어 있지 않습니다. 상세 내용은 담당 의료진에게 직접 상담해 주시기 바랍니다."
      ],
      escalation: 'none',
      tags: ['emr_restriction', 'refer_to_staff'],
      isDeletable: false,
    },
     {
      id: 'system-rule-2',
      condition: '종료, 그만, 수고, 끝',
      matchType: 'any',
      responses: [
        "상담을 종료합니다. 언제든지 도움이 필요하시면 말씀해주세요.",
        "네, 알겠습니다. 오늘도 평안한 하루 보내세요."
      ],
      escalation: 'none',
      tags: ['conversation_end'],
      isDeletable: false,
    }
];

export const INITIAL_KNOWLEDGE_SOURCES: KnowledgeSource[] = [
  {
    id: 'kb-1',
    name: '소아 급성 호흡곤란 증후군(PARDS) 프로토콜',
    type: KnowledgeSourceType.PROTOCOL,
    description: '서울아산병원 PICU의 PARDS 관리 프로토콜',
    url: 'https://www.amc.seoul.kr/asan/main.do',
    enabled: true,
    isDeletable: false,
  },
  {
    id: 'kb-2',
    name: '소아 만성 호흡부전 환자 가정간호 가이드라인',
    type: KnowledgeSourceType.GUIDELINE,
    description: '대한소아알레르기호흡기학회(KAPARD)',
    url: 'https://www.kapard.or.kr/',
    enabled: true,
    isDeletable: false,
  },
   {
    id: 'kb-3',
    name: '가정용 인공호흡기 소아 적용 권장사항',
    type: KnowledgeSourceType.RECOMMENDATION,
    description: '미국흉부학회(ATS) 소아 환자 대상 임상 권장사항',
    url: 'https://www.thoracic.org/',
    enabled: true,
    isDeletable: false,
  },
  {
    id: 'kb-4',
    name: '홍창의 소아과학: 호흡기 질환편',
    type: KnowledgeSourceType.TEXTBOOK,
    description: '소아 호흡기 질환의 진단, 치료 및 가정 간호에 대한 교과서',
    url: 'http://www.doctorbook.co.kr/shop/book/Info.asp?Gserial=9788994334032',
    enabled: true,
    isDeletable: false,
  },
  {
    id: 'kb-5',
    name: 'Nelson 소아과학: 호흡기계',
    type: KnowledgeSourceType.TEXTBOOK,
    description: '소아 호흡기 질환 및 관리에 대한 포괄적인 개요',
    url: 'https://www.elsevier.com/books/nelson-textbook-of-pediatrics/kliegman/978-0-323-52950-1',
    enabled: true,
    isDeletable: false,
  },
  // Surgery specific sources
  {
    id: 'kb-s1',
    name: 'ERAS(조기 회복 프로그램) 위절제술 가이드라인',
    type: KnowledgeSourceType.PROTOCOL,
    description: '수술 후 회복 향상을 위한 표준 임상 경로',
    enabled: true,
    isDeletable: true,
  },
  {
    id: 'kb-s2',
    name: '수술 후 통증 관리 지침 (APS)',
    type: KnowledgeSourceType.GUIDELINE,
    description: '급성 통증 관리 및 진통제 투여 프로토콜',
    enabled: true,
    isDeletable: true,
  },
  // Colorectal specific sources
  {
    id: 'kb-c1',
    name: '결장암 진료 권고안 v3.1',
    type: KnowledgeSourceType.GUIDELINE,
    description: '대한대장항문학회 표준 진료 지침',
    enabled: true,
    isDeletable: true,
  },
  {
    id: 'kb-c2',
    name: '장루 관리 및 합병증 예방 가이드',
    type: KnowledgeSourceType.RECOMMENDATION,
    description: '병원상처장루실금간호사회(KAWOC) 제공',
    enabled: true,
    isDeletable: true,
  }
];


export const AGENT_TYPE_DETAILS: Record<AgentType, {
  label: string;
  category: AgentCategory;
  icon: React.ComponentType<{ className?: string }>;
  defaultDescription: string;
  defaultConfig: AgentConfig;
}> = {
  [AgentType.MONITORING_VITAL_SIGNS]: {
    label: '실시간 생체 신호 모니터',
    category: AgentCategory.MONITORING,
    icon: ChartBarIcon,
    defaultDescription: 'SpO2, 심박수 등 주요 생체 신호를 실시간으로 모니터링하고 이상 징후 발생 시 알림을 보냅니다.',
    defaultConfig: {
      parameters: {
        spo2: true,
        heartRate: true,
        respRate: true,
        ventilatorPressure: false,
      },
      spo2Threshold: 92,
      alertSensitivity: 'medium',
      emrIntegration: DEFAULT_EMR_INTEGRATION_CONFIG,
      notificationPreferences: DEFAULT_NOTIFICATION_PREFERENCES,
    } as MonitoringConfig,
  },
  [AgentType.MONITORING_VENTILATOR]: {
    label: '가정용 인공호흡기 모니터',
    category: AgentCategory.MONITORING,
    icon: SignalIcon,
    defaultDescription: '가정용 인공호흡기의 주요 지표(일회호흡량, 기도압 등)를 모니터링하고, 소아 호흡부전 가이드라인에 기반하여 이상 징후 발생 시 알림을 보냅니다.',
    defaultConfig: {
      parameters: {
        tidalVolume: true,
        peakInspiratoryPressure: true,
        respiratoryRate: true,
        leakPercentage: true,
        peep: true,
        drivingPressure: true,
      },
      lowTidalVolumeThreshold: 4,
      highTidalVolumeThreshold: 8,
      pipThreshold: 35,
      minRespiratoryRateThreshold: 15,
      maxRespiratoryRateThreshold: 40,
      leakThreshold: 25,
      peepThreshold: 5,
      drivingPressureThreshold: 15,
      alertProfile: 'pediatric',
      knowledgeSourceIds: ['kb-1', 'kb-3'],
      emrIntegration: { ...DEFAULT_EMR_INTEGRATION_CONFIG, dataPoints: { vitals: true, ventilatorData: true }},
      literatureSearch: DEFAULT_LITERATURE_SEARCH_CONFIG,
      evaluation: DEFAULT_EVALUATION_METRIC_CONFIG,
      notificationPreferences: DEFAULT_NOTIFICATION_PREFERENCES,
    } as VentilatorConfig,
  },
  [AgentType.CONVERSATIONAL_CHATBOT]: {
    label: '홈케어 가이드 챗봇',
    category: AgentCategory.CONVERSATIONAL,
    icon: ChatBubbleLeftRightIcon,
    defaultDescription: '환자 상태와 의료 기록에 기반하여 보호자의 질문에 답변하고, 홈케어 절차를 안내합니다.',
    defaultConfig: {
      persona: 'empathetic',
      knowledgeSourceIds: ['kb-1', 'kb-2', 'kb-3', 'kb-4'],
      rules: DEFAULT_BEHAVIORAL_RULES,
      literatureSearch: DEFAULT_LITERATURE_SEARCH_CONFIG,
      evaluation: DEFAULT_EVALUATION_METRIC_CONFIG,
    } as ChatbotConfig,
  },
  [AgentType.REPORTING_SUMMARY]: {
    label: '일일 요약 보고서',
    category: AgentCategory.REPORTING,
    icon: DocumentTextIcon,
    defaultDescription: '환자의 상태, 주요 이벤트, 보호자 질문 등을 요약하여 매일 아침 보고서를 생성합니다.',
    defaultConfig: {
      frequency: 'daily',
      content: {
        vitalTrends: true,
        alertsLog: true,
        guardianSymptoms: true,
        medicationAdherence: false,
      },
      format: 'narrative',
      emrIntegration: DEFAULT_EMR_INTEGRATION_CONFIG,
      literatureSearch: DEFAULT_LITERATURE_SEARCH_CONFIG,
      evaluation: DEFAULT_EVALUATION_METRIC_CONFIG,
    } as ReportingConfig,
  },
};

// Pediatric Agents (Default)
export const INITIAL_AGENTS_PEDIATRICS: Agent<any>[] = [
  {
    id: 'agent-1',
    name: '소아 생체 신호 모니터',
    description: '민준이의 산소포화도, 심박수, 호흡수를 PARDS 프로토콜에 따라 모니터링합니다.',
    category: AgentCategory.MONITORING,
    type: AgentType.MONITORING_VITAL_SIGNS,
    icon: ChartBarIcon,
    config: {
      parameters: {
        spo2: true,
        heartRate: true,
        respRate: true,
        ventilatorPressure: false,
      },
      spo2Threshold: 92,
      alertSensitivity: 'high',
      emrIntegration: { ...DEFAULT_EMR_INTEGRATION_CONFIG, enabled: true, dataPoints: { vitals: true } },
      notificationPreferences: DEFAULT_NOTIFICATION_PREFERENCES,
    } as MonitoringConfig,
    enabled: true,
  },
  {
    id: 'agent-2',
    name: '인공호흡기 (PARDS) 모니터',
    description: '민준이의 가정용 인공호흡기 상태를 PARDS 가이드라인에 맞춰 모니터링합니다.',
    category: AgentCategory.MONITORING,
    type: AgentType.MONITORING_VENTILATOR,
    icon: SignalIcon,
    config: {
      parameters: {
        tidalVolume: true,
        peakInspiratoryPressure: true,
        respiratoryRate: true,
        leakPercentage: true,
        peep: true,
        drivingPressure: true,
      },
      lowTidalVolumeThreshold: 5,
      highTidalVolumeThreshold: 7,
      pipThreshold: 30,
      minRespiratoryRateThreshold: 18,
      maxRespiratoryRateThreshold: 35,
      leakThreshold: 25,
      peepThreshold: 8,
      drivingPressureThreshold: 14,
      alertProfile: 'pediatric',
      knowledgeSourceIds: ['kb-1', 'kb-3'],
      emrIntegration: { ...DEFAULT_EMR_INTEGRATION_CONFIG, enabled: true, dataPoints: { vitals: true, ventilatorData: true }},
      literatureSearch: { ...DEFAULT_LITERATURE_SEARCH_CONFIG, enabled: true },
      evaluation: { ...DEFAULT_EVALUATION_METRIC_CONFIG, enabled: true },
      notificationPreferences: DEFAULT_NOTIFICATION_PREFERENCES,
    } as VentilatorConfig,
    enabled: true,
  },
  {
    id: 'agent-3',
    name: '소아 호흡기 홈케어 챗봇',
    description: '민준이 보호자의 질문에 답변하고 PARDS 관리 절차를 안내합니다.',
    category: AgentCategory.CONVERSATIONAL,
    type: AgentType.CONVERSATIONAL_CHATBOT,
    icon: ChatBubbleLeftRightIcon,
    config: {
      persona: 'empathetic',
      knowledgeSourceIds: ['kb-1', 'kb-2', 'kb-3', 'kb-4'],
      rules: DEFAULT_BEHAVIORAL_RULES,
      literatureSearch: { ...DEFAULT_LITERATURE_SEARCH_CONFIG, enabled: true, recency: '1y' },
      evaluation: { ...DEFAULT_EVALUATION_METRIC_CONFIG, enabled: true, factualityScoreThreshold: 98, evaluationAction: 'alert' },
    } as ChatbotConfig,
    enabled: true,
  },
  {
    id: 'agent-4',
    name: '경과 요약 보고서',
    description: '의료진을 위해 민준이의 PARDS 경과를 요약하여 매일 아침 보고서를 생성합니다.',
    category: AgentCategory.REPORTING,
    type: AgentType.REPORTING_SUMMARY,
    icon: DocumentTextIcon,
    config: {
      frequency: 'daily',
      content: {
        vitalTrends: true,
        alertsLog: true,
        guardianSymptoms: true,
        medicationAdherence: true,
      },
      format: 'narrative',
      emrIntegration: { ...DEFAULT_EMR_INTEGRATION_CONFIG, enabled: true, dataPoints: { vitals: true, consultationNotes: true, medications: true } },
       literatureSearch: DEFAULT_LITERATURE_SEARCH_CONFIG,
       evaluation: { ...DEFAULT_EVALUATION_METRIC_CONFIG, enabled: true, rougeScoreThreshold: 80 },
    } as ReportingConfig,
    enabled: true,
  },
];

// Surgery Agents (PEP)
export const INITIAL_AGENTS_PEP: Agent<any>[] = [
    {
      id: 'agent-pep-1',
      name: '수술 후 바이탈 모니터',
      description: '수술 직후 회복기 환자의 활력 징후를 면밀히 모니터링하여 조기 경보를 제공합니다.',
      category: AgentCategory.MONITORING,
      type: AgentType.MONITORING_VITAL_SIGNS,
      icon: ChartBarIcon,
      config: {
        parameters: {
          spo2: true,
          heartRate: true,
          respRate: true,
          ventilatorPressure: false,
        },
        spo2Threshold: 94, // Slightly higher threshold for recovery
        alertSensitivity: 'high',
        emrIntegration: { ...DEFAULT_EMR_INTEGRATION_CONFIG, enabled: true, dataPoints: { vitals: true } },
        notificationPreferences: { ...DEFAULT_NOTIFICATION_PREFERENCES, push: true, sound: true },
      } as MonitoringConfig,
      enabled: true,
    },
    {
      id: 'agent-pep-2',
      name: '수술 후 회복(ERAS) 가이드',
      description: 'ERAS 프로토콜에 기반하여 통증 관리, 운동, 식이 진행 등에 대한 환자 및 보호자 질문에 답변합니다.',
      category: AgentCategory.CONVERSATIONAL,
      type: AgentType.CONVERSATIONAL_CHATBOT,
      icon: ChatBubbleLeftRightIcon,
      config: {
        persona: 'clinical', // More clinical/professional tone
        knowledgeSourceIds: ['kb-s1', 'kb-s2'],
        rules: DEFAULT_BEHAVIORAL_RULES,
        literatureSearch: { ...DEFAULT_LITERATURE_SEARCH_CONFIG, enabled: true, recency: '5y' },
        evaluation: { ...DEFAULT_EVALUATION_METRIC_CONFIG, enabled: true },
      } as ChatbotConfig,
      enabled: true,
    },
    {
      id: 'agent-pep-3',
      name: '회진 브리핑 리포트',
      description: '의료진 회진 전, 지난 24시간 동안의 활력 징후 변동, 통증 점수, 특이 사항을 요약합니다.',
      category: AgentCategory.REPORTING,
      type: AgentType.REPORTING_SUMMARY,
      icon: DocumentTextIcon,
      config: {
        frequency: 'daily',
        content: {
          vitalTrends: true,
          alertsLog: true,
          guardianSymptoms: true, // Used for pain score reporting
          medicationAdherence: true,
        },
        format: 'table', // Table format is preferred for quick rounds review
        emrIntegration: { ...DEFAULT_EMR_INTEGRATION_CONFIG, enabled: true, dataPoints: { vitals: true, medications: true } },
         literatureSearch: DEFAULT_LITERATURE_SEARCH_CONFIG,
         evaluation: { ...DEFAULT_EVALUATION_METRIC_CONFIG, enabled: true },
      } as ReportingConfig,
      enabled: true,
    },
  ];

// Colorectal Agents
export const INITIAL_AGENTS_COLORECTAL: Agent<any>[] = [
  {
    id: 'agent-crc-1',
    name: 'AI 재발 예측 분석',
    description: '병리학적 소견과 유전자 변이 데이터를 지속적으로 분석하여 수술 후 재발 확률을 예측하고 모니터링합니다.',
    category: AgentCategory.REPORTING, // Using Reporting category as it outputs analysis
    type: AgentType.REPORTING_SUMMARY,
    icon: PresentationChartLineIcon,
    config: {
      frequency: 'on_demand',
      content: {
        vitalTrends: false,
        alertsLog: true,
        guardianSymptoms: true,
        medicationAdherence: true,
      },
      format: 'table',
      emrIntegration: { ...DEFAULT_EMR_INTEGRATION_CONFIG, enabled: true, dataPoints: { labResults: true, consultationNotes: true } },
      literatureSearch: { ...DEFAULT_LITERATURE_SEARCH_CONFIG, enabled: true, recency: '1y', searchScope: 'full_text' },
      evaluation: { ...DEFAULT_EVALUATION_METRIC_CONFIG, enabled: true },
    } as ReportingConfig,
    enabled: true,
  },
  {
    id: 'agent-crc-2',
    name: '장루 케어 가이드 챗봇',
    description: '장루(Stoma) 관리법, 식이요법, 일상생활 적응에 대한 맞춤형 가이드를 제공합니다.',
    category: AgentCategory.CONVERSATIONAL,
    type: AgentType.CONVERSATIONAL_CHATBOT,
    icon: ChatBubbleLeftRightIcon,
    config: {
      persona: 'empathetic',
      knowledgeSourceIds: ['kb-c1', 'kb-c2'],
      rules: DEFAULT_BEHAVIORAL_RULES,
      literatureSearch: DEFAULT_LITERATURE_SEARCH_CONFIG,
      evaluation: DEFAULT_EVALUATION_METRIC_CONFIG,
    } as ChatbotConfig,
    enabled: true,
  },
  {
    id: 'agent-crc-3',
    name: '수술 후 바이탈 모니터',
    description: '수술 후 회복기 환자의 활력 징후 및 장 기능 회복 여부를 모니터링합니다.',
    category: AgentCategory.MONITORING,
    type: AgentType.MONITORING_VITAL_SIGNS,
    icon: ChartBarIcon,
    config: {
      parameters: {
        spo2: true,
        heartRate: true,
        respRate: true,
        ventilatorPressure: false,
      },
      spo2Threshold: 92,
      alertSensitivity: 'medium',
      emrIntegration: { ...DEFAULT_EMR_INTEGRATION_CONFIG, enabled: true, dataPoints: { vitals: true } },
      notificationPreferences: { ...DEFAULT_NOTIFICATION_PREFERENCES, push: true },
    } as MonitoringConfig,
    enabled: true,
  },
];

// Maintain backward compatibility variable if needed, or simply alias
export const INITIAL_AGENTS = INITIAL_AGENTS_PEDIATRICS;

// Generate dummy patients to simulate a hospital environment with many patients
const GENERATED_PATIENTS: Patient[] = Array.from({ length: 100 }).map((_, index) => {
  const departments: Department[] = ['PEDIATRICS', 'SURGERY', 'COLORECTAL'];
  const dept = departments[index % 3];
  const gender = index % 2 === 0 ? '남' : '여';
  const age = dept === 'PEDIATRICS' ? Math.floor(Math.random() * 18) : Math.floor(Math.random() * 60) + 20;
  
  let diagnosis = '';
  let status = '';
  let complicationRisk: ComplicationRisk | undefined = undefined;
  let recurrenceRisk: ComplicationRisk | undefined = undefined;

  const names = ['김', '이', '박', '최', '정', '강', '조', '윤', '장', '임', '한', '오', '서', '신', '권', '황', '안', '송', '전', '홍'];
  const givenNames = ['민준', '서윤', '서준', '지우', '도윤', '하은', '건우', '도현', '민서', '지민', '선우', '서연', '연우', '채원', '현우', '지아', '지호', '수아', '준우', '은우'];
  const name = `${names[Math.floor(Math.random() * names.length)]}${givenNames[Math.floor(Math.random() * givenNames.length)]}`;

  if (dept === 'PEDIATRICS') {
    const diagnoses = ['천식 (Asthma)', '폐렴 (Pneumonia)', '기관지염', '크룹', 'RSV 감염', '소아 PARDS', '기관지폐이형성증'];
    diagnosis = diagnoses[index % diagnoses.length];
    status = '안정적 상태 유지 중';
  } else if (dept === 'SURGERY') {
    const diagnoses = ['위암 (Stomach Cancer)', '담석증', '서혜부 탈장', '급성 충수돌기염', '간세포암'];
    diagnosis = diagnoses[index % diagnoses.length];
    status = '수술 후 회복실 대기';
    
    const score = Math.floor(Math.random() * 100);
    let level: 'Low' | 'Moderate' | 'High' | 'Critical' = 'Low';
    let label = '안전';
    
    if (score > 80) { level = 'Critical'; label = '위험'; }
    else if (score > 60) { level = 'High'; label = '경고'; }
    else if (score > 30) { level = 'Moderate'; label = '주의'; }

    complicationRisk = {
        score,
        level,
        label,
        trend: Math.random() > 0.5 ? 'stable' : (Math.random() > 0.5 ? 'increasing' : 'decreasing')
    };
  } else {
    const diagnoses = ['대장암 (Colon Cancer)', '직장암 (Rectal Cancer)', '항문암', '크론병', '궤양성 대장염'];
    diagnosis = diagnoses[index % diagnoses.length];
    status = '항암 치료 사이클 진행 중';

    const score = Math.floor(Math.random() * 100);
    let level: 'Low' | 'Moderate' | 'High' | 'Critical' = 'Low';
    let label = '안전';
    
    if (score > 80) { level = 'High'; label = '고위험'; }
    else if (score > 40) { level = 'Moderate'; label = '관찰'; }

    recurrenceRisk = {
        score,
        level,
        label,
        trend: Math.random() > 0.5 ? 'stable' : (Math.random() > 0.5 ? 'increasing' : 'decreasing')
    };
  }

  return {
    id: `gen-${1000 + index}`,
    name,
    age,
    gender,
    department: dept,
    diagnosis,
    status,
    complicationRisk,
    recurrenceRisk
  };
});

export const MOCK_PATIENTS: Patient[] = [
    {
      id: '7891011',
      name: '김민준',
      age: 5,
      gender: '남',
      department: 'PEDIATRICS',
      diagnosis: '소아 급성 호흡곤란 증후군(PARDS)',
      status: '가정용 인공호흡기(Trilogy Evo) 치료 중. SpO2 안정적.',
    },
    {
      id: '7891012',
      name: '이서윤',
      age: 3,
      gender: '여',
      department: 'PEDIATRICS',
      diagnosis: '만성 폐질환 (CLD)',
      status: '산소 요법 2L/min 적용 중. 최근 기침 빈도 증가.',
    },
    {
        id: '7891013',
        name: '박준우',
        age: 7,
        gender: '남',
        department: 'PEDIATRICS',
        diagnosis: '척수성 근위축증 (SMA)',
        status: '야간 기계환기 보조 필요. 호흡근 약화 관찰됨.',
    },
    {
      id: '1029384',
      name: '박성훈',
      age: 54,
      gender: '남',
      department: 'SURGERY',
      diagnosis: '위암 (Stomach Cancer)',
      status: '위아전절제술(Subtotal Gastrectomy) 후 3일차(POD 3). ERAS 적용 중.',
      complicationRisk: {
        score: 18,
        level: 'Moderate',
        label: '주의',
        trend: 'stable'
      }
    },
    {
      id: '1029385',
      name: '최영희',
      age: 62,
      gender: '여',
      department: 'SURGERY',
      diagnosis: '대장암 (Colon Cancer)',
      status: '복강경 저위전방절제술 후 1일차. 통증 조절 중.',
      complicationRisk: {
        score: 45,
        level: 'High',
        label: '위험',
        trend: 'increasing'
      }
    },
    {
        id: '1029386',
        name: '정민수',
        age: 45,
        gender: '남',
        department: 'SURGERY',
        diagnosis: '급성 충수돌기염',
        status: '충수절제술 후 회복 중. 퇴원 예정.',
        complicationRisk: {
          score: 5,
          level: 'Low',
          label: '안전',
          trend: 'decreasing'
        }
    },
    // Colorectal Patients
    {
      id: 'col-1',
      name: '김철수',
      age: 68,
      gender: '남',
      department: 'COLORECTAL',
      diagnosis: '직장암 (Rectal Cancer, Stage III)',
      status: '수술 후 보조 항암화학요법 진행 중. 장루 관리 양호.',
      recurrenceRisk: {
        score: 32,
        level: 'Moderate',
        label: '관찰 필요',
        trend: 'stable'
      }
    },
    {
      id: 'col-2',
      name: '이영자',
      age: 55,
      gender: '여',
      department: 'COLORECTAL',
      diagnosis: '상행 결장암 (Ascending Colon Cancer)',
      status: '우반결장절제술 후 6개월 경과. 정기 추적 관찰 중.',
      recurrenceRisk: {
        score: 12,
        level: 'Low',
        label: '안전',
        trend: 'decreasing'
      }
    },
     {
      id: 'col-3',
      name: '박상철',
      age: 72,
      gender: '남',
      department: 'COLORECTAL',
      diagnosis: 'S상 결장암 및 간 전이',
      status: '동시 절제술 시행 후 회복 중. 고위험군 관리 필요.',
      recurrenceRisk: {
        score: 78,
        level: 'High',
        label: '고위험',
        trend: 'increasing'
      }
    },
    ...GENERATED_PATIENTS
  ];
