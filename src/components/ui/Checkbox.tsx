import React from 'react';
import { Check } from 'lucide-react';
interface CheckboxProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  id?: string;
}
export function Checkbox({
  label,
  checked,
  onChange,
  disabled = false,
  id
}: CheckboxProps) {
  const checkboxId = id || label.toLowerCase().replace(/\s+/g, '-');
  return (
    <label
      htmlFor={checkboxId}
      className={`
        flex items-center gap-3 cursor-pointer select-none
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
      `}>

      <div className="relative">
        <input
          type="checkbox"
          id={checkboxId}
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
          className="sr-only peer" />

        <div
          className={`
            w-5 h-5 border-2 rounded transition-all duration-200
            peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2
            ${checked ? 'bg-primary border-primary' : 'bg-background border-input hover:border-primary/50'}
          `}>

          {checked &&
          <Check
            className="w-full h-full text-primary-foreground p-0.5"
            strokeWidth={3} />

          }
        </div>
      </div>
      <span className="text-sm text-foreground">{label}</span>
    </label>);

}