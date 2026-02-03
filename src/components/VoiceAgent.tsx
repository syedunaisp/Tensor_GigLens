"use client";

import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { Mic, MicOff, Volume2, Loader2, Languages, StopCircle, UserPlus } from "lucide-react";
import { useLanguage, Language, SPEECH_LANGUAGE_CODES, LANGUAGE_NAMES } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useGigFin } from "@/context/GigFinContext";
import { useAuth } from "@/context/AuthContext";
import { aggregateVoiceAgentData, createMinimalVoiceAgentData } from "@/lib/voice-agent-data";
import { useMLSimulation } from "@/hooks/useMLSimulation";
import { BackendFinancialData } from "@/types/voice-agent";

// Types for Web Speech API
interface SpeechRecognitionEvent extends Event {
    results: SpeechRecognitionResultList;
    resultIndex: number;
}

interface SpeechRecognitionErrorEvent extends Event {
    error: string;
    message: string;
}

interface SpeechRecognition extends EventTarget {
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    start(): void;
    stop(): void;
    abort(): void;
    onresult: (event: SpeechRecognitionEvent) => void;
    onerror: (event: SpeechRecognitionErrorEvent) => void;
    onend: () => void;
    onstart: () => void;
}

declare global {
    interface Window {
        SpeechRecognition: new () => SpeechRecognition;
        webkitSpeechRecognition: new () => SpeechRecognition;
    }
}

type VoiceAgentState = "IDLE" | "LISTENING" | "PROCESSING" | "SPEAKING" | "ERROR";

interface VoiceAgentProps {
    variant?: "landing" | "floating" | "inline";
    onUserMessage?: (message: string) => void;
    className?: string;
}

