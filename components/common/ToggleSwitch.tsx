
import React from 'react';

interface ToggleSwitchProps {
  enabled: boolean;
  setEnabled: (enabled: boolean) => void;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ enabled, setEnabled }) => {
  return (
    <button
      type="button"
      className={`${
        enabled ? 'bg-green-500' : 'bg-slate-200'
      } relative inline-flex h-7 w-12 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 shadow-inner`}
      role="switch"
      aria-checked={enabled}
      onClick={() => setEnabled(!enabled)}
    >
      <span className="sr-only">설정 사용</span>
      <span
        aria-hidden="true"
        className={`${
          enabled ? 'translate-x-5' : 'translate-x-0'
        } pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out`}
      />
    </button>
  );
};

export default ToggleSwitch;
