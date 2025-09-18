import React from 'react';
import type { AnalysisRecord } from '../types';
import type { Language } from '../types';
import { translations } from '../translations';
import { HistoryIcon } from './icons/HistoryIcon';

interface AnalysisHistoryProps {
    history: AnalysisRecord[];
    onViewReport: (record: AnalysisRecord) => void;
    onNewAnalysis: () => void;
    language: Language;
}

export const AnalysisHistory: React.FC<AnalysisHistoryProps> = ({ history, onViewReport, onNewAnalysis, language }) => {
    const t = translations[language].analysisHistory;

    return (
        <div className="max-w-screen-xl mx-auto">
            <div className="mb-6">
                <div className="flex items-center gap-2">
                    <span className="text-farm-green-dark"><HistoryIcon /></span>
                    <h1 className="text-3xl font-bold text-gray-800">{t.title}</h1>
                </div>
                <p className="text-gray-500 mt-1">{t.subtitle}</p>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-md border border-gray-200">
                {history.length > 0 ? (
                    <ul className="space-y-4">
                        {history.map(record => (
                            <li key={record.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 border rounded-lg hover:bg-gray-50">
                                <div>
                                    <p className="font-semibold text-gray-800">{t.dateLabel}</p>
                                    <p className="text-gray-600">{new Date(record.date).toLocaleString()}</p>
                                </div>
                                <button
                                    onClick={() => onViewReport(record)}
                                    className="px-4 py-2 bg-farm-green text-white font-bold rounded-lg hover:bg-farm-green-dark transition-colors w-full sm:w-auto"
                                >
                                    {t.reportButton}
                                </button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="text-center py-12">
                        <p className="text-gray-500 mb-4">{t.noHistory}</p>
                        <button
                            onClick={onNewAnalysis}
                            className="px-6 py-3 bg-farm-green-dark text-white font-bold rounded-lg hover:bg-green-800 transition-colors"
                        >
                            {t.startAnalysis}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
