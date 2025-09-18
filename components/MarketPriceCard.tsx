import React from 'react';
import type { MarketPrice, Language } from '../types';
import { translations } from '../translations';
import { PriceTagIcon } from './icons/PriceTagIcon';
import { ArrowTrendingUpIcon } from './icons/ArrowTrendingUpIcon';
import { ArrowTrendingDownIcon } from './icons/ArrowTrendingDownIcon';
import { MinusIcon } from './icons/MinusIcon';

interface MarketPriceCardProps {
    priceData: MarketPrice | null;
    isLoading: boolean;
    language: Language;
}

const TrendIndicator: React.FC<{ trend: 'up' | 'down' | 'stable', text: string }> = ({ trend, text }) => {
    const styles = {
        up: 'bg-green-100 text-green-700',
        down: 'bg-red-100 text-red-700',
        stable: 'bg-gray-100 text-gray-700',
    };
    const icon = {
        up: <ArrowTrendingUpIcon />,
        down: <ArrowTrendingDownIcon />,
        stable: <MinusIcon />,
    };

    return (
        <span className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${styles[trend]}`}>
            {icon[trend]}
            {text}
        </span>
    );
};

export const MarketPriceCard: React.FC<MarketPriceCardProps> = ({ priceData, isLoading, language }) => {
    const t = translations[language].marketPrice;

    return (
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 h-full">
            <div className="flex items-center gap-3 mb-4">
                <span className="text-farm-green-dark"><PriceTagIcon /></span>
                <h2 className="text-xl font-bold text-gray-800">{t.title}</h2>
            </div>
            
            <div className="space-y-4">
                {isLoading ? (
                    <>
                        <div className="h-8 bg-gray-100 rounded-lg animate-pulse w-3/4"></div>
                        <div className="h-6 bg-gray-100 rounded-lg animate-pulse w-full"></div>
                        <div className="h-6 bg-gray-100 rounded-lg animate-pulse w-5/6"></div>
                    </>
                ) : priceData ? (
                    <div>
                        <div className="flex justify-between items-center mb-2">
                           <p className="font-bold text-gray-800 text-lg">{priceData.cropName}</p>
                           <TrendIndicator trend={priceData.trend} text={t.trends[priceData.trend]}/>
                        </div>

                        <p className="text-3xl font-bold text-farm-green-dark">{priceData.price}</p>
                        <p className="text-sm text-gray-500">{priceData.unit}</p>
                        
                        <div className="mt-4 border-t pt-3">
                             <p className="text-sm text-gray-500">{t.market}: <span className="font-medium text-gray-700">{priceData.market}</span></p>
                        </div>
                    </div>
                ) : (
                    <p className="text-gray-500 text-center py-8">{t.noData}</p>
                )}
            </div>
        </div>
    );
};
