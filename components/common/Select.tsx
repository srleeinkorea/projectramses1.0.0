
import React from 'react';

interface SelectProps<T extends string> {
  label: string;
  value: T;
  onChange: (value: T) => void;
  options: { value: T; label: string }[];
  description?: string;
}

const Select = <T extends string,>({ label, value, onChange, options, description }: SelectProps<T>) => {
  return (
    <div>
      <label htmlFor={label} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <select
        id={label}
        name={label}
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {description && <p className="mt-1 text-xs text-gray-500">{description}</p>}
    </div>
  );
};

export default Select;
