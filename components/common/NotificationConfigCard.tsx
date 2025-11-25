
import React from 'react';
import { NotificationPreferences } from '../../types';
import Card from './Card';
import ToggleSwitch from './ToggleSwitch';

interface NotificationConfigCardProps {
  preferences: NotificationPreferences;
  onPreferencesChange: (newPreferences: NotificationPreferences) => void;
}

const NotificationConfigCard: React.FC<NotificationConfigCardProps> = ({ preferences, onPreferencesChange }) => {

  const handleToggle = (field: keyof NotificationPreferences) => {
    onPreferencesChange({ ...preferences, [field]: !preferences[field] });
  };

  return (
    <Card title="실시간 알림 및 통지 설정" description="임계값 위반 등 중요 이벤트 발생 시 알림을 받을 채널과 방식을 설정합니다.">
        <div className="space-y-4 mt-2">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div>
                    <span className="block text-sm font-medium text-gray-900">알림 시스템 활성화</span>
                    <span className="block text-xs text-gray-500">모든 채널에 대한 마스터 스위치입니다.</span>
                </div>
                <ToggleSwitch enabled={preferences.enabled} setEnabled={() => handleToggle('enabled')} />
            </div>

            {preferences.enabled && (
                <div className="space-y-3 pt-1">
                    <div className="flex items-center justify-between">
                         <div className="flex items-center">
                            <input
                                id="notify-sound"
                                type="checkbox"
                                checked={preferences.sound}
                                onChange={() => handleToggle('sound')}
                                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <label htmlFor="notify-sound" className="ml-3 block text-sm font-medium text-gray-700">
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
                            <label htmlFor="notify-push" className="ml-3 block text-sm font-medium text-gray-700">
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
                            <label htmlFor="notify-email" className="ml-3 block text-sm font-medium text-gray-700">
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
