import React from 'react';
import type { Language } from './types';
import { translations } from './translations';
import { CheckCircleIcon } from './components/icons/CheckCircleIcon';
import { PlusCircleIcon } from './components/icons/PlusCircleIcon';

interface LandingPageProps {
    onLogin: () => void;
    language: Language;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLogin, language }) => {
    const t = translations[language].landingPage;

    return (
        <div className="bg-white text-gray-700">
            <main className="pt-16">
                {/* Hero Section */}
                <section className="bg-farm-green-light">
                    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-8 items-center py-12 md:py-20">
                        <div className="text-center md:text-left">
                            <span className="text-sm font-bold text-farm-green-dark uppercase">{t.hero.subtitle}</span>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mt-2 leading-tight">{t.hero.title}</h1>
                            <p className="mt-4 text-lg text-gray-600">{t.hero.description}</p>
                            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                                <button onClick={onLogin} className="px-8 py-3 bg-farm-green-dark text-white rounded-lg font-semibold hover:bg-green-800 transition-transform hover:scale-105 shadow-lg">{t.hero.cta}</button>
                                <button onClick={onLogin} className="px-8 py-3 bg-white text-farm-green-dark rounded-lg font-semibold border border-gray-200 hover:bg-gray-50 shadow-lg">{t.hero.loginLink}</button>
                            </div>
                        </div>
                        <div>
                            <img src="https://storage.googleapis.com/aistudio-hosting/krishi-sakhi/farmer-hero.png" alt="Farmer using a tablet in a field" className="rounded-lg shadow-2xl w-full h-auto object-cover" />
                        </div>
                    </div>
                </section>

                {/* Stats Section */}
                <section className="py-12 bg-white">
                    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
                        {/* FIX: Use Object.keys and cast for type-safe access to fix key error */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                            {Object.keys(t.stats).map(key => (
                                <div key={key}>
                                    <div className="flex justify-center items-center text-farm-green mb-2">
                                        <PlusCircleIcon />
                                    </div>
                                    <p className="text-3xl md:text-4xl font-bold text-gray-800">{t.stats[key as keyof typeof t.stats].value}</p>
                                    <p className="text-sm text-gray-500">{t.stats[key as keyof typeof t.stats].label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                 <section className="py-16 bg-farm-green-light">
                    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-800">{t.features.title}</h2>
                        <p className="mt-4 max-w-3xl mx-auto text-gray-600">{t.features.subtitle}</p>
                        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {t.features.list.map((feature, index) => (
                                <div key={index} className="bg-white p-6 rounded-lg shadow-md text-left border-t-4 border-farm-green">
                                    <h3 className="text-lg font-bold text-gray-800">{feature.title}</h3>
                                    <p className="mt-2 text-sm text-gray-600">{feature.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                 {/* Plant Images Section */}
                <section className="py-12 bg-white hidden md:block">
                     <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <img src="https://storage.googleapis.com/aistudio-hosting/krishi-sakhi/plant-journey.png" alt="Plant growth stages" className="mx-auto" />
                     </div>
                </section>
                

                {/* Why Choose Section */}
                <section className="py-16 bg-farm-green-light">
                    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="bg-white p-8 rounded-lg shadow-xl border border-gray-200 grid md:grid-cols-2 gap-8 items-center">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800">{t.whyChoose.title}</h2>
                                <ul className="mt-4 space-y-3">
                                    {t.whyChoose.reasons.map((reason, index) => (
                                        <li key={index} className="flex items-start gap-3">
                                            <span className="text-farm-green mt-1"><CheckCircleIcon /></span>
                                            <span className="text-gray-600">{reason}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                             <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                                <h3 className="text-xl font-bold text-center">{t.whyChoose.form.title}</h3>
                                <p className="text-sm text-gray-500 text-center">{t.whyChoose.form.subtitle}</p>
                                <ul className="mt-4 space-y-2">
                                     {t.whyChoose.form.features.map((feature, index) => (
                                        <li key={index} className="flex items-center gap-2 text-sm">
                                            <span className="text-farm-green"><CheckCircleIcon /></span>
                                            <span className="text-gray-700">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                                <button onClick={onLogin} className="w-full mt-6 py-3 bg-farm-green-dark text-white rounded-lg font-semibold hover:bg-green-800 transition-colors">{t.whyChoose.form.cta}</button>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="bg-gray-800 text-white">
                <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                     <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div className="md:col-span-1">
                             <div className="flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-farm-green" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M17.713 3.333A10.023 10.023 0 0010 0C4.477 0 0 4.477 0 10A10.005 10.005 0 0010 20c.465 0 .922-.033 1.373-.1a.75.75 0 00.565-1.096 7.5 7.5 0 01-8.11-8.11.75.75 0 00-1.097-.565A10.005 10.005 0 000 10c0-4.52 2.98-8.397 7.12-9.627a1 1 0 011.162.376l.25.417a.5.5 0 00.866-.002l.249-.415a1 1 0 011.162-.377A9.998 9.998 0 0117.713 3.333zM12.5 10a2.5 2.5 0 10-5 0 2.5 2.5 0 005 0z" />
                                    <path d="M18.75 11.25a.75.75 0 00-1.5 0v2.668l-1.33-1.33a.75.75 0 00-1.06 1.06l2.5 2.5a.75.75 0 001.06 0l2.5-2.5a.75.75 0 10-1.06-1.06l-1.33 1.33V11.25z" />
                                </svg>
                                <h1 className="text-xl font-bold text-white">Krishi Sakhi</h1>
                            </div>
                             <p className="mt-4 text-sm text-gray-400">{t.footer.tagline}</p>
                        </div>
                        {/* FIX: Use Object.keys and cast for type-safe access to fix key error */}
                        {Object.keys(t.footer.sections).map(key => (
                             <div key={key}>
                                <h4 className="font-semibold">{t.footer.sections[key as keyof typeof t.footer.sections].title}</h4>
                                <ul className="mt-4 space-y-2">
                                    {t.footer.sections[key as keyof typeof t.footer.sections].links.map((link, i) => (
                                        <li key={i}><a href="#" className="text-gray-400 hover:text-white text-sm">{link}</a></li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                    <div className="mt-8 border-t border-gray-700 pt-8 text-center text-sm text-gray-400">
                        <p>{t.footer.copyright}</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};