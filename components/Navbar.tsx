import React from 'react';
import type { Language, Page } from '../types';
import { translations } from '../translations';

interface NavbarProps {
    isLoggedIn: boolean;
    userName: string;
    language: Language;
    onLanguageChange: (lang: Language) => void;
    onLogin: () => void;
    onLogout: () => void;
    onChatClick?: () => void;
    activePage?: Page;
    onNavigate?: (page: Page) => void;
}

const UserIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
);


const LanguageIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m4 13-4-4m0 0l4-4m-4 4h12" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21l-4-4m0 0l4-4m-4 4H5" />
    </svg>
);

const Logo = () => (
    <div className="flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-farm-green" viewBox="0 0 20 20" fill="currentColor">
            <path d="M17.713 3.333A10.023 10.023 0 0010 0C4.477 0 0 4.477 0 10A10.005 10.005 0 0010 20c.465 0 .922-.033 1.373-.1a.75.75 0 00.565-1.096 7.5 7.5 0 01-8.11-8.11.75.75 0 00-1.097-.565A10.005 10.005 0 000 10c0-4.52 2.98-8.397 7.12-9.627a1 1 0 011.162.376l.25.417a.5.5 0 00.866-.002l.249-.415a1 1 0 011.162-.377A9.998 9.998 0 0117.713 3.333zM12.5 10a2.5 2.5 0 10-5 0 2.5 2.5 0 005 0z" />
            <path d="M18.75 11.25a.75.75 0 00-1.5 0v2.668l-1.33-1.33a.75.75 0 00-1.06 1.06l2.5 2.5a.75.75 0 001.06 0l2.5-2.5a.75.75 0 10-1.06-1.06l-1.33 1.33V11.25z" />
        </svg>
        <h1 className="text-xl font-bold text-gray-800">Krishi Sakhi</h1>
    </div>
);


export const Navbar: React.FC<NavbarProps> = ({ isLoggedIn, userName, language, onLanguageChange, onLogin, onLogout, onChatClick, activePage, onNavigate }) => {
    const t = translations[language];
    const isSoilAnalysisActive = activePage === 'soil-analysis' || activePage === 'crop-recommendations';

    return (
        <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-50 shadow-sm border-b border-gray-200">
            <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <Logo />
                    
                    {isLoggedIn && onNavigate && (
                        <nav className="hidden md:flex items-center gap-2 lg:gap-4">
                            {t.navbar.links.map(link => (
                                <button
                                    key={link.id}
                                    onClick={() => onNavigate(link.id as Page)}
                                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                                        (activePage === link.id || (link.id === 'soil-analysis' && isSoilAnalysisActive))
                                        ? 'bg-farm-green-light text-farm-green-dark' 
                                        : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
                                    }`}
                                >
                                    {link.name}
                                </button>
                            ))}
                             <button
                                onClick={onChatClick}
                                className="px-3 py-2 rounded-md text-sm font-medium transition-colors text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                            >
                                {t.navbar.chatAssistant}
                            </button>
                        </nav>
                    )}

                    <div className="flex items-center gap-4">
                         <div className="relative">
                            <select 
                                value={language}
                                onChange={(e) => onLanguageChange(e.target.value as Language)}
                                className="appearance-none bg-transparent text-gray-500 hover:text-gray-700 font-medium py-1 pl-2 pr-8 rounded-md focus:outline-none focus:ring-2 focus:ring-farm-green"
                            >
                                <option value="en">English</option>
                                <option value="ml">മലയാളം</option>
                                <option value="ta">தமிழ்</option>
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none text-gray-500">
                                <LanguageIcon />
                            </div>
                        </div>

                        {isLoggedIn ? (
                             <>
                                <button 
                                    onClick={() => onNavigate && onNavigate('profile')}
                                    className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${activePage === 'profile' ? 'bg-farm-green-light text-farm-green-dark' : 'text-gray-500 hover:bg-gray-100'}`}
                                >
                                   <UserIcon />
                                   <span className="hidden sm:block">{userName}</span>
                                </button>
                                <button onClick={onLogout} className="hidden sm:block text-sm font-medium text-gray-600 hover:text-farm-green">{t.navbar.logout}</button>
                            </>
                        ) : (
                            <>
                                <button onClick={onLogin} className="hidden sm:block text-sm font-medium text-gray-600 hover:text-farm-green">{t.landingPage.header.login}</button>
                                <button onClick={onLogin} className="px-4 py-2 bg-farm-green-dark text-white rounded-md text-sm font-medium hover:bg-green-800 transition-colors">{t.landingPage.header.getStarted}</button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}