
import React, { useState, useMemo, useRef } from 'react';
import { Agent, ReportingConfig, NotificationPreferences, Patient } from '../../types';
import Card from '../common/Card';
import NotificationConfigCard from '../common/NotificationConfigCard';

interface RecurrencePredictionConfigPanelProps {
  agent: Agent<ReportingConfig>;
  onConfigChange: (agentId: string, newConfig: ReportingConfig) => void;
  patient?: Patient;
}

const CLINICAL_FACTORS = [
  { id: 'tnm_staging', label: 'TNM Staging (8th Ed.)', active: true },
  { id: 'tumor_grade', label: 'Histologic Grade', active: true },
  { id: 'lvi', label: 'Lymphovascular Invasion (LVI)', active: true },
  { id: 'pni', label: 'Perineural Invasion (PNI)', active: true },
  { id: 'obstruction', label: 'Bowel Obstruction/Perforation', active: false },
  { id: 'margins', label: 'Resection Margins', active: true },
];

const BIOMARKERS = [
  { id: 'cea_trend', label: 'Serial CEA Trend', active: true },
  { id: 'msi_status', label: 'MSI / MMR Status', active: true },
  { id: 'kras_nras', label: 'KRAS / NRAS Mutation', active: true },
  { id: 'braf', label: 'BRAF V600E Mutation', active: false },
  { id: 'ct_dna', label: 'ctDNA (Liquid Biopsy)', active: false },
];

