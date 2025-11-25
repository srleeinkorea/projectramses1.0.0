
import React, { useState, useEffect } from 'react';
import { Agent, VentilatorConfig, EMRDataPoints, KnowledgeSource, KnowledgeSourceType, MedicalLiteratureSearchConfig, EvaluationMetricConfig, NotificationPreferences } from '../../types';
import Card from '../common/Card';
import Select from '../common/Select';
import ToggleSwitch from '../common/ToggleSwitch';
import LiteratureSearchConfigCard from '../common/LiteratureSearchConfigCard';
import EvaluationMetricCard from '../common/EvaluationMetricCard';
import NotificationConfigCard from '../common/NotificationConfigCard';
import { AGENT_TYPE_DETAILS } from '../../constants';
import Modal from '../common/Modal';


interface PatientTemplate {
  id: string;
  name: string;
  config: VentilatorConfig;
}

interface VentilatorAgentConfigPanelProps {
  agent: Agent<VentilatorConfig>;
  onConfigChange: (agentId: string, newConfig: VentilatorConfig) => void;
  allKnowledgeSources: KnowledgeSource[];
}

const PARAMETER_LABELS: Record<keyof VentilatorConfig['parameters'], string> = {
  tidalVolume: '일회호흡량 (Tidal Volume)',
  peakInspiratoryPressure: '최대 흡기 압력 (PIP)',
  respiratoryRate: '호흡수 (RR)',
  leakPercentage: '누출률 (%)',
  peep: '호기말 양압 (PEEP)',
  drivingPressure: '구동압 (Driving Pressure)',
  fio2: '흡입 산소 농도 (FiO2)',
  minuteVolume: '분당 환기량 (Minute Volume)',
  ieRatio: 'I:E 비율 (I:E Ratio)'
};

const EMR_DATA_POINT_LABELS: Record<keyof EMRDataPoints, string> = {
    vitals: '실시간 생체 신호',
    ventilatorData: '인공호흡기 데이터',
    labResults: '최신 검사 결과',
    medications: '투약 기록',
    allergies: '알레르기 정보',
    consultationNotes: '진료 기록 노트',
};

const TYPE_COLORS: Record<string, string> = {
    [KnowledgeSourceType.PROTOCOL]: 'bg-blue-100 text-blue-800',
    [KnowledgeSourceType.GUIDELINE]: 'bg-green-100 text-green-800',
    [KnowledgeSourceType.RECOMMENDATION]: 'bg-yellow-100 text-yellow-800',
    [KnowledgeSourceType.TEXTBOOK]: 'bg-indigo-100 text-indigo-800',
    [KnowledgeSourceType.PRO]: 'bg-purple-100 text-purple-800',
    [KnowledgeSourceType.CUSTOM]: 'bg-gray-200 text-gray-800',
};


const AVAILABLE_EMR_DATA_POINTS: (keyof EMRDataPoints)[] = ['vitals', 'ventilatorData', 'labResults', 'medications'];

const PEDIATRIC_PRESETS = {
  infant: {
    label: '영아 (3-10kg, 초기 PARDS)',
    config: { lowTidalVolumeThreshold: 4, highTidalVolumeThreshold: 7, pipThreshold: 28, minRespiratoryRateThreshold: 25, maxRespiratoryRateThreshold: 50, peepThreshold: 5, drivingPressureThreshold: 14 },
  },
  toddler: {
    label: '유아 (10-20kg, 안정기 PARDS)',
    config: { lowTidalVolumeThreshold: 5, highTidalVolumeThreshold: 8, pipThreshold: 30, minRespiratoryRateThreshold: 20, maxRespiratoryRateThreshold: 40, peepThreshold: 5, drivingPressureThreshold: 15 },
  },
  child: {
    label: '어린이 (20-40kg, 회복기 PARDS)',
    config: { lowTidalVolumeThreshold: 6, highTidalVolumeThreshold: 8, pipThreshold: 32, minRespiratoryRateThreshold: 15, maxRespiratoryRateThreshold: 35, peepThreshold: 5, drivingPressureThreshold: 15 },
  },
};

