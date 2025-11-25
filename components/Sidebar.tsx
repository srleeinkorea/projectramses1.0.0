
import React, { useState, useMemo } from 'react';
import { Department, Patient } from '../types';

interface SidebarProps {
  department: Department;
  onDepartmentChange: (dept: Department) => void;
  patients: Patient[];
  selectedPatientId: string;
  onSelectPatient: (patient: Patient) => void;
}

const SearchIcon: React.FC<{ className?: string }> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
  </svg>
);

const ExclamationTriangleIcon: React.FC<{ className?: string }> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
  </svg>
);

const ArrowPathIcon: React.FC<{ className?: string }> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
    </svg>
);

const Sidebar: React.FC<SidebarProps> = ({ 
  department, 
  onDepartmentChange, 
  patients, 
  selectedPatientId, 
  onSelectPatient 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'severity' | 'age'>('severity');

  const filteredPatients = useMemo(() => {
    let result = patients.filter(p => 
        p.name.includes(searchTerm) || 
        p.diagnosis.includes(searchTerm) ||
        p.id.includes(searchTerm)
    );

    return result.sort((a, b) => {
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        if (sortBy === 'age') return a.age - b.age;
        if (sortBy === 'severity') {
             const scoreA = (a.complicationRisk?.score || a.recurrenceRisk?.score || 0);
             const scoreB = (b.complicationRisk?.score || b.recurrenceRisk?.score || 0);
             return scoreB - scoreA; 
        }
        return 0;
    });
  }, [patients, searchTerm, sortBy]);

  const renderRiskBadge = (p: Patient) => {
    if ((p.department !== 'SURGERY' && p.department !== 'COLORECTAL')) return null;
    
    const riskData = p.department === 'COLORECTAL' ? p.recurrenceRisk : p.complicationRisk;
    if (!riskData) return null;

    const { score, level } = riskData;
    const icon = p.department === 'COLORECTAL' ? <ArrowPathIcon className="h-3 w-3" /> : <ExclamationTriangleIcon className="h-3 w-3" />;

    let colorClass = 'bg-green-100 text-green-700';
    if (p.department === 'COLORECTAL') {
         if (level === 'Moderate') colorClass = 'bg-purple-100 text-purple-700';
         else if (level === 'High' || level === 'Critical') colorClass = 'bg-fuchsia-100 text-fuchsia-700';
         else colorClass = 'bg-indigo-50 text-indigo-700';
    } else {
         if (level === 'Moderate') colorClass = 'bg-yellow-100 text-yellow-700';
         else if (level === 'High' || level === 'Critical') colorClass = 'bg-red-100 text-red-700';
    }

    return (
        <div className={`flex items-center space-x-1 px-1.5 py-0.5 rounded text-[10px] font-bold ${colorClass}`}>
            <span>{icon}</span>
            <span>{score}</span>
        </div>
    );
  };

  return (
    <aside className="w-72 bg-white border-r border-gray-200 flex flex-col h-full z-20 shadow-xl shadow-gray-200/50 shrink-0">
      <div className="p-3 border-b border-gray-100 space-y-2.5 bg-gray-50/50">
        <div>
            <div className="relative">
                <select
                    id="dept-select"
                    value={department}
                    onChange={(e) => onDepartmentChange(e.target.value as Department)}
                    className="block w-full pl-3 pr-8 py-1.5 border-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm font-bold rounded-md bg-white text-gray-800 cursor-pointer shadow-sm transition-colors"
                >
                    <option value="PEDIATRICS">소아청소년과</option>
                    <option value="SURGERY">외과 (G-PEP)</option>
                    <option value="COLORECTAL">대장항문외과 (C-PEP)</option>
                </select>
            </div>
        </div>
        
        {/* Search & Sort */}
        <div className="space-y-2">
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                    <SearchIcon className="h-3.5 w-3.5 text-gray-400" />
                </div>
                <input
                    type="text"
                    placeholder="이름, 진단명 검색..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="block w-full pl-8 pr-3 py-1.5 border border-gray-200 rounded-md leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-xs"
                />
            </div>
            <div className="flex space-x-1">
                 <button onClick={() => setSortBy('severity')} className={`flex-1 py-1 rounded text-[10px] font-medium border transition-colors ${sortBy === 'severity' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'}`}>
                    위험도순
                 </button>
                 <button onClick={() => setSortBy('name')} className={`flex-1 py-1 rounded text-[10px] font-medium border transition-colors ${sortBy === 'name' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'}`}>
                    이름순
                 </button>
                 <button onClick={() => setSortBy('age')} className={`flex-1 py-1 rounded text-[10px] font-medium border transition-colors ${sortBy === 'age' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'}`}>
                    나이순
                 </button>
            </div>
        </div>
        
        <div className="flex justify-between items-center text-[10px] text-gray-400 px-1 pt-1">
            <span>환자 목록</span>
            <span className="font-semibold">{filteredPatients.length}명</span>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto">
        <ul className="divide-y divide-gray-100">
            {filteredPatients.map((patient) => (
            <li key={patient.id}>
                <button
                    onClick={() => onSelectPatient(patient)}
                    className={`w-full text-left px-3 py-3 hover:bg-gray-50 transition-all duration-200 flex flex-col space-y-0.5 relative border-l-[3px] ${
                        selectedPatientId === patient.id 
                        ? 'bg-blue-50/40 border-blue-500' 
                        : 'border-transparent'
                    }`}
                >
                    <div className="flex justify-between items-start w-full mb-0.5">
                        <div className="flex items-center space-x-1.5">
                            <span className={`text-sm font-bold ${selectedPatientId === patient.id ? 'text-blue-700' : 'text-gray-800'}`}>
                                {patient.name}
                            </span>
                            <span className="text-xs text-gray-500">({patient.gender}/{patient.age})</span>
                        </div>
                        {renderRiskBadge(patient)}
                    </div>
                    <p className="text-xs text-gray-600 line-clamp-1">{patient.diagnosis}</p>
                    <p className="text-[10px] text-gray-400 line-clamp-1">{patient.status}</p>
                </button>
            </li>
            ))}
            {filteredPatients.length === 0 && (
                <li className="p-8 text-center text-gray-400 text-xs">
                    검색 결과가 없습니다.
                </li>
            )}
        </ul>
      </nav>
      
      <div className="p-2 border-t border-gray-200 bg-gray-50 text-center text-[10px] text-gray-400">
        <p className="font-medium text-gray-500">RAMSES AI Control</p>
      </div>
    </aside>
  );
};

export default Sidebar;
