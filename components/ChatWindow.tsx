import React, { useState, useRef, useEffect } from 'react';
import type { Message } from '../types';
import { MessageRole } from '../types';
import { MicrophoneIcon } from './icons/MicrophoneIcon';
import { SendIcon } from './icons/SendIcon';
import { SpeakerIcon } from './icons/SpeakerIcon';
import { CameraIcon } from './icons/CameraIcon';
import { XCircleIcon } from './icons/XCircleIcon';
import type { Language } from '../types';
import { translations } from '../translations';


interface ChatWindowProps {
    messages: Message[];
    onSendMessage: (text: string, image?: File) => void;
    isLoading: boolean;
    onSpeak: (text: string) => void;
    onClose: () => void;
    language: Language;
}

const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
let recognition: any | null = null;

if (SpeechRecognition) {
    recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ messages, onSendMessage, isLoading, onSpeak, onClose, language }) => {
    const [inputText, setInputText] = useState('');
    const [isListening, setIsListening] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const t = translations[language].chat;

    useEffect(() => {
        if (recognition) {
            const langCode = { en: 'en-US', ml: 'ml-IN', ta: 'ta-IN' }[language];
            recognition.lang = langCode;
        }
    }, [language]);


    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (!recognition) return;

        recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            setInputText(transcript);
            setIsListening(false);
        };

        recognition.onerror = (event: any) => {
            console.error('Speech recognition error:', event.error);
            setIsListening(false);
        };
        
        recognition.onend = () => {
             setIsListening(false);
        }

    }, []);

    const handleMicClick = () => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
        }

        if (!recognition) {
            alert(t.voiceNotAvailable);
            return;
        }

        if (isListening) {
            recognition.stop();
            setIsListening(false);
        } else {
            recognition.start();
            setIsListening(true);
        }
    };

    const handleImageSelectClick = () => {
        fileInputRef.current?.click();
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const previewUrl = URL.createObjectURL(file);
            setImagePreview(previewUrl);
        }
    };

    const removeImage = () => {
        if (imagePreview) {
            URL.revokeObjectURL(imagePreview);
        }
        setImageFile(null);
        setImagePreview(null);
        if(fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(!inputText.trim() && !imageFile) return;

        onSendMessage(inputText, imageFile ?? undefined);
        setInputText('');
        removeImage();
    };

    return (
        <div className="bg-white rounded-xl flex flex-col h-full overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800">{t.title}</h2>
                 <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
            <div className="flex-1 p-4 sm:p-6 overflow-y-auto bg-gray-50">
                <div className="space-y-4">
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex items-end gap-3 ${msg.role === MessageRole.User ? 'justify-end' : 'justify-start'}`}>
                            {msg.role === MessageRole.AI && (
                                <div className="w-10 h-10 rounded-full bg-farm-green-dark flex items-center justify-center text-white font-bold flex-shrink-0 text-sm">
                                    {t.aiAvatar}
                                </div>
                            )}
                            <div className={`max-w-md lg:max-w-lg px-4 py-3 rounded-2xl ${msg.role === MessageRole.User ? 'bg-blue-500 text-white rounded-br-none' : 'bg-gray-200 text-gray-800 rounded-bl-none'}`}>
                                {msg.imageUrl && (
                                    <img src={msg.imageUrl} alt="Upload" className="mb-2 rounded-lg max-w-full h-auto max-h-64 object-contain" />
                                )}
                                <p className="whitespace-pre-wrap">{msg.text}</p>
                                {msg.role === MessageRole.AI && msg.text && (
                                    <button onClick={() => onSpeak(msg.text)} className="mt-2 text-gray-500 hover:text-farm-green">
                                        <SpeakerIcon />
                                    </button>
                                )}
                            </div>
                            {msg.role === MessageRole.User && (
                                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold flex-shrink-0 text-sm">
                                    {t.userAvatar}
                                </div>
                            )}
                        </div>
                    ))}
                    {isLoading && (
                       <div className="flex items-end gap-3 justify-start">
                           <div className="w-10 h-10 rounded-full bg-farm-green-dark flex items-center justify-center text-white font-bold flex-shrink-0 text-sm">{t.aiAvatar}</div>
                           <div className="max-w-sm px-4 py-3 rounded-2xl bg-gray-200 text-gray-800 rounded-bl-none">
                               <div className="flex items-center justify-center gap-2">
                                   <div className="w-2 h-2 bg-farm-green rounded-full animate-pulse"></div>
                                   <div className="w-2 h-2 bg-farm-green rounded-full animate-pulse [animation-delay:0.2s]"></div>
                                   <div className="w-2 h-2 bg-farm-green rounded-full animate-pulse [animation-delay:0.4s]"></div>
                               </div>
                           </div>
                       </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
            </div>
            <div className="p-4 border-t border-gray-200 bg-white">
                {imagePreview && (
                    <div className="mb-2 p-2 bg-gray-100 rounded-lg relative w-28">
                        <img src={imagePreview} alt="Selected" className="w-full h-auto rounded" />
                        <button onClick={removeImage} className="absolute -top-2 -right-2 bg-gray-800 text-white rounded-full p-0.5 hover:bg-red-600 transition-colors" aria-label={t.removeImage}>
                           <XCircleIcon />
                        </button>
                    </div>
                )}
                <form onSubmit={handleSubmit} className="flex items-center gap-2">
                    <button type="button" onClick={handleMicClick} className={`p-3 rounded-full transition-colors flex-shrink-0 ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`} aria-label={t.useMicrophone}>
                        <MicrophoneIcon />
                    </button>
                     <button type="button" onClick={handleImageSelectClick} className="p-3 rounded-full transition-colors flex-shrink-0 bg-gray-100 text-gray-700 hover:bg-gray-200" aria-label={t.uploadImage}>
                        <CameraIcon />
                    </button>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageChange}
                        className="hidden"
                        accept="image/png, image/jpeg, image/webp"
                    />
                    <input
                        type="text"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        placeholder={isListening ? t.placeholderListening : t.placeholderDefault}
                        className="flex-1 w-full px-4 py-3 bg-gray-100 border-transparent rounded-full focus:outline-none focus:ring-2 focus:ring-farm-green"
                        disabled={isLoading}
                    />
                    <button type="submit" className="p-3 bg-farm-green text-white rounded-full hover:bg-farm-green-dark disabled:bg-green-300 transition-colors flex-shrink-0" disabled={isLoading || (!inputText.trim() && !imageFile)} aria-label={t.sendMessage}>
                        <SendIcon />
                    </button>
                </form>
            </div>
        </div>
    );
};
