

import { GoogleGenAI, Chat, Type } from '@google/genai';
import type { Profile, SoilData, CropRecommendation, Language, DashboardAdvice, MarketPrice, WeeklyTasks, AITask } from '../types';
import { translations } from '../translations';

// The API key is expected to be available in the environment variables.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const model = 'gemini-2.5-flash';

const getSystemInstruction = (profile: Profile, lang: Language): string => {
    const districtName = translations[lang].districts[profile.district as keyof typeof translations.en.districts] || profile.district;
    const prompts = {
        en: `You are "Krishi Sakhi," a friendly, expert AI farming assistant for farmers in Kerala.
Your primary language of communication MUST be English.
You will receive queries in English or Malayalam (from text or transcribed from voice).
You MUST respond ONLY in English, using a simple, clear, and encouraging tone.
Your goal is to provide personalized, actionable advice based on the farmer's specific context.

Here is the farmer's profile:
- Name: ${profile.name}
- Location (District): ${districtName}
- Land Size: ${profile.landSize}
- Main Crop: ${profile.crop || 'Not selected yet'}
- Soil Type: ${profile.soilType}
- Irrigation Method: ${profile.irrigation}

Use this profile to tailor your advice.
When the farmer logs an activity, acknowledge it and offer relevant next steps in English.
Keep your answers concise, clear, and easy for a farmer to understand.

NEW CAPABILITY (Image Analysis): If the user uploads a plant image, identify diseases or pests. Provide symptoms and treatment options in English. If the image is unclear, state that you cannot analyze it.

NEW CAPABILITY (Task Management): If the user asks to add a task, respond with ONLY a JSON object in this format. Do not add any other text.
{"action": "addTask", "task": {"text": "The task description in English", "priority": "medium", "time": "Anytime"}}

For all other queries, respond naturally and ONLY in English.`,
        ml: `നിങ്ങൾ "കൃഷി സഖി" എന്ന പേരിൽ അറിയപ്പെടുന്ന ഒരു AI ഫാമിംഗ് അസിസ്റ്റന്റാണ്. കേരളത്തിലെ കർഷകർക്ക് വേണ്ടിയുള്ള നിങ്ങളുടെ സഹായം വളരെ വലുതാണ്.
നിങ്ങൾ പ്രധാനമായും മലയാളത്തിൽ സംസാരിക്കണം.
നിങ്ങൾക്ക് മലയാളത്തിലോ ഇംഗ്ലീഷിലോ ചോദ്യങ്ങൾ ലഭിക്കാം.
നിങ്ങൾ ലളിതവും വ്യക്തവുമായ മലയാളത്തിൽ മറുപടി നൽകണം.
കർഷകന്റെ സാഹചര്യങ്ങൾക്കനുസരിച്ച് വ്യക്തിഗത ഉപദേശങ്ങൾ നൽകുക എന്നതാണ് നിങ്ങളുടെ ലക്ഷ്യം.

കർഷകന്റെ പ്രൊഫൈൽ ഇതാ:
- പേര്: ${profile.name}
- സ്ഥലം (ജില്ല): ${districtName}
- സ്ഥലത്തിന്റെ വലുപ്പം: ${profile.landSize}
- പ്രധാന വിള: ${profile.crop || 'ഇതുവരെ തിരഞ്ഞെടുത്തിട്ടില്ല'}
- മണ്ണിന്റെ തരം: ${profile.soilType}
- ജലസേചന രീതി: ${profile.irrigation}

ഈ പ്രൊഫൈൽ ഉപയോഗിച്ച് നിങ്ങളുടെ ഉപദേശങ്ങൾ ക്രമീകരിക്കുക.
ഒരു കർഷകൻ ഒരു പ്രവർത്തനം രേഖപ്പെടുത്തുമ്പോൾ (ഉദാഹരണത്തിന്, വിത, വളപ്രയോഗം), അത് അംഗീകരിക്കുകയും മലയാളത്തിൽ അടുത്ത ഘട്ടങ്ങൾ നിർദ്ദേശിക്കുകയും ചെയ്യുക.
നിങ്ങളുടെ ഉത്തരങ്ങൾ ലളിതവും കർഷകർക്ക് മനസ്സിലാകുന്നതുമായിരിക്കണം.

പുതിയ കഴിവ് (ചിത്രം വിശകലനം ചെയ്യൽ): ഉപയോക്താവ് ഒരു ചെടിയുടെ ചിത്രം അപ്‌ലോഡ് ചെയ്താൽ, അതിലെ രോഗങ്ങളോ കീടങ്ങളോ തിരിച്ചറിയുക. രോഗലക്ഷണങ്ങളും ചികിത്സാ രീതികളും മലയാളത്തിൽ നൽകുക. ചിത്രം വ്യക്തമല്ലെങ്കിൽ, അത് വിശകലനം ചെയ്യാൻ കഴിയില്ലെന്ന് മലയാളത്തിൽ പറയുക.

പുതിയ കഴിവ് (ടാസ്ക് മാനേജ്മെന്റ്): ഒരു ടാസ്ക് ചേർക്കാൻ ഉപയോക്താവ് ആവശ്യപ്പെട്ടാൽ, ഈ ഫോർമാറ്റിൽ ഒരു JSON ഒബ്ജക്റ്റ് മാത്രം നൽകുക. മറ്റ് ടെക്സ്റ്റ് ഒന്നും ചേർക്കരുത്.
{"action": "addTask", "task": {"text": "ടാസ്കിന്റെ വിവരണം മലയാളത്തിൽ", "priority": "medium", "time": "എപ്പോൾ വേണമെങ്കിലും"}}

മറ്റെല്ലാ ചോദ്യങ്ങൾക്കും സ്വാഭാവികമായി മലയാളത്തിൽ മാത്രം മറുപടി നൽകുക.`,
        ta: `நீங்கள் "கிருஷி சகி", கேரள விவசாயிகளுக்கான ஒரு நட்பு, நிபுணத்துவ AI விவசாய உதவியாளர்.
உங்கள் முதன்மை தகவல் தொடர்பு மொழி தமிழாக இருக்க வேண்டும்.
நீங்கள் தமிழ் அல்லது ஆங்கிலத்தில் கேள்விகளைப் பெறுவீர்கள் (உரை அல்லது குரல் வழியாக).
நீங்கள் எளிய, தெளிவான மற்றும் ஊக்கமளிக்கும் தொனியில் தமிழில் மட்டுமே பதிலளிக்க வேண்டும்.
விவசாயியின் குறிப்பிட்ட சூழலின் அடிப்படையில் தனிப்பயனாக்கப்பட்ட, செயல்படக்கூடிய ஆலோசனைகளை வழங்குவதே உங்கள் குறிக்கோள்.

விவசாயியின் சுயவிவரம் இங்கே:
- பெயர்: ${profile.name}
- இடம் (மாவட்டம்): ${districtName}
- நில அளவு: ${profile.landSize}
- முக்கிய பயிர்: ${profile.crop || 'இன்னும் தேர்ந்தெடுக்கப்படவில்லை'}
- மண் வகை: ${profile.soilType}
- பாசன முறை: ${profile.irrigation}

உங்கள் ஆலோசனையைத் தனிப்பயனாக்க இந்த சுயவிவரத்தைப் பயன்படுத்தவும்.
விவசாயி ஒரு செயலைப் பதிவுசெய்யும்போது, அதை ஏற்றுக்கொண்டு, அடுத்த படிகளை தமிழில் வழங்கவும்.
உங்கள் பதில்களை சுருக்கமாகவும், தெளிவாகவும், விவசாயிக்கு எளிதில் புரியும்படியும் வைத்திருங்கள்.

புதிய திறன் (படப் பகுப்பாய்வு): பயனர் ஒரு தாவரத்தின் படத்தைப் பதிவேற்றினால், நோய்கள் அல்லது பூச்சிகளைக் கண்டறியவும். அறிகுறிகள் மற்றும் சிகிச்சை விருப்பங்களை தமிழில் வழங்கவும். படம் தெளிவாக இல்லை என்றால், அதை பகுப்பாய்வு செய்ய முடியாது என்று தமிழில் கூறவும்.

புதிய திறன் (பணி மேலாண்மை): ஒரு பணியைச் சேர்க்க பயனர் கேட்டால், இந்த வடிவமைப்பில் ஒரு JSON பொருளை மட்டும் பதிலளிக்கவும். வேறு எந்த உரையையும் சேர்க்க வேண்டாம்.
{"action": "addTask", "task": {"text": "பணி விவரணம் தமிழில்", "priority": "medium", "time": "எந்த நேரத்திலும்"}}

மற்ற அனைத்து கேள்விகளுக்கும், இயற்கையாகவும் தமிழிலும் மட்டும் பதிலளிக்கவும்.`
    };
    return prompts[lang];
};

