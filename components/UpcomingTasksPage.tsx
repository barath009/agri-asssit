import React from 'react';
import type { Language, Task, WeeklyTasks, AITask } from '../types';
import { translations } from '../translations';
import { CalendarIcon } from './icons/CalendarIcon';

interface UpcomingTasksPageProps {
    todaysTasks: Task[];
    isTodaysTasksLoading: boolean;
    weeklyTasks: WeeklyTasks | null;
    isWeeklyTasksLoading: boolean;
    language: Language;
}

const priorityStyles: { [key: string]: string } = {
    high: 'bg-red-100 text-red-700 border-red-200',
    medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    low: 'bg-blue-100 text-blue-700 border-blue-200',
};

const TaskItem: React.FC<{ task: Task | AITask }> = ({ task }) => {
    const t = translations['en'].tasks; // Use a fixed language for priorities as they are keys
    const isCompleted = 'completed' in task ? task.completed : false;

    return (
        <div className={`flex items-start gap-4 p-3 bg-gray-50 rounded-lg border-l-4 ${isCompleted ? 'opacity-60 border-gray-300' : 'border-gray-200'}`}>
            <div className="flex-1">
                <p className={`${isCompleted ? 'line-through text-gray-500' : 'text-gray-800'}`}>{task.text}</p>
                <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                    <div className="flex items-center gap-1">
                        <CalendarIcon className="h-4 w-4" />
                        {/* FIX: Use a reliable property like 'completed' to differentiate between Task and AITask types. */}
                        <span>{'completed' in task ? task.dueDate : task.time}</span>
                    </div>
                </div>
            </div>
            <div className={`px-2 py-1 text-xs font-semibold rounded-full border ${priorityStyles[task.priority]}`}>
                {t.priorities[task.priority]}
            </div>
        </div>
    );
};


const LoadingSkeleton: React.FC = () => (
    <div className="space-y-3">
        <div className="h-16 bg-gray-200 rounded-lg animate-pulse"></div>
        <div className="h-16 bg-gray-200 rounded-lg animate-pulse" style={{ animationDelay: '0.1s' }}></div>
        <div className="h-16 bg-gray-200 rounded-lg animate-pulse" style={{ animationDelay: '0.2s' }}></div>
    </div>
);

export const UpcomingTasksPage: React.FC<UpcomingTasksPageProps> = ({ todaysTasks, isTodaysTasksLoading, weeklyTasks, isWeeklyTasksLoading, language }) => {
    const t = translations[language].upcomingTasks;
    
    return (
        <div className="max-w-screen-xl mx-auto space-y-6">
            {/* Header */}
            <div>
                <div className="flex items-center gap-3">
                    <CalendarIcon className="h-8 w-8 text-farm-green-dark" />
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">{t.title}</h1>
                        <p className="text-gray-500 mt-1">{t.subtitle}</p>
                    </div>
                </div>
            </div>

            {/* Today's Tasks Card */}
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">{t.todaysTasks}</h2>
                {isTodaysTasksLoading ? (
                    <LoadingSkeleton />
                ) : todaysTasks.length > 0 ? (
                    <div className="space-y-3">
                        {todaysTasks.map(task => (
                            <TaskItem key={task.id} task={task} />
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500 text-center py-4">{translations[language].tasks.noTasks}</p>
                )}
            </div>

            {/* Upcoming Tasks Card */}
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">{t.upcomingHeader}</h2>
                {isWeeklyTasksLoading ? (
                    <LoadingSkeleton />
                ) : weeklyTasks ? (
                    <div className="space-y-6">
                        {Object.entries(weeklyTasks).map(([dayKey, tasks], index) => (
                            <div key={dayKey}>
                                <h3 className="font-bold text-farm-green-dark text-lg mb-2 pb-2 border-b border-gray-200">{t.day(index + 2)}</h3>
                                {tasks.length > 0 ? (
                                    <div className="space-y-2">
                                        {tasks.map((task, taskIndex) => (
                                            <TaskItem key={taskIndex} task={task} />
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-500 pl-4">{translations[language].tasks.noTasks}</p>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500 text-center py-8">{t.noUpcomingTasks}</p>
                )}
            </div>
        </div>
    );
};