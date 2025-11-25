import React from 'react';
import { EvaluationMetricConfig } from '../../types';
import Card from './Card';
import ToggleSwitch from './ToggleSwitch';
import Select from './Select';

interface EvaluationMetricCardProps {
  config: EvaluationMetricConfig;
  onConfigChange: (newConfig: EvaluationMetricConfig) => void;
}

const InformationCircleIcon: React.FC<{ className?: string }> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
  </svg>
);


const EvaluationMetricCard: React.FC<EvaluationMetricCardProps> = ({ config, onConfigChange }) => {
  
  const handleEnabledChange = (enabled: boolean) => {
    onConfigChange({ ...config, enabled });
  };

  const handleSliderChange = (field: 'rougeScoreThreshold' | 'factualityScoreThreshold', value: number) => {
    onConfigChange({ ...config, [field]: value });
  };
  
  const handleActionChange = (value: 'log' | 'flag' | 'alert') => {
    onConfigChange({ ...config, evaluationAction: value });
  };

  return (
    <Card title="AI 성능 검증 (TRI-Agentic AI)" description="에이전트의 응답 품질을 지속적으로 모니터링하기 위한 성능 검증 지표를 설정합니다.">
        <div className="space-y-4 mt-4">
            <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">성능 검증 활성화</label>
                <ToggleSwitch enabled={config.enabled} setEnabled={handleEnabledChange} />
            </div>

            {config.enabled && (
                <div className="space-y-6 pt-4 border-t">
                  <div className="space-y-4">
                     <div>
                        <div className="flex items-center justify-between">
                            <label htmlFor="rougeScore" className="block text-sm font-medium text-gray-700">
                                ROUGE-L Score 임계값
                            </label>
                            <div className="relative group">
                                <InformationCircleIcon className="h-5 w-5 text-gray-400 cursor-pointer" />
                                <div className="absolute bottom-full mb-2 w-64 p-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
                                    생성된 텍스트가 참조 문서(Knowledge DB)의 내용과 얼마나 유사한지를 측정합니다. 요약의 품질을 평가하는 데 사용됩니다.
                                    <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-gray-800"></div>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4 mt-2">
                           <input
                            type="range"
                            id="rougeScore"
                            min="0"
                            max="100"
                            value={config.rougeScoreThreshold}
                            onChange={(e) => handleSliderChange('rougeScoreThreshold', parseInt(e.target.value, 10))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                           />
                           <span className="font-semibold text-blue-600 w-12 text-center">{config.rougeScoreThreshold}%</span>
                        </div>
                    </div>
                     <div>
                        <div className="flex items-center justify-between">
                            <label htmlFor="factualityScore" className="block text-sm font-medium text-gray-700">
                                Factuality Score 임계값
                            </label>
                             <div className="relative group">
                                <InformationCircleIcon className="h-5 w-5 text-gray-400 cursor-pointer" />
                                <div className="absolute bottom-full mb-2 w-64 p-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
                                    생성된 텍스트의 각 문장이 참조 문서에 의해 사실적으로 뒷받침되는지 측정합니다. '환각(Hallucination)' 현상을 방지하는 데 중요합니다.
                                     <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-gray-800"></div>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4 mt-2">
                           <input
                            type="range"
                            id="factualityScore"
                            min="0"
                            max="100"
                            value={config.factualityScoreThreshold}
                            onChange={(e) => handleSliderChange('factualityScoreThreshold', parseInt(e.target.value, 10))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                           />
                           <span className="font-semibold text-blue-600 w-12 text-center">{config.factualityScoreThreshold}%</span>
                        </div>
                    </div>
                  </div>
                   <Select
                        label="임계값 미달 시 조치"
                        value={config.evaluationAction}
                        onChange={handleActionChange}
                        options={[
                            { value: 'log', label: '로그만 기록' },
                            { value: 'flag', label: '검토를 위해 플래그 지정' },
                            { value: 'alert', label: '관리자에게 즉시 알림' },
                        ]}
                        description="성능 점수가 설정된 임계값 아래로 떨어질 경우 시스템이 수행할 작업을 선택합니다."
                    />
                </div>
            )}
             <div className="mt-4 flex items-start p-3 bg-red-50 rounded-lg border border-red-200">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500 flex-shrink-0 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <p className="text-xs text-red-800">
                    <strong>중요:</strong> 성능 검증은 시스템의 안정성을 보장하지만, 최종적인 임상적 판단은 반드시 자격을 갖춘 의료 전문가가 내려야 합니다. 이 지표는 보조적인 도구로 사용되어야 합니다.
                </p>
            </div>
        </div>
    </Card>
  );
};

export default EvaluationMetricCard;