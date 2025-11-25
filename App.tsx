
import React, { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import Sidebar from './components/Sidebar';
import AgentConfigPanel from './components/AgentConfigPanel';
import CreateAgentModal from './components/CreateAgentModal';
import PatientContext from './components/PatientContext';
import KnowledgeBasePanel from './components/KnowledgeBasePanel';
import AlertCenter from './components/AlertCenter';
import { INITIAL_AGENTS_PEDIATRICS, INITIAL_AGENTS_PEP, INITIAL_AGENTS_COLORECTAL, AGENT_TYPE_DETAILS, INITIAL_KNOWLEDGE_SOURCES, MOCK_PATIENTS } from './constants';
import { Agent, AgentConfig, AgentTemplate, AgentType, KnowledgeSource, Department, Patient, Alert, AlertSeverity, MonitoringConfig, VentilatorConfig } from './types';

const TEMPLATES_STORAGE_KEY = 'ai_agent_templates';

const BookOpenIcon: React.FC<{ className?: string }> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
  </svg>
);

// Brand Logo Component
const BrandLogo: React.FC<{ department: Department }> = ({ department }) => {
  if (department === 'PEDIATRICS') {
    return (
      <div className="flex items-center gap-3 select-none">
        <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 shadow-lg shadow-blue-500/20 text-white shrink-0">
             {/* Lungs Icon Concept */}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path d="M7.5 4C5 4 3 6.5 3 10c0 4 2.5 8 5.5 8 1 0 1.5-1 1.5-1s-.5-2 0-3c.5-1 2-2 2-2V4h-4.5zM16.5 4h-4.5v8s1.5 1 2 2 .5 3 0 3c0 0 .5 1 1.5 1 3 0 5.5-4 5.5-8 0-3.5-2-6-4.5-6z" opacity="0.9" />
                <circle cx="12" cy="5" r="1.5" className="text-white opacity-80" />
            </svg>
            <div className="absolute top-0 right-0 -mr-1 -mt-1 w-2.5 h-2.5 bg-white rounded-full flex items-center justify-center shadow-sm">
                <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-pulse"></div>
            </div>
        </div>
        <div className="flex flex-col justify-center">
            <h1 className="text-xl font-bold text-slate-800 tracking-tight leading-none flex items-center gap-1">
                V.Doc <span className="text-blue-600">PEDI-AIR</span>
            </h1>
            <span className="text-[9px] font-bold text-blue-400 uppercase tracking-widest mt-0.5">
                Pediatric AI for Respiratory System
            </span>
        </div>
      </div>
    );
  } else if (department === 'SURGERY') {
     return (
      <div className="flex items-center gap-3 select-none">
        <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-teal-400 shadow-lg shadow-indigo-500/20 text-white shrink-0">
            {/* Pulse/Heartbeat Icon */}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
            <div className="absolute top-0 right-0 -mr-1 -mt-1 w-2.5 h-2.5 bg-white rounded-full flex items-center justify-center shadow-sm">
                <div className="w-1.5 h-1.5 bg-teal-500 rounded-full animate-pulse"></div>
            </div>
        </div>
        <div className="flex flex-col justify-center">
            <h1 className="text-xl font-bold text-slate-800 tracking-tight leading-none flex items-center gap-1">
                V.Doc <span className="text-indigo-600">G-PEP</span>
            </h1>
            <span className="text-[9px] font-bold text-indigo-400 uppercase tracking-widest mt-0.5">
                General Surgery Post-op Recovery AI
            </span>
        </div>
      </div>
    );
  } else { // COLORECTAL
     return (
      <div className="flex items-center gap-3 select-none">
        <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-fuchsia-400 shadow-lg shadow-purple-500/20 text-white shrink-0">
            {/* Loop/Intestine/Recurrence Icon */}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z" className="opacity-30" />
                <path d="M12 7v5l3 3" />
                <path d="M3.6 9a9 9 0 0 1 14.8-2.6L21 9M2.5 9h5v-5" />
            </svg>
            <div className="absolute top-0 right-0 -mr-1 -mt-1 w-2.5 h-2.5 bg-white rounded-full flex items-center justify-center shadow-sm">
                <div className="w-1.5 h-1.5 bg-fuchsia-500 rounded-full animate-pulse"></div>
            </div>
        </div>
        <div className="flex flex-col justify-center">
            <h1 className="text-xl font-bold text-slate-800 tracking-tight leading-none flex items-center gap-1">
                V.Doc <span className="text-purple-600">C-PEP</span>
            </h1>
            <span className="text-[9px] font-bold text-purple-400 uppercase tracking-widest mt-0.5">
                Colorectal Recurrence Prediction AI
            </span>
        </div>
      </div>
    );
  }
};

