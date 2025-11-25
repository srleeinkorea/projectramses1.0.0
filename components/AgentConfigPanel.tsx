
import React, { useState } from 'react';
import { Agent, AgentType, AgentConfig, AgentTemplate, KnowledgeSource, Patient } from '../types';
import MonitoringAgentConfigPanel from './config_panels/MonitoringAgentConfig';
import ChatbotAgentConfigPanel from './config_panels/ChatbotAgentConfig';
import ReportingAgentConfigPanel from './config_panels/ReportingAgentConfig';
import VentilatorAgentConfigPanel from './config_panels/VentilatorAgentConfig';
import RecurrencePredictionConfigPanel from './config_panels/RecurrencePredictionConfigPanel';
import TriageAgentConfigPanel from './config_panels/TriageAgentConfig';
import ToggleSwitch from './common/ToggleSwitch';
import Modal from './common/Modal';

interface AgentConfigPanelProps {
  agent: Agent<any>;
  onConfigChange: (agentId: string, newConfig: AgentConfig, newEnabledState?: boolean) => void;
  templates: AgentTemplate[];
  onSaveTemplate: (name: string, agentType: AgentType, config: AgentConfig) => void;
  onDeleteTemplate: (templateId: string) => void;
  allKnowledgeSources: KnowledgeSource[];
  currentPatient?: Patient;
}

const AgentConfigPanel: React.FC<AgentConfigPanelProps> = ({ agent, onConfigChange, templates, onSaveTemplate, onDeleteTemplate, allKnowledgeSources, currentPatient }) => {
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [isLoadModalOpen, setIsLoadModalOpen] = useState(false);
  const [templateName, setTemplateName] = useState('');

  const handleEnabledChange = (enabled: boolean) => {
    onConfigChange(agent.id, agent.config, enabled);
  };

  const handleSaveTemplate = () => {
    if (templateName.trim()) {
      onSaveTemplate(templateName.trim(), agent.type, agent.config);
      setTemplateName('');
      setIsSaveModalOpen(false);
    }
  };

  const handleLoadTemplate = (config: AgentConfig) => {
    onConfigChange(agent.id, config, agent.enabled);
    setIsLoadModalOpen(false);
  };

  const compatibleTemplates = templates.filter(t => t.agentType === agent.type);

  const renderConfigPanel = () => {
    // Specialized route for Colorectal Recurrence Prediction Agent
    if (agent.id === 'agent-crc-1') {
        return <RecurrencePredictionConfigPanel agent={agent} onConfigChange={onConfigChange} patient={currentPatient} />;
    }

    switch (agent.type) {
      case AgentType.MONITORING_VITAL_SIGNS:
        return <MonitoringAgentConfigPanel agent={agent} onConfigChange={onConfigChange} />;
      case AgentType.MONITORING_VENTILATOR:
        return <VentilatorAgentConfigPanel agent={agent} onConfigChange={onConfigChange} allKnowledgeSources={allKnowledgeSources} />;
      case AgentType.CONVERSATIONAL_CHATBOT:
        return <ChatbotAgentConfigPanel agent={agent} onConfigChange={onConfigChange} allKnowledgeSources={allKnowledgeSources} />;
      case AgentType.REPORTING_SUMMARY:
        return <ReportingAgentConfigPanel agent={agent} onConfigChange={onConfigChange} />;
      case AgentType.MANAGEMENT_TRIAGE:
        return <TriageAgentConfigPanel agent={agent} onConfigChange={onConfigChange} />;
      default:
        return <p>이 에이전트 유형에 대한 설정이 없습니다.</p>;
    }
  };

  return (
    <div className="space-y-4">
      {/* Dashboard-like Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 relative overflow-hidden">
         {/* Decorative background element */}
         <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-full blur-2xl opacity-70"></div>
         
         <div className="flex flex-col sm:flex-row justify-between sm:items-center relative z-10">
            <div className="flex items-center gap-4">
                <div className={`p-3 rounded-lg shadow-sm ${agent.enabled ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-400'}`}>
                    <agent.icon className="h-6 w-6" />
                </div>
                <div>
                    <h2 className="text-lg font-bold text-gray-900 leading-tight flex items-center gap-2">
                        {agent.name}
                        <span