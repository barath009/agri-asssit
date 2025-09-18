import React from 'react';
import type { Task, DashboardAdvice, MarketPrice } from '../types';
import { TaskList } from './TaskList';
import { StatsCard } from './StatsCard';
import { WeatherCard } from './WeatherCard';
import { RecentActivityCard } from './RecentActivityCard';
import type { Language } from '../types';
import { translations } from '../translations';
import { PersonalizedAdvice } from './PersonalizedAdvice';
import { MarketPriceCard } from './MarketPriceCard';


interface DashboardProps {
    tasks: Task[];
    onToggleTask: (id: string) => void;
    language: Language;
    isTasksLoading: boolean;
    advice: DashboardAdvice | null;
    isAdviceLoading: boolean;
    marketPrice: MarketPrice | null;
    isMarketPriceLoading: boolean;
    activeCrops: number;
}

export const Dashboard: React.FC<DashboardProps> = ({ tasks, onToggleTask, language, isTasksLoading, advice, isAdviceLoading, marketPrice, isMarketPriceLoading, activeCrops }) => {
    const t = translations[language].dashboard;

    const nextIncompleteTask = tasks.find(task => !task.completed);

    return (
        <div className="max-w-screen-xl mx-auto">
            {/* Welcome Header */}
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-800">{t.welcome} 👋</h1>
                <p className="text-gray-500 mt-1">{t.subtitle}</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <StatsCard 
                    title={t.stats.activeCrops.title}
                    value={activeCrops.toString()} 
                    language={language}
                />
                <StatsCard 
                    title={t.stats.soilHealth.title}
                    value={t.stats.soilHealth.value}
                    subValue="pH 6.8" 
                    language={language}
                />
                <StatsCard 
                    title={t.stats.waterLevel.title}
                    value="78%" 
                    subValue={t.stats.waterLevel.value}
                    language={language}
                />
                <StatsCard 
                    title={t.stats.nextTask.title}
                    value={nextIncompleteTask?.dueDate || t.stats.nextTask.value}
                    subValue={nextIncompleteTask?.text || t.stats.nextTask.subValue}
                    language={language}
                />
            </div>

            {/* Main Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                <div className="lg:col-span-1">
                    <PersonalizedAdvice advice={advice} isLoading={isAdviceLoading} language={language} />
                </div>
                <div className="lg:col-span-2">
                    <TaskList tasks={tasks} onToggleTask={onToggleTask} language={language} isLoading={isTasksLoading} />
                </div>
            </div>

            {/* Bottom Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                    <MarketPriceCard priceData={marketPrice} isLoading={isMarketPriceLoading} language={language} />
                </div>
                <div className="lg:col-span-1">
                    <WeatherCard language={language} />
                </div>
                <div className="lg:col-span-1">
                    <RecentActivityCard language={language} />
                </div>
            </div>

        </div>
    );
};