export const createChatSession = (profile: Profile, lang: Language): Chat => {
    const systemInstruction = getSystemInstruction(profile, lang);
    const chat: Chat = ai.chats.create({
        model,
        config: {
            systemInstruction,
        },
    });
    return chat;
};

export const getDailyTasks = async (profile: Profile, lang: Language): Promise<AITask[]> => {
    if (!profile.crop) return []; // Prevent API call if no crop is selected
    const districtName = translations[lang].districts[profile.district as keyof typeof translations.en.districts] || profile.district;
    const prompts = {
        en: `As "Krishi Sakhi", generate a personalized list of 3-4 simple, actionable daily tasks for a farmer. Consider a plausible weather forecast for their location. For example, do not suggest watering if rain is likely.
        
        Farmer Profile:
        - Main Crop: ${profile.crop}
        - Location (District): ${districtName}

        For each task, provide a short text description, a suggested time (e.g., "Morning", "After 4 PM"), and a priority ('high', 'medium', or 'low').
        Return the response ONLY as a JSON object in English with a single key "tasks", which is an array of task objects.`,
        ml: `"കൃഷി സഖി" എന്ന നിലയിൽ, ഒരു കർഷകന് വേണ്ടി 3-4 ലളിതമായ ദൈനംദിന ജോലികളുടെ ഒരു ലിസ്റ്റ് തയ്യാറാക്കുക. അവരുടെ സ്ഥലത്തെ കാലാവസ്ഥാ പ്രവചനം പരിഗണിക്കുക. ഉദാഹരണത്തിന്, മഴ സാധ്യതയുണ്ടെങ്കിൽ നനയ്ക്കാൻ നിർദ്ദേശിക്കരുത്.
        
        കർഷകന്റെ പ്രൊഫൈൽ:
        - പ്രധാന വിള: ${profile.crop}
        - സ്ഥലം (ജില്ല): ${districtName}

        ഓരോ ജോലിക്കും, ഒരു ചെറിയ വിവരണം, നിർദ്ദേശിക്കുന്ന സമയം (ഉദാ: "രാവിലെ", "വൈകുന്നേരം 4 മണിക്ക് ശേഷം"), മുൻഗണന ('high', 'medium', or 'low') എന്നിവ നൽകുക.
        "tasks" എന്ന കീ അടങ്ങുന്ന ഒരു JSON ഒബ്ജക്റ്റായി മാത്രം മലയാളത്തിൽ പ്രതികരണം നൽകുക, അത് ടാസ്ക് ഒബ്ജക്റ്റുകളുടെ ഒരു അറേയാണ്.`,
        ta: `"கிருஷி சகி"யாக, ஒரு விவசாயிக்கு 3-4 எளிய, தினசரி பணிகளின் பட்டியலை உருவாக்கவும். அவர்களின் இருப்பிடத்திற்கான நம்பத்தகுந்த வானிலை முன்னறிவிப்பைக் கவனியுங்கள். உதாரணமாக, மழை பெய்ய வாய்ப்பிருந்தால் నీர்ப்பாசனம் செய்ய பரிந்துரைக்க வேண்டாம்.
        
        விவசாயி சுயவிவரம்:
        - முக்கிய பயிர்: ${profile.crop}
        - இடம் (மாவட்டம்): ${districtName}

        ஒவ்வொரு பணிக்கும், ஒரு சிறிய உரை விளக்கம், பரிந்துரைக்கப்பட்ட நேரம் (எ.கா., "காலை", "மாலை 4 மணிக்கு பிறகு"), மற்றும் முன்னுரிமை ('high', 'medium', or 'low') வழங்கவும்.
        பதிலை தமிழில் "tasks" என்ற ஒரே திறவுகோலைக் கொண்ட ஒரு JSON பொருளாக மட்டுமே வழங்கவும், இது பணி பொருட்களின் வரிசையாகும்.`
    };
    
    const prompt = prompts[lang];

    const responseSchema = {
        type: Type.OBJECT,
        properties: {
            tasks: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        text: { type: Type.STRING },
                        time: { type: Type.STRING },
                        priority: { type: Type.STRING, enum: ['high', 'medium', 'low'] },
                    },
                    required: ['text', 'time', 'priority'],
                }
            }
        },
        required: ['tasks']
    };

    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema,
            },
        });
        
        const jsonString = response.text.trim();
        const result = JSON.parse(jsonString);
        return result.tasks || [];

    } catch (error) {
        console.error("Error getting daily tasks from AI:", error);
        return [];
    }
};

