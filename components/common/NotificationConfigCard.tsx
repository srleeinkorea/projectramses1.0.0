
import React from 'react';
import { NotificationPreferences } from '../../types';
import Card from './Card';
import ToggleSwitch from './ToggleSwitch';

interface NotificationConfigCardProps {
  preferences: NotificationPreferences;
  onPreferencesChange: (newPreferences: NotificationPreferences) => void;
}

const BellAlertIcon: React.FC<{ className?: string }> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
  </svg>
);

const NotificationConfigCard: React.FC<NotificationConfigCardProps> = ({ preferences, onPreferencesChange }) => {

  const handleToggle = (field: keyof NotificationPreferences) => {
    onPreferencesChange({ ...preferences, [field]: !preferences[field] });
  };

  return (
    <Card title="실시간 알림 및 통지 설정" description="임계값 위반 등 중요 이벤트 발생 시 알림을 받을 채널과 방식을 설정합니다.">
        <div className="space-y-4 mt-4">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <div>
                    <span className="block text-base font-medium text-gray-900">알림 시스템 활성화</span>
                    <span className="block text-sm text-gray-500">모든 채널에 대한 마스터 스위치입니다.</span>
                </div>
                <ToggleSwitch enabled={preferences.enabled} setEnabled={() => handleToggle('enabled')} />
            </div>

            {preferences.enabled && (
                <div className="space-y-4 pt-2">
                    <div className="flex items-center justify-between">
                         <div className="flex items-center">
                            <input
                                id="notify-sound"
                                type="checkbox"
                                checked={preferences.sound}
                                onChange={() => handleToggle('sound')}
                                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <label htmlFor="notify-sound" className="ml-3 block text-base font-medium text-gray-700">
                                경고음 재생 (Sound)
                            </label>
                        </div>
                    </div>
                     <div className="flex items-center justify-between">
                         <div className="flex items-center">
                            <input
                                id="notify-push"
                                type="checkbox"
                                checked={preferences.push}
                                onChange={() => handleToggle('push')}
                                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <label htmlFor="notify-push" className="ml-3 block text-base font-medium text-gray-700">
                                모바일 푸시 알림 (Push)
                            </label>
                        </div>
                    </div>
                     <div className="flex items-center justify-between">
                         <div className="flex items-center">
                            <input
                                id="notify-email"
                                type="checkbox"
                                checked={preferences.email}
                                onChange={() => handleToggle('email')}
                                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <label htmlFor="notify-email" className="ml-3 block text-base font-medium text-gray-700">
                                이메일 발송 (Email)
                            </label>
                        </div>
                    </div>
                </div>
            )}
        </div>
    </Card>
  );
};

export default NotificationConfigCard;
