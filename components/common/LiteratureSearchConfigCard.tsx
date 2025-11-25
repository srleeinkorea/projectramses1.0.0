import React from 'react';
import { MedicalLiteratureSearchConfig } from '../../types';
import Card from './Card';
import ToggleSwitch from './ToggleSwitch';
import Select from './Select';

interface LiteratureSearchConfigCardProps {
  config: MedicalLiteratureSearchConfig;
  onConfigChange: (newConfig: MedicalLiteratureSearchConfig) => void;
}

const DATABASE_LABELS: Record<keyof MedicalLiteratureSearchConfig['databases'], string> = {
  pubmed: 'PubMed',
  medline: 'MEDLINE',
  cochrane: 'Cochrane Library',
};

const LiteratureSearchConfigCard: React.FC<LiteratureSearchConfigCardProps> = ({ config, onConfigChange }) => {
  
  const handleEnabledChange = (enabled: boolean) => {
    onConfigChange({ ...config, enabled });
  };

  const handleDatabaseChange = (db: keyof MedicalLiteratureSearchConfig['databases']) => {
    onConfigChange({
      ...config,
      databases: {
        ...config.databases,
        [db]: !config.databases[db],
      },
    });
  };

  const handleSelectChange = (field: 'searchScope' | 'recency', value: string) => {
    onConfigChange({ ...config, [field]: value });
  };
  
  return (
    <Card title="의학 문헌 실시간 검색" description="에이전트가 최신 의학 연구 및 논문을 실시간으로 검색하여 답변과 분석의 깊이를 더하도록 설정합니다.">
        <div className="space-y-4 mt-4">
            <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">실시간 검색 활성화</label>
                <ToggleSwitch enabled={config.enabled} setEnabled={handleEnabledChange} />
            </div>

            {config.enabled && (
                <div className="space-y-6 pt-4 border-t">
                    <div>
                        <h4 className="text-sm font-medium text-gray-700">검색 대상 데이터베이스</h4>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-2">
                            {(Object.keys(DATABASE_LABELS) as (keyof typeof DATABASE_LABELS)[]).map(db => (
                                <div key={db} className="flex items-center">
                                    <input
                                        id={`db-${db}`}
                                        type="checkbox"
                                        checked={config.databases[db]}
                                        onChange={() => handleDatabaseChange(db)}
                                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                    <label htmlFor={`db-${db}`} className="ml-3 block text-sm font-medium text-gray-700">
                                        {DATABASE_LABELS[db]}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <Select
                            label="검색 범위"
                            value={config.searchScope}
                            onChange={(v) => handleSelectChange('searchScope', v as 'abstracts' | 'full_text')}
                            options={[
                                { value: 'abstracts', label: '초록만 검색' },
                                { value: 'full_text', label: '전체 텍스트 검색' },
                            ]}
                        />
                         <Select
                            label="결과 최신성 필터"
                            value={config.recency}
                            onChange={(v) => handleSelectChange('recency', v as '1y' | '5y' | 'all')}
                            options={[
                                { value: '1y', label: '최근 1년' },
                                { value: '5y', label: '최근 5년' },
                                { value: 'all', label: '전체 기간' },
                            ]}
                        />
                    </div>
                </div>
            )}
             <div className="mt-4 flex items-start p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-500 flex-shrink-0 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <p className="text-xs text-yellow-800">
                    <strong>주의:</strong> 검색 결과는 AI에 의해 요약되며, 임상적 결정은 반드시 의료 전문가의 최종 검토를 거쳐야 합니다. 외부 데이터베이스의 가용성에 따라 성능이 달라질 수 있습니다.
                </p>
            </div>
        </div>
    </Card>
  );
};

export default LiteratureSearchConfigCard;