const RecurrencePredictionConfigPanel: React.FC<RecurrencePredictionConfigPanelProps> = ({ agent, onConfigChange, patient }) => {
  const { config } = agent;
  const [hoveredPoint, setHoveredPoint] = useState<{ x: number, y: number, month: number, prob: number } | null>(null);
  const chartRef = useRef<SVGSVGElement>(null);

  const riskScore = patient?.recurrenceRisk?.score ?? 50;

  // Generate dynamic curve data based on patient risk score
  const chartData = useMemo(() => {
    const points = [];
    const maxMonth = 60; // 5 Years
    
    // Logic: Higher score -> Higher max recurrence probability, faster rise
    // This is a simplified mathematical model for visualization
    const maxProb = Math.min(0.95, riskScore / 100 + 0.05); 
    const rate = 0.03 + (riskScore / 2000); // 0.03 to 0.08 approx

    for (let t = 0; t <= maxMonth; t++) {
        // P(t) = maxProb * (1 - e^(-rate * t))
        // This is a cumulative incidence like curve (probability of event happening)
        const prob = maxProb * (1 - Math.exp(-rate * t));
        points.push({ month: t, prob: prob * 100 });
    }
    return points;
  }, [riskScore]);

  // Convert data points to SVG path commands
  const getPathD = (data: { month: number, prob: number }[], width: number, height: number) => {
    const xScale = width / 60;
    const yScale = height / 100;

    let d = `M 0 ${height} `; // Start at bottom left (0,0 in math terms, but 0,height in SVG)
    
    data.forEach(p => {
        const x = p.month * xScale;
        const y = height - (p.prob * yScale);
        d += `L ${x} ${y} `;
    });

    return d;
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!chartRef.current) return;
    
    const svgRect = chartRef.current.getBoundingClientRect();
    const x = e.clientX - svgRect.left;
    const width = svgRect.width;
    const height = svgRect.height;
    
    const xScale = width / 60;
    const month = Math.min(60, Math.max(0, Math.round(x / xScale)));
    
    const dataPoint = chartData[month];
    if (dataPoint) {
         const yScale = height / 100;
         const exactX = month * xScale;
         const exactY = height - (dataPoint.prob * yScale);
         setHoveredPoint({ x: exactX, y: exactY, month: month, prob: dataPoint.prob });
    }
  };

  const handleNotificationChange = (newPreferences: NotificationPreferences) => {
     // Mock handler
  };

  return (
    <div className="space-y-6">
      {/* Model Status Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex flex-col items-center justify-center">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Model Accuracy (AUC)</span>
            <span className="text-2xl font-bold text-blue-600 mt-1">0.94</span>
            <span className="text-[10px] text-green-600 mt-1 flex items-center">
                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20"><path d="M12 7l-5 5 1.41 1.41L12 9.83l3.59 3.58L17 12"/></svg>
                Last validated: 24h ago
            </span>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex flex-col items-center justify-center">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Risk Stratification</span>
            <span className="text-2xl font-bold text-purple-600 mt-1">NCCN</span>
            <span className="text-[10px] text-gray-400 mt-1">Based on v3.2024 Guidelines</span>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex flex-col items-center justify-center">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Current Score</span>
            <span className={`text-2xl font-bold mt-1 ${riskScore > 80 ? 'text-red-600' : riskScore > 40 ? 'text-yellow-600' : 'text-green-600'}`}>
                {riskScore}
            </span>
            <span className="text-[10px] text-gray-400 mt-1">Patient Risk Index</span>
        </div>
      </div>

      <Card title="재발 예측 곡선 (Kaplan-Meier Simulation)" description={`현재 환자(${patient?.name || 'Unknown'})의 임상 데이터에 기반한 5년 재발 확률 시뮬레이션입니다.`}>
        <div className="h-72 w-full bg-white rounded-lg border border-gray-100 p-4 relative">
            <div className="absolute inset-0 p-6 pb-8 pl-8">
                {/* Y-axis Labels */}
                <div className="absolute left-0 top-6 bottom-8 flex flex-col justify-between text-[10px] text-gray-400 font-medium px-1">
                    <span>100%</span>
                    <span>75%</span>
                    <span>50%</span>
                    <span>25%</span>
                    <span>0%</span>
                </div>
                
                 {/* X-axis Labels */}
                <div className="absolute left-8 right-6 bottom-2 flex justify-between text-[10px] text-gray-400 font-medium">
                    <span>0</span>
                    <span>12</span>
                    <span>24</span>
                    <span>36</span>
                    <span>48</span>
                    <span>60 (Months)</span>
                </div>

                <svg 
                    ref={chartRef} 
                    className="w-full h-full overflow-visible cursor-crosshair" 
                    viewBox="0 0 600 250"
                    preserveAspectRatio="none"
                    onMouseMove={handleMouseMove}
                    onMouseLeave={() => setHoveredPoint(null)}
                >
                    {/* Grid Lines */}
                    {[0, 0.25, 0.5, 0.75, 1].map(t => (
                        <line key={t} x1="0" y1={250 * t} x2="600" y2={250 * t} stroke="#f3f4f6" strokeWidth="1" />
                    ))}
                    {[0, 0.2, 0.4, 0.6, 0.8, 1].map(t => (
                         <line key={t} x1={600 * t} y1="0" x2={600 * t} y2="250" stroke="#f3f4f6" strokeWidth="1" />
                    ))}
                    
                    {/* Baseline Curves for Reference (Static) */}
                    <path d="M0 250 Q 150 245 300 240 T 600 230" fill="none" stroke="#e5e7eb" strokeWidth="1" strokeDasharray="4 4" />
                    <text x="590" y="225" fontSize="10" fill="#9ca3af" textAnchor="end">Standard Low Risk</text>
                    
                    <path d="M0 250 Q 100 200 250 150 T 600 100" fill="none" stroke="#e5e7eb" strokeWidth="1" strokeDasharray="4 4" />
                    <text x="590" y="95" fontSize="10" fill="#9ca3af" textAnchor="end">Standard High Risk</text>

                    {/* Dynamic Patient Curve */}
                    <defs>
                        <linearGradient id="curveGradient" x1="0" x2="0" y1="0" y2="1">
                            <stop offset="0%" stopColor={riskScore > 60 ? "#ef4444" : "#22c55e"} stopOpacity="0.4" />
                            <stop offset="100%" stopColor={riskScore > 60 ? "#ef4444" : "#22c55e"} stopOpacity="0" />
                        </linearGradient>
                    </defs>
                    
                    {/* Area under curve */}
                    <path 
                        d={`${getPathD(chartData, 600, 250)} L 600 250 L 0 250 Z`} 
                        fill="url(#curveGradient)" 
                    />
                    
                    {/* Main Line */}
                    <path 
                        d={getPathD(chartData, 600, 250)} 
                        fill="none" 
                        stroke={riskScore > 60 ? "#ef4444" : "#22c55e"} 
                        strokeWidth="2.5" 
                        strokeLinecap="round"
                    />

                    {/* Interaction Elements */}
                    {hoveredPoint && (
                        <>
                            {/* Crosshair Vertical */}
                            <line 
                                x1={hoveredPoint.x} y1="0" 
                                x2={hoveredPoint.x} y2="250" 
                                stroke="#6b7280" strokeWidth="1" strokeDasharray="3 3" 
                            />
                            {/* Crosshair Horizontal */}
                            <line 
                                x1="0" y1={hoveredPoint.y} 
                                x2="600" y2={hoveredPoint.y} 
                                stroke="#6b7280" strokeWidth="1" strokeDasharray="3 3" 
                            />
                            {/* Point Dot */}
                            <circle cx={hoveredPoint.x} cy={hoveredPoint.y} r="4" fill="white" stroke="#374151" strokeWidth="2" />
                            
                            {/* Tooltip Background */}
                            <rect 
                                x={hoveredPoint.x > 300 ? hoveredPoint.x - 110 : hoveredPoint.x + 10} 
                                y={hoveredPoint.y < 50 ? hoveredPoint.y + 10 : hoveredPoint.y - 60} 
                                width="100" height="50" rx="4" fill="rgba(31, 41, 55, 0.9)" 
                            />
                            {/* Tooltip Text */}
                            <text 
                                x={hoveredPoint.x > 300 ? hoveredPoint.x - 60 : hoveredPoint.x + 60} 
                                y={hoveredPoint.y < 50 ? hoveredPoint.y + 30 : hoveredPoint.y - 40} 
                                fill="white" fontSize="10" textAnchor="middle" fontWeight="bold"
                            >
                                Month: {hoveredPoint.month}
                            </text>
                             <text 
                                x={hoveredPoint.x > 300 ? hoveredPoint.x - 60 : hoveredPoint.x + 60} 
                                y={hoveredPoint.y < 50 ? hoveredPoint.y + 45 : hoveredPoint.y - 25} 
                                fill="white" fontSize="10" textAnchor="middle"
                            >
                                Prob: {hoveredPoint.prob.toFixed(1)}%
                            </text>
                        </>
                    )}
                </svg>
            </div>
            <p className="absolute top-2 left-4 text-[10px] font-bold text-gray-500">Cumulative Recurrence Probability (%)</p>
        </div>
      </Card>

      <Card title="임상 위험 인자 (Clinical Risk Factors)" description="재발 예측 모델에 포함할 병리학적 및 임상적 변수를 설정합니다.">
        <div className="grid grid-cols-2 gap-4 mt-4">
            {CLINICAL_FACTORS.map(factor => (
                <div key={factor.id} className="flex items-center">
                    <input
                        id={factor.id}
                        type="checkbox"
                        defaultChecked={factor.active}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor={factor.id} className="ml-3 block text-sm font-medium text-gray-700">
                        {factor.label}
                    </label>
                </div>
            ))}
        </div>
      </Card>

      <Card title="바이오마커 및 유전자 분석" description="정밀 의료(Precision Medicine)를 위한 분자 생물학적 마커 연동을 설정합니다.">
        <div className="grid grid-cols-2 gap-4 mt-4">
            {BIOMARKERS.map(marker => (
                <div key={marker.id} className="flex items-center">
                    <input
                        id={marker.id}
                        type="checkbox"
                        defaultChecked={marker.active}
                        className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                    <label htmlFor={marker.id} className="ml-3 block text-sm font-medium text-gray-700">
                        {marker.label}
                    </label>
                </div>
            ))}
        </div>
         <div className="mt-4 p-3 bg-purple-50 rounded-lg border border-purple-100 flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
            <p className="text-xs text-purple-900">
                <strong>AI Insight:</strong> ctDNA 양성 반응 시 재발 위험도가 4.8배 상승하는 것으로 모델링되어 있습니다. 해당 데이터 연동 시 예측 정확도가 약 12% 향상됩니다.
            </p>
        </div>
      </Card>

      <Card title="위험도 알림 임계값 (Risk Thresholds)" description="의료진에게 알림을 발송할 재발 위험도 점수 기준을 설정합니다.">
          <div className="space-y-6 mt-4">
            <div>
                <div className="flex justify-between mb-1">
                    <label className="text-sm font-medium text-gray-700">고위험군 (High Risk) 경고 기준</label>
                    <span className="text-sm font-bold text-red-600">Score &gt; 80</span>
                </div>
                <input type="range" min="0" max="100" defaultValue="80" className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-red-500"/>
                <p className="text-xs text-gray-500 mt-1">예측된 재발 확률이 80%를 초과할 경우 'Critical' 등급 알림을 발송합니다.</p>
            </div>
             <div>
                <div className="flex justify-between mb-1">
                    <label className="text-sm font-medium text-gray-700">중등도 위험군 (Moderate Risk) 주의 기준</label>
                    <span className="text-sm font-bold text-yellow-600">Score &gt; 40</span>
                </div>
                <input type="range" min="0" max="100" defaultValue="40" className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-yellow-500"/>
                <p className="text-xs text-gray-500 mt-1">예측된 재발 확률이 40%를 초과할 경우 'Warning' 등급 알림을 발송합니다.</p>
            </div>
          </div>
      </Card>
      
      <NotificationConfigCard 
        preferences={{ enabled: true, sound: true, push: true, email: true }} 
        onPreferencesChange={handleNotificationChange} 
      />
    </div>
  );
};

export default RecurrencePredictionConfigPanel;
