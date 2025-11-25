import React from 'react';
import { Agent, ReportingConfig, EMRDataPoints, MedicalLiteratureSearchConfig, EvaluationMetricConfig } from '../../types';
import Card from '../common/Card';
import Select from '../common/Select';
import ToggleSwitch from '../common/ToggleSwitch';
import LiteratureSearchConfigCard from '../common/LiteratureSearchConfigCard';
import EvaluationMetricCard from '../common/EvaluationMetricCard';

interface ReportingAgentConfigPanelProps {
  agent: Agent<ReportingConfig>;
  onConfigChange: (agentId: string, newConfig: ReportingConfig) => void;
}

const CONTENT_LABELS: Record<keyof ReportingConfig['content'], string> = {
    vitalTrends: '생체 신호 동향',
    alertsLog: '알림 기록',
    guardianSymptoms: '보호자 보고 증상',
    medicationAdherence: '투약 순응도'
};

const EMR_DATA_POINT_LABELS: Record<keyof EMRDataPoints, string> = {
    vitals: '실시간 생체 신호',
    ventilatorData: '인공호흡기 데이터',
    labResults: '최신 검사 결과',
    medications: '투약 기록',
    allergies: '알레르기 정보',
    consultationNotes: '진료 기록 노트',
};

const AVAILABLE_EMR_DATA_POINTS: (keyof EMRDataPoints)[] = ['vitals', 'labResults', 'medications', 'allergies', 'consultationNotes'];

const ReportingAgentConfigPanel: React.FC<ReportingAgentConfigPanelProps> = ({ agent, onConfigChange }) => {
  const { config } = agent;

  const handleFrequencyChange = (value: 'daily' | 'twice_daily' | 'on_demand') => {
    onConfigChange(agent.id, { ...config, frequency: value });
  };
  
  const handleFormatChange = (value: 'bullet' | 'narrative' | 'table') => {
    onConfigChange(agent.id, { ...config, format: value });
  };
  
  const handleContentChange = (contentKey: keyof ReportingConfig['content']) => {
    onConfigChange(agent.id, {
      ...config,
      content: {
        ...config.content,
        [contentKey]: !config.content[contentKey],
      },
    });
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

  const handleLiteratureSearchChange = (literatureSearchConfig: MedicalLiteratureSearchConfig) => {
    onConfigChange(agent.id, { ...config, literatureSearch: literatureSearchConfig });
  };

  const handleEvaluationChange = (evaluationConfig: EvaluationMetricConfig) => {
    onConfigChange(agent.id, { ...config, evaluation: evaluationConfig });
  };

  return (
    <div className="space-y-6">
      <Card title="보고서 생성" description="자동 요약 보고서의 생성 주기와 형식을 설정하세요.">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <Select
            label="보고서 생성 주기"
            value={config.frequency}
            onChange={handleFrequencyChange}
            options={[
              { value: 'daily', label: '매일' },
              { value: 'twice_daily', label: '하루에 두 번' },
              { value: 'on_demand', label: '요청 시에만' },
            ]}
          />
          <Select
            label="보고서 형식"
            value={config.format}
            onChange={handleFormatChange}
            options={[
              { value: 'bullet', label: '글머리 기호 목록' },
              { value: 'narrative', label: '서술형 요약' },
              { value: 'table', label: '표 데이터' },
            ]}
          />
        </div>
      </Card>

      <Card title="보고서 내용" description="생성된 보고서에 포함할 섹션을 선택하세요.">
        <div className="grid grid-cols-2 gap-4 mt-4">
          {Object.entries(config.content).map(([key, value]) => (
            <div key={key} className="flex items-center">
              <input
                id={key}
                name={key}
                type="checkbox"
                checked={value}
                onChange={() => handleContentChange(key as keyof ReportingConfig['content'])}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor={key} className="ml-3 block text-sm font-medium text-gray-700 capitalize">
                {CONTENT_LABELS[key as keyof ReportingConfig['content']]}
              </label>
            </div>
          ))}
        </div>
      </Card>

       <Card title="EMR 실시간 데이터 연동" description="보고서 생성 시 EMR 시스템의 최신 환자 데이터를 안전하게 참조하도록 허용합니다.">
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
                                    id={`emr-report-${point}`}
                                    type="checkbox"
                                    checked={!!config.emrIntegration.dataPoints?.[point]}
                                    onChange={() => handleEmrDataPointChange(point)}
                                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <label htmlFor={`emr-report-${point}`} className="ml-3 block text-sm font-medium text-gray-700">
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
    </div>
  );
};

export default ReportingAgentConfigPanel;