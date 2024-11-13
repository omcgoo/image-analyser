import React from 'react';

interface CustomSwitchProps {
  isOn: boolean;
  handleToggle: () => void;
  onLabel: string;
  offLabel: string;
}

const CustomSwitch: React.FC<CustomSwitchProps> = ({ isOn, handleToggle, onLabel, offLabel }) => {
  return (
    <button
      onClick={handleToggle}
      className={`relative w-24 h-8 rounded-full p-1 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 ${
        isOn ? 'bg-amber-600' : 'bg-gray-200'
      }`}
      type="button"
      role="switch"
      aria-checked={isOn}
    >
      <div className="relative h-full w-full">
        <span
          className={`absolute top-0 flex h-6 w-6 items-center justify-center rounded-full bg-white shadow-md transform transition-transform duration-200 ease-in-out ${
            isOn ? 'right-0' : 'left-0'
          }`}
        />
        <span
          className={`absolute top-1/2 -translate-y-1/2 text-xs font-medium transition-all duration-200 ${
            isOn 
              ? 'left-2 text-white opacity-100' 
              : 'right-2 opacity-0'
          }`}
        >
          {onLabel}
        </span>
        <span
          className={`absolute top-1/2 -translate-y-1/2 text-xs font-medium transition-all duration-200 ${
            isOn 
              ? 'right-2 opacity-0' 
              : 'left-8 text-gray-700 opacity-100'
          }`}
        >
          {offLabel}
        </span>
      </div>
    </button>
  );
};

export default CustomSwitch;