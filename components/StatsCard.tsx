import React from 'react';
import type { Language } from '../types';

interface StatsCardProps {
    title: string;
    value: string;
    subValue?: string;
    change?: string;
    changeType?: 'increase' | 'decrease';
    category?: string;
    language: Language;
}


export const StatsCard: React.FC<StatsCardProps> = ({ title, value, subValue, change, changeType, category }) => {
    return (
        <div className="bg-white p-5 rounded-xl shadow-md border border-gray-200">
            <div className="flex justify-between items-start">
                 <p className="text-sm font-medium text-gray-500">{title}</p>
                 {category && (
                    <span className="text-xs font-semibold text-purple-600 bg-purple-100 px-2 py-1 rounded-full">{subValue}</span>
                 )}
            </div>
            <div className="mt-2">
                <p className="text-3xl font-bold text-gray-800">{value}</p>
                <div className="flex items-center gap-2 mt-1">
                    {change && (
                        <span className={`flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${changeType === 'increase' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {change}
                        </span>
                    )}
                    {!category && subValue && (
                        <p className="text-sm text-gray-500">{subValue}</p>
                    )}
                </div>
            </div>
        </div>
    );
};
