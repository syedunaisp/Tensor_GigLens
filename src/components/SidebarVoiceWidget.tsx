"use client";

import React, { useState, useEffect } from "react";
import { Mic, Volume2, Loader2 } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

type SahayakState = "IDLE" | "LISTENING" | "PROCESSING" | "SPEAKING";

export default function SidebarVoiceWidget() {
    const { language } = useLanguage();
    const [state, setState] = useState<SahayakState>("IDLE");
    const [displayText, setDisplayText] = useState<string>("Need Help?");

    useEffect(() => {
        let timeout: NodeJS.Timeout;

        if (state === "LISTENING") {
            setDisplayText(language === "hi" ? "सुन रहा हूँ..." : "Listening...");
            timeout = setTimeout(() => {
                setState("PROCESSING");
            }, 3000);
        } else if (state === "PROCESSING") {
            setDisplayText(language === "hi" ? "विश्लेषण हो रहा है..." : "Analyzing...");
            timeout = setTimeout(() => {
                setState("SPEAKING");
            }, 2000);
        } else if (state === "SPEAKING") {
            setDisplayText(
                language === "hi"
                    ? "शेष: ₹28,000"
                    : "Balance: ₹28,000"
            );
            timeout = setTimeout(() => {
                setState("IDLE");
                setDisplayText(language === "hi" ? "मदद चाहिए?" : "Need Help?");
            }, 3000);
        } else {
            setDisplayText(language === "hi" ? "मदद चाहिए?" : "Need Help?");
        }

        return () => clearTimeout(timeout);
    }, [state, language]);

    const handleClick = () => {
        if (state === "IDLE") {
            setState("LISTENING");
        }
    };

    return (
        <div className="mt-auto px-4 pb-4">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 p-4 text-white shadow-lg shadow-orange-500/20">

                {/* Background Decorative Circles */}
                <div className="absolute -right-4 -top-4 h-16 w-16 rounded-full bg-white/10 blur-xl"></div>
                <div className="absolute -left-4 -bottom-4 h-20 w-20 rounded-full bg-orange-400/20 blur-xl"></div>

                <div className="relative flex flex-col items-center gap-3">

                    {/* Title & Subtext */}
                    <div className="text-center">
                        <h3 className="font-bold text-sm tracking-wide transition-all duration-300">
                            {displayText}
                        </h3>
                        {state === "IDLE" && (
                            <p className="text-xs text-orange-100/80 mt-1">
                                {language === 'hi' ? 'बोलें' : 'Tap to Speak'}
                            </p>
                        )}
                    </div>

                    {/* Interactive Button */}
                    <button
                        onClick={handleClick}
                        className={`relative flex h-14 w-14 items-center justify-center rounded-full bg-white text-orange-600 shadow-xl transition-all duration-300 hover:scale-105 active:scale-95`}
                    >
                        {/* IDLE: Breathing Shadow */}
                        {state === "IDLE" && (
                            <div className="absolute inset-0 rounded-full bg-white/30 animate-ping duration-[3s]"></div>
                        )}

                        {/* LISTENING: Sound Wave Bars */}
                        {state === "LISTENING" && (
                            <div className="flex items-center gap-1">
                                <div className="h-3 w-1 rounded-full bg-orange-500 animate-[bounce_0.8s_infinite]"></div>
                                <div className="h-5 w-1 rounded-full bg-orange-500 animate-[bounce_0.6s_infinite]"></div>
                                <div className="h-3 w-1 rounded-full bg-orange-500 animate-[bounce_0.8s_infinite]"></div>
                            </div>
                        )}

                        {/* PROCESSING: Spinner */}
                        {state === "PROCESSING" && (
                            <Loader2 className="h-6 w-6 animate-spin text-orange-600" />
                        )}

                        {/* SPEAKING: Vibrating/Active Icon */}
                        {state === "SPEAKING" && (
                            <Volume2 className="h-6 w-6 animate-pulse text-green-600" />
                        )}

                        {/* Default Icon when IDLE */}
                        {state === "IDLE" && <Mic className="h-6 w-6" />}
                    </button>
                </div>
            </div>
        </div>
    );
}
