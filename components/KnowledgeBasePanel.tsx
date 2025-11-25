import React, { useState } from 'react';
import { KnowledgeSource, KnowledgeSourceType } from '../types';
import Card from './common/Card';
import Select from './common/Select';
import ToggleSwitch from './common/ToggleSwitch';

interface KnowledgeBasePanelProps {
  knowledgeSources: KnowledgeSource[];
  onUpdateKnowledgeSources: (newSources: KnowledgeSource[]) => void;
}

const KNOWLEDGE_SOURCE_TYPE_OPTIONS = Object.entries(KnowledgeSourceType).map(([_, value]) => ({ value, label: value }));

const TYPE_COLORS: Record<string, string> = {
    [KnowledgeSourceType.PROTOCOL]: 'bg-blue-100 text-blue-800',
    [KnowledgeSourceType.GUIDELINE]: 'bg-green-100 text-green-800',
    [KnowledgeSourceType.RECOMMENDATION]: 'bg-yellow-100 text-yellow-800',
    [KnowledgeSourceType.TEXTBOOK]: 'bg-indigo-100 text-indigo-800',
    [KnowledgeSourceType.PRO]: 'bg-purple-100 text-purple-800',
    [KnowledgeSourceType.CUSTOM]: 'bg-gray-200 text-gray-800',
};

const LinkIcon: React.FC<{ className?: string }> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
    </svg>
);

