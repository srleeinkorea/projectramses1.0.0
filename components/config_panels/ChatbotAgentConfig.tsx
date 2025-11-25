
import React from 'react';
import { Agent, ChatbotConfig, KnowledgeSource, KnowledgeSourceType, MedicalLiteratureSearchConfig, EvaluationMetricConfig } from '../../types';
import Card from '../common/Card';
import Select from '../common/Select';
import LiteratureSearchConfigCard from '../common/LiteratureSearchConfigCard';
import EvaluationMetricCard from '../common/EvaluationMetricCard';

interface ChatbotAgentConfigPanelProps {
  agent: Agent<ChatbotConfig>;
  onConfigChange: (agentId: string, newConfig: ChatbotConfig) => void;
  allKnowledgeSources: KnowledgeSource[];
}

const TYPE_COLORS: Record<string, string> = {
    [KnowledgeSourceType.PROTOCOL]: 'bg-blue-100 text-blue-800',
    [KnowledgeSourceType.GUIDELINE]: 'bg-green-100 text-green-800',
    [KnowledgeSourceType.RECOMMENDATION]: 'bg-yellow-100 text-yellow-800',
    [KnowledgeSourceType.TEXTBOOK]: 'bg-indigo-100 text-indigo-800',
    [KnowledgeSourceType.PRO]: 'bg-purple-100 text-purple-800',
    [KnowledgeSourceType.CUSTOM]: 'bg-gray-200 text-gray-800',
};

const PERSONA_EXAMPLES: Record<string, string> = {
    clinical: "환자의 체온이 38.5도로 확인됩니다. 표준 프로토콜에 따라 아세트아미노펜 계열 해열제를 체중 비례 용량으로 투여하고, 1시간 후 재측정이 필요합니다. 탈수 징후를 모니터링하십시오.",
    empathetic: "아이가 열이 나서 많이 걱정되시겠어요. 38.5도면 꽤 높은 편이라 아이가 힘들 수 있습니다. 우선 해열제를 먹이고, 미지근한 물로 닦아주며 아이를 안심시켜 주세요. 계속 곁에서 지켜봐 주세요.",
    direct: "현재 체온 38.5도. 해열제 즉시 투여 필요. 수분 섭취 권장. 1시간 간격 체온 측정 요망. 39도 이상 상승 시 응급실 내원 고려.",
};

const LockClosedIcon: React.FC<{ className?: string }> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
  </svg>
);

const ChatbotAgentConfigPanel: React.FC<ChatbotAgentConfigPanelProps> = ({ agent, onConfigChange, allKnowledgeSources }) => {
  const { config } = agent;

  const handlePersonaChange = (value: 'clinical' | 'empathetic' | 'direct') => {
    onConfigChange(agent.id, { ...config, persona: value });
  };

  const handleToggleSource = (sourceId: string) => {
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

  const handleDeleteRule = (ruleId: string) => {
    const newRules = config.rules.filter(rule => rule.id !== ruleId);
    onConfigChange(agent.id, { ...config, rules: newRules });
  };

  return (
    <div className="space-y-4">
      <Card title="페르소나 설정" description="챗봇의 대화 스타일과 어조를 설정합니다.">
        <div className="space-y-3 mt-4">
          <Select
            label="대화 페르소나"
            value={config.persona}
            onChange={(val) => handlePersonaChange(val as any)}
            options={[
              { value: 'clinical', label: '전문적/임상적 (Clinical)' },
              { value: 'empathetic', label: '공감적/친근한 (Empathetic)' },
              { value: 'direct', label: '직설적/지시적 (Direct)' },
            ]}
          />
          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">응답 예시</h4>
            <p className="text-sm text-gray-700 italic">"{PERSONA_EXAMPLES[config.persona]}"</p>
          </div>
        </div>
      </Card>

      <Card title="참조 Knowledge DB" description="챗봇이 답변을 생성할 때 근거로 사용할 지식 소스를 선택하세요.">
        <div className="space-y-2 mt-4">
            {allKnowledgeSources.map(source => {
                const isSelected = config.knowledgeSourceIds.includes(source.id);
                const isEnabledInKB = source.enabled;
                const typeColor = TYPE_COLORS[source.type as KnowledgeSourceType] || TYPE_COLORS[KnowledgeSourceType.CUSTOM];

                return (
                    <div key={source.id} className={`flex items-center justify-between p-3 rounded-lg border ${!isEnabledInKB ? 'bg-gray-100 opacity-60' : 'bg-gray-50'}`}>
                        <div className="flex items-start flex-1 pr-4">
                            <input
                                id={`ks-${source.id}`}
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => handleToggleSource(source.id)}
                                disabled={!isEnabledInKB}
                                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 mt-1"
                            />
                            <div className="ml-3">
                                <label htmlFor={`ks-${source.id}`} className={`text-sm font-medium ${!isEnabledInKB ? 'text-gray-500' : 'text-gray-800'}`}>{source.name}</label>
                                <div className="flex items-center gap-x-2 mt-0.5">
                                    <span className={`px-2 py-0.5 inline-flex text-[10px] leading-4 font-semibold rounded-full ${typeColor}`}>
                                        {source.type}
                                    </span>
                                    {source.description && <p className="text-xs text-gray-500 hidden sm:block">{source.description}</p>}
                                </div>
                                {!isEnabledInKB && <p className="text-[10px] text-red-500 mt-0.5">이 소스는 전체 Knowledge DB에서 비활성화되어 있습니다.</p>}
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
      </Card>

      <Card title="행동 제어 규칙 (Guardrails)" description="특정 키워드나 상황에 대한 챗봇의 필수 반응 또는 제한 사항을 정의합니다.">
        <div className="mt-4 space-y-3">
            {config.rules.map(rule => (
                 <div key={rule.id} className="p-3 bg-white border border-gray-200 rounded-lg shadow-sm">
                    <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                            {!rule.isDeletable && <LockClosedIcon className="h-3.5 w-3.5 text-gray-400" />}
                            <span className="font-semibold text-sm text-gray-800">조건: "{rule.condition}" ({rule.matchType === 'any' ? '하나라도 포함' : '모두 포함'})</span>
                        </div>
                        {rule.isDeletable && (
                            <button onClick={() => handleDeleteRule(rule.id)} className="text-xs text-red-500 hover:text-red-700">삭제</button>
                        )}
                    </div>
                    <div className="mt-1.5 text-sm text-gray-600 bg-gray-50 p-2 rounded">
                        <span className="font-medium text-gray-700">응답: </span>
                        {rule.responses[0]}
                    </div>
                     <div className="mt-2 flex gap-1.5">
                        {rule.tags?.map(tag => (
                            <span key={tag} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] rounded-full">#{tag}</span>
                        ))}
                         {rule.escalation !== 'none' && (
                             <span className="px-2 py-0.5 bg-red-100 text-red-800 text-[10px] rounded-full font-bold">
                                 {rule.escalation === 'nurse_alert' ? '간호사 알림' : '의사 검토'}
                             </span>
                         )}
                    </div>
                 </div>
            ))}
             <p className="text-xs text-gray-500 text-center pt-2">새 규칙 추가는 관리자 권한이 필요합니다.</p>
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

export default ChatbotAgentConfigPanel;
