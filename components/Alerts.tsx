import React from 'react';
import type { Language } from '../types';
import { translations } from '../translations';

interface AlertsProps {
    language: Language;
}

const AlertIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
);

export const Alerts: React.FC<AlertsProps> = ({ language }) => {
    const t = translations[language].alerts;

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-yellow-300">
            <h2 className="text-2xl font-bold text-yellow-800 mb-4">{t.title}</h2>
            <ul className="space-y-4">
                {t.messages.map((alert, index) => (
                    <li key={index} className="flex items-start gap-4 p-3 bg-yellow-50 rounded-lg">
                        <AlertIcon />
                        <span className="text-yellow-900">{alert}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};