const App: React.FC = () => {
  const [department, setDepartment] = useState<Department>('PEDIATRICS');
  // Initialize agents based on the default department
  const [agents, setAgents] = useState<Agent<any>[]>(INITIAL_AGENTS_PEDIATRICS);
  const [selectedAgentId, setSelectedAgentId] = useState<string | 'knowledge-base' | null>(INITIAL_AGENTS_PEDIATRICS.length > 0 ? INITIAL_AGENTS_PEDIATRICS[0].id : 'knowledge-base');
  const [templates, setTemplates] = useState<AgentTemplate[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [knowledgeSources, setKnowledgeSources] = useState<KnowledgeSource[]>(INITIAL_KNOWLEDGE_SOURCES);
  const [alerts, setAlerts] = useState<Alert[]>([]);

  // Patient Management
  const availablePatients = useMemo(() => MOCK_PATIENTS.filter(p => p.department === department), [department]);
  const [currentPatient, setCurrentPatient] = useState<Patient>(availablePatients[0]);

  // Ref for scrollable container
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const tabsContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  // Check scroll position for tabs
  const checkScroll = useCallback(() => {
    if (tabsContainerRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = tabsContainerRef.current;
        setShowLeftArrow(scrollLeft > 0);
        setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10); // buffer
    }
  }, []);

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [checkScroll, agents]);

  const scrollTabs = (direction: 'left' | 'right') => {
      if (tabsContainerRef.current) {
          const scrollAmount = 200;
          tabsContainerRef.current.scrollBy({
              left: direction === 'left' ? -scrollAmount : scrollAmount,
              behavior: 'smooth'
          });
          setTimeout(checkScroll, 300);
      }
  };


  // Handle Department Switch
  const handleDepartmentChange = useCallback((newDept: Department) => {
    setDepartment(newDept);
    
    // Switch default agent set based on department
    let newAgents: Agent<any>[] = [];
    if (newDept === 'SURGERY') {
        newAgents = INITIAL_AGENTS_PEP;
    } else if (newDept === 'COLORECTAL') {
        newAgents = INITIAL_AGENTS_COLORECTAL;
    } else {
        newAgents = INITIAL_AGENTS_PEDIATRICS;
    }
    
    setAgents(newAgents);
    // Select the first agent of the new set
    setSelectedAgentId(newAgents.length > 0 ? newAgents[0].id : 'knowledge-base');

    // Switch to first patient of new department
    const newPatients = MOCK_PATIENTS.filter(p => p.department === newDept);
    if (newPatients.length > 0) {
        setCurrentPatient(newPatients[0]);
    }
  }, []);

  useEffect(() => {
    try {
      const storedTemplates = localStorage.getItem(TEMPLATES_STORAGE_KEY);
      if (storedTemplates) {
        setTemplates(JSON.parse(storedTemplates));
      }
    } catch (error) {
      console.error("Failed to load templates from localStorage", error);
    }
  }, []);

  // Scroll to top when selected agent changes
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo(0, 0);
    }
  }, [selectedAgentId]);

  // Alert Simulation Logic
  useEffect(() => {
    if (!currentPatient) return;

    const intervalId = setInterval(() => {
        if (Math.random() > 0.3) return;

        const newAlerts: Alert[] = [];
        const timestamp = Date.now();

        // 1. Vital Signs Monitoring Simulation
        const vitalAgent = agents.find(a => a.type === AgentType.MONITORING_VITAL_SIGNS && a.enabled);
        if (vitalAgent) {
            const config = vitalAgent.config as MonitoringConfig;
            // Check if notification system is enabled for this agent
            if (config.notificationPreferences?.enabled) {
                if (config.parameters.spo2) {
                    const simulatedSpO2 = Math.floor(Math.random() * (99 - 85 + 1)) + 85;
                    if (simulatedSpO2 < config.spo2Threshold) {
                        newAlerts.push({
                            id: `alert-${timestamp}-spo2`,
                            timestamp,
                            severity: simulatedSpO2 < 88 ? 'critical' : 'warning',
                            message: `SpO2 저하 감지: ${simulatedSpO2}% (임계값: ${config.spo2Threshold}%)`,
                            agentName: vitalAgent.name,
                            patientId: currentPatient.id,
                            patientName: currentPatient.name,
                            isRead: false,
                        });
                    }
                }
            }
        }

        // 2. Ventilator Monitoring Simulation
        const ventAgent = agents.find(a => a.type === AgentType.MONITORING_VENTILATOR && a.enabled);
        if (ventAgent && department === 'PEDIATRICS') {
             const config = ventAgent.config as VentilatorConfig;
             // Check if notification system is enabled for this agent
             if (config.notificationPreferences?.enabled) {
                 if (config.parameters.peakInspiratoryPressure && Math.random() < 0.2) {
                     const simulatedPIP = Math.floor(Math.random() * (40 - 20 + 1)) + 20;
                     if (simulatedPIP > config.pipThreshold) {
                          newAlerts.push({
                            id: `alert-${timestamp}-pip`,
                            timestamp,
                            severity: 'critical',
                            message: `기도압(PIP) 상승 경고: ${simulatedPIP} cmH2O`,
                            agentName: ventAgent.name,
                            patientId: currentPatient.id,
                            patientName: currentPatient.name,
                            isRead: false,
                        });
                     }
                 }
             }
        }

        // 3. Surgery Specific
        if (department === 'SURGERY' && Math.random() < 0.15) {
             const erasAgent = agents.find(a => a.type === AgentType.CONVERSATIONAL_CHATBOT && a.enabled);
             if (erasAgent) {
                  newAlerts.push({
                        id: `alert-${timestamp}-pain`,
                        timestamp,
                        severity: 'warning',
                        message: `환자 통증 호소 빈도 증가 (최근 1시간 내 3회)`,
                        agentName: '수술 후 회복 가이드',
                        patientId: currentPatient.id,
                        patientName: currentPatient.name,
                        isRead: false,
                    });
             }
        }

        // 4. Colorectal Specific
        if (department === 'COLORECTAL' && Math.random() < 0.1) {
            newAlerts.push({
                id: `alert-${timestamp}-risk`,
                timestamp,
                severity: 'warning',
                message: `재발 위험 예측 스코어 변동 감지 (상승 추세)`,
                agentName: 'AI 재발 예측 분석',
                patientId: currentPatient.id,
                patientName: currentPatient.name,
                isRead: false,
            });
        }

        if (newAlerts.length > 0) {
            setAlerts(prev => [...newAlerts, ...prev]);
        }

    }, 8000);

    return () => clearInterval(intervalId);
  }, [currentPatient, agents, department]);

  const handleMarkAsRead = useCallback((alertId: string) => {
      setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, isRead: true } : a));
  }, []);

  const handleClearAlerts = useCallback(() => {
      setAlerts([]);
  }, []);
  
  const handleConfigChange = useCallback((agentId: string, newConfig: AgentConfig, newEnabledState?: boolean) => {
    setAgents(prevAgents =>
      prevAgents.map(agent => {
        if (agent.id === agentId) {
          const updatedAgent = { ...agent, config: newConfig };
          if (typeof newEnabledState === 'boolean') {
            updatedAgent.enabled = newEnabledState;
          }
          return updatedAgent;
        }
        return agent;
      })
    );
  }, [setAgents]);

  const handleSaveTemplate = useCallback((name: string, agentType: AgentType, config: AgentConfig) => {
    const newTemplate: AgentTemplate = {
      id: `template-${Date.now()}`,
      name,
      agentType,
      config,
    };
    setTemplates(prevTemplates => {
      const updatedTemplates = [...prevTemplates, newTemplate];
      try {
        localStorage.setItem(TEMPLATES_STORAGE_KEY, JSON.stringify(updatedTemplates));
      } catch (error) {
        console.error("Failed to save templates to localStorage", error);
      }
      return updatedTemplates;
    });
  }, [setTemplates]);

  const handleDeleteTemplate = useCallback((templateId: string) => {
    setTemplates(prevTemplates => {
      const updatedTemplates = prevTemplates.filter(t => t.id !== templateId);
       try {
        localStorage.setItem(TEMPLATES_STORAGE_KEY, JSON.stringify(updatedTemplates));
      } catch (error) {
        console.error("Failed to save templates to localStorage", error);
      }
      return updatedTemplates;
    });
  }, [setTemplates]);

  const handleCreateAgent = useCallback((name: string, description: string, type: AgentType) => {
    const details = AGENT_TYPE_DETAILS[type];
    if (!details) return;

    const newAgent: Agent<any> = {
      id: `agent-${Date.now()}`,
      name,
      description,
      type,
      category: details.category,
      icon: details.icon,
      config: details.defaultConfig,
      enabled: true,
    };

    setAgents(prev => [...prev, newAgent]);
    setSelectedAgentId(newAgent.id);
    setIsCreateModalOpen(false);
  }, [setAgents, setIsCreateModalOpen]);

  const handleUpdateKnowledgeSources = useCallback((newSources: KnowledgeSource[]) => {
    setKnowledgeSources(newSources);
  }, [setKnowledgeSources]);


  const selectedAgent = agents.find(agent => agent.id === selectedAgentId);

  return (
    <>
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
            display: none;
        }
        .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
      `}</style>
      <div className="flex h-screen bg-slate-50 font-sans text-slate-900">
        {/* Left Sidebar: Patient List */}
        <Sidebar
          department={department}
          onDepartmentChange={handleDepartmentChange}
          patients={availablePatients}
          selectedPatientId={currentPatient?.id || ''}
          onSelectPatient={setCurrentPatient}
        />

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col overflow-hidden relative">
          
          {/* Top Header */}
          <header className="bg-white shadow-sm border-b border-gray-200 px-5 py-3 flex justify-between items-center h-16 shrink-0 z-20">
                <div className="flex items-center">
                    <BrandLogo department={department} />
                </div>
                <div className="flex items-center space-x-4">
                    <AlertCenter 
                        alerts={alerts} 
                        onMarkAsRead={handleMarkAsRead} 
                        onClearAll={handleClearAlerts}
                    />
                </div>
          </header>

          {/* Active Patient Details Context */}
          <div className="bg-white border-b border-gray-200 shadow-sm z-10 shrink-0">
             <PatientContext 
                department={department} 
                patient={currentPatient}
            />
          </div>

          {/* Agent Navigation Tabs */}
          <div className="bg-gray-50 border-b border-gray-200 pt-3 shrink-0 relative group">
             {/* Left Scroll Button */}
             {showLeftArrow && (
                 <button 
                    onClick={() => scrollTabs('left')}
                    className="absolute left-0 top-3 bottom-0 w-8 bg-gradient-to-r from-gray-50 to-transparent z-10 flex items-center justify-center text-gray-400 hover:text-gray-600"
                 >
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 bg-white/80 rounded-full shadow-sm" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                     </svg>
                 </button>
             )}

            <div 
                ref={tabsContainerRef}
                onScroll={checkScroll}
                className="flex items-center space-x-1 overflow-x-auto scrollbar-hide px-6 relative"
            >
                 {/* Agent Tabs */}
                 {agents.map(agent => (
                     <button
                        key={agent.id}
                        onClick={() => setSelectedAgentId(agent.id)}
                        className={`
                            flex items-center px-4 py-2.5 text-sm font-medium border-t border-l border-r rounded-t-lg whitespace-nowrap transition-all
                            ${selectedAgentId === agent.id 
                                ? 'border-gray-200 bg-white text-blue-600 shadow-[0_-2px_4px_rgba(0,0,0,0.02)] translate-y-[1px] z-10' 
                                : 'border-transparent bg-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                            }
                        `}
                     >
                        <agent.icon className={`h-4 w-4 mr-2 ${selectedAgentId === agent.id ? 'text-blue-500' : 'text-gray-400'}`} />
                        {agent.name}
                        {/* Status Indicator (Dot) */}
                        <span className={`ml-2 w-2.5 h-2.5 rounded-full ${agent.enabled ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                     </button>
                 ))}

                 {/* New Agent Button */}
                 <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="ml-1 p-1.5 rounded text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors shrink-0"
                    title="새 에이전트 추가"
                 >
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                     </svg>
                 </button>

                 <div className="flex-1 min-w-[20px]"></div>

                 {/* Knowledge DB Tab */}
                 <button
                    onClick={() => setSelectedAgentId('knowledge-base')}
                    className={`
                        flex items-center px-4 py-2.5 text-sm font-medium border-t border-l border-r rounded-t-lg whitespace-nowrap transition-all ml-4 shrink-0
                        ${selectedAgentId === 'knowledge-base' 
                             ? 'border-gray-200 bg-white text-indigo-600 shadow-[0_-2px_4px_rgba(0,0,0,0.02)] translate-y-[1px] z-10' 
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                        }
                    `}
                 >
                    <BookOpenIcon className={`h-4 w-4 mr-2 ${selectedAgentId === 'knowledge-base' ? 'text-indigo-500' : 'text-gray-400'}`} />
                    Knowledge DB
                 </button>
            </div>

            {/* Right Scroll Button */}
             {showRightArrow && (
                 <button 
                    onClick={() => scrollTabs('right')}
                    className="absolute right-0 top-3 bottom-0 w-8 bg-gradient-to-l from-gray-50 to-transparent z-10 flex items-center justify-center text-gray-400 hover:text-gray-600"
                 >
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 bg-white/80 rounded-full shadow-sm" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                     </svg>
                 </button>
             )}
          </div>

          {/* Main Config/Content Area */}
          <div 
            ref={scrollContainerRef}
            className="flex-1 p-6 overflow-y-auto bg-slate-50"
          >
            <div className="max-w-6xl mx-auto">
                {selectedAgentId === 'knowledge-base' ? (
                    <KnowledgeBasePanel 
                        knowledgeSources={knowledgeSources}
                        onUpdateKnowledgeSources={handleUpdateKnowledgeSources}
                    />
                ) : selectedAgent ? (
                    <AgentConfigPanel
                    key={selectedAgent.id}
                    agent={selectedAgent}
                    onConfigChange={handleConfigChange}
                    templates={templates}
                    onSaveTemplate={handleSaveTemplate}
                    onDeleteTemplate={handleDeleteTemplate}
                    allKnowledgeSources={knowledgeSources}
                    currentPatient={currentPatient}
                    />
                ) : (
                <div className="flex items-center justify-center h-full">
                    <p className="text-gray-500 text-sm">에이전트를 선택해주세요.</p>
                </div>
                )}
            </div>
          </div>
        </main>
      </div>
      
      <CreateAgentModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateAgent={handleCreateAgent}
      />
    </>
  );
};

export default App;