const VentilatorAgentConfigPanel: React.FC<VentilatorAgentConfigPanelProps> = ({ agent, onConfigChange, allKnowledgeSources }) => {
  const { config } = agent;
  const [patientTemplates, setPatientTemplates] = useState<PatientTemplate[]>([]);
  const [isPatientSaveModalOpen, setIsPatientSaveModalOpen] = useState(false);
  const [patientTemplateName, setPatientTemplateName] = useState('');
  
  const PATIENT_TEMPLATES_STORAGE_KEY = `patient_templates_${agent.id}`;

  useEffect(() => {
    try {
      const stored = localStorage.getItem(PATIENT_TEMPLATES_STORAGE_KEY);
      if (stored) {
        setPatientTemplates(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Failed to load patient templates from localStorage", error);
    }
  }, [PATIENT_TEMPLATES_STORAGE_KEY]);

  const savePatientTemplatesToStorage = (templates: PatientTemplate[]) => {
    try {
      localStorage.setItem(PATIENT_TEMPLATES_STORAGE_KEY, JSON.stringify(templates));
    } catch (error) {
      console.error("Failed to save patient templates to localStorage", error);
    }
  };

  const handleSavePatientTemplate = () => {
    if (patientTemplateName.trim()) {
      const newTemplate: PatientTemplate = {
        id: `patient-template-${Date.now()}`,
        name: patientTemplateName.trim(),
        config: agent.config,
      };
      const updatedTemplates = [...patientTemplates, newTemplate];
      setPatientTemplates(updatedTemplates);
      savePatientTemplatesToStorage(updatedTemplates);
      setPatientTemplateName('');
      setIsPatientSaveModalOpen(false);
    }
  };

  const handleLoadPatientTemplate = (templateConfig: VentilatorConfig) => {
    onConfigChange(agent.id, templateConfig);
  };

  const handleDeletePatientTemplate = (templateId: string) => {
    const updatedTemplates = patientTemplates.filter(t => t.id !== templateId);
    setPatientTemplates(updatedTemplates);
    savePatientTemplatesToStorage(updatedTemplates);
  };


  const handleParamChange = (param: keyof VentilatorConfig['parameters']) => {
    const newConfig = {
      ...config,
      parameters: {
        ...config.parameters,
        [param]: !config.parameters[param],
      },
    };
    onConfigChange(agent.id, newConfig);
  };

  const handleConfigValueChange = (field: keyof VentilatorConfig, value: string | number) => {
    const newConfig = { ...config, [field]: value };
    onConfigChange(agent.id, newConfig);
  };

  const handleEmrIntegrationChange = (field: 'enabled' | 'dataPoints', value: any) => {
    const newConfig = {
        ...config,
        emrIntegration: {
            ...config.emrIntegration,
            [field]: value,
        }
    };
    onConfigChange(agent.id, newConfig);
  };
  
  const handleEmrDataPointChange = (point: keyof EMRDataPoints) => {
    const currentPoints = config.emrIntegration.dataPoints || {};
    handleEmrIntegrationChange('dataPoints', {
        ...currentPoints,
        [point]: !currentPoints[point],
    });
  };

  const handleToggleSourceReference = (sourceId: string) => {
    const currentIds = config.knowledgeSourceIds || [];
    const newIds = currentIds.includes(sourceId)
        ? currentIds.filter(id => id !== sourceId)
        : [...currentIds, sourceId];
    onConfigChange(agent.id, { ...config, knowledgeSourceIds: newIds });
  };

  const handleLiteratureSearchChange = (literatureSearchConfig: MedicalLiteratureSearchConfig) => {
    onConfigChange(agent.id, { ...config, literatureSearch: literatureSearchConfig });
  };

  const handleEvaluationChange = (evaluationConfig: EvaluationMetricConfig) => {
    onConfigChange(agent.id, { ...config, evaluation: evaluationConfig });
  };

  const handleNotificationPreferencesChange = (newPreferences: NotificationPreferences) => {
    onConfigChange(agent.id, { ...config, notificationPreferences: newPreferences });
  };

  const applyPreset = (presetKey: keyof typeof PEDIATRIC_PRESETS) => {
    const presetConfig = PEDIATRIC_PRESETS[presetKey].config;
    const newConfig: VentilatorConfig = {
      ...config,
      ...presetConfig
    };
    onConfigChange(agent.id, newConfig);
  };

  const defaultConfig = AGENT_TYPE_DETAILS[agent.type].defaultConfig as VentilatorConfig;
  const defaultSourceIds = defaultConfig.knowledgeSourceIds;

  return (
    <div className="space-y-6">
      <Card title="모니터링 항목" description="이 에이전트가 능동적으로 모니터링할 인공호흡기 지표를 선택하세요.">
        <div className="grid grid-cols-2 gap-4 mt-4">
          {Object.entries(config.parameters).map(([key, value]) => (
            <div key={key} className="flex items-center">
              <input
                id={key}
                name={key}
                type="checkbox"
                checked={value}
                onChange={() => handleParamChange(key as keyof VentilatorConfig['parameters'])}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor={key} className="ml-3 block text-sm font-medium text-gray-700 capitalize">
                {PARAMETER_LABELS[key as keyof VentilatorConfig['parameters']]}
              </label>
            </div>
          ))}
        </div>
      </Card>

      <Card title="알림 규칙" description="알림을 트리거할 임계값을 정의하세요. 폐보호 환기 전략(Lung Protective Strategy)에 기반한 소아과 사전 설정을 사용하여 임상적으로 적절한 값으로 빠르게 설정할 수 있습니다.">
        <div className="flex items-center space-x-2 mt-4 mb-6">
          <span className="text-sm font-medium text-gray-700">사전 설정 적용:</span>
          {Object.entries(PEDIATRIC_PRESETS).map(([key, preset]) => (
            <button
              key={key}
              onClick={() => applyPreset(key as keyof typeof PEDIATRIC_PRESETS)}
              className="px-3 py-1 text-xs font-semibold text-blue-700 bg-blue-100 rounded-full hover:bg-blue-200"
            >
              {preset.label}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
            <div className="md:col-span-2 grid grid-cols-2 gap-x-6">
                 <div>
                    <label className="block text-sm font-medium text-gray-700">최소 일회호흡량 (mL/kg)</label>
                    <input type="number" value={config.lowTidalVolumeThreshold} onChange={e => handleConfigValueChange('lowTidalVolumeThreshold', parseInt(e.target.value, 10) || 0)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">최대 일회호흡량 (mL/kg)</label>
                    <input type="number" value={config.highTidalVolumeThreshold} onChange={e => handleConfigValueChange('highTidalVolumeThreshold', parseInt(e.target.value, 10) || 0)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
                </div>
            </div>
            <div className="md:col-span-2 grid grid-cols-2 gap-x-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700">최소 호흡수 (breaths/min)</label>
                    <input type="number" value={config.minRespiratoryRateThreshold} onChange={e => handleConfigValueChange('minRespiratoryRateThreshold', parseInt(e.target.value, 10) || 0)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">최대 호흡수 (breaths/min)</label>
                    <input type="number" value={config.maxRespiratoryRateThreshold} onChange={e => handleConfigValueChange('maxRespiratoryRateThreshold', parseInt(e.target.value, 10) || 0)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
                </div>
            </div>
             <div>
                <label className="block text-sm font-medium text-gray-700">최대 흡기 압력 (cmH2O)</label>
                <input type="number" value={config.pipThreshold} onChange={e => handleConfigValueChange('pipThreshold', parseInt(e.target.value, 10) || 0)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">최대 구동압 (cmH2O)</label>
                <input type="number" value={config.drivingPressureThreshold} onChange={e => handleConfigValueChange('drivingPressureThreshold', parseInt(e.target.value, 10) || 0)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
            </div>
             <div>
                <label className="block text-sm font-medium text-gray-700">최소 PEEP (cmH2O)</label>
                <input type="number" value={config.peepThreshold} onChange={e => handleConfigValueChange('peepThreshold', parseInt(e.target.value, 10) || 0)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">누출률 (%)</label>
                <input type="number" value={config.leakThreshold} onChange={e => handleConfigValueChange('leakThreshold', parseInt(e.target.value, 10) || 0)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
            </div>
             <div className="md:col-span-2">
                <Select
                    label="알림 프로필"
                    value={config.alertProfile}
                    onChange={(value) => handleConfigValueChange('alertProfile', value)}
                    options={[
                    { value: 'standard', label: '표준' },
                    { value: 'pediatric', label: '소아과 민감' },
                    { value: 'sensitive', label: '최고 민감' },
                    ]}
                    description="알림 빈도와 심각도를 조정합니다. '소아과 민감'은 미세한 변화에 더 빠르게 반응하도록 최적화되어 있습니다."
                />
            </div>
        </div>
      </Card>
      
      <NotificationConfigCard
        preferences={config.notificationPreferences}
        onPreferencesChange={handleNotificationPreferencesChange}
      />
      
      <Card title="환자 맞춤형 설정 템플릿" description="현재 알림 규칙 설정을 환자별 템플릿으로 저장하고 불러올 수 있습니다.">
        <div className="mt-4 space-y-3">
          {patientTemplates.length > 0 ? (
            patientTemplates.map(template => (
              <div key={template.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border">
                <span className="text-gray-800 font-medium">{template.name}</span>
                <div className="space-x-2">
                  <button
                    onClick={() => handleDeletePatientTemplate(template.id)}
                    className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-100 transition-colors"
                    aria-label={`Delete ${template.name}`}
                  >
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                       <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                     </svg>
                  </button>
                  <button
                    onClick={() => handleLoadPatientTemplate(template.config)}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-3 rounded-md text-sm"
                  >
                    불러오기
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-sm text-gray-500 py-2">저장된 환자 맞춤형 템플릿이 없습니다.</p>
          )}
          <div className="pt-2">
            <button 
              onClick={() => setIsPatientSaveModalOpen(true)}
              className="w-full text-sm font-semibold text-blue-600 hover:text-blue-800 text-left"
            >
              + 현재 설정을 템플릿으로 저장
            </button>
          </div>
        </div>
      </Card>
      
      <Card title="참조 Knowledge DB" description="에이전트가 알림을 분석하고 권장사항을 생성할 때 참조할 치료 프로토콜 및 임상 가이드라인과 같은 지식 소스를 선택하세요.">
         <div className="space-y-2 mt-4">
            {allKnowledgeSources.map(source => {
                const isSelected = config.knowledgeSourceIds.includes(source.id);
                const isEnabledInKB = source.enabled;
                const typeColor = TYPE_COLORS[source.type as KnowledgeSourceType] || TYPE_COLORS[KnowledgeSourceType.CUSTOM];
                const isDefault = defaultSourceIds.includes(source.id);

                return (
                    <div key={source.id} className={`flex items-center justify-between p-3 rounded-lg border ${!isEnabledInKB ? 'bg-gray-100 opacity-60' : 'bg-gray-50'}`}>
                        <div className="flex items-start flex-1 pr-4">
                            <input
                                id={`ks-ref-vent-${source.id}`}
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => handleToggleSourceReference(source.id)}
                                disabled={!isEnabledInKB}
                                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 mt-1"
                            />
                            <div className="ml-3">
                                <div className="flex items-center space-x-2">
                                  <label htmlFor={`ks-ref-vent-${source.id}`} className={`text-sm font-medium ${!isEnabledInKB ? 'text-gray-500' : 'text-gray-800'}`}>{source.name}</label>
                                  {isDefault && <span className="px-2 py-0.5 text-xs font-semibold text-green-800 bg-green-100 rounded-full">기본</span>}
                                </div>
                                <div className="flex items-center gap-x-2 mt-1">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${typeColor}`}>
                                        {source.type}
                                    </span>
                                    {source.description && <p className="text-xs text-gray-500 hidden sm:block">{source.description}</p>}
                                </div>
                                {!isEnabledInKB && <p className="text-xs text-red-500 mt-1">이 소스는 전체 Knowledge DB에서 비활성화되어 있습니다.</p>}
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
      </Card>
      
      <Card title="EMR 실시간 데이터 연동" description="에이전트가 EMR 시스템의 최신 환자 데이터에 안전하게 접근하도록 허용합니다.">
        <div className="space-y-4 mt-4">
            <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">EMR 연동 활성화</label>
                <ToggleSwitch enabled={config.emrIntegration.enabled} setEnabled={(e) => handleEmrIntegrationChange('enabled', e)} />
            </div>

            {config.emrIntegration.enabled && (
                <div>
                    <h4 className="text-sm font-medium text-gray-700">접근 가능 데이터</h4>
                    <div className="grid grid-cols-2 gap-4 mt-2">
                        {AVAILABLE_EMR_DATA_POINTS.map(point => (
                             <div key={point} className="flex items-center">
                                <input
                                    id={`emr-vent-${point}`}
                                    type="checkbox"
                                    checked={!!config.emrIntegration.dataPoints?.[point]}
                                    onChange={() => handleEmrDataPointChange(point)}
                                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <label htmlFor={`emr-vent-${point}`} className="ml-3 block text-sm font-medium text-gray-700">
                                    {EMR_DATA_POINT_LABELS[point]}
                                </label>
                            </div>
                        ))}
                    </div>
                </div>
            )}
             <div className="mt-4 flex items-start p-3 bg-gray-50 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400 flex-shrink-0 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <p className="text-xs text-gray-600">
                    <strong>보안 및 규정 준수:</strong> 모든 데이터는 HIPAA 규정을 준수하여 암호화된 채널을 통해 안전하게 전송됩니다.
                </p>
            </div>
        </div>
      </Card>

      <LiteratureSearchConfigCard 
        config={config.literatureSearch}
        onConfigChange={handleLiteratureSearchChange}
      />
      
      <EvaluationMetricCard
        config={config.evaluation}
        onConfigChange={handleEvaluationChange}
      />
      
      {/* Save Patient Template Modal */}
      <Modal isOpen={isPatientSaveModalOpen} onClose={() => setIsPatientSaveModalOpen(false)} title="환자 맞춤형 템플릿 저장">
        <div className="space-y-4">
          <p className="text-sm text-gray-600">현재 알림 규칙 설정을 이 환자를 위한 템플릿으로 저장합니다.</p>
          <div>
            <label htmlFor="patientTemplateName" className="block text-sm font-medium text-gray-700">
              템플릿 이름
            </label>
            <input
              type="text"
              id="patientTemplateName"
              value={patientTemplateName}
              onChange={(e) => setPatientTemplateName(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="예: PARDS 급성기 설정"
            />
          </div>
          <div className="flex justify-end space-x-2 pt-2">
            <button
              onClick={() => setIsPatientSaveModalOpen(false)}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg"
            >
              취소
            </button>
            <button
              onClick={handleSavePatientTemplate}
              disabled={!patientTemplateName.trim()}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              저장
            </button>
          </div>
        </div>
      </Modal>

    </div>
  );
};

export default VentilatorAgentConfigPanel;