const KnowledgeBasePanel: React.FC<KnowledgeBasePanelProps> = ({ knowledgeSources, onUpdateKnowledgeSources }) => {
  const [isAddingSource, setIsAddingSource] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [newSource, setNewSource] = useState<Omit<KnowledgeSource, 'id' | 'enabled' | 'isDeletable'>>({
      name: '',
      type: KnowledgeSourceType.GUIDELINE,
      description: '',
      url: '',
  });
  const [customTypeName, setCustomTypeName] = useState('');

  const handleToggleSource = (sourceId: string) => {
    const newKnowledgeBase = knowledgeSources.map(source =>
      source.id === sourceId ? { ...source, enabled: !source.enabled } : source
    );
    onUpdateKnowledgeSources(newKnowledgeBase);
  };
  
  const handleAddSource = () => {
    const isCustom = newSource.type === KnowledgeSourceType.CUSTOM;
    if (newSource.name.trim() && (!isCustom || (isCustom && customTypeName.trim()))) {
      const sourceToAdd: KnowledgeSource = {
        id: `kb-${Date.now()}`,
        name: newSource.name.trim(),
        description: newSource.description?.trim(),
        url: newSource.url?.trim(),
        type: isCustom ? customTypeName.trim() : newSource.type,
        enabled: true,
        isDeletable: true,
      };
      onUpdateKnowledgeSources([...knowledgeSources, sourceToAdd]);
      setNewSource({ name: '', type: KnowledgeSourceType.GUIDELINE, description: '', url: '' });
      setCustomTypeName('');
      setIsAddingSource(false);
    }
  };

  const handleRemoveSource = (sourceId: string) => {
    const newKnowledgeBase = knowledgeSources.filter(source => source.id !== sourceId);
    onUpdateKnowledgeSources(newKnowledgeBase);
  };

  const filteredKnowledgeSources = knowledgeSources.filter(source => {
    const lowercasedTerm = searchTerm.toLowerCase();
    return (
      source.name.toLowerCase().includes(lowercasedTerm) ||
      source.type.toLowerCase().includes(lowercasedTerm) ||
      (source.description && source.description.toLowerCase().includes(lowercasedTerm))
    );
  });

  return (
    <Card title="전체 Knowledge DB 관리" description="모든 AI 에이전트가 참조할 수 있는 공통 지식 소스(Knowledge Source)를 관리합니다.">
        <div className="relative mt-4">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="이름, 유형, 설명으로 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full rounded-md border-gray-300 pl-10 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>
        <div className="space-y-2 mt-4">
        {filteredKnowledgeSources.length > 0 ? (
          filteredKnowledgeSources.map(source => {
              const typeColor = TYPE_COLORS[source.type as KnowledgeSourceType] || TYPE_COLORS[KnowledgeSourceType.CUSTOM];
              return (
              <div key={source.id} className="flex items-start justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex-1 pr-4">
                      <div className="flex items-center gap-x-2">
                          <span className="text-sm font-medium text-gray-800">{source.name}</span>
                          {source.url && (
                            <a href={source.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700" aria-label="Open source link">
                                <LinkIcon className="h-4 w-4" />
                            </a>
                          )}
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${typeColor}`}>
                              {source.type}
                          </span>
                      </div>
                      {source.description && <p className="text-xs text-gray-500 mt-1">{source.description}</p>}
                  </div>
                  <div className="flex items-center space-x-3 flex-shrink-0">
                  <ToggleSwitch enabled={source.enabled} setEnabled={() => handleToggleSource(source.id)} />
                  {source.isDeletable && (
                      <button 
                      onClick={() => handleRemoveSource(source.id)} 
                      className="text-gray-400 hover:text-red-600 p-1"
                      aria-label={`'${source.name}' 소스 삭제`}
                      >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      </button>
                  )}
                  </div>
              </div>
              )
          })
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">
              {searchTerm
                ? `'${searchTerm}'와(과) 일치하는 지식 소스가 없습니다.`
                : "표시할 지식 소스가 없습니다."}
            </p>
          </div>
        )}
        </div>
        
        {!isAddingSource && (
            <button onClick={() => setIsAddingSource(true)} className="mt-4 text-sm font-semibold text-blue-600 hover:text-blue-800">
            + 새 지식 소스 추가
        </button>
        )}

        {isAddingSource && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg border space-y-4">
            <Select
                label="소스 유형"
                value={newSource.type}
                onChange={(v) => setNewSource(s => ({...s, type: v}))}
                options={KNOWLEDGE_SOURCE_TYPE_OPTIONS}
            />
            {newSource.type === KnowledgeSourceType.CUSTOM && (
                <div>
                <label htmlFor="customTypeName" className="block text-sm font-medium text-gray-700">사용자 정의 유형 이름</label>
                <input
                    type="text"
                    id="customTypeName"
                    value={customTypeName}
                    onChange={(e) => setCustomTypeName(e.target.value)}
                    placeholder="예: 내부 위키, 학회 발표 자료"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
                </div>
            )}
            <div>
                <label className="block text-sm font-medium text-gray-700">이름 / 제목</label>
                <input
                    type="text"
                    value={newSource.name}
                    onChange={(e) => setNewSource(s => ({ ...s, name: e.target.value }))}
                    placeholder="예: 소아 기도 관리 최신 지침"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
            </div>
                <div>
                <label className="block text-sm font-medium text-gray-700">설명 / 출처 (선택 사항)</label>
                <input
                    type="text"
                    value={newSource.description || ''}
                    onChange={(e) => setNewSource(s => ({ ...s, description: e.target.value }))}
                    placeholder="예: 대한소아중환자의학회, 2024년"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
            </div>
             <div>
                <label htmlFor="sourceUrl" className="block text-sm font-medium text-gray-700">소스 URL / 참조 링크 (선택 사항)</label>
                <div className="relative mt-1">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <LinkIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </div>
                  <input
                    type="url"
                    id="sourceUrl"
                    value={newSource.url || ''}
                    onChange={(e) => setNewSource(s => ({ ...s, url: e.target.value }))}
                    placeholder="예: https://www.kspccm.org/guidelines"
                    className="block w-full rounded-md border-gray-300 pl-10 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
            </div>
            <div className="flex justify-end space-x-2">
                <button onClick={() => {
                    setIsAddingSource(false);
                    setCustomTypeName('');
                }} className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-300 rounded-lg shadow-sm">
                    취소
                </button>
                <button onClick={handleAddSource} disabled={!newSource.name.trim() || (newSource.type === KnowledgeSourceType.CUSTOM && !customTypeName.trim())} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg disabled:bg-gray-400">
                    저장
                </button>
            </div>
        </div>
        )}
    </Card>
  );
};

export default KnowledgeBasePanel;