export const getWeeklyTasks = async (profile: Profile, lang: Language): Promise<WeeklyTasks | null> => {
    if (!profile.crop) return null;
    const districtName = translations[lang].districts[profile.district as keyof typeof translations.en.districts] || profile.district;
    const prompts = {
        en: `As "Krishi Sakhi", create a 7-day task plan for a farmer. The tasks must be relevant to their crop and location, considering the plausible weather for the week. For each day, provide 2-3 simple tasks.
        
        Farmer Profile:
        - Main Crop: ${profile.crop}
        - Location (District): ${districtName}

        For each task, provide a short text description, a suggested time, and a priority ('high', 'medium', 'low').
        Return the response ONLY as a JSON object in English. The object should have keys "day1" through "day7". Each key's value should be an array of task objects.`,
        ml: `"കൃഷി സഖി" എന്ന നിലയിൽ, ഒരു കർഷകന് വേണ്ടി 7 ദിവസത്തെ ഒരു ടാസ്ക് പ്ലാൻ തയ്യാറാക്കുക. ജോലികൾ അവരുടെ വിളയ്ക്കും സ്ഥലത്തിനും, ആ ആഴ്ചയിലെ കാലാവസ്ഥയും പരിഗണിച്ച്, അനുയോജ്യമായിരിക്കണം. ഓരോ ദിവസവും 2-3 ലളിതമായ ജോലികൾ നൽകുക.
        
        കർഷകന്റെ പ്രൊഫൈൽ:
        - പ്രധാന വിള: ${profile.crop}
        - സ്ഥലം (ജില്ല): ${districtName}

        ഓരോ ജോലിക്കും, ഒരു ചെറിയ വിവരണം, നിർദ്ദേശിക്കുന്ന സമയം, മുൻഗണന ('high', 'medium', or 'low') എന്നിവ നൽകുക.
        പ്രതികരണം മലയാളത്തിൽ ഒരു JSON ഒബ്ജക്റ്റായി മാത്രം നൽകുക. ഒബ്ജക്റ്റിൽ "day1" മുതൽ "day7" വരെയുള്ള കീകൾ ഉണ്ടായിരിക്കണം. ഓരോ കീയുടെയും മൂല്യം ടാസ്ക് ഒബ്ജക്റ്റുകളുടെ ഒരു അറേ ആയിരിക്കണം.`,
        ta: `"கிருஷி சகி"யாக, ஒரு விவசாயிக்கு 7-நாள் பணித் திட்டத்தை உருவாக்கவும். பணிகள் அவர்களின் பயிர் மற்றும் இருப்பிடத்திற்கு பொருத்தமானதாக இருக்க வேண்டும், வாரத்திற்கான சாத்தியமான வானிலையைக் கருத்தில் கொண்டு. ஒவ்வொரு நாளுக்கும், 2-3 எளிய பணிகளை வழங்கவும்.
        
        விவசாயி சுயவிவரம்:
        - முக்கிய பயிர்: ${profile.crop}
        - இடம் (மாவட்டம்): ${districtName}

        ஒவ்வொரு பணிக்கும், ஒரு சிறிய உரை விளக்கம், பரிந்துரைக்கப்பட்ட நேரம், மற்றும் முன்னுரிமை ('high', 'medium', 'low') வழங்கவும்.
        பதிலை தமிழில் ஒரு JSON பொருளாக மட்டுமே வழங்கவும். பொருளில் "day1" முதல் "day7" வரையிலான திறவுகோள்கள் இருக்க வேண்டும். ஒவ்வொரு திறவுகோளின் மதிப்பும் பணி பொருட்களின் வரிசையாக இருக்க வேண்டும்.`
    };

    const prompt = prompts[lang];

    const taskObjectSchema = {
        type: Type.OBJECT,
        properties: {
            text: { type: Type.STRING },
            time: { type: Type.STRING },
            priority: { type: Type.STRING, enum: ['high', 'medium', 'low'] },
        },
        required: ['text', 'time', 'priority'],
    };

    const responseSchema = {
        type: Type.OBJECT,
        properties: {
            day1: { type: Type.ARRAY, items: taskObjectSchema },
            day2: { type: Type.ARRAY, items: taskObjectSchema },
            day3: { type: Type.ARRAY, items: taskObjectSchema },
            day4: { type: Type.ARRAY, items: taskObjectSchema },
            day5: { type: Type.ARRAY, items: taskObjectSchema },
            day6: { type: Type.ARRAY, items: taskObjectSchema },
            day7: { type: Type.ARRAY, items: taskObjectSchema },
        },
        required: ['day1', 'day2', 'day3', 'day4', 'day5', 'day6', 'day7']
    };

    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema,
            },
        });

        const jsonString = response.text.trim();
        return JSON.parse(jsonString);

    } catch (error) {
        console.error("Error getting weekly tasks from AI:", error);
        return null;
    }
};

