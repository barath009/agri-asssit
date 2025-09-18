


import React, { useState, useCallback, useRef, useEffect } from 'react';
import type { Chat, Part } from '@google/genai';
import { ChatWindow } from './components/ChatWindow';
import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { SoilAnalysis } from './components/SoilAnalysis';
import { CropRecommendations } from './components/CropRecommendations';
import { createChatSession, getSoilRecommendations, getDailyTasks, getDashboardAdvice, getMarketPrice, getWeeklyTasks } from './services/geminiService';
import type { Profile, Message, Task, SoilData, CropRecommendation, AnalysisRecord, Page, Language, DashboardAdvice, MarketPrice, WeeklyTasks, AITask } from './types';
import { MessageRole } from './types';
import { translations } from './translations';
import { LandingPage } from './LandingPage';
import { AnalysisHistory } from './components/AnalysisHistory';
import { ProfileCard } from './components/ProfileCard';
import { OnboardingModal } from './components/OnboardingModal';
import { UpcomingTasksPage } from './components/UpcomingTasksPage';


// Helper function to convert a File object to a GoogleGenerativeAI.Part
const fileToGenerativePart = async (file: File): Promise<Part> => {
    const base64EncodedData = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve((reader.result as string).split(',')[1]);
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file);
    });

    return {
        inlineData: {
            data: base64EncodedData,
            mimeType: file.type,
        },
    };
};

