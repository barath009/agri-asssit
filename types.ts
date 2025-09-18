export interface Profile {
  name: string;
  email?: string;
  district: string;
  landSize: string;
  crop: string;
  soilType: string;
  irrigation: string;
}

export enum MessageRole {
    User = 'user',
    AI = 'ai',
}

export interface Message {
  role: MessageRole;
  text: string;
  timestamp: Date;
  imageUrl?: string;
}

// The task object structure used within the app's state
export interface Task {
  id: string;
  text: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
  dueDate?: string; // e.g., "Morning", "By 2 PM"
}

// The task object structure returned by the AI
export interface AITask {
    text: string;
    time: string; // This will map to dueDate
    priority: 'high' | 'medium' | 'low';
}

export type ChatMessageRole = 'user' | 'model';

export type Page = 'dashboard' | 'soil-analysis' | 'crop-recommendations' | 'analysis-history' | 'profile' | 'upcoming-tasks';

export type Language = 'en' | 'ml' | 'ta';

export interface SoilData {
    ph: string;
    ec: string;
    oc: string;
    soilType: string;
    n: string;
    p: string;
    k: string;
    ca: string;
    mg: string;
    s: string;
}

export interface CropRecommendation {
    cropName: string;
    suitability: 'Best' | 'Excellent' | 'Good';
    yield: string;
    duration: string;
    reasons: string[];
    plantingTips: string[];
}
export interface AnalysisRecord {
    id: string;
    date: string;
    soilData: SoilData;
    recommendations: CropRecommendation[];
}

export interface DashboardAdvice {
    title: string;
    advice: string[];
}

export interface MarketPrice {
    cropName: string;
    price: string;
    unit: string;
    market: string;
    trend: 'up' | 'down' | 'stable';
}

export interface WeeklyTasks {
    [day: string]: AITask[];
}