export const getDashboardAdvice = async (profile: Profile, lang: Language): Promise<DashboardAdvice | null> => {
    if (!profile.crop) return null;
    const districtName = translations[lang].districts[profile.district as keyof typeof translations.en.districts] || profile.district;
    const prompts = {
        en: `As an expert farm manager AI named "Krishi Sakhi", generate a personalized title and a list of 2-3 concise, actionable tips for a farmer. The advice should be highly relevant to their main crop, location, and the current season (assume it's the present day).
        
        Farmer Profile:
        - Main Crop: ${profile.crop}
        - Location (District): ${districtName}

        Provide the response in English. The title should be engaging. The tips should be practical.
        Return the response ONLY as a JSON object with "title" (string) and "advice" (an array of strings).`,
        ml: `"കൃഷി സഖി" എന്ന വിദഗ്ദ്ധനായ ഫാം മാനേജർ AI എന്ന നിലയിൽ, ഒരു കർഷകന് വേണ്ടി വ്യക്തിഗതമാക്കിയ ഒരു തലക്കെട്ടും 2-3 ലളിതവും പ്രായോഗികവുമായ നുറുങ്ങുകളും തയ്യാറാക്കുക. ഉപദേശം അവരുടെ പ്രധാന വിള, സ്ഥലം, ഇപ്പോഴത്തെ കാലവസ്ഥ എന്നിവയ്ക്ക് ഏറ്റവും അനുയോജ്യമായിരിക്കണം.
        
        കർഷകന്റെ പ്രൊഫൈൽ:
        - പ്രധാന വിള: ${profile.crop}
        - സ്ഥലം (ജില്ല): ${districtName}

        പ്രതികരണം മലയാളത്തിൽ നൽകുക. തലക്കെട്ട് ആകർഷകമായിരിക്കണം. നുറുങ്ങുകൾ പ്രായോഗികമായിരിക്കണം.
        "title" (string), "advice" (സ്ട്രിംഗുകളുടെ ഒരു അറേ) എന്നിവ അടങ്ങുന്ന ഒരു JSON ഒബ്ജക്റ്റായി മാത്രം പ്രതികരണം നൽകുക.`,
        ta: `"கிருஷி சகி" என்ற நிபுணர் பண்ணை மேலாளர் AI ஆக, ஒரு விவசாயிக்கு தனிப்பயனாக்கப்பட்ட தலைப்பு மற்றும் 2-3 சுருக்கமான, செயல்படக்கூடிய உதவிக்குறிப்புகளின் பட்டியலை உருவாக்கவும். இந்த அறிவுரை அவர்களின் முக்கிய பயிர், இருப்பிடம் மற்றும் தற்போதைய பருவகாலத்திற்கு (இன்றைய நாள் என கருதுங்கள்) மிகவும் பொருத்தமானதாக இருக்க வேண்டும்.
        
        விவசாயி சுயவிவரம்:
        - முக்கிய பயிர்: ${profile.crop}
        - இடம் (மாவட்டம்): ${districtName}

        பதிலைத் தமிழில் வழங்கவும். தலைப்பு ஈர்க்கக்கூடியதாக இருக்க வேண்டும். குறிப்புகள் நடைமுறைக்குரியதாக இருக்க வேண்டும்.
        "title" (string) மற்றும் "advice" (சரங்களின் வரிசை) கொண்ட ஒரு JSON பொருளாக மட்டுமே பதிலை வழங்கவும்.`
    };

    const prompt = prompts[lang];

    const responseSchema = {
        type: Type.OBJECT,
        properties: {
            title: { type: Type.STRING },
            advice: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
            }
        },
        required: ['title', 'advice']
    };

    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema,
            },
        });
        
        const jsonString = response.text.trim();
        const result = JSON.parse(jsonString);
        return result;

    } catch (error) {
        console.error("Error getting dashboard advice from AI:", error);
        return null;
    }
};

export const getMarketPrice = async (profile: Profile, lang: Language): Promise<MarketPrice | null> => {
    if (!profile.crop) return null;
    const districtName = translations[lang].districts[profile.district as keyof typeof translations.en.districts] || profile.district;
    const prompts = {
        en: `As a market data provider AI, generate a realistic, single market price update for a farmer. The price should be for their main crop in a plausible local market within their district.
        
        Farmer Profile:
        - Main Crop: ${profile.crop}
        - Location (District): ${districtName}

        Provide the response in English.
        Return the response ONLY as a JSON object with "cropName" (string), "price" (string, e.g., "₹3,500"), "unit" (string, e.g., "per quintal"), "market" (string, a plausible local market name), and "trend" ('up', 'down', or 'stable').`,
        ml: `ഒരു മാർക്കറ്റ് ഡാറ്റാ ദാതാവായ AI എന്ന നിലയിൽ, ഒരു കർഷകന് വേണ്ടി യഥാർത്ഥമെന്ന് തോന്നുന്ന ഒരു മാർക്കറ്റ് വില വിവരം നൽകുക. വില അവരുടെ പ്രധാന വിളയ്ക്ക്, അവരുടെ ജില്ലയിലെ അടുത്തുള്ള ഒരു പ്രാദേശിക മാർക്കറ്റിലേത് ആയിരിക്കണം.
        
        കർഷകന്റെ പ്രൊഫൈൽ:
        - പ്രധാന വിള: ${profile.crop}
        - സ്ഥലം (ജില്ല): ${districtName}

        പ്രതികരണം മലയാളത്തിൽ നൽകുക.
        "cropName" (string), "price" (string, ഉദാ: "₹3,500"), "unit" (string, ഉദാ: "ക്വിന്റലിന്"), "market" (string, അടുത്തുള്ള മാർക്കറ്റിന്റെ പേര്), "trend" ('up', 'down', or 'stable') എന്നിവ അടങ്ങുന്ന ഒരു JSON ഒബ്ജക്റ്റായി മാത്രം പ്രതികരണം നൽകുക.`,
        ta: `ஒரு சந்தை தரவு வழங்குநர் AI ஆக, ஒரு விவசாயிக்கு ஒரு யதார்த்தமான, ஒற்றை சந்தை விலை புதுப்பிப்பை உருவாக்கவும். விலை அவர்களின் முக்கிய பயிருக்கு, அவர்களின் மாவட்டத்திற்குள் உள்ள நம்பத்தகுந்த உள்ளூர் சந்தையில் இருக்க வேண்டும்.
        
        விவசாயி சுயவிவரம்:
        - முக்கிய பயிர்: ${profile.crop}
        - இடம் (மாவட்டம்): ${districtName}

        பதிலைத் தமிழில் வழங்கவும்.
        "cropName" (string), "price" (string, எ.கா., "₹3,500"), "unit" (string, எ.கா., "ஒரு குவிண்டாலுக்கு"), "market" (string, நம்பத்தகுந்த உள்ளூர் சந்தையின் பெயர்), மற்றும் "trend" ('up', 'down', or 'stable') கொண்ட ஒரு JSON பொருளாக மட்டுமே பதிலை வழங்கவும்.`
    };

    const prompt = prompts[lang];

    const responseSchema = {
        type: Type.OBJECT,
        properties: {
            cropName: { type: Type.STRING },
            price: { type: Type.STRING },
            unit: { type: Type.STRING },
            market: { type: Type.STRING },
            trend: { type: Type.STRING }
        },
        required: ['cropName', 'price', 'unit', 'market', 'trend']
    };

    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema,
            },
        });
        
        const jsonString = response.text.trim();
        const result = JSON.parse(jsonString);
        // Ensure trend is one of the allowed values, default to 'stable' if not.
        if (!['up', 'down', 'stable'].includes(result.trend)) {
            result.trend = 'stable';
        }
        return result;

    } catch (error) {
        console.error("Error getting market price from AI:", error);
        return null;
    }
};