const App: React.FC = () => {
  const [profile, setProfile] = useState<Profile>({
    name: '',
    email: '',
    district: 'Alappuzha',
    landSize: '',
    crop: '',
    soilType: '',
    irrigation: '',
  });
  
  const [language, setLanguage] = useState<Language>('en');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [activeCrops, setActiveCrops] = useState(0);
  
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    if(isLoggedIn) {
        setMessages([
            {
              role: MessageRole.AI,
              text: translations[language].chat.initialMessage,
              timestamp: new Date(),
            }
        ]);
    }
  }, [language, isLoggedIn]);


  const [tasks, setTasks] = useState<Task[]>([]);
  const [isTasksLoading, setIsTasksLoading] = useState(false);
  const [dashboardAdvice, setDashboardAdvice] = useState<DashboardAdvice | null>(null);
  const [isAdviceLoading, setIsAdviceLoading] = useState(false);
  const [marketPrice, setMarketPrice] = useState<MarketPrice | null>(null);
  const [isMarketPriceLoading, setIsMarketPriceLoading] = useState(false);
  const [weeklyTasks, setWeeklyTasks] = useState<WeeklyTasks | null>(null);
  const [isWeeklyTasksLoading, setIsWeeklyTasksLoading] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [soilData, setSoilData] = useState<SoilData | null>(null);
  const [recommendations, setRecommendations] = useState<CropRecommendation[]>([]);
  const [analysisHistory, setAnalysisHistory] = useState<AnalysisRecord[]>([]);
  const [cameFromHistory, setCameFromHistory] = useState(false);

  const chatRef = useRef<Chat | null>(null);

  useEffect(() => {
    try {
        const storedHistory = localStorage.getItem('krishi-sakhi-history');
        if (storedHistory) {
            setAnalysisHistory(JSON.parse(storedHistory));
        }

    } catch (error) {
        console.error("Failed to load data from localStorage", error);
    }
  }, []);

   useEffect(() => {
    try {
        localStorage.setItem('krishi-sakhi-history', JSON.stringify(analysisHistory));
    } catch (error) {
        console.error("Failed to save analysis history to localStorage", error);
    }
  }, [analysisHistory]);

  const initializeChat = useCallback(() => {
    if(!profile.name) return; // Don't initialize chat if not logged in
    try {
      const chat = createChatSession(profile, language);
      chatRef.current = chat;
    } catch (error) {
      console.error("Failed to initialize chat:", error);
      setMessages(prev => [...prev, {
        role: MessageRole.AI,
        text: translations[language].errors.chatInit,
        timestamp: new Date(),
      }]);
    }
  }, [profile, language]);

  useEffect(() => {
    const fetchAdvice = async () => {
        if (isLoggedIn && profile.crop) {
            setIsAdviceLoading(true);
            try {
                const adviceData = await getDashboardAdvice(profile, language);
                setDashboardAdvice(adviceData);
            } catch (error) {
                console.error("Failed to fetch dashboard advice:", error);
                setDashboardAdvice(null);
            } finally {
                setIsAdviceLoading(false);
            }
        } else {
            setDashboardAdvice(null);
        }
    };

    fetchAdvice();
  }, [isLoggedIn, profile, language]);

  useEffect(() => {
    const fetchMarketPrice = async () => {
        if (isLoggedIn && profile.crop) {
            setIsMarketPriceLoading(true);
            try {
                const priceData = await getMarketPrice(profile, language);
                setMarketPrice(priceData);
            } catch (error) {
                console.error("Failed to fetch market price:", error);
                setMarketPrice(null);
            } finally {
                setIsMarketPriceLoading(false);
            }
        } else {
            setMarketPrice(null);
        }
    };

    fetchMarketPrice();
  }, [isLoggedIn, profile, language]);
  
  useEffect(() => {
    const fetchTasks = async () => {
      if (isLoggedIn && profile.crop) {
        setIsTasksLoading(true);
        try {
          const aiTasks = await getDailyTasks(profile, language);
          const newTasks: Task[] = aiTasks.map((aiTask, index) => ({
            id: `${Date.now()}-${index}`,
            text: aiTask.text,
            completed: false,
            priority: aiTask.priority || 'medium',
            dueDate: aiTask.time,
          }));
          setTasks(newTasks);
        } catch (error) {
          console.error("Failed to fetch daily tasks:", error);
          setTasks([]); // Clear tasks on error
        } finally {
          setIsTasksLoading(false);
        }
      } else {
          setTasks([]); // Clear tasks if not logged in
      }
    };

    fetchTasks();
  }, [isLoggedIn, profile, language]);

    useEffect(() => {
        const fetchWeeklyTasks = async () => {
            if (isLoggedIn && profile.crop) {
                setIsWeeklyTasksLoading(true);
                try {
                    const weeklyData = await getWeeklyTasks(profile, language);
                    setWeeklyTasks(weeklyData);
                } catch (error) {
                    console.error("Failed to fetch weekly tasks:", error);
                    setWeeklyTasks(null);
                } finally {
                    setIsWeeklyTasksLoading(false);
                }
            } else {
                setWeeklyTasks(null);
            }
        };
        fetchWeeklyTasks();
    }, [isLoggedIn, profile, language]);


  useEffect(() => {
    if (isLoggedIn) {
        initializeChat();
    }
  }, [initializeChat, isLoggedIn]);

  const handleSpeak = (text: string) => {
    if ('speechSynthesis' in window) {
      const langCode = { en: 'en-US', ml: 'ml-IN', ta: 'ta-IN' }[language];
      window.speechSynthesis.cancel(); 
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = langCode;
      window.speechSynthesis.speak(utterance);
    } else {
      console.warn("Speech Synthesis is not supported by this browser.");
    }
  };

  const handleAddTask = (aiTask: AITask) => {
    const newTask: Task = {
        id: Date.now().toString(),
        text: aiTask.text,
        completed: false,
        priority: aiTask.priority || 'medium',
        dueDate: aiTask.time,
    };
    setTasks(prev => [newTask, ...prev]);
  };

  const handleToggleTask = (id: string) => {
      setTasks(prev =>
          prev.map(task =>
              task.id === id ? { ...task, completed: !task.completed } : task
          )
      );
  };

  const handleSendMessage = async (text: string, image?: File) => {
    if ((!text.trim() && !image) || isLoading) return;

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    const userMessage: Message = {
      role: MessageRole.User,
      text,
      timestamp: new Date(),
      imageUrl: image ? URL.createObjectURL(image) : undefined,
    };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    if (!chatRef.current) {
        initializeChat();
        if(!chatRef.current) {
            setMessages(prev => [...prev, {
                role: MessageRole.AI,
                text: translations[language].errors.chatInitRetry,
                timestamp: new Date(),
            }]);
            setIsLoading(false);
            return;
        }
    }

    try {
      let stream;
      const imagePrompt = translations[language].chat.imagePrompt;
      if (image) {
        const imagePart = await fileToGenerativePart(image);
        const prompt = text.trim() || imagePrompt;
        const textPart = { text: prompt };
        // FIX: The sendMessageStream method expects an object with a 'message' property.
        stream = await chatRef.current.sendMessageStream({ message: [textPart, imagePart] });
      } else {
        // FIX: The sendMessageStream method expects an object with a 'message' property.
        stream = await chatRef.current.sendMessageStream({ message: text });
      }

      let aiResponseText = '';
      let isToolResponse = false;
      let completeToolJson = '';

      setMessages(prev => [...prev, { role: MessageRole.AI, text: '', timestamp: new Date() }]);

      for await (const chunk of stream) {
        aiResponseText += chunk.text;
        
        if (aiResponseText.trim().startsWith('{')) {
            try {
                // Check if the text is a complete JSON object
                const potentialJson = JSON.parse(aiResponseText);
                if (potentialJson.action === 'addTask' && potentialJson.task) {
                    isToolResponse = true;
                    completeToolJson = aiResponseText;
                    break; 
                }
            } catch (e) {
                // Not a complete JSON object yet, continue accumulating chunks.
            }
        }
        
        if (!isToolResponse) {
            setMessages(prev => {
                const newMessages = [...prev];
                newMessages[newMessages.length - 1].text = aiResponseText;
                return newMessages;
            });
        }
      }

      if (isToolResponse) {
        const responseJson = JSON.parse(completeToolJson);
        handleAddTask(responseJson.task);
        const confirmationText = translations[language].chat.taskConfirmation(responseJson.task);
        setMessages(prev => {
            const newMessages = [...prev];
            newMessages[newMessages.length - 1].text = confirmationText;
            return newMessages;
        });
        handleSpeak(confirmationText);
      } else {
        if (aiResponseText.trim()) {
            handleSpeak(aiResponseText);
        }
      }

    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage: Message = {
        role: MessageRole.AI,
        text: translations[language].errors.sendMessage,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleAnalysisSubmit = async (data: SoilData) => {
    setIsAnalyzing(true);
    setSoilData(data);
    setCameFromHistory(false);
    try {
        const result = await getSoilRecommendations(data, language);
        setRecommendations(result);
        const newRecord: AnalysisRecord = {
            id: Date.now().toString(),
            date: new Date().toISOString(),
            soilData: data,
            recommendations: result
        };
        setAnalysisHistory(prev => [newRecord, ...prev]);
        setCurrentPage('crop-recommendations');
    } catch (error) {
        console.error("Failed to get crop recommendations:", error);
        alert(translations[language].errors.recommendations);
    } finally {
        setIsAnalyzing(false);
    }
  };

  const handleViewHistoryReport = (record: AnalysisRecord) => {
    setSoilData(record.soilData);
    setRecommendations(record.recommendations);
    setCameFromHistory(true);
    setCurrentPage('crop-recommendations');
  };

  const handleLogin = (newProfile: Profile) => {
    setProfile(newProfile);
    setIsLoggedIn(true);
    setShowOnboarding(false);
    setCurrentPage('soil-analysis'); // Start user at soil analysis
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setProfile({ name: '', email: '', district: 'Alappuzha', landSize: '', crop: '', soilType: '', irrigation: '' });
    setMessages([]);
    setActiveCrops(0);
  };

  const handleStartOnboarding = () => {
      setShowOnboarding(true);
  };

  const handleProfileUpdate = (updatedProfile: Profile) => {
    setProfile(updatedProfile);
  };

  const handleCropSelection = (cropName: string) => {
    setProfile(prev => ({ ...prev, crop: cropName }));
    setActiveCrops(1);
    setCurrentPage('dashboard');
    alert(translations[language].recommendations.cropSelected(cropName));
  };
  
  const renderPage = () => {
    switch(currentPage) {
        case 'dashboard':
            return <Dashboard 
                        tasks={tasks} 
                        onToggleTask={handleToggleTask} 
                        language={language} 
                        isTasksLoading={isTasksLoading} 
                        advice={dashboardAdvice} 
                        isAdviceLoading={isAdviceLoading} 
                        marketPrice={marketPrice} 
                        isMarketPriceLoading={isMarketPriceLoading}
                        activeCrops={activeCrops}
                    />;
        case 'soil-analysis':
            return <SoilAnalysis onAnalyze={handleAnalysisSubmit} isLoading={isAnalyzing} language={language} />;
        case 'analysis-history':
            return <AnalysisHistory history={analysisHistory} onViewReport={handleViewHistoryReport} onNewAnalysis={() => setCurrentPage('soil-analysis')} language={language} />;
        case 'profile':
            return <ProfileCard profile={profile} onUpdate={handleProfileUpdate} language={language} />;
        case 'upcoming-tasks':
            return <UpcomingTasksPage 
                        todaysTasks={tasks} 
                        isTodaysTasksLoading={isTasksLoading} 
                        weeklyTasks={weeklyTasks} 
                        isWeeklyTasksLoading={isWeeklyTasksLoading} 
                        language={language} 
                    />;
        case 'crop-recommendations':
             if (!soilData) {
                setCurrentPage('soil-analysis');
                return null;
             }
             return <CropRecommendations 
                        soilData={soilData} 
                        recommendations={recommendations} 
                        onBack={() => setCurrentPage(cameFromHistory ? 'analysis-history' : 'soil-analysis')} 
                        language={language}
                        cameFromHistory={cameFromHistory}
                        onSelectCrop={handleCropSelection}
                    />;
        default:
            return <Dashboard 
                        tasks={tasks} 
                        onToggleTask={handleToggleTask} 
                        language={language} 
                        isTasksLoading={isTasksLoading} 
                        advice={dashboardAdvice} 
                        isAdviceLoading={isAdviceLoading} 
                        marketPrice={marketPrice} 
                        isMarketPriceLoading={isMarketPriceLoading}
                        activeCrops={activeCrops}
                    />;
    }
  };

  return (
    <div className="bg-farm-green-light min-h-screen text-gray-700">
      <Navbar 
        isLoggedIn={isLoggedIn}
        userName={profile.name}
        language={language}
        onLanguageChange={setLanguage}
        onLogin={handleStartOnboarding}
        onLogout={handleLogout}
        activePage={currentPage}
        onNavigate={(page) => setCurrentPage(page)}
        onChatClick={() => setIsChatOpen(true)} 
      />

      {isLoggedIn ? (
         <main className="p-4 sm:p-6 lg:p-8 pt-20">
            {renderPage()}
         </main>
      ) : (
        <LandingPage 
            onLogin={handleStartOnboarding}
            language={language}
        />
      )}

      {showOnboarding && (
        <OnboardingModal 
            onLogin={handleLogin}
            onClose={() => setShowOnboarding(false)}
            language={language}
        />
      )}
      
      {isChatOpen && isLoggedIn && (
        <div 
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 flex items-center justify-center"
            onClick={() => setIsChatOpen(false)}
        >
          <div 
            className="bg-white rounded-xl shadow-2xl w-[95%] h-[90%] max-w-4xl transform transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            <ChatWindow 
                messages={messages} 
                onSendMessage={handleSendMessage}
                isLoading={isLoading}
                onSpeak={handleSpeak}
                onClose={() => setIsChatOpen(false)}
                language={language}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default App;