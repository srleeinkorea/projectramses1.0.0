
import React from 'react';
import { Department, Patient } from '../types';

interface PatientContextProps {
    department: Department;
    patient: Patient;
}

// Icons
const MaleIcon: React.FC<{ className?: string }> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
  </svg>
);

const FemaleIcon: React.FC<{ className?: string }> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.5 20.25a7.5 7.5 0 0 1 15 0A18.75 18.75 0 0 1 12 22.5c-2.793 0-5.49-.606-7.5-1.75Z" />
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

const PatientContext: React.FC<PatientContextProps> = ({ department, patient }) => {
  if (!patient) return <div className="p-6 text-base text-gray-500">환자를 선택해주세요.</div>;

  const isMale = patient.gender === '남';
  const isSurgery = department === 'SURGERY';
  const isColorectal = department === 'COLORECTAL';

  const renderComplicationScore = (p: Patient) => {
    if ((p.department !== 'SURGERY' && p.department !== 'COLORECTAL')) return null;
    
    // Determine which risk data to use
    const riskData = p.department === 'COLORECTAL' ? p.recurrenceRisk : p.complicationRisk;
    if (!riskData) return null;

    const { score, level, label } = riskData;
    const title = p.department === 'COLORECTAL' ? '재발 위험도' : '합병증 위험';
    const icon = p.department === 'COLORECTAL' ? <ArrowPathIcon className="h-4 w-4" /> : <ExclamationTriangleIcon className="h-4 w-4" />;

    // Determine color based on risk level
    let badgeClass = 'bg-green-100 text-green-800';
    
    if (p.department === 'COLORECTAL') {
         if (level === 'Moderate') badgeClass = 'bg-purple-100 text-purple-800';
         else if (level === 'High' || level === 'Critical') badgeClass = 'bg-fuchsia-100 text-fuchsia-800';
         else badgeClass = 'bg-indigo-50 text-indigo-800';
    } else {
         if (level === 'Moderate') badgeClass = 'bg-yellow-100 text-yellow-800';
         else if (level === 'High' || level === 'Critical') badgeClass = 'bg-red-100 text-red-800';
    }

    return (
        <div className={`flex items-center px-4 py-2 rounded-full border border-opacity-10 ${badgeClass} border-current ml-6`}>
            {icon}
            <span className="ml-2 text-xs font-bold mr-3">{title}</span>
            <span className="text-xl font-extrabold">{score}</span>
            <span className="mx-2 opacity-50 text-sm">|</span>
            <span className="text-sm font-semibold">{label}</span>
        </div>
    );
  };

  return (
    <div className="flex items-center justify-between px-6 py-4 w-full bg-white">
      <div className="flex items-center min-w-0">
         <div className={`flex items-center justify-center h-12 w-12 rounded-full flex-shrink-0 bg-gray-100 text-gray-400 mr-4`}>
             {isMale ? <MaleIcon className="h-7 w-7 text-blue-500" /> : <FemaleIcon className="h-7 w-7 text-pink-500" />}
         </div>
         <div className="flex flex-col">
            <div className="flex items-center gap-3">
                <h2 className="text-2xl font-bold text-gray-900 leading-none">{patient.name}</h2>
                <span className="text-sm text-gray-500 font-medium">({patient.gender}/{patient.age}세)</span>
                {isSurgery && <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 text-xs font-bold rounded border border-indigo-100">G-PEP</span>}
                {isColorectal && <span className="px-2 py-0.5 bg-purple-50 text-purple-700 text-xs font-bold rounded border border-purple-100">C-PEP</span>}
            </div>
            <div className="flex items-center gap-2 mt-1.5">
                <span className="text-sm font-semibold text-gray-700 truncate max-w-[240px]" title={patient.diagnosis}>{patient.diagnosis}</span>
                <span className="text-xs text-gray-300">|</span>
                <span className="text-sm text-gray-500 truncate max-w-[350px]" title={patient.status}>{patient.status}</span>
            </div>
         </div>
      </div>
      
      {/* Complication or Recurrence Score - Right aligned */}
      <div className="flex-shrink-0">
           {renderComplicationScore(patient)}
      </div>
    </div>
  );
};

export default PatientContext;
