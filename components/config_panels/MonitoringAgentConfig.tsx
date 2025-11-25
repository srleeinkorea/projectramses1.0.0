
import React from 'react';
import { Agent, MonitoringConfig, EMRDataPoints, NotificationPreferences } from '../../types';
import Card from '../common/Card';
import Select from '../common/Select';
import ToggleSwitch from '../common/ToggleSwitch';
import NotificationConfigCard from '../common/NotificationConfigCard';

interface MonitoringAgentConfigPanelProps {
  agent: Agent<MonitoringConfig>;
  onConfigChange: (agentId: string, newConfig: MonitoringConfig) => void;
}

const PARAMETER_LABELS: Record<keyof MonitoringConfig['parameters'], string> = {
  spo2: '산소포화도 (SpO2)',
  heartRate: '심박수',
  respRate: '호흡수',
  ventilatorPressure: '인공호흡기 압력'
};

const EMR_DATA_POINT_LABELS: Record<keyof EMRDataPoints, string> = {
    vitals: '실시간 생체 신호',
    ventilatorData: '인공호흡기 데이터',
    labResults: '최신 검사 결과',
    medications: '투약 기록',
    allergies: '알레르기 정보',
    consultationNotes: '진료 기록 노트',
};

const AVAILABLE_EMR_DATA_POINTS: (keyof EMRDataPoints)[] = ['vitals', 'labResults'];


const MonitoringAgentConfigPanel: React.FC<MonitoringAgentConfigPanelProps> = ({ agent, onConfigChange }) => {
  const { config } = agent;

  const handleParamChange = (param: keyof MonitoringConfig['parameters']) => {
    const newConfig = {
      ...config,
      parameters: {
        ...config.parameters,
        [param]: !config.parameters[param],
      },
    };
    onConfigChange(agent.id, newConfig);
  };

  const handleThresholdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newConfig = { ...config, spo2Threshold: parseInt(e.target.value, 10) || 0 };
    onConfigChange(agent.id, newConfig);
  };
  
  const handleSensitivityChange = (value: 'low' | 'medium' | 'high') => {
    const newConfig = { ...config, alertSensitivity: value };
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

  const handleNotificationPreferencesChange = (newPreferences: NotificationPreferences) => {
    onConfigChange(agent.id, { ...config, notificationPreferences: newPreferences });
  };

  return (
    <div className="space-y-6">
      <Card title="모니터링 항목" description="이 에이전트가 능동적으로 모니터링할 생체 신호를 선택하세요.">
        <div className="grid grid-cols-2 gap-4 mt-4">
          {Object.entries(config.parameters).map(([key, value]) => (
            <div key={key} className="flex items-center">
              <input
                id={key}
                name={key}
                type="checkbox"
                checked={value}
                onChange={() => handleParamChange(key as keyof MonitoringConfig['parameters'])}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor={key} className="ml-3 block text-sm font-medium text-gray-700 capitalize">
                {PARAMETER_LABELS[key as keyof MonitoringConfig['parameters']]}
              </label>
            </div>
          ))}
        </div>
      </Card>

      <Card title="알림 규칙" description="알림을 트리거할 임계값과 민감도를 정의하세요.">
        <div className="space-y-6 mt-4">
          <div>
            <label htmlFor="spo2Threshold" className="block text-sm font-medium text-gray-700">
              SpO2 알림 임계값 (%)
            </label>
            <div className="mt-1 flex rounded-md shadow-sm">
                <input
                    type="number"
                    name="spo2Threshold"
                    id="spo2Threshold"
                    className="block w-full min-w-0 flex-1 rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    value={config.spo2Threshold}
                    onChange={handleThresholdChange}
                />
            </div>
             <p className="mt-2 text-sm text-gray-500">SpO2가 이 값 아래로 지속적으로 떨어지면 알림을 보냅니다.</p>
          </div>
          <Select
            label="알림 민감도"
            value={config.alertSensitivity}
            onChange={handleSensitivityChange}
            options={[
              { value: 'low', label: '낮음 (알림 빈도 낮음, 미세한 변화를 놓칠 수 있음)' },
              { value: 'medium', label: '중간 (균형 잡힌 접근 방식)' },
              { value: 'high', label: '높음 (알림 빈도 높음, 사소한 편차도 감지)' },
            ]}
            description="변동에 대한 에이전트의 민감도를 조정하여 알림 빈도를 제어합니다."
          />
        </div>
      </Card>
      
      <NotificationConfigCard
        preferences={config.notificationPreferences}
        onPreferencesChange={handleNotificationPreferencesChange}
      />
      
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
                                    id={`emr-${point}`}
                                    type="checkbox"
                                    checked={!!config.emrIntegration.dataPoints?.[point]}
                                    onChange={() => handleEmrDataPointChange(point)}
                                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <label htmlFor={`emr-${point}`} className="ml-3 block text-sm font-medium text-gray-700">
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
    </div>
  );
};

export default MonitoringAgentConfigPanel;
