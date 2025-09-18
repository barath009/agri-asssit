import React from 'react';
import type { Task } from '../types';
import type { Language } from '../types';
import { translations } from '../translations';
import { CalendarIcon } from './icons/CalendarIcon';

interface TaskListProps {
    tasks: Task[];
    onToggleTask: (id: string) => void;
    language: Language;
    isLoading: boolean;
}

const priorityStyles = {
    high: 'bg-red-100 text-red-700',
    medium: 'bg-yellow-100 text-yellow-700',
    low: 'bg-blue-100 text-blue-700',
};


export const TaskList: React.FC<TaskListProps> = ({ tasks, onToggleTask, language, isLoading }) => {
    const t = translations[language].tasks;
    const sortedTasks = [...tasks].sort((a, b) => {
        if (a.completed === b.completed) return 0;
        return a.completed ? 1 : -1;
    });

    return (
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 h-full">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">{t.title}</h2>
            </div>
            
            <div className="space-y-3">
                {isLoading ? (
                    <>
                        <div className="h-16 bg-gray-100 rounded-lg animate-pulse"></div>
                        <div className="h-16 bg-gray-100 rounded-lg animate-pulse" style={{ animationDelay: '0.1s' }}></div>
                        <div className="h-16 bg-gray-100 rounded-lg animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                    </>
                ) : sortedTasks.length > 0 ? (
                    sortedTasks.map(task => (
                        <div 
                            key={task.id} 
                            className={`flex items-start gap-3 p-3 bg-gray-50 rounded-lg transition-opacity ${task.completed ? 'opacity-60' : 'opacity-100'}`}
                        >
                            <input
                                type="checkbox"
                                checked={task.completed}
                                onChange={() => onToggleTask(task.id)}
                                className="h-5 w-5 rounded border-gray-300 text-farm-green focus:ring-farm-green cursor-pointer flex-shrink-0 mt-1"
                            />
                            <div className="flex-1">
                                <span className={`${task.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                                    {task.text}
                                </span>
                                {task.dueDate && (
                                    <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                                        <CalendarIcon className="h-4 w-4" />
                                        <span>{task.dueDate}</span>
                                    </div>
                                )}
                            </div>
                            <span className={`px-2 py-0.5 text-xs font-semibold rounded-full self-center ${priorityStyles[task.priority || 'medium']}`}>
                                {t.priorities[task.priority || 'medium']}
                            </span>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500 text-center py-4">{t.noTasks}</p>
                )}
            </div>
        </div>
    );
};