export default function VoiceAgent({ 
    variant = "landing", 
    onUserMessage,
    className 
}: VoiceAgentProps) {
    const { language, setLanguage, t, speechCode } = useLanguage();
    const [state, setState] = useState<VoiceAgentState>("IDLE");
    const [transcript, setTranscript] = useState<string>("");
    const [response, setResponse] = useState<string>("");
    const [isSupported, setIsSupported] = useState(true);
    const [showLanguageSelector, setShowLanguageSelector] = useState(false);
    
    const recognitionRef = useRef<SpeechRecognition | null>(null);
    const synthRef = useRef<SpeechSynthesisUtterance | null>(null);

    // Get auth state to check if user is logged in and onboarded
    const { isAuthenticated, onboardingComplete } = useAuth();

    // Integrate with GigFin context for backend data
    const { transactions, userProfile, calculateKarmaScore, isDataLoaded } = useGigFin();
    
    // Get ML simulation data for leak detection
    const { detectedLeaks } = useMLSimulation(
        transactions, 
        userProfile.currentBalance, 
        userProfile.goals
    );

    // Determine the user state for voice agent behavior
    type UserDataState = "NOT_AUTHENTICATED" | "LOADING" | "NOT_ONBOARDED" | "READY";
    
    const userDataState: UserDataState = useMemo(() => {
        if (!isAuthenticated) {
            return "NOT_AUTHENTICATED";
        }
        if (!isDataLoaded) {
            return "LOADING";
        }
        if (!onboardingComplete) {
            return "NOT_ONBOARDED";
        }
        return "READY";
    }, [isAuthenticated, isDataLoaded, onboardingComplete]);

    // Aggregate all backend data for the voice agent
    // ONLY compute when data is fully loaded and user is onboarded
    const backendData: BackendFinancialData = useMemo(() => {
        // Don't compute if data isn't ready
        if (userDataState !== "READY") {
            return createMinimalVoiceAgentData();
        }
        
        try {
            // Check if we have meaningful data (onboarding completed)
            if (userProfile.gigCreditScore > 0 && transactions.length > 0) {
                const karmaScore = calculateKarmaScore();
                return aggregateVoiceAgentData(
                    userProfile,
                    transactions,
                    karmaScore,
                    detectedLeaks
                );
            }
            // Return minimal data if no real data
            return createMinimalVoiceAgentData();
        } catch (error) {
            console.error("Error aggregating voice agent data:", error);
            return createMinimalVoiceAgentData();
        }
    }, [userDataState, userProfile, transactions, detectedLeaks, calculateKarmaScore]);

    // Check for Web Speech API support
    useEffect(() => {
        if (typeof window !== "undefined") {
            const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
            if (!SpeechRecognitionAPI) {
                setIsSupported(false);
            }
        }
    }, []);

    // Initialize speech recognition
    const initRecognition = useCallback(() => {
        if (typeof window === "undefined") return null;
        
        const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognitionAPI) return null;

        const recognition = new SpeechRecognitionAPI();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = speechCode;

        recognition.onstart = () => {
            setState("LISTENING");
            setTranscript("");
        };

        recognition.onresult = (event: SpeechRecognitionEvent) => {
            let finalTranscript = "";
            let interimTranscript = "";

            for (let i = event.resultIndex; i < event.results.length; i++) {
                const result = event.results[i];
                if (result.isFinal) {
                    finalTranscript += result[0].transcript;
                } else {
                    interimTranscript += result[0].transcript;
                }
            }

            setTranscript(finalTranscript || interimTranscript);
            
            if (finalTranscript) {
                handleUserInput(finalTranscript);
            }
        };

        recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
            console.error("Speech recognition error:", event.error);
            if (event.error !== "aborted") {
                setState("ERROR");
                setResponse(t.voice_error);
            }
        };

        recognition.onend = () => {
            if (state === "LISTENING") {
                // If we're still in listening state without a result, show error
                if (!transcript) {
                    setState("IDLE");
                }
            }
        };

        return recognition;
    }, [speechCode, state, transcript, t.voice_error]);

    // Handle user input - send to LLM with backend data
    const handleUserInput = async (text: string) => {
        setState("PROCESSING");
        
        // Notify parent component if callback provided
        onUserMessage?.(text);

        try {
            // Call our API route with full backend data context
            // The LLM will use this data to provide grounded responses
            const res = await fetch("/api/voice-agent", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: text,
                    language: language,
                    backendData: backendData  // Send all aggregated backend data
                })
            });

            if (!res.ok) {
                throw new Error("API request failed");
            }

            const data = await res.json();
            const aiResponse = data.response || t.voice_error;
            
            setResponse(aiResponse);
            speakResponse(aiResponse);
        } catch (error) {
            console.error("Error processing voice input:", error);
            setResponse(t.voice_error);
            setState("ERROR");
        }
    };

    // Text-to-Speech using Web Speech API
    const speakResponse = (text: string) => {
        if (typeof window === "undefined" || !window.speechSynthesis) {
            setState("IDLE");
            return;
        }

        // Cancel any ongoing speech
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = speechCode;
        utterance.rate = 0.9;
        utterance.pitch = 1;

        // Try to find a voice that matches the language
        const voices = window.speechSynthesis.getVoices();
        const matchingVoice = voices.find(voice => voice.lang.startsWith(language));
        if (matchingVoice) {
            utterance.voice = matchingVoice;
        }

        utterance.onstart = () => {
            setState("SPEAKING");
        };

        utterance.onend = () => {
            setState("IDLE");
        };

        utterance.onerror = () => {
            setState("IDLE");
        };

        synthRef.current = utterance;
        window.speechSynthesis.speak(utterance);
    };

    // Start listening
    const startListening = () => {
        if (!isSupported) {
            setResponse(t.voice_no_support);
            return;
        }

        // Stop any ongoing speech
        if (typeof window !== "undefined" && window.speechSynthesis) {
            window.speechSynthesis.cancel();
        }

        const recognition = initRecognition();
        if (recognition) {
            recognitionRef.current = recognition;
            recognition.start();
        }
    };

    // Stop listening
    const stopListening = () => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
        }
        if (typeof window !== "undefined" && window.speechSynthesis) {
            window.speechSynthesis.cancel();
        }
        setState("IDLE");
    };

    // Handle main button click
    const handleMainAction = () => {
        if (state === "IDLE" || state === "ERROR") {
            startListening();
        } else if (state === "LISTENING" || state === "SPEAKING") {
            stopListening();
        }
    };

    // Select language
    const handleLanguageSelect = (lang: Language) => {
        setLanguage(lang);
        setShowLanguageSelector(false);
    };

    // Render based on variant
    if (variant === "landing") {
        // Show different UI based on user data state
        if (userDataState === "NOT_AUTHENTICATED") {
            return (
                <div className={cn("flex flex-col items-center gap-6", className)}>
                    <div className="text-center space-y-2">
                        <h2 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white">
                            {t.voice_agent_title}
                        </h2>
                        <p className="text-slate-600 dark:text-slate-300">
                            {language === "hi" ? "शुरू करने के लिए साइन अप करें" : 
                             language === "te" ? "ప్రారంభించడానికి సైన్ అప్ చేయండి" : 
                             "Sign up to get started"}
                        </p>
                    </div>
                    <div className="relative">
                        <div className="flex h-32 w-32 md:h-40 md:w-40 items-center justify-center rounded-full bg-gradient-to-br from-slate-400 to-slate-500 shadow-2xl">
                            <UserPlus className="h-12 w-12 md:h-16 md:w-16 text-white" />
                        </div>
                    </div>
                    <p className="text-lg text-slate-600 dark:text-slate-300">
                        {language === "hi" ? "कृपया पहले साइन अप करें" : 
                         language === "te" ? "దయచేసి ముందుగా సైన్ అప్ చేయండి" : 
                         "Please sign up first"}
                    </p>
                </div>
            );
        }

        if (userDataState === "LOADING") {
            return (
                <div className={cn("flex flex-col items-center gap-6", className)}>
                    <div className="text-center space-y-2">
                        <h2 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white">
                            {t.voice_agent_title}
                        </h2>
                    </div>
                    <div className="relative">
                        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-orange-500 animate-spin" />
                        <div className="flex h-32 w-32 md:h-40 md:w-40 items-center justify-center rounded-full bg-gradient-to-br from-orange-400 to-orange-500 shadow-2xl">
                            <Loader2 className="h-12 w-12 md:h-16 md:w-16 text-white animate-spin" />
                        </div>
                    </div>
                    <p className="text-lg text-orange-600 font-medium animate-pulse">
                        {language === "hi" ? "आपका डेटा लोड हो रहा है..." : 
                         language === "te" ? "మీ డేటా లోడ్ అవుతోంది..." : 
                         "Loading your data..."}
                    </p>
                </div>
            );
        }

        if (userDataState === "NOT_ONBOARDED") {
            return (
                <div className={cn("flex flex-col items-center gap-6", className)}>
                    <div className="text-center space-y-2">
                        <h2 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white">
                            {t.voice_agent_title}
                        </h2>
                        <p className="text-slate-600 dark:text-slate-300">
                            {language === "hi" ? "अपनी प्रोफ़ाइल पूरी करें" : 
                             language === "te" ? "మీ ప్రొఫైల్ పూర్తి చేయండి" : 
                             "Complete your profile to use voice assistant"}
                        </p>
                    </div>
                    <div className="relative">
                        <div className="flex h-32 w-32 md:h-40 md:w-40 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-amber-500 shadow-2xl">
                            <Mic className="h-12 w-12 md:h-16 md:w-16 text-white opacity-50" />
                        </div>
                    </div>
                    <p className="text-lg text-amber-600">
                        {language === "hi" ? "कृपया पहले ऑनबोर्डिंग पूरी करें" : 
                         language === "te" ? "దయచేసి ముందుగా ఆన్‌బోర్డింగ్ పూర్తి చేయండి" : 
                         "Please complete onboarding first"}
                    </p>
                </div>
            );
        }

        // userDataState === "READY" - Show full voice agent
        return (
            <div className={cn("flex flex-col items-center gap-6", className)}>
                {/* Title */}
                <div className="text-center space-y-2">
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white">
                        {t.voice_agent_title}
                    </h2>
                    <p className="text-slate-600 dark:text-slate-300">
                        {t.voice_agent_subtitle}
                    </p>
                </div>

                {/* Main Voice Button */}
                <div className="relative">
                    {/* Animated rings when listening */}
                    {state === "LISTENING" && (
                        <>
                            <div className="absolute inset-0 rounded-full bg-red-400/30 animate-ping" />
                            <div className="absolute -inset-4 rounded-full border-2 border-red-300 animate-pulse opacity-50" />
                            <div className="absolute -inset-8 rounded-full border border-red-200 animate-pulse opacity-30" />
                        </>
                    )}
                    
                    {/* Processing spinner ring */}
                    {state === "PROCESSING" && (
                        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-orange-500 animate-spin" />
                    )}

                    {/* Speaking waves */}
                    {state === "SPEAKING" && (
                        <div className="absolute -inset-4 rounded-full border-2 border-green-400 animate-pulse" />
                    )}

                    <button
                        onClick={handleMainAction}
                        disabled={state === "PROCESSING"}
                        className={cn(
                            "relative flex h-32 w-32 md:h-40 md:w-40 items-center justify-center rounded-full shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95",
                            state === "IDLE" && "bg-gradient-to-br from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700",
                            state === "LISTENING" && "bg-gradient-to-br from-red-500 to-red-600",
                            state === "PROCESSING" && "bg-gradient-to-br from-orange-400 to-orange-500 cursor-wait",
                            state === "SPEAKING" && "bg-gradient-to-br from-green-500 to-green-600",
                            state === "ERROR" && "bg-gradient-to-br from-slate-500 to-slate-600"
                        )}
                    >
                        <div className="text-white">
                            {state === "IDLE" && <Mic className="h-12 w-12 md:h-16 md:w-16" />}
                            {state === "LISTENING" && (
                                <div className="flex items-end gap-1">
                                    <div className="w-2 h-6 bg-white rounded-full animate-[bounce_0.6s_ease-in-out_infinite]" />
                                    <div className="w-2 h-10 bg-white rounded-full animate-[bounce_0.4s_ease-in-out_infinite_0.1s]" />
                                    <div className="w-2 h-8 bg-white rounded-full animate-[bounce_0.5s_ease-in-out_infinite_0.2s]" />
                                    <div className="w-2 h-12 bg-white rounded-full animate-[bounce_0.4s_ease-in-out_infinite_0.15s]" />
                                    <div className="w-2 h-6 bg-white rounded-full animate-[bounce_0.6s_ease-in-out_infinite_0.25s]" />
                                </div>
                            )}
                            {state === "PROCESSING" && <Loader2 className="h-12 w-12 md:h-16 md:w-16 animate-spin" />}
                            {state === "SPEAKING" && <Volume2 className="h-12 w-12 md:h-16 md:w-16 animate-pulse" />}
                            {state === "ERROR" && <MicOff className="h-12 w-12 md:h-16 md:w-16" />}
                        </div>
                    </button>
                </div>

                {/* Status Text */}
                <div className="text-center min-h-[60px]">
                    {state === "IDLE" && (
                        <p className="text-lg text-slate-600 dark:text-slate-300 animate-pulse">
                            {t.voice_tap_to_speak}
                        </p>
                    )}
                    {state === "LISTENING" && (
                        <div className="space-y-1">
                            <p className="text-lg text-red-600 font-medium">{t.voice_listening}</p>
                            {transcript && (
                                <p className="text-slate-700 dark:text-slate-200 italic">"{transcript}"</p>
                            )}
                        </div>
                    )}
                    {state === "PROCESSING" && (
                        <p className="text-lg text-orange-600 font-medium">{t.voice_processing}</p>
                    )}
                    {state === "SPEAKING" && (
                        <div className="space-y-2">
                            <p className="text-lg text-green-600 font-medium">{t.voice_speaking}</p>
                            <p className="text-slate-700 dark:text-slate-200 max-w-md mx-auto">
                                {response}
                            </p>
                        </div>
                    )}
                    {state === "ERROR" && (
                        <p className="text-lg text-red-600">{response || t.voice_error}</p>
                    )}
                </div>

                {/* Language Selector */}
                <div className="relative">
                    <Button
                        variant="outline"
                        size="lg"
                        onClick={() => setShowLanguageSelector(!showLanguageSelector)}
                        className="gap-2"
                    >
                        <Languages className="h-5 w-5" />
                        {LANGUAGE_NAMES[language].native}
                    </Button>

                    {showLanguageSelector && (
                        <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-white dark:bg-slate-800 rounded-lg shadow-xl border p-2 min-w-[160px] z-50">
                            {(["en", "hi", "te"] as Language[]).map((lang) => (
                                <button
                                    key={lang}
                                    onClick={() => handleLanguageSelect(lang)}
                                    className={cn(
                                        "w-full text-left px-4 py-2 rounded-md transition-colors",
                                        language === lang
                                            ? "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300"
                                            : "hover:bg-slate-100 dark:hover:bg-slate-700"
                                    )}
                                >
                                    <span className="font-medium">{LANGUAGE_NAMES[lang].native}</span>
                                    <span className="text-sm text-slate-500 dark:text-slate-400 ml-2">
                                        ({LANGUAGE_NAMES[lang].english})
                                    </span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {!isSupported && (
                    <p className="text-red-500 text-sm text-center max-w-md">
                        {t.voice_no_support}
                    </p>
                )}
            </div>
        );
    }

    // Floating variant (for use within the app)
    if (variant === "floating") {
        return (
            <div className={cn("fixed bottom-24 right-6 z-50 md:bottom-10 md:right-10", className)}>
                {/* Response bubble */}
                {(state === "SPEAKING" || state === "ERROR") && response && (
                    <div className="absolute bottom-full mb-4 right-0 max-w-xs bg-white dark:bg-slate-800 rounded-xl shadow-xl border p-4 animate-in fade-in slide-in-from-bottom-2">
                        <p className="text-sm text-slate-700 dark:text-slate-200">{response}</p>
                        <div className="absolute -bottom-2 right-6 w-4 h-4 bg-white dark:bg-slate-800 border-b border-r transform rotate-45" />
                    </div>
                )}

                {/* Listening indicator */}
                {state === "LISTENING" && transcript && (
                    <div className="absolute bottom-full mb-4 right-0 max-w-xs bg-white dark:bg-slate-800 rounded-xl shadow-xl border p-4 animate-in fade-in slide-in-from-bottom-2">
                        <p className="text-sm text-slate-700 dark:text-slate-200 italic">"{transcript}"</p>
                    </div>
                )}

                <button
                    onClick={handleMainAction}
                    disabled={state === "PROCESSING"}
                    className={cn(
                        "relative flex h-16 w-16 items-center justify-center rounded-full shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95",
                        state === "IDLE" && "bg-orange-600 hover:bg-orange-700",
                        state === "LISTENING" && "bg-red-500",
                        state === "PROCESSING" && "bg-orange-500 cursor-wait",
                        state === "SPEAKING" && "bg-green-600",
                        state === "ERROR" && "bg-slate-500"
                    )}
                >
                    {/* Animated rings */}
                    {state === "IDLE" && (
                        <div className="absolute inset-0 rounded-full border-2 border-white/30 animate-ping opacity-75" />
                    )}
                    {state === "LISTENING" && (
                        <>
                            <div className="absolute inset-0 rounded-full border-4 border-red-300 animate-ping opacity-50" />
                            <div className="absolute -inset-2 rounded-full border border-red-200 animate-pulse opacity-30" />
                        </>
                    )}
                    {state === "PROCESSING" && (
                        <div className="absolute inset-0 rounded-full border-t-4 border-white animate-spin" />
                    )}

                    <div className="z-10 text-white">
                        {state === "IDLE" && <Mic className="h-8 w-8" />}
                        {state === "LISTENING" && <Mic className="h-8 w-8 animate-pulse" />}
                        {state === "PROCESSING" && <Loader2 className="h-8 w-8 animate-spin" />}
                        {state === "SPEAKING" && <Volume2 className="h-8 w-8 animate-bounce" />}
                        {state === "ERROR" && <MicOff className="h-8 w-8" />}
                    </div>
                </button>
            </div>
        );
    }

    // Inline variant
    return (
        <div className={cn("flex items-center gap-4", className)}>
            <button
                onClick={handleMainAction}
                disabled={state === "PROCESSING"}
                className={cn(
                    "flex h-12 w-12 items-center justify-center rounded-full transition-all",
                    state === "IDLE" && "bg-orange-600 hover:bg-orange-700",
                    state === "LISTENING" && "bg-red-500",
                    state === "PROCESSING" && "bg-orange-500",
                    state === "SPEAKING" && "bg-green-600",
                    state === "ERROR" && "bg-slate-500"
                )}
            >
                <div className="text-white">
                    {state === "IDLE" && <Mic className="h-6 w-6" />}
                    {state === "LISTENING" && <Mic className="h-6 w-6 animate-pulse" />}
                    {state === "PROCESSING" && <Loader2 className="h-6 w-6 animate-spin" />}
                    {state === "SPEAKING" && <Volume2 className="h-6 w-6" />}
                    {state === "ERROR" && <MicOff className="h-6 w-6" />}
                </div>
            </button>
            <div className="flex-1">
                {state === "IDLE" && <span className="text-sm text-muted-foreground">{t.voice_tap_to_speak}</span>}
                {state === "LISTENING" && <span className="text-sm text-red-600">{transcript || t.voice_listening}</span>}
                {state === "PROCESSING" && <span className="text-sm text-orange-600">{t.voice_processing}</span>}
                {state === "SPEAKING" && <span className="text-sm text-green-600">{response}</span>}
                {state === "ERROR" && <span className="text-sm text-red-600">{t.voice_error}</span>}
            </div>
        </div>
    );
}
