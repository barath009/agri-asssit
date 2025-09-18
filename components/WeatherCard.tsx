import React, { useState } from 'react';
import type { Language } from '../types';
import { translations } from '../translations';

interface WeatherCardProps {
    language: Language;
}

const WeatherIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 15a4 4 0 004 4h9a5 5 0 10-2-9.75V10a3 3 0 00-3-3h-1m-4-3l.5 1.5M21 15a4 4 0 00-4-4h-2.5m-7.5 0A3.5 3.5 0 017.5 6H9m6 0a3 3 0 00-3-3h-1M3 15a4 4 0 004 4h9a5 5 0 10-2-9.75V10a3 3 0 00-3-3h-1m-4-3l.5 1.5" />
    </svg>
);

interface WeatherData {
    city: string;
    country: string;
    tempC: string;
    description: string;
    humidity: string;
    precipitation: string;
}

const initialWeather: { [key in Language]: WeatherData } = {
    en: { city: 'Kochi', country: 'IN', tempC: '25', description: 'Overcast Clouds', humidity: '91%', precipitation: '0mm' },
    ml: { city: 'കൊച്ചി', country: 'IN', tempC: '25', description: 'മേഘാവൃതം', humidity: '91%', precipitation: '0mm' },
    ta: { city: 'கொச்சி', country: 'IN', tempC: '25', description: 'மேகமூட்டம்', humidity: '91%', precipitation: '0mm' },
};


export const WeatherCard: React.FC<WeatherCardProps> = ({ language }) => {
    const t = translations[language].weather;
    const [searchQuery, setSearchQuery] = useState('');
    const [weather, setWeather] = useState<WeatherData>(initialWeather[language]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    React.useEffect(() => {
        setWeather(initialWeather[language]);
    }, [language]);


    const handleSearch = async () => {
        if (!searchQuery.trim()) return;
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch(`https://wttr.in/${encodeURIComponent(searchQuery)}?format=j1`);
            if (!response.ok) {
                throw new Error('City not found');
            }
            const data = await response.json();

            const currentCondition = data.current_condition[0];
            const nearestArea = data.nearest_area[0];

            const newWeather: WeatherData = {
                city: nearestArea.areaName[0].value,
                country: nearestArea.country[0].value,
                tempC: currentCondition.temp_C,
                description: currentCondition.weatherDesc[0].value,
                humidity: `${currentCondition.humidity}%`,
                precipitation: `${currentCondition.precipMM}mm`,
            };
            setWeather(newWeather);
            setSearchQuery('');
        } catch (err) {
            setError(t.error);
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

     const handleReset = () => {
        setWeather(initialWeather[language]);
        setError(null);
        setSearchQuery('');
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleSearch();
    };


    return (
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 h-full">
            <h2 className="text-xl font-bold text-gray-800 mb-4">{t.title}</h2>
            <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
                <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t.placeholder}
                    className="flex-1 w-full px-3 py-2 bg-gray-100 border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-farm-green sm:text-sm"
                    disabled={isLoading}
                />
                <button type="submit" className="px-4 py-2 bg-farm-green text-white rounded-md hover:bg-farm-green-dark transition-colors disabled:bg-green-300" disabled={isLoading}>
                    {isLoading ? '...' : t.search}
                </button>
            </form>
            <button onClick={handleReset} className="text-sm font-medium text-farm-green-dark hover:underline w-full text-left mb-4">
                {t.reset}
            </button>

            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

            <div className="flex items-center gap-4">
                <WeatherIcon />
                <div>
                    <p className="text-5xl font-bold text-gray-800">{weather.tempC}°C</p>
                    <p className="font-semibold text-gray-600">{weather.city}, {weather.country}</p>
                    <p className="text-sm text-gray-500">{weather.description}</p>
                </div>
            </div>
            <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
                <p>💧 {weather.humidity}</p>
                <p>💨 {weather.precipitation}</p>
            </div>
        </div>
    );
};
