
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
    vitalTrends: '생체 신호 및 바이오마커 추이',
    alertsLog: '이상 징후 알림 이력',
    guardianSymptoms: 'PRO (환자 보고 결과) 및 증상',
    medicationAdherence: '복약 순응도 및 부작용'
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
    <div className="space-y-4">
      <Card title="보고서 생성" description="자동 요약 보고서의 생성 주기와 형식을 설정하세요.">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <Select
            label="보고서 생성 주기"
            value={config.frequency}
            onChange={handleFrequencyChange}
            options={[
              { value: 'daily', label: '매일 (회진 전 07:00)' },
              { value: 'twice_daily', label: '하루에 두 번 (07:00, 19:00)' },
              { value: 'on_demand', label: '요청 시에만' },
            ]}
          />
          <Select
            label="보고서 형식"
            value={config.format}
            onChange={handleFormatChange}
            options={[
              { value: 'bullet', label: '글머리 기호 목록 (빠른 검토)' },
              { value: 'narrative', label: '서술형 요약 (상세)' },
              { value: 'table', label: '테이블 데이터 (수치 중심)' },
            ]}
          />
        </div>
      </Card>

      <Card title="보고서 내용 및 PRO 구성" description="생성된 보고서에 포함할 임상 지표 및 환자 보고 결과를 선택하세요.">
        <div className="grid grid-cols-1 gap-3 mt-4">
          {Object.entries(config.content).map(([key, value]) => (
            <div key={key} className="flex items-center p-2.5 bg-gray-50 rounded-lg border border-gray-100">
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
        
        {/* Professional PRO Standards Display */}
        {config.content.guardianSymptoms && (
            <div className="mt-4 p-4 bg-blue-50/50 border border-blue-100 rounded-lg">
                <h4 className="text-xs font-bold text-blue-800 mb-2 flex items-center">
                    <svg className="w-3.5 h-3.5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    현재 적용된 표준 PRO 척도 (Standardized PRO Protocols)
                </h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-1.5 gap-x-4 text-xs text-blue-900">
                    <li className="flex items-start">
                        <span className="w-1 h-1 bg-blue-400 rounded-full mt-1.5 mr-2"></span>
                        <span><strong>신체 기능:</strong> PROMIS-PF / K-MBI</span>
                    </li>
                    <li className="flex items-start">
                        <span className="w-1 h-1 bg-blue-400 rounded-full mt-1.5 mr-2"></span>
                        <span><strong>통증 (Pain):</strong> NRS (0-10) 및 FLACC 척도</span>
                    </li>
                    <li className="flex items-start">
                        <span className="w-1 h-1 bg-blue-400 rounded-full mt-1.5 mr-2"></span>
                        <span><strong>정서 (Emotion):</strong> PHQ-9 (우울) / GAD-7 (불안)</span>
                    </li>
                    <li className="flex items-start">
                        <span className="w-1 h-1 bg-blue-400 rounded-full mt-1.5 mr-2"></span>
                        <span><strong>삶의 질 (HRQoL):</strong> PedsQL™ / EQ-5D-5L</span>
                    </li>
                    <li className="flex items-start">
                        <span className="w-1 h-1 bg-blue-400 rounded-full mt-1.5 mr-2"></span>
                        <span><strong>영양 상태:</strong> PG-SGA / MUST 선별 검사</span>
                    </li>
                </ul>
                <p className="mt-2 text-[10px] text-blue-700 opacity-80 border-t border-blue-200 pt-1.5">
                    * 위 척도는 환자의 진단명 및 연령에 따라 자동으로 최적화되어 환자용 앱에 표시됩니다.
                </p>
            </div>
        )}
      </Card>

       <Card title="EMR 실시간 데이터 연동" description="보고서 생성 시 EMR 시스템의 최신 환자 데이터를 안전하게 참조하도록 허용합니다.">
        <div className="space-y-4 mt-2">
            <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">EMR 연동 활성화</label>
                <ToggleSwitch enabled={config.emrIntegration.enabled} setEnabled={(e) => handleEmrIntegrationChange('enabled', e)} />
            </div>

            {config.emrIntegration.enabled && (
                <div>
                    <h4 className="text-xs font-medium text-gray-700 mb-2">접근 가능 데이터</h4>
                    <div className="grid grid-cols-2 gap-3">
                        {AVAILABLE_EMR_DATA_POINTS.map(point => (
                             <div key={point} className="flex items-center">
                                <input
                                    id={`emr-report-${point}`}
                                    type="checkbox"
                                    checked={!!config.emrIntegration.dataPoints?.[point]}
                                    onChange={() => handleEmrDataPointChange(point)}
                                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <label htmlFor={`emr-report-${point}`} className="ml-2 block text-sm font-medium text-gray-700">
                                    {EMR_DATA_POINT_LABELS[point]}
                                </label>
                            </div>
                        ))}
                    </div>
                </div>
            )}
             <div className="mt-4 flex items-start p-3 bg-gray-50 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 flex-shrink-0 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
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
