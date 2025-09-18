import React, { useState } from 'react';
import type { Language, Profile } from '../types';
import { translations } from '../translations';

interface OnboardingModalProps {
    onLogin: (profile: Profile) => void;
    onClose: () => void;
    language: Language;
}

const ProgressBar: React.FC<{ steps: string[], currentStep: number }> = ({ steps, currentStep }) => (
    <div className="flex justify-between items-center mb-6">
        {steps.map((step, index) => {
            const stepIndex = index + 1;
            const isCompleted = stepIndex < currentStep;
            const isActive = stepIndex === currentStep;
            return (
                <React.Fragment key={stepIndex}>
                    <div className="flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                            isActive ? 'bg-farm-green text-white' : isCompleted ? 'bg-farm-green-dark text-white' : 'bg-gray-200 text-gray-500'
                        }`}>
                            {isCompleted ? '✓' : stepIndex}
                        </div>
                        <p className={`mt-2 text-xs text-center font-medium ${isActive ? 'text-farm-green-dark' : 'text-gray-500'}`}>{step}</p>
                    </div>
                    {stepIndex < steps.length && <div className={`flex-1 h-1 mx-2 transition-colors ${isCompleted ? 'bg-farm-green-dark' : 'bg-gray-200'}`}></div>}
                </React.Fragment>
            );
        })}
    </div>
);

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ onLogin, onClose, language }) => {
    const t = translations[language].onboarding;
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState<Profile>({
        name: '',
        email: '',
        district: 'Alappuzha',
        landSize: '2 acres',
        crop: '', // Crop will be selected after analysis
        soilType: 'Alluvial Soil',
        irrigation: 'Canal Irrigation',
    });
    const [error, setError] = useState('');

    const handleNext = () => {
        if (step === 2 && !formData.name.trim()) {
            setError(t.requiredField);
            return;
        }
        setError('');
        setStep(prev => prev + 1);
    };

    const handleBack = () => setStep(prev => prev - 1);
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if(name === 'name' && value.trim()) {
            setError('');
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name.trim()) {
             setError(t.requiredField);
             setStep(2); // Go back to the name step if empty on final submission
            return;
        }
        onLogin(formData);
    };

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-gray-800">{t.welcome.subtitle}</h2>
                        <p className="mt-2 text-gray-600">{t.welcome.description}</p>
                        <button onClick={handleNext} className="w-full mt-8 py-3 bg-farm-green-dark text-white rounded-lg font-semibold hover:bg-green-800 transition-colors">{t.welcome.cta}</button>
                    </div>
                );
            case 2:
                return (
                    <div>
                        <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">{t.personal.title}</h2>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">{t.personal.nameLabel}</label>
                                <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} placeholder={t.personal.namePlaceholder} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500" />
                                {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
                            </div>
                             <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">{t.personal.emailLabel}</label>
                                <input type="email" id="email" name="email" value={formData.email ?? ''} onChange={handleChange} placeholder={t.personal.emailPlaceholder} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500" />
                            </div>
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div>
                        <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">{t.farm.title}</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="district" className="block text-sm font-medium text-gray-700">{t.farm.districtLabel}</label>
                                <select 
                                    id="district" 
                                    name="district" 
                                    value={formData.district} 
                                    onChange={handleChange} 
                                    className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                                >
                                    {Object.entries(translations[language].districts).map(([key, value]) => (
                                        <option key={key} value={key}>{value}</option>
                                    ))}
                                </select>
                            </div>
                             <div>
                                <label htmlFor="landSize" className="block text-sm font-medium text-gray-700">{t.farm.landSizeLabel}</label>
                                <input type="text" id="landSize" name="landSize" value={formData.landSize} onChange={handleChange} placeholder={t.farm.landSizePlaceholder} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500" />
                            </div>
                             <div>
                                <label htmlFor="soilType" className="block text-sm font-medium text-gray-700">{t.farm.soilTypeLabel}</label>
                                <input type="text" id="soilType" name="soilType" value={formData.soilType} onChange={handleChange} placeholder={t.farm.soilTypePlaceholder} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500" />
                            </div>
                             <div className="sm:col-span-2">
                                <label htmlFor="irrigation" className="block text-sm font-medium text-gray-700">{t.farm.irrigationLabel}</label>
                                <input type="text" id="irrigation" name="irrigation" value={formData.irrigation} onChange={handleChange} placeholder={t.farm.irrigationPlaceholder} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500" />
                            </div>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg transform transition-all p-6 sm:p-8" onClick={e => e.stopPropagation()}>
                <div className="text-center mb-4">
                    <h1 className="text-2xl font-bold text-gray-800">{t.title}</h1>
                </div>
                
                <ProgressBar steps={t.steps} currentStep={step} />

                <form onSubmit={handleSubmit}>
                    {renderStep()}
                </form>

                {step > 1 && (
                     <div className="mt-8 flex justify-between items-center">
                         <button onClick={handleBack} className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition-colors">{t.buttons.back}</button>
                         {step === 3 ? (
                            <button onClick={handleSubmit} className="px-6 py-2 bg-farm-green-dark text-white rounded-lg font-semibold hover:bg-green-800 transition-colors">{t.buttons.finish}</button>
                         ) : (
                            <button onClick={handleNext} className="px-6 py-2 bg-farm-green text-white rounded-lg font-semibold hover:bg-farm-green-dark transition-colors">{t.buttons.next}</button>
                         )}
                    </div>
                )}

                 <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
        </div>
    );
};