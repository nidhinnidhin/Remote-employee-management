import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

interface Option {
    value: string;
    label: string;
    icon?: React.ReactNode;
}

interface CustomSelectProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    options: Option[];
    placeholder?: string;
    required?: boolean;
    error?: string;
    className?: string;
    icon?: React.ReactNode;
}

export default function CustomSelect({
    label,
    value,
    onChange,
    options,
    placeholder = 'Select an option',
    required,
    error,
    className = '',
    icon,
}: CustomSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const selectedOption = options.find((opt) => opt.value === value);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (optionValue: string) => {
        onChange(optionValue);
        setIsOpen(false);
    };

    return (
        <div className={`w-full group ${className}`} ref={containerRef}>
            <label
                className="block text-sm font-semibold text-slate-700 mb-2 transition-colors group-focus-within:text-blue-600"
            >
                {label}
                {required && <span className="text-red-500 ml-0.5">*</span>}
            </label>

            <div className="relative">
                {/* Focus Ring Background */}
                <div className={`
            absolute inset-0 bg-white rounded-xl transition-all duration-300 pointer-events-none
            ${isOpen ? 'ring-4 ring-blue-500/10' : ''}
          `}
                />

                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className={`
            w-full relative flex items-center justify-between
            rounded-xl border py-3.5 px-4 bg-white text-left outline-none transition-all duration-200
            ${icon ? 'pl-11' : 'pl-4'}
            ${error ? 'border-red-300' : isOpen ? 'border-blue-500' : 'border-slate-200 hover:border-slate-300'}
          `}
                >
                    {icon && (
                        <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${isOpen ? 'text-blue-500' : 'text-slate-400'}`}>
                            {icon}
                        </div>
                    )}

                    <span className={`block truncate ${selectedOption ? 'text-slate-900 font-medium' : 'text-slate-400'}`}>
                        {selectedOption ? selectedOption.label : placeholder}
                    </span>

                    <span className={`
            pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4 
            transition-transform duration-300 ${isOpen ? 'rotate-180 text-blue-500' : 'text-slate-400'}
          `}>
                        <ChevronDown size={18} strokeWidth={2.5} />
                    </span>
                </button>

                {/* Dropdown Menu */}
                <div className={`
            absolute z-50 mt-2 w-full overflow-hidden rounded-xl bg-white shadow-xl ring-1 ring-black/5 transition-all duration-200 origin-top
            ${isOpen ? 'opacity-100 scale-100 translate-y-0 visible' : 'opacity-0 scale-95 -translate-y-2 invisible'}
        `}>
                    <div className="py-1 max-h-60 overflow-auto custom-scrollbar">
                        {options.map((option) => {
                            const isSelected = value === option.value;
                            return (
                                <div
                                    key={option.value}
                                    onClick={() => handleSelect(option.value)}
                                    className={`
                        relative cursor-pointer select-none py-3 px-4 flex items-center justify-between
                        transition-colors active:bg-blue-50
                        ${isSelected ? 'bg-blue-50 text-blue-900 font-medium' : 'text-slate-700 hover:bg-slate-50'}
                        `}
                                >
                                    <div className="flex items-center gap-3">
                                        {option.icon}
                                        <span className="block truncate">{option.label}</span>
                                    </div>

                                    {isSelected && (
                                        <span className="text-blue-600">
                                            <Check size={16} strokeWidth={2.5} />
                                        </span>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {error && (
                <p className="mt-2 text-xs text-red-500 animate-in slide-in-from-top-1 fade-in">
                    {error}
                </p>
            )}
        </div>
    );
}
