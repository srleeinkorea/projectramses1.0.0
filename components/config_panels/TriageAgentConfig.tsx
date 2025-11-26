
import React, { useState } from 'react';
import { Agent, TriageConfig, TriageCriteria, EMRDataPoints, NotificationPreferences } from '../../types';
import Card from '../common/Card';
import ToggleSwitch from '../common/ToggleSwitch';
import NotificationConfigCard from '../common/NotificationConfigCard';

interface TriageAgentConfigPanelProps {
  agent: Agent<TriageConfig>;
  onConfigChange: (agentId: string, newConfig: TriageConfig) => void;
}

const EMR_DATA_POINT_LABELS: Record<keyof EMRDataPoints, string> = {
    vitals: '실시간 생체 신호',
    ventilatorData: '인공호흡기 데이터',
    labResults: '최신 검사 결과',
    medications: '투약 기록',
    allergies: '알레르기 정보',
    consultationNotes: '진료 기록 노트',
};

const AVAILABLE_EMR_DATA_POINTS: (keyof EMRDataPoints)[] = ['vitals', 'medications', 'consultationNotes'];

const TriageAgentConfigPanel: React.FC<TriageAgentConfigPanelProps> = ({ agent, onConfigChange }) => {
  const { config } = agent;

  const handleAutoAlertChange = (enabled: boolean) => {
    onConfigChange(agent.id, { ...config, autoAlertGuardian: enabled });
  };
  
  const handleVentilatorIntegrationChange = (enabled: boolean) => {
    onConfigChange(agent.id, { ...config, ventilatorIntegration: enabled });
  };

  const handleCustomPromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onConfigChange(agent.id, { ...config, customPrompt: e.target.value });
  };

  const handleProtocolUpdate = (protocolId: string, field: keyof TriageCriteria, value: any) => {
      const newProtocols = config.protocols.map(p => {
          if (p.id === protocolId) {
              return { ...p, [field]: value };
          }
          return p;
      });
      onConfigChange(agent.id, { ...config, protocols: newProtocols });
  };

  const handleSymptomAdd = (protocolId: string) => {
      // Logic to add a new symptom prompt could go here, for now simplified
      const protocol = config.protocols.find(p => p.id === protocolId);
      if (protocol) {
          const newSymptom = prompt("추가할 증상을 입력하세요:");
          if (newSymptom) {
              handleProtocolUpdate(protocolId, 'symptoms', [...protocol.symptoms, newSymptom]);
          }
      }
  };
  
  const handleSymptomRemove = (protocolId: string, symptomToRemove: string) => {
      const protocol = config.protocols.find(p => p.id === protocolId);
      if (protocol) {
          handleProtocolUpdate(protocolId, 'symptoms', protocol.symptoms.filter(s => s !== symptomToRemove));
      }
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

  const getLevelColor = (level: string) => {
      switch(level) {
          case 'red': return 'bg-red-50 border-red-200';
          case 'yellow': return 'bg-yellow-50 border-yellow-200';
          case 'green': return 'bg-green-50 border-green-200';
          default: return 'bg-gray-50 border-gray-200';
      }
  };

   const getLevelBadge = (level: string) => {
      switch(level) {
          case 'red': return <span className="px-2 py-1 rounded bg-red-100 text-red-800 text-xs font-bold uppercase">Red Flag (응급)</span>;
          case 'yellow': return <span className="px-2 py-1 rounded bg-yellow-100 text-yellow-800 text-xs font-bold uppercase">Yellow Flag (주의)</span>;
          case 'green': return <span className="px-2 py-1 rounded bg-green-100 text-green-800 text-xs font-bold uppercase">Green Flag (안정)</span>;
          default: return null;
      }
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
          <h4 className="text-sm font-bold text-blue-900 mb-1">홈케어 트리아제 시스템이란?</h4>
          <p className="text-xs text-blue-800 opacity-80 leading-relaxed">
              환자가 가정에서 겪는 증상을 3단계(Red/Yellow/Green)로 분류하여, 보호자에게 상황별 적절한 대처 가이드를 자동으로 제공하는 의사결정 지원 시스템입니다.
          </p>
      </div>

      <Card title="트리아제 프로토콜 설정" description="각 위험 단계별 증상 기준과 보호자에게 제공할 행동 지침을 정의합니다.">
        <div className="space-y-4 mt-4">
            {config.protocols.map(protocol => (
                <div key={protocol.id} className={`p-4 rounded-lg border ${getLevelColor(protocol.level)} space-y-3`}>
                    <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                             {getLevelBadge(protocol.level)}
                             <h5 className="text-sm font-bold text-gray-800">{protocol.description}</h5>
                        </div>
                    </div>
                    
                    <div>
                        <span className="text-xs font-semibold text-gray-500 uppercase block mb-1.5">감지 증상 및 징후 (Criteria)</span>
                        <div className="flex flex-wrap gap-2">
                            {protocol.symptoms.map((symptom, idx) => (
                                <span key={idx} className="inline-flex items-center px-2 py-1 rounded-md bg-white border border-gray-200 text-xs text-gray-700 shadow-sm">
                                    {symptom}
                                    <button onClick={() => handleSymptomRemove(protocol.id, symptom)} className="ml-1.5 text-gray-400 hover:text-red-500">×</button>
                                </span>
                            ))}
                            <button onClick={() => handleSymptomAdd(protocol.id)} className="inline-flex items-center px-2 py-1 rounded-md bg-white border border-gray-300 border-dashed text-xs text-gray-500 hover:bg-gray-50">
                                + 증상 추가
                            </button>
                        </div>
                    </div>

                    <div className="bg-white/60 p-3 rounded-md border border-gray-200/50">
                         <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">보호자 행동 가이드 (Action Guide)</label>
                         <textarea 
                            className="w-full text-sm p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500" 
                            rows={2}
                            value={protocol.action}
                            onChange={(e) => handleProtocolUpdate(protocol.id, 'action', e.target.value)}
                         />
                    </div>
                </div>
            ))}
        </div>
      </Card>
      
      <Card title="고급 AI 설정 (Prompt Engineering)" description="트리아제 판단 로직에 적용할 추가적인 임상 컨텍스트나 프롬프트를 설정합니다.">
        <div className="space-y-4 mt-4">
            <div>
                 <label className="block text-sm font-medium text-gray-700 mb-2">Custom Triage Prompt (System Instruction)</label>
                 <textarea 
                    className="w-full text-sm p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 font-mono bg-gray-50" 
                    rows={4}
                    placeholder="예: 소아 환자의 경우, 고열과 함께 호흡수가 분당 50회를 초과하면 즉시 Red Flag로 간주하십시오."
                    value={config.customPrompt || ""}
                    onChange={handleCustomPromptChange}
                 />
                 <p className="text-xs text-gray-500 mt-1">이 프롬프트는 AI가 증상을 분석할 때 최우선 규칙으로 적용됩니다.</p>
            </div>
            
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div>
                    <span className="block text-sm font-medium text-gray-900">인공호흡기 데이터 통합 (Ventilator Integration)</span>
                    <span className="block text-xs text-gray-500">인공호흡기 알람(High Pressure, Low Tidal Vol)을 트리아제 판단의 핵심 척도로 사용합니다.</span>
                </div>
                <ToggleSwitch enabled={config.ventilatorIntegration || false} setEnabled={handleVentilatorIntegrationChange} />
            </div>
        </div>
      </Card>

      <Card title="보호자 알림 자동화" description="트리아제 결과에 따라 보호자에게 앱 알림을 자동으로 발송할지 설정합니다.">
        <div className="flex items-center justify-between mt-2">
             <div>
                <span className="block text-sm font-medium text-gray-900">자동 알림 발송</span>
                <span className="block text-xs text-gray-500">위험 신호 감지 시 보호자 앱으로 즉시 푸시 알림을 전송합니다.</span>
            </div>
            <ToggleSwitch enabled={config.autoAlertGuardian} setEnabled={handleAutoAlertChange} />
        </div>
      </Card>

      <NotificationConfigCard 
        preferences={config.notificationPreferences} 
        onPreferencesChange={handleNotificationPreferencesChange} 
      />

       <Card title="EMR 데이터 연동 (참조용)" description="증상 판단 시 환자의 최근 의무 기록을 참조합니다.">
        <div className="space-y-4 mt-2">
            <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">EMR 연동 활성화</label>
                <ToggleSwitch enabled={config.emrIntegration.enabled} setEnabled={(e) => handleEmrIntegrationChange('enabled', e)} />
            </div>

            {config.emrIntegration.enabled && (
                <div className="grid grid-cols-2 gap-3 mt-2">
                    {AVAILABLE_EMR_DATA_POINTS.map(point => (
                            <div key={point} className="flex items-center">
                            <input
                                id={`emr-triage-${point}`}
                                type="checkbox"
                                checked={!!config.emrIntegration.dataPoints?.[point]}
                                onChange={() => handleEmrDataPointChange(point)}
                                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <label htmlFor={`emr-triage-${point}`} className="ml-2 block text-sm font-medium text-gray-700">
                                {EMR_DATA_POINT_LABELS[point]}
                            </label>
                        </div>
                    ))}
                </div>
            )}
        </div>
      </Card>
    </div>
  );
};

export default TriageAgentConfigPanel;
