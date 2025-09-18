import React, { useState } from 'react';
import type { SoilData } from '../types';
import { FlaskIcon } from './icons/FlaskIcon';
import { LeafIcon } from './icons/LeafIcon';
import { InfoIcon } from './icons/InfoIcon';
import { WarningIcon } from './icons/WarningIcon';
import type { Language } from '../types';
import { translations } from '../translations';


interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    unit?: string;
}

interface SoilAnalysisProps {
    onAnalyze: (data: SoilData) => void;
    isLoading: boolean;
    language: Language;
}

const FormInput: React.FC<FormInputProps> = ({ label, unit, id, ...props }) => (
    <div>
        <label htmlFor={id} className="flex items-center gap-1 mb-1 text-sm font-medium text-gray-700">
            {label}
            <span className="text-gray-400">
                <InfoIcon />
            </span>
        </label>
        <div className="relative">
            <input
                id={id}
                {...props}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-farm-green-dark sm:text-sm"
            />
            {unit && <span className="absolute inset-y-0 right-3 flex items-center text-sm text-gray-500">{unit}</span>}
        </div>
    </div>
);

export const SoilAnalysis: React.FC<SoilAnalysisProps> = ({ onAnalyze, isLoading, language }) => {
    const t = translations[language].soilAnalysis;
    const [formData, setFormData] = useState<SoilData>({
        ph: '7',
        ec: '1',
        oc: '0.5',
        soilType: 'Loamy',
        n: '50',
        p: '20',
        k: '100',
        ca: '1000',
        mg: '200',
        s: '10'
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({...prev, [name]: value}));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onAnalyze(formData);
    };

    const phValue = parseFloat(formData.ph);
    const isPhOutOfRange = !isNaN(phValue) && (phValue < 6.0 || phValue > 7.5);

    return (
        <div className="max-w-screen-xl mx-auto">
             <div className="mb-6">
                <div className="flex items-center gap-2">
                    <span className="text-farm-green-dark"><FlaskIcon /></span>
                    <h1 className="text-3xl font-bold text-gray-800">{t.title}</h1>
                </div>
                <p className="text-gray-500 mt-1">{t.subtitle}</p>
            </div>
            
            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-md border border-gray-200">
                <form onSubmit={handleSubmit}>
                    <div className="mb-8">
                        <h2 className="text-lg font-bold text-gray-800 mb-1">{t.form.title}</h2>
                        <p className="text-sm text-gray-500">{t.form.subtitle}</p>
                    </div>

                    {/* Basic Soil Properties */}
                    <div className="mb-8">
                        <h3 className="flex items-center gap-2 text-xl font-bold text-farm-green-dark mb-4">
                            <LeafIcon />
                            <span>{t.form.basic.title}</span>
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                               <FormInput label={t.form.basic.ph} id="ph" name="ph" type="number" step="0.1" value={formData.ph} onChange={handleChange} />
                               {isPhOutOfRange && (
                                    <div className="flex items-start gap-2 mt-2 p-2 bg-yellow-50 text-yellow-800 text-xs rounded-md border border-yellow-200">
                                        <span className="flex-shrink-0 mt-0.5 text-yellow-500">
                                            <WarningIcon />
                                        </span>
                                        <p>{t.form.basic.phWarning}</p>
                                    </div>
                                )}
                            </div>
                           <FormInput label={t.form.basic.ec} id="ec" name="ec" type="number" step="0.1" value={formData.ec} onChange={handleChange} unit="dS/m" />
                           <FormInput label={t.form.basic.oc} id="oc" name="oc" type="number" step="0.1" value={formData.oc} onChange={handleChange} unit="%" />
                           <div>
                                <label htmlFor="soilType" className="flex items-center gap-1 mb-1 text-sm font-medium text-gray-700">
                                    {t.form.basic.soilType.label}
                                </label>
                                <select id="soilType" name="soilType" value={formData.soilType} onChange={handleChange} className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-farm-green-dark sm:text-sm">
                                    {/* FIX: Cast value to string to resolve 'unknown' type error */}
                                    {Object.entries(t.form.basic.soilType.options).map(([key, value]) => (
                                        <option key={key} value={key}>{String(value)}</option>
                                    ))}
                                </select>
                           </div>
                        </div>
                    </div>

                    {/* Macronutrients */}
                    <div className="mb-8">
                        <h3 className="flex items-center gap-2 text-xl font-bold text-farm-green-dark mb-4">
                             <LeafIcon />
                             <span>{t.form.macro.title}</span>
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                           <FormInput label={t.form.macro.n} id="n" name="n" type="number" value={formData.n} onChange={handleChange} unit="kg/ha" />
                           <FormInput label={t.form.macro.p} id="p" name="p" type="number" value={formData.p} onChange={handleChange} unit="kg/ha" />
                           <FormInput label={t.form.macro.k} id="k" name="k" type="number" value={formData.k} onChange={handleChange} unit="kg/ha" />
                        </div>
                    </div>

                     {/* Secondary Nutrients */}
                    <div className="mb-8">
                        <h3 className="flex items-center gap-2 text-xl font-bold text-farm-green-dark mb-4">
                             <LeafIcon />
                            <span>{t.form.secondary.title}</span>
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                           <FormInput label={t.form.secondary.ca} id="ca" name="ca" type="number" value={formData.ca} onChange={handleChange} unit="ppm" />
                           <FormInput label={t.form.secondary.mg} id="mg" name="mg" type="number" value={formData.mg} onChange={handleChange} unit="ppm" />
                           <FormInput label={t.form.secondary.s} id="s" name="s" type="number" value={formData.s} onChange={handleChange} unit="ppm" />
                        </div>
                    </div>

                    <div className="flex justify-end mt-8">
                        <button 
                            type="submit" 
                            className="px-6 py-3 bg-farm-green-dark text-white font-bold rounded-lg hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-farm-green-dark transition-colors disabled:bg-green-800/50 flex items-center gap-2"
                            disabled={isLoading}
                        >
                             {isLoading && <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
                            {isLoading ? t.form.button.loading : t.form.button.default}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};