export const getSoilRecommendations = async (soilData: SoilData, lang: Language): Promise<CropRecommendation[]> => {
    const prompts = {
        en: `Analyze the following soil data and provide personalized crop recommendations for a farmer in India.

        Soil Data:
        - pH Level: ${soilData.ph}
        - Electrical Conductivity: ${soilData.ec} dS/m
        - Organic Carbon: ${soilData.oc} %
        - Soil Type: ${soilData.soilType}
        - Nitrogen (N): ${soilData.n} kg/ha
        - Phosphorus (P): ${soilData.p} kg/ha
        - Potassium (K): ${soilData.k} kg/ha
        - Calcium (Ca): ${soilData.ca} ppm
        - Magnesium (Mg): ${soilData.mg} ppm
        - Sulphur (S): ${soilData.s} ppm

        Based on this data, recommend exactly 3 suitable crops with the following constraints on their harvest duration:
        1. One short-term crop with a harvest duration of approximately 90 days.
        2. One long-term crop with a harvest duration of approximately 200 days.
        3. One other suitable crop with a flexible duration.

        For each of the 3 crops, provide all string values in English.
        The duration string for each crop must clearly state the number of days (e.g., "90-100 days", "Approx. 200 days").
        Return the response as a JSON object containing a single key "recommendations" which is an array of exactly 3 crop recommendation objects.`,
        ml: `ഇന്ത്യയിലെ ഒരു കർഷകന് വേണ്ടി താഴെ പറയുന്ന മണ്ണിന്റെ ഡാറ്റ വിശകലനം ചെയ്ത് വ്യക്തിഗത വിള ശുപാർശകൾ നൽകുക.

        മണ്ണിന്റെ ഡാറ്റ:
        - pH നില: ${soilData.ph}
        - ഇലക്ട്രിക്കൽ കണ്ടക്റ്റിവിറ്റി: ${soilData.ec} dS/m
        - ഓർഗാനിക് കാർബൺ: ${soilData.oc} %
        - മണ്ണിന്റെ തരം: ${soilData.soilType}
        - നൈട്രജൻ (N): ${soilData.n} kg/ha
        - ഫോസ്ഫറസ് (P): ${soilData.p} kg/ha
        - പൊട്ടാസ്യം (K): ${soilData.k} kg/ha
        - കാൽസ്യം (Ca): ${soilData.ca} ppm
        - മഗ്നീഷ്യം (Mg): ${soilData.mg} ppm
        - സൾഫർ (S): ${soilData.s} ppm

        ഈ ഡാറ്റയെ അടിസ്ഥാനമാക്കി, വിളവെടുപ്പ് കാലയളവിൽ താഴെ പറയുന്ന നിയന്ത്രണങ്ങളോടെ അനുയോജ്യമായ 3 വിളകൾ ശുപാർശ ചെയ്യുക:
        1. ഏകദേശം 90 ദിവസം വിളവെടുപ്പ് കാലയളവുള്ള ഒരു ഹ്രസ്വകാല വിള.
        2. ഏകദേശം 200 ദിവസം വിളവെടുപ്പ് കാലയളവുള്ള ഒരു ദീർഘകാല വിള.
        3. അനുയോജ്യമായ മറ്റേതെങ്കിലും ഒരു വിള.

        ഈ 3 വിളകൾക്കും, എല്ലാ സ്ട്രിംഗ് മൂല്യങ്ങളും മലയാളത്തിൽ നൽകുക.
        ഓരോ വിളയുടെയും കാലയളവ് ദിവസങ്ങളുടെ എണ്ണം വ്യക്തമാക്കണം (ഉദാഹരണത്തിന്, "90-100 ദിവസം", "ഏകദേശം 200 ദിവസം").
        "recommendations" എന്ന കീ അടങ്ങുന്ന ഒരു JSON ഒബ്ജക്റ്റായി പ്രതികരണം നൽകുക, അത് കൃത്യമായി 3 വിള ശുപാർശ ഒബ്ജക്റ്റുകളുടെ ഒരു അറേയാണ്.`,
        ta: `இந்தியாவில் உள்ள ஒரு விவசாயிக்கு தனிப்பயனாக்கப்பட்ட பயிர் பரிந்துரைகளை வழங்க பின்வரும் மண் தரவை பகுப்பாய்வு செய்யவும்.

        மண் தரவு:
        - pH நிலை: ${soilData.ph}
        - மின் கடத்துத்திறன்: ${soilData.ec} dS/m
        - கரிம கார்பன்: ${soilData.oc} %
        - மண் வகை: ${soilData.soilType}
        - நைட்ரஜன் (N): ${soilData.n} kg/ha
        - பாஸ்பரஸ் (P): ${soilData.p} kg/ha
        - பொட்டாசியம் (K): ${soilData.k} kg/ha
        - கால்சியம் (Ca): ${soilData.ca} ppm
        - மெக்னீசியம் (Mg): ${soilData.mg} ppm
        - சல்பர் (S): ${soilData.s} ppm

        இந்த தரவின் அடிப்படையில், அவற்றின் அறுவடை காலத்திற்கான பின்வரும் கட்டுப்பாடுகளுடன் சரியாக 3 பொருத்தமான பயிர்களைப் பரிந்துரைக்கவும்:
        1. சுமார் 90 நாட்கள் அறுவடை காலத்துடன் ஒரு குறுகிய காலப் பயிர்.
        2. சுமார் 200 நாட்கள் அறுவடை காலத்துடன் ஒரு நீண்ட காலப் பயிர்.
        3. நெகிழ்வான கால அளவு கொண்ட மற்றொரு பொருத்தமான பயிர்.

        இந்த 3 பயிர்களுக்கும், அனைத்து ஸ்டிரிங் மதிப்புகளையும் தமிழில் வழங்கவும்.
        ஒவ்வொரு பயிருக்கான கால அளவு நாட்களின் எண்ணிக்கையை தெளிவாகக் குறிப்பிட வேண்டும் (எ.கா., "90-100 நாட்கள்", "சுமார் 200 நாட்கள்").
        சரியாக 3 பயிர் பரிந்துரை பொருட்களின் வரிசையான "recommendations" என்ற ஒரே ஒரு திறவுகோலைக் கொண்ட ஒரு JSON பொருளாக பதிலை வழங்கவும்.`
    }

    const prompt = prompts[lang];
    
    const responseSchema = {
        type: Type.OBJECT,
        properties: {
            recommendations: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        cropName: { type: Type.STRING },
                        suitability: { type: Type.STRING, enum: ['Best', 'Excellent', 'Good', 'മികച്ചത്', 'ഏറ്റവും മികച്ചത്', 'നല്ലത്', 'சிறந்தது', 'மிகச் சிறந்தது', 'நல்லது'] },
                        yield: { type: Type.STRING },
                        duration: { type: Type.STRING },
                        reasons: { type: Type.ARRAY, items: { type: Type.STRING } },
                        plantingTips: { type: Type.ARRAY, items: { type: Type.STRING } },
                    },
                    required: ['cropName', 'suitability', 'yield', 'duration', 'reasons', 'plantingTips'],
                },
            },
        },
        required: ['recommendations'],
    };

    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema,
            },
        });
        
        const jsonString = response.text.trim();
        const result = JSON.parse(jsonString);
        
        // Normalize suitability ratings to English for consistent styling
        const normalizedRecommendations = result.recommendations.map((rec: any) => {
            let suitability = rec.suitability;
            if (suitability === 'മികച്ചത്' || suitability === 'மிகச் சிறந்தது' || suitability === 'சிறந்தது' || suitability === 'ഏറ്റവും മികച്ചത്') {
                suitability = 'Best';
            } else if (suitability === 'Excellent') { // Already English
                suitability = 'Excellent';
            } else if (suitability === 'നല്ലത്' || suitability === 'நல்லது') {
                suitability = 'Good';
            }
            return { ...rec, suitability };
        });

        return normalizedRecommendations;


    } catch (error) {
        console.error("Error getting soil recommendations from AI:", error);
        throw new Error("Failed to generate crop recommendations.");
    }
};