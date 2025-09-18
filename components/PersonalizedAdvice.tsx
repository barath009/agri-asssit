import React from 'react';
import type { DashboardAdvice, Language } from '../types';
import { LightbulbIcon } from './icons/LightbulbIcon';
import { translations } from '../translations';

interface PersonalizedAdviceProps {
    advice: DashboardAdvice | null;
    isLoading: boolean;
    language: Language;
}

export const PersonalizedAdvice: React.FC<PersonalizedAdviceProps> = ({ advice, isLoading, language }) => {

    return (
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 h-full">
            <div className="flex items-center gap-3 mb-4">
                <span className="text-yellow-500"><LightbulbIcon /></span>
                <h2 className="text-xl font-bold text-gray-800">{advice?.title || 'Personalized Advice'}</h2>
            </div>
            
            <div className="space-y-3">
                {isLoading ? (
                    <>
                        <div className="h-6 bg-gray-100 rounded-lg animate-pulse w-3/4"></div>
                        <div className="h-6 bg-gray-100 rounded-lg animate-pulse w-full"></div>
                        <div className="h-6 bg-gray-100 rounded-lg animate-pulse w-5/6"></div>
                    </>
                ) : advice && advice.advice.length > 0 ? (
                    <ul className="list-disc list-inside space-y-2 text-gray-700">
                        {advice.advice.map((tip, index) => (
                            <li key={index}>{tip}</li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-500 text-center py-4">No specific advice available at the moment.</p>
                )}
            </div>
        </div>
    );
};
