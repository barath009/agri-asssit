import React from 'react';
import type { Language } from '../types';
import { translations } from '../translations';
import { WarningIcon } from './icons/WarningIcon';

interface RecentActivityCardProps {
    language: Language;
}

const activityDotColors: { [key: string]: string } = {
    test: 'bg-blue-500',
    update: 'bg-purple-500',
    scan: 'bg-green-500',
    reminder: 'bg-yellow-500',
}

export const RecentActivityCard: React.FC<RecentActivityCardProps> = ({ language }) => {
    const t = translations[language].activity;

    return (
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 h-full">
            <h2 className="text-xl font-bold text-gray-800 mb-1">{t.title}</h2>
            <p className="text-sm text-gray-500 mb-4">{t.subtitle}</p>
            
            <div className="space-y-4">
                {t.items.map((activity, index) => (
                    <div key={index} className="flex items-center gap-4 p-3 border-l-4 border-gray-200 hover:bg-gray-50 rounded-r-lg">
                       <span className={`h-3 w-3 rounded-full ${activityDotColors[activity.type]}`}></span>
                        <div className="flex-1">
                            <p className="font-medium text-gray-700">{activity.text}</p>
                            <p className="text-xs text-gray-500">{activity.time}</p>
                        </div>
                        {activity.hasWarning && <span className="text-yellow-500"><WarningIcon /></span>}
                    </div>
                ))}
            </div>
        </div>
    );
};