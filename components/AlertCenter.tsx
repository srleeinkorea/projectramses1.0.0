
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
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
  </svg>
);

const ExclamationTriangleIcon: React.FC<{ className?: string }> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
    </svg>
);

const ExclamationCircleIcon: React.FC<{ className?: string }> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
    </svg>
);

const XMarkIcon: React.FC<{ className?: string }> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
      <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
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
          case 'critical': return <ExclamationCircleIcon className="h-6 w-6 text-red-500" />;
          case 'warning': return <ExclamationTriangleIcon className="h-6 w-6 text-yellow-500" />;
          default: return <div className="h-6 w-6 rounded-full bg-blue-400 flex items-center justify-center text-white text-sm font-bold">i</div>;
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
            className="p-2.5 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 rounded-full transition-colors"
            aria-label="알림"
        >
            <BellIcon className="h-7 w-7" />
            {unreadCount > 0 && (
            <span className="absolute top-1 right-1 block h-5 w-5 rounded-full bg-red-500 ring-2 ring-white text-xs font-bold text-white flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
            </span>
            )}
        </button>

        {/* Dropdown Panel */}
        {isOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 z-50 overflow-hidden transform transition-all">
            <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-700">알림 센터</h3>
                {alerts.length > 0 && (
                     <button onClick={onClearAll} className="text-sm text-gray-500 hover:text-gray-700 underline">
                        모두 지우기
                    </button>
                )}
            </div>
            <div className="max-h-96 overflow-y-auto">
                {alerts.length === 0 ? (
                <div className="p-8 text-center text-gray-500 text-base">
                    새로운 알림이 없습니다.
                </div>
                ) : (
                <ul className="divide-y divide-gray-100">
                    {alerts.map((alert) => (
                    <li key={alert.id} className={`p-4 hover:bg-gray-50 transition-colors relative ${!alert.isRead ? 'bg-blue-50/30' : ''}`}>
                        <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0 mt-0.5">
                                {getSeverityIcon(alert.severity)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-base font-medium text-gray-900 truncate pr-6">
                                    {alert.message}
                                </p>
                                <p className="text-sm text-gray-500 mt-1">
                                    {alert.patientName} • {alert.agentName}
                                </p>
                                <p className="text-xs text-gray-400 mt-1">
                                    {formatTime(alert.timestamp)}
                                </p>
                            </div>
                            {!alert.isRead && (
                                <button 
                                    onClick={(e) => { e.stopPropagation(); onMarkAsRead(alert.id); }}
                                    className="absolute top-4 right-4 text-gray-400 hover:text-blue-500"
                                    title="읽음으로 표시"
                                >
                                    <CheckCircleIcon className="h-6 w-6" />
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
                <div className="p-5">
                    <div className="flex items-start">
                        <div className="flex-shrink-0">
                            {getSeverityIcon(toastAlert.severity)}
                        </div>
                        <div className="ml-4 w-0 flex-1 pt-0.5">
                            <p className="text-base font-medium">
                                {toastAlert.severity === 'critical' ? '긴급 알림' : '알림'}
                            </p>
                            <p className="mt-1 text-sm opacity-90">
                                {toastAlert.message}
                            </p>
                            <p className="mt-1 text-xs opacity-75">
                                {toastAlert.patientName}
                            </p>
                        </div>
                        <div className="ml-4 flex-shrink-0 flex">
                            <button
                                className="inline-flex text-current opacity-60 hover:opacity-100 focus:outline-none"
                                onClick={() => setToastAlert(null)}
                            >
                                <span className="sr-only">Close</span>
                                <XMarkIcon className="h-6 w-6" />
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
