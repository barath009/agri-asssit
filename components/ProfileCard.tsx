import React, { useState } from 'react';
import type { Profile } from '../types';
import type { Language } from '../types';
import { translations } from '../translations';


interface ProfileCardProps {
    profile: Profile;
    onUpdate: (profile: Profile) => void;
    language: Language;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({ profile, onUpdate, language }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<Profile>(profile);
    const t = translations[language].profileCard;
    const tOnboarding = translations[language].onboarding;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({...prev, [name]: value}));
    };

    const handleSave = () => {
        onUpdate(formData);
        setIsEditing(false);
    };

    const renderInput = (key: keyof Profile) => {
        if (key === 'district') {
            return (
                 <div>
                    <label className="block text-sm font-medium text-gray-700 capitalize">{t.labels[key]}</label>
                    <select
                        name="district"
                        value={formData.district}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    >
                        {Object.entries(translations[language].districts).map(([distKey, distValue]) => (
                            <option key={distKey} value={distKey}>{distValue}</option>
                        ))}
                    </select>
                </div>
            )
        }
        return (
            <div>
                <label className="block text-sm font-medium text-gray-700 capitalize">{t.labels[key]}</label>
                <input
                    type="text"
                    name={key}
                    value={formData[key]}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                />
            </div>
        )

    }

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-green-200">
            <h2 className="text-2xl font-bold text-green-800 mb-4">{t.title}</h2>
            {isEditing ? (
                <div className="space-y-4">
                    {(Object.keys(t.labels) as Array<keyof Profile>).map((key) => (
                        <div key={key}>
                           {renderInput(key)}
                        </div>
                    ))}
                    <div className="flex justify-end gap-2 mt-4">
                        <button onClick={() => setIsEditing(false)} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">{t.cancel}</button>
                        <button onClick={handleSave} className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">{t.save}</button>
                    </div>
                </div>
            ) : (
                 <div className="space-y-3">
                    <p><strong>{t.labels.name}:</strong> {profile.name}</p>
                    <p><strong>{t.labels.district}:</strong> {translations[language].districts[profile.district as keyof typeof translations['en']['districts']] || profile.district}</p>
                    <p><strong>{t.labels.landSize}:</strong> {profile.landSize}</p>
                    <p><strong>{t.labels.crop}:</strong> {profile.crop}</p>
                    <p><strong>{t.labels.soilType}:</strong> {profile.soilType}</p>
                    <p><strong>{t.labels.irrigation}:</strong> {profile.irrigation}</p>
                    <div className="flex justify-end mt-4">
                        <button onClick={() => setIsEditing(true)} className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
                            {t.editProfile}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};