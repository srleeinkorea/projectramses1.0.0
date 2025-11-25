
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
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
  </svg>
);

const ArrowPathIcon: React.FC<{ className?: string }> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
    </svg>
);

const PatientContext: React.FC<PatientContextProps> = ({ department, patient }) => {
  if (!patient) return <div className="p-4 text-sm text-gray-500">환자를 선택해주세요.</div>;

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
        <div className={`flex items-center px-3 py-1.5 rounded-full border border-opacity-10 ${badgeClass} border-current ml-auto md:ml-6`}>
            {icon}
            <span className="ml-2 text-xs font-bold mr-2">{title}</span>
            <span className="text-lg font-extrabold">{score}</span>
            <span className="mx-2 opacity-50 text-xs">|</span>
            <span className="text-xs font-semibold">{label}</span>
        </div>
    );
  };

  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between px-4 sm:px-6 py-3 w-full bg-white gap-3 md:gap-0">
      <div className="flex items-center min-w-0 w-full md:w-auto">
         <div className={`flex items-center justify-center h-10 w-10 rounded-full flex-shrink-0 bg-gray-100 text-gray-400 mr-3`}>
             {isMale ? <MaleIcon className="h-6 w-6 text-blue-500" /> : <FemaleIcon className="h-6 w-6 text-pink-500" />}
         </div>
         <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-gray-900 leading-none">{patient.name}</h2>
                <span className="text-xs text-gray-500 font-medium whitespace-nowrap">({patient.gender}/{patient.age}세)</span>
                {isSurgery && <span className="px-1.5 py-0.5 bg-indigo-50 text-indigo-700 text-[10px] font-bold rounded border border-indigo-100 whitespace-nowrap">G-PEP & REHAB</span>}
                {isColorectal && <span className="px-1.5 py-0.5 bg-purple-50 text-purple-700 text-[10px] font-bold rounded border border-purple-100 whitespace-nowrap">C-PEP & REHAB</span>}
            </div>
            <div className="flex items-center gap-2 mt-1 min-w-0">
                <span className="text-xs font-semibold text-gray-700 truncate max-w-[150px] sm:max-w-[240px]" title={patient.diagnosis}>{patient.diagnosis}</span>
                <span className="text-[10px] text-gray-300 flex-shrink-0">|</span>
                <span className="text-xs text-gray-500 truncate max-w-[180px] sm:max-w-[350px]" title={patient.status}>{patient.status}</span>
            </div>
         </div>
      </div>
      
      {/* Complication or Recurrence Score - Right aligned */}
      <div className="flex-shrink-0 w-full md:w-auto flex justify-end">
           {renderComplicationScore(patient)}
      </div>
    </div>
  );
};

export default PatientContext;
