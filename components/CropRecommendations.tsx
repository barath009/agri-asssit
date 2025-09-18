import React, { useState } from 'react';
import type { SoilData, CropRecommendation } from '../types';
import { LeafIcon } from './icons/LeafIcon';
import { YieldIcon } from './icons/YieldIcon';
import { CalendarIcon } from './icons/CalendarIcon';
import { PlantingIcon } from './icons/PlantingIcon';
import { SoilProfileIcon } from './icons/SoilProfileIcon';
import type { Language } from '../types';
import { translations } from '../translations';


interface CropRecommendationsProps {
    soilData: SoilData;
    recommendations: CropRecommendation[];
    onBack: () => void;
    language: Language;
    cameFromHistory: boolean;
    onSelectCrop: (cropName: string) => void;
}

const suitabilityStyles: { [key: string]: string } = {
    'Best': 'bg-green-100 text-green-800 border-green-300',
    'Excellent': 'bg-blue-100 text-blue-800 border-blue-300',
    'Good': 'bg-yellow-100 text-yellow-800 border-yellow-300',
};

const suitabilityPillStyles: { [key: string]: string } = {
    'Best': 'bg-green-500',
    'Excellent': 'bg-blue-500',
    'Good': 'bg-yellow-500',
};

export const CropRecommendations: React.FC<CropRecommendationsProps> = ({ soilData, recommendations, onBack, language, cameFromHistory, onSelectCrop }) => {
    const t = translations[language].recommendations;
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 3;

    // @ts-ignore - Recharts is loaded from a script tag.
    // Moved from top-level to prevent crash on initial load before script is ready.
    const { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Label } = window.Recharts || {};

    const totalPages = Math.ceil(recommendations.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentRecommendations = recommendations.slice(startIndex, startIndex + itemsPerPage);

    const goToNextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
    const goToPrevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));

    const macroNutrientData = [
        { name: 'N', value: parseFloat(soilData.n) || 0 },
        { name: 'P', value: parseFloat(soilData.p) || 0 },
        { name: 'K', value: parseFloat(soilData.k) || 0 },
    ];

    const secondaryNutrientData = [
        { name: 'Ca', value: parseFloat(soilData.ca) || 0 },
        { name: 'Mg', value: parseFloat(soilData.mg) || 0 },
        { name: 'S', value: parseFloat(soilData.s) || 0 },
    ];


    return (
        <div className="max-w-screen-xl mx-auto">
            <header className="text-center bg-farm-green-dark py-12 px-4 rounded-t-xl">
                 <div className="flex items-center justify-center gap-3">
                    <span className="text-white"><LeafIcon /></span>
                    <h1 className="text-4xl font-bold text-white">{t.title}</h1>
                </div>
                <p className="text-green-200 mt-2 text-lg">{t.subtitle}</p>
                <p className="text-green-300 mt-1 text-sm">{t.tagline}</p>
            </header>
            
            <div className="bg-white p-6 sm:p-8 rounded-b-xl shadow-md border border-gray-200">
                <button onClick={onBack} className="text-sm font-medium text-farm-green-dark hover:underline mb-8">
                    &larr; {cameFromHistory ? t.backToHistoryButton : t.backButton}
                </button>

                {/* Soil Profile */}
                <div className="mb-10">
                    <h2 className="flex items-center gap-2 text-2xl font-bold text-gray-800 mb-4">
                        <SoilProfileIcon />
                        <span>{t.profile.title}</span>
                    </h2>
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                        <div>
                            <p className="text-sm text-gray-500">{t.profile.ph}</p>
                            <p className="text-2xl font-bold text-farm-green-dark">{soilData.ph}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">{t.profile.n}</p>
                            <p className="text-2xl font-bold text-farm-green-dark">{soilData.n} <span className="text-base font-normal">kg/ha</span></p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">{t.profile.p}</p>
                            <p className="text-2xl font-bold text-farm-green-dark">{soilData.p} <span className="text-base font-normal">kg/ha</span></p>
                        </div>
                         <div>
                            <p className="text-sm text-gray-500">{t.profile.k}</p>
                            <p className="text-2xl font-bold text-farm-green-dark">{soilData.k} <span className="text-base font-normal">kg/ha</span></p>
                        </div>
                    </div>
                </div>

                {/* Soil Nutrient Charts */}
                <div className="mb-10">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">{t.charts.title}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {BarChart ? (
                            <>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-700 text-center mb-4">{t.charts.macroTitle}</h3>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <BarChart data={macroNutrientData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="name" />
                                            <YAxis>
                                                <Label value={t.charts.yAxisLabel} angle={-90} position="insideLeft" style={{ textAnchor: 'middle' }} />
                                            </YAxis>
                                            <Tooltip cursor={{fill: '#F0FDF4'}}/>
                                            <Bar dataKey="value" fill="#22C55E" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-700 text-center mb-4">{t.charts.secondaryTitle}</h3>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <BarChart data={secondaryNutrientData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="name" />
                                            <YAxis>
                                                <Label value={t.charts.yAxisLabel} angle={-90} position="insideLeft" style={{ textAnchor: 'middle' }} />
                                            </YAxis>
                                            <Tooltip cursor={{fill: '#F0FDF4'}} />
                                            <Bar dataKey="value" fill="#15803D" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </>
                        ) : (
                             <div className="md:col-span-2 text-center py-10 text-gray-500">
                                Loading Charts...
                            </div>
                        )}
                    </div>
                </div>

                {/* Crop Recommendations */}
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 text-center mb-2">{t.crops.title}</h2>
                    <p className="text-gray-500 text-center mb-8">{t.crops.subtitle}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {currentRecommendations.map((rec, index) => (
                             <div key={index} className={`bg-white border rounded-lg shadow-lg p-6 flex flex-col ${suitabilityStyles[rec.suitability]}`}>
                                <div className="flex-grow">
                                    <div className="flex justify-between items-start mb-4">
                                        <h3 className="flex items-center gap-2 text-2xl font-bold text-gray-800">
                                            <LeafIcon /> {rec.cropName}
                                        </h3>
                                        <span className={`px-3 py-1 text-xs font-bold text-white rounded-full ${suitabilityPillStyles[rec.suitability]}`}>{t.crops.suitability[rec.suitability as keyof typeof t.crops.suitability]}</span>
                                    </div>
                                    <div className="flex items-center gap-6 text-sm text-gray-600 mb-6 border-b pb-4">
                                        <div className="flex items-center gap-2"><YieldIcon /> {rec.yield}</div>
                                        <div className="flex items-center gap-2"><CalendarIcon /> {rec.duration}</div>
                                    </div>
                                    
                                    <div className="mb-6">
                                        <h4 className="font-bold text-gray-800 mb-2">{t.crops.reasonsTitle}</h4>
                                        <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                                            {rec.reasons.map((reason, i) => <li key={i}>{reason}</li>)}
                                        </ul>
                                    </div>

                                    <div>
                                        <h4 className="flex items-center gap-2 font-bold text-gray-800 mb-2">
                                            <PlantingIcon /> {t.crops.tipsTitle}
                                        </h4>
                                        <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                                        {rec.plantingTips.map((tip, i) => <li key={i}>{tip}</li>)}
                                        </ul>
                                    </div>
                                </div>
                                <div className="mt-6">
                                    <button 
                                        onClick={() => onSelectCrop(rec.cropName)}
                                        className="w-full py-2 px-4 bg-farm-green-dark text-white font-bold rounded-lg hover:bg-green-800 transition-colors"
                                    >
                                        {t.selectCropButton}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div className="mt-8 flex justify-center items-center gap-4">
                            <button 
                                onClick={goToPrevPage}
                                disabled={currentPage === 1}
                                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {t.pagination.previous}
                            </button>
                            <span className="text-gray-600 font-medium">
                                {t.pagination.pageOf(currentPage, totalPages)}
                            </span>
                            <button
                                onClick={goToNextPage}
                                disabled={currentPage === totalPages}
                                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {t.pagination.next}
                            </button>
                        </div>
                    )}
                </div>
            </div>
             <footer className="text-center py-8">
                 <p className="text-gray-600 font-bold">🌱 {t.footer.title}</p>
                 <p className="text-sm text-gray-500">{t.footer.subtitle}</p>
            </footer>
        </div>
    );
};