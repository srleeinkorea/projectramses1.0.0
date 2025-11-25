
import React, { useState, useEffect, useRef } from 'react';
import { Alert, AlertSeverity } from '../types';

interface AlertCenterProps {
  alerts: Alert[];
  onMarkAsRead: (alertId: string) => void;
  onClearAll: () => void;
}

const BellIcon: React.FC<{ className?: string }> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
  </svg>
);

const CheckCircleIcon: React.FC<{ className?: string }> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const ExclamationTriangleIcon: React.FC<{ className?: string }> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
    </svg>
);

const ExclamationCircleIcon: React.FC<{ className?: string }> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
    </svg>
);

const XMarkIcon: React.FC<{ className?: string }> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const AlertCenter: React.FC<AlertCenterProps> = ({ alerts, onMarkAsRead, onClearAll }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [lastAlertCount, setLastAlertCount] = useState(0);
  const [toastAlert, setToastAlert] = useState<Alert | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = alerts.filter(a => !a.isRead).length;

  useEffect(() => {
    // Show toast for new alerts
    if (alerts.length > lastAlertCount) {
        const latestAlert = alerts[0];
        if (!latestAlert.isRead) {
             setToastAlert(latestAlert);
             // Auto hide toast after 5 seconds
             const timer = setTimeout(() => setToastAlert(null), 5000);
             return () => clearTimeout(timer);
        }
    }
    setLastAlertCount(alerts.length);
  }, [alerts, lastAlertCount]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getSeverityStyles = (severity: AlertSeverity) => {
    switch (severity) {
      case 'critical': return 'bg-red-50 text-red-700 border-red-200';
      case 'warning': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'info': return 'bg-blue-50 text-blue-700 border-blue-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getSeverityIcon = (severity: AlertSeverity) => {
      switch (severity) {
          case 'critical': return <ExclamationCircleIcon className="h-5 w-5 text-red-500" />;
          case 'warning': return <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" />;
          default: return <div className="h-5 w-5 rounded-full bg-blue-400 flex items-center justify-center text-white text-xs font-bold">i</div>;
      }
  };

  const formatTime = (timestamp: number) => {
      const date = new Date(timestamp);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  return (
    <>
        {/* Header Icon */}
        <div className="relative" ref={dropdownRef}>
        <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 rounded-full transition-colors"
            aria-label="알림"
        >
            <BellIcon className="h-6 w-6" />
            {unreadCount > 0 && (
            <span className="absolute top-1 right-1 block h-4 w-4 rounded-full bg-red-500 ring-2 ring-white text-[10px] font-bold text-white flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
            </span>
            )}
        </button>

        {/* Dropdown Panel */}
        {isOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 z-50 overflow-hidden transform transition-all">
            <div className="p-3 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-base font-semibold text-gray-700">알림 센터</h3>
                {alerts.length > 0 && (
                     <button onClick={onClearAll} className="text-xs text-gray-500 hover:text-gray-700 underline">
                        모두 지우기
                    </button>
                )}
            </div>
            <div className="max-h-80 overflow-y-auto">
                {alerts.length === 0 ? (
                <div className="p-6 text-center text-gray-500 text-sm">
                    새로운 알림이 없습니다.
                </div>
                ) : (
                <ul className="divide-y divide-gray-100">
                    {alerts.map((alert) => (
                    <li key={alert.id} className={`p-3 hover:bg-gray-50 transition-colors relative ${!alert.isRead ? 'bg-blue-50/30' : ''}`}>
                        <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0 mt-0.5">
                                {getSeverityIcon(alert.severity)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate pr-6">
                                    {alert.message}
                                </p>
                                <p className="text-xs text-gray-500 mt-0.5">
                                    {alert.patientName} • {alert.agentName}
                                </p>
                                <p className="text-[10px] text-gray-400 mt-0.5">
                                    {formatTime(alert.timestamp)}
                                </p>
                            </div>
                            {!alert.isRead && (
                                <button 
                                    onClick={(e) => { e.stopPropagation(); onMarkAsRead(alert.id); }}
                                    className="absolute top-3 right-3 text-gray-400 hover:text-blue-500"
                                    title="읽음으로 표시"
                                >
                                    <CheckCircleIcon className="h-5 w-5" />
                                </button>
                            )}
                        </div>
                    </li>
                    ))}
                </ul>
                )}
            </div>
            </div>
        )}
        </div>

        {/* Toast Notification for Critical Alerts */}
        {toastAlert && (
            <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-[60] max-w-sm w-full shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden animate-slide-down ${getSeverityStyles(toastAlert.severity)}`}>
                <div className="p-4">
                    <div className="flex items-start">
                        <div className="flex-shrink-0">
                            {getSeverityIcon(toastAlert.severity)}
                        </div>
                        <div className="ml-3 w-0 flex-1 pt-0.5">
                            <p className="text-sm font-medium">
                                {toastAlert.severity === 'critical' ? '긴급 알림' : '알림'}
                            </p>
                            <p className="mt-1 text-xs opacity-90">
                                {toastAlert.message}
                            </p>
                            <p className="mt-1 text-[10px] opacity-75">
                                {toastAlert.patientName}
                            </p>
                        </div>
                        <div className="ml-4 flex-shrink-0 flex">
                            <button
                                className="inline-flex text-current opacity-60 hover:opacity-100 focus:outline-none"
                                onClick={() => setToastAlert(null)}
                            >
                                <span className="sr-only">Close</span>
                                <XMarkIcon className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )}
    </>
  );
};

export default AlertCenter;
