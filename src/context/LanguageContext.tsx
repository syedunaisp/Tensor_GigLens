"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'en' | 'hi' | 'te';

// Language codes for Web Speech API
export const SPEECH_LANGUAGE_CODES: Record<Language, string> = {
    en: 'en-IN',
    hi: 'hi-IN',
    te: 'te-IN'
};

// Language names for display
export const LANGUAGE_NAMES: Record<Language, { native: string; english: string }> = {
    en: { native: 'English', english: 'English' },
    hi: { native: 'हिंदी', english: 'Hindi' },
    te: { native: 'తెలుగు', english: 'Telugu' }
};

interface LanguageContextType {
    language: Language;
    toggleLanguage: () => void;
    setLanguage: (lang: Language) => void;
    t: typeof translations['en'];
    speechCode: string;
}

export const translations = {
    en: {
        // Dashboard
        greeting: "Namaste",
        earned: "Money Earned",
        spent: "Money Spent",
        support: "Emergency Help",
        trust: "Trust Badge",
        save_mode: "Save Mode",
        voice_help: "Tap to Speak",
        available_liquidity: "Available Liquidity",
        current_balance: "Current Balance",
        dashboard: "Dashboard",
        expense_ratio: "Expense Ratio",

        // Sidebar
        nav_dashboard: "Dashboard",
        nav_jobs: "Jobs",
        nav_simulator: "Simulator",
        nav_goals: "Goals",
        nav_profile: "Profile",
        nav_help: "Help",
        nav_logout: "Logout",

        // Streak
        streak_title: "Daily Streak",
        streak_sub: "Login everyday to not lose the streak.",
        pro_driver: "Pro Driver",
        next_level: "days to next level",

        // Forms (Quick Add)
        quick_add: "Quick Add",
        btn_income: "Income",
        btn_expense: "Expense",
        label_amount: "Amount",
        label_category: "Category",
        btn_submit: "Add Transaction",

        // Placeholders
        ph_amount: "Enter amount",
        ph_category: "Select category",

        // Language Gate
        lang_english: "English",
        lang_hindi: "हिंदी",
        lang_telugu: "తెలుగు",
        continue_english: "Continue in English",
        continue_hindi: "हिंदी में आगे बढ़ें",
        continue_telugu: "తెలుగులో కొనసాగించండి",

        // Voice Agent
        voice_agent_title: "GigLens Voice Assistant",
        voice_agent_subtitle: "Ask me anything about your finances",
        voice_listening: "Listening...",
        voice_processing: "Processing...",
        voice_speaking: "Speaking...",
        voice_tap_to_speak: "Tap to speak",
        voice_error: "Could not understand. Please try again.",
        voice_welcome: "Hello! I'm your GigLens assistant. How can I help you today?",
        voice_no_support: "Voice recognition is not supported in your browser",

        // Jobs & Career
        jobs_for_you: "Jobs For You",
        career_path: "Career Path",
        career_growth: "Career Growth",
        recommended_courses: "Recommended Courses",
        view_course: "View Course",
        skill_up: "Skill Up",
        free_course: "Free",
        paid_course: "Paid",

        // Landing Page
        landing_title: "Welcome to GigLens",
        landing_subtitle: "Your financial companion for gig work",
        landing_choose_language: "Choose your language",
        landing_speak_to_start: "Or speak to get started",
        landing_what_is: "What is GigLens?",
        landing_description: "GigLens helps gig workers manage their finances, find better opportunities, and plan for a stable future.",

        // Other
        recent_activity: "Recent Activity"
    },
    hi: {
        // Dashboard
        greeting: "नमस्ते",
        earned: "कुल कमाई",
        spent: "कुल खर्च",
        support: "आपातकालीन मदद",
        trust: "भरोसा बैज",
        save_mode: "बचत मोड",
        voice_help: "बोलने के लिए दबाएं",
        available_liquidity: "उपलब्ध राशि",
        current_balance: "वर्तमान शेष",
        dashboard: "डैशबोर्ड",
        expense_ratio: "खर्च अनुपात",

        // Sidebar
        nav_dashboard: "डैशबोर्ड",
        nav_jobs: "नौकरियां",
        nav_simulator: "सिम्युलेटर",
        nav_goals: "लक्ष्य",
        nav_profile: "प्रोफ़ाइल",
        nav_help: "सहायता",
        nav_logout: "लॉग आउट",

        // Streak
        streak_title: "दैनिक लड़ी",
        streak_sub: "लगातार लॉगिन करें ताकि लड़ी न टूटे।",
        pro_driver: "प्रो ड्राइवर",
        next_level: "अगले स्तर के लिए दिन",

        // Forms (Quick Add)
        quick_add: "फटाफट जोड़ें",
        btn_income: "आय",
        btn_expense: "खर्च",
        label_amount: "राशि",
        label_category: "श्रेणी",
        btn_submit: "लेनदेन जोड़ें",

        // Placeholders
        ph_amount: "राशि दर्ज करें",
        ph_category: "श्रेणी चुनें",

        // Language Gate
        lang_english: "English",
        lang_hindi: "हिंदी",
        lang_telugu: "తెలుగు",
        continue_english: "Continue in English",
        continue_hindi: "हिंदी में आगे बढ़ें",
        continue_telugu: "తెలుగులో కొనసాగించండి",

        // Voice Agent
        voice_agent_title: "गिगलेंस वॉइस सहायक",
        voice_agent_subtitle: "अपने वित्त के बारे में कुछ भी पूछें",
        voice_listening: "सुन रहा हूँ...",
        voice_processing: "विश्लेषण हो रहा है...",
        voice_speaking: "बोल रहा हूँ...",
        voice_tap_to_speak: "बोलने के लिए दबाएं",
        voice_error: "समझ नहीं आया। कृपया फिर से प्रयास करें।",
        voice_welcome: "नमस्ते! मैं आपका गिगलेंस सहायक हूँ। आज मैं आपकी कैसे मदद कर सकता हूँ?",
        voice_no_support: "आपके ब्राउज़र में वॉइस रिकग्निशन समर्थित नहीं है",

        // Jobs & Career
        jobs_for_you: "आपके लिए नौकरियां",
        career_path: "करियर पथ",
        career_growth: "करियर विकास",
        recommended_courses: "अनुशंसित कोर्स",
        view_course: "कोर्स देखें",
        skill_up: "कौशल बढ़ाएं",
        free_course: "मुफ्त",
        paid_course: "सशुल्क",

        // Landing Page
        landing_title: "गिगलेंस में आपका स्वागत है",
        landing_subtitle: "गिग वर्क के लिए आपका वित्तीय साथी",
        landing_choose_language: "अपनी भाषा चुनें",
        landing_speak_to_start: "या शुरू करने के लिए बोलें",
        landing_what_is: "गिगलेंस क्या है?",
        landing_description: "गिगलेंस गिग वर्कर्स को अपने वित्त का प्रबंधन करने, बेहतर अवसर खोजने और स्थिर भविष्य की योजना बनाने में मदद करता है।",

        // Other
        recent_activity: "हालिया गतिविधि"
    },
    te: {
        // Dashboard
        greeting: "నమస్కారం",
        earned: "సంపాదించిన డబ్బు",
        spent: "ఖర్చు చేసిన డబ్బు",
        support: "అత్యవసర సహాయం",
        trust: "నమ్మకం బ్యాడ్జ్",
        save_mode: "సేవ్ మోడ్",
        voice_help: "మాట్లాడటానికి నొక్కండి",
        available_liquidity: "అందుబాటులో ఉన్న నగదు",
        current_balance: "ప్రస్తుత బ్యాలెన్స్",
        dashboard: "డాష్‌బోర్డ్",
        expense_ratio: "ఖర్చుల నిష్పత్తి",

        // Sidebar
        nav_dashboard: "డాష్‌బోర్డ్",
        nav_jobs: "ఉద్యోగాలు",
        nav_simulator: "సిమ్యులేటర్",
        nav_goals: "లక్ష్యాలు",
        nav_profile: "ప్రొఫైల్",
        nav_help: "సహాయం",
        nav_logout: "లాగ్ అవుట్",

        // Streak
        streak_title: "దినసరి స్ట్రీక్",
        streak_sub: "స్ట్రీక్ కోల్పోకుండా ప్రతిరోజూ లాగిన్ అవ్వండి.",
        pro_driver: "ప్రో డ్రైవర్",
        next_level: "తదుపరి స్థాయికి రోజులు",

        // Forms (Quick Add)
        quick_add: "త్వరగా జోడించండి",
        btn_income: "ఆదాయం",
        btn_expense: "ఖర్చు",
        label_amount: "మొత్తం",
        label_category: "వర్గం",
        btn_submit: "లావాదేవీ జోడించండి",

        // Placeholders
        ph_amount: "మొత్తం నమోదు చేయండి",
        ph_category: "వర్గం ఎంచుకోండి",

        // Language Gate
        lang_english: "English",
        lang_hindi: "हिंदी",
        lang_telugu: "తెలుగు",
        continue_english: "Continue in English",
        continue_hindi: "हिंदी में आगे बढ़ें",
        continue_telugu: "తెలుగులో కొనసాగించండి",

        // Voice Agent
        voice_agent_title: "గిగ్‌లెన్స్ వాయిస్ అసిస్టెంట్",
        voice_agent_subtitle: "మీ ఆర్థిక విషయాల గురించి ఏదైనా అడగండి",
        voice_listening: "వింటున్నాను...",
        voice_processing: "ప్రాసెస్ చేస్తున్నాను...",
        voice_speaking: "మాట్లాడుతున్నాను...",
        voice_tap_to_speak: "మాట్లాడటానికి నొక్కండి",
        voice_error: "అర్థం కాలేదు. దయచేసి మళ్ళీ ప్రయత్నించండి.",
        voice_welcome: "నమస్కారం! నేను మీ గిగ్‌లెన్స్ అసిస్టెంట్. ఈ రోజు మీకు ఎలా సహాయం చేయగలను?",
        voice_no_support: "మీ బ్రౌజర్‌లో వాయిస్ రికగ్నిషన్ మద్దతు లేదు",

        // Jobs & Career
        jobs_for_you: "మీ కోసం ఉద్యోగాలు",
        career_path: "కెరీర్ మార్గం",
        career_growth: "కెరీర్ వృద్ధి",
        recommended_courses: "సిఫార్సు చేసిన కోర్సులు",
        view_course: "కోర్సు చూడండి",
        skill_up: "నైపుణ్యం పెంచుకోండి",
        free_course: "ఉచితం",
        paid_course: "చెల్లింపు",

        // Landing Page
        landing_title: "గిగ్‌లెన్స్‌కు స్వాగతం",
        landing_subtitle: "గిగ్ వర్క్ కోసం మీ ఆర్థిక సహచరుడు",
        landing_choose_language: "మీ భాషను ఎంచుకోండి",
        landing_speak_to_start: "లేదా ప్రారంభించడానికి మాట్లాడండి",
        landing_what_is: "గిగ్‌లెన్స్ అంటే ఏమిటి?",
        landing_description: "గిగ్‌లెన్స్ గిగ్ వర్కర్లకు వారి ఆర్థిక నిర్వహణ, మెరుగైన అవకాశాలను కనుగొనడం మరియు స్థిరమైన భవిష్యత్తు కోసం ప్రణాళిక వేయడంలో సహాయపడుతుంది.",

        // Other
        recent_activity: "ఇటీవలి కార్యకలాపం"
    }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [language, setLanguageState] = useState<Language>('en');
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const savedLang = localStorage.getItem('app_language') as Language;
        if (savedLang && (savedLang === 'en' || savedLang === 'hi' || savedLang === 'te')) {
            setLanguageState(savedLang);
        }
        setIsLoaded(true);
    }, []);

    const toggleLanguage = () => {
        setLanguageState(prev => {
            const langs: Language[] = ['en', 'hi', 'te'];
            const currentIndex = langs.indexOf(prev);
            const newLang = langs[(currentIndex + 1) % langs.length];
            localStorage.setItem('app_language', newLang);
            return newLang;
        });
    };

    const setLanguage = (lang: Language) => {
        setLanguageState(lang);
        localStorage.setItem('app_language', lang);
    };

    const value = {
        language,
        toggleLanguage,
        setLanguage,
        t: translations[language],
        speechCode: SPEECH_LANGUAGE_CODES[language]
    };

    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    );
}

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};
