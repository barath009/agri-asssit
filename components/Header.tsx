import React from 'react';
import type { Language } from '../types';
import { translations } from '../translations';

interface HeaderProps {
    language: Language;
}

export const Header: React.FC<HeaderProps> = ({ language }) => {
    return (
        <header className="bg-green-800 text-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-4">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3.31 4.312C2.686 4.936 2.333 5.89 2.333 7c0 1.11.353 2.064.977 2.688A3.335 3.335 0 006.333 11c1.33 0 2.502-.8 3.033-2H17a1 1 0 100-2H9.366A3.328 3.328 0 006.333 5c-1.11 0-2.064.353-2.688.977A3.322 3.322 0 003.31 4.312zM12 3a1 1 0 011 1v1h1a1 1 0 110 2h-1v1a1 1 0 11-2 0V7h-1a1 1 0 110-2h1V4a1 1 0 011-1zM4 14a1 1 0 011-1h1.634A3.328 3.328 0 009.667 15c1.11 0 2.064-.353 2.688-.977.624-.624.977-1.578.977-2.688a3.335 3.335 0 00-1.023-2.333H17a1 1 0 100-2h-3.69a3.322 3.322 0 00-.977 2.688 3.335 3.335 0 001.023 2.333C13.502 15.2 12.33 16 11 16a3.328 3.328 0 01-3.033-2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
                <h1 className="text-2xl md:text-3xl font-bold">
                    {translations[language].appName}
                </h1>
            </div>
        </header>
    );
}
