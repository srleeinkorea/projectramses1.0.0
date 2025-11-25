

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
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
  </svg>
);

const ArrowPathIcon: React.FC<{ className?: string }> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
        <path fillRule="evenodd" d="M15.312 11.424a5.5 5.5 0 01-9.201 2.466l-.312-.311h2.433a.75.75 0 000-1.5H3.989a.75.75 0 00-.75.75v4.242a.75.75 0 001.5 0v-2.43l.31.31a7 7 0 0011.712-3.138.75.75 0 00-1.449-.39zm1.23-3.723a.75.75 0 00.219-.53V2.929a.75.75 0 00-1.5 0v2.433l-.31-.31a7 7 0 00-11.712 3.138.75.75 0 001.449.39 5.5 5.5 0 019.201-2.466l.312.312H11.75a.75.75 0 000 1.5h4.243a.75.75 0 00.548-.219z" clipRule="evenodd" />
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
    const icon = p.department === 'COLORECTAL' ? <ArrowPathIcon className="h-3.5 w-3.5" /> : <ExclamationTriangleIcon className="h-3.5 w-3.5" />;

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
        <div className={`flex items-center space-x-1 px-2 py-0.5 rounded text-xs font-bold ${colorClass}`}>
            <span>{icon}</span>
            <span>{score}</span>
        </div>
    );
  };

  return (
    <aside className="w-80 bg-white border-r border-gray-200 flex flex-col h-full z-20 shadow-xl shadow-gray-200/50">
      <div className="p-4 border-b border-gray-100 space-y-3 bg-gray-50/50">
        <div>
            <div className="relative">
                <select
                    id="dept-select"
                    value={department}
                    onChange={(e) => onDepartmentChange(e.target.value as Department)}
                    className="block w-full pl-3 pr-8 py-2 border-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm font-bold rounded-md bg-white text-gray-800 cursor-pointer shadow-sm transition-colors"
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
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <SearchIcon className="h-4 w-4 text-gray-400" />
                </div>
                <input
                    type="text"
                    placeholder="이름, 진단명 검색..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="block w-full pl-9 pr-3 py-2 border border-gray-200 rounded-md leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
            </div>
            <div className="flex space-x-1">
                 <button onClick={() => setSortBy('severity')} className={`flex-1 py-1.5 rounded text-xs font-medium border transition-colors ${sortBy === 'severity' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'}`}>
                    위험도순
                 </button>
                 <button onClick={() => setSortBy('name')} className={`flex-1 py-1.5 rounded text-xs font-medium border transition-colors ${sortBy === 'name' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'}`}>
                    이름순
                 </button>
                 <button onClick={() => setSortBy('age')} className={`flex-1 py-1.5 rounded text-xs font-medium border transition-colors ${sortBy === 'age' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'}`}>
                    나이순
                 </button>
            </div>
        </div>
        
        <div className="flex justify-between items-center text-xs text-gray-400 px-1 pt-1">
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
                    className={`w-full text-left px-4 py-4 hover:bg-gray-50 transition-all duration-200 flex flex-col space-y-1 relative border-l-[4px] ${
                        selectedPatientId === patient.id 
                        ? 'bg-blue-50/40 border-blue-500' 
                        : 'border-transparent'
                    }`}
                >
                    <div className="flex justify-between items-start w-full mb-0.5">
                        <div className="flex items-center space-x-2">
                            <span className={`text-base font-bold ${selectedPatientId === patient.id ? 'text-blue-700' : 'text-gray-800'}`}>
                                {patient.name}
                            </span>
                            <span className="text-sm text-gray-500">({patient.gender}/{patient.age})</span>
                        </div>
                        {renderRiskBadge(patient)}
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-1">{patient.diagnosis}</p>
                    <p className="text-xs text-gray-400 line-clamp-1">{patient.status}</p>
                </button>
            </li>
            ))}
            {filteredPatients.length === 0 && (
                <li className="p-8 text-center text-gray-400 text-sm">
                    검색 결과가 없습니다.
                </li>
            )}
        </ul>
      </nav>
      
      <div className="p-3 border-t border-gray-200 bg-gray-50 text-center text-xs text-gray-400">
        <p className="font-medium text-gray-500">RAMSES AI Control</p>
      </div>
    </aside>
  );
};

export default Sidebar;