import React, { useState, useEffect } from 'react';
import { AgentType } from '../types';
import { AGENT_TYPE_DETAILS } from '../constants';
import Modal from './common/Modal';

interface CreateAgentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateAgent: (name: string, description: string, type: AgentType) => void;
}

const CreateAgentModal: React.FC<CreateAgentModalProps> = ({ isOpen, onClose, onCreateAgent }) => {
  const [step, setStep] = useState(1);
  const [selectedType, setSelectedType] = useState<AgentType | ''>('');
  const [agentName, setAgentName] = useState('');
  const [agentDescription, setAgentDescription] = useState('');

  useEffect(() => {
    if (isOpen) {
      // Reset state when modal opens
      setStep(1);
      setSelectedType('');
      setAgentName('');
      setAgentDescription('');
    }
  }, [isOpen]);

  useEffect(() => {
    if (selectedType) {
      const details = AGENT_TYPE_DETAILS[selectedType];
      setAgentName(details.label);
      setAgentDescription(details.defaultDescription);
    } else {
      setAgentName('');
      setAgentDescription('');
    }
  }, [selectedType]);

  const handleCreate = () => {
    if (selectedType && agentName.trim() && agentDescription.trim()) {
      onCreateAgent(agentName.trim(), agentDescription.trim(), selectedType);
    }
  };

  const renderStepOne = () => (
    <div>
      <h3 className="text-lg font-medium text-gray-800 mb-1">에이전트 유형 선택</h3>
      <p className="text-sm text-gray-500 mb-4">생성할 에이전트의 기본 기능을 선택하세요.</p>
      <div className="space-y-3">
        {(Object.keys(AGENT_TYPE_DETAILS) as AgentType[]).map((type) => {
          const details = AGENT_TYPE_DETAILS[type];
          return (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`w-full text-left p-4 border rounded-lg flex items-center transition-all duration-200 ${
                selectedType === type
                  ? 'border-blue-500 ring-2 ring-blue-200 bg-blue-50'
                  : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
              }`}
            >
              <details.icon className="h-8 w-8 mr-4 text-blue-600 flex-shrink-0" />
              <div>
                <p className="font-semibold text-gray-800">{details.label}</p>
                <p className="text-sm text-gray-500">{details.category}</p>
              </div>
            </button>
          );
        })}
      </div>
      <div className="flex justify-end pt-4 mt-4 border-t">
        <button
          onClick={() => setStep(2)}
          disabled={!selectedType}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          다음
        </button>
      </div>
    </div>
  );

  const renderStepTwo = () => (
    <div>
      <h3 className="text-lg font-medium text-gray-800 mb-1">에이전트 세부 정보</h3>
      <p className="text-sm text-gray-500 mb-4">에이전트의 이름과 설명을 입력하세요.</p>
      <div className="space-y-4">
        <div>
          <label htmlFor="agentName" className="block text-sm font-medium text-gray-700">
            에이전트 이름
          </label>
          <input
            type="text"
            id="agentName"
            value={agentName}
            onChange={(e) => setAgentName(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="agentDescription" className="block text-sm font-medium text-gray-700">
            에이전트 설명
          </label>
          <textarea
            id="agentDescription"
            value={agentDescription}
            onChange={(e) => setAgentDescription(e.target.value)}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>
      </div>
      <div className="flex justify-between pt-4 mt-4 border-t">
        <button
            onClick={() => setStep(1)}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg"
        >
            이전
        </button>
        <button
          onClick={handleCreate}
          disabled={!agentName.trim() || !agentDescription.trim()}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          에이전트 생성
        </button>
      </div>
    </div>
  );


  return (
    <Modal isOpen={isOpen} onClose={onClose} title="새 AI 에이전트 생성">
        {step === 1 ? renderStepOne() : renderStepTwo()}
    </Modal>
  );
};

export default CreateAgentModal;