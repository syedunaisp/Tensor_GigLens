"use client";

import React, { useState, useEffect } from "react";
import { Mic, Volume2, Loader2, Info } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

type SahayakState = "IDLE" | "LISTENING" | "PROCESSING" | "SPEAKING";

export default function VoiceSahayak() {
    const { language } = useLanguage();
    const [state, setState] = useState<SahayakState>("IDLE");
    const [toastMessage, setToastMessage] = useState<string | null>(null);

    useEffect(() => {
        let timeout: NodeJS.Timeout;

        if (state === "LISTENING") {
            setToastMessage(language === "hi" ? "सुन रहा हूँ..." : "Listening...");
            timeout = setTimeout(() => {
                setState("PROCESSING");
            }, 3000);
        } else if (state === "PROCESSING") {
            setToastMessage(language === "hi" ? "विश्लेषण हो रहा है..." : "Analyzing...");
            timeout = setTimeout(() => {
                setState("SPEAKING");
            }, 2000);
        } else if (state === "SPEAKING") {
            setToastMessage(
                language === "hi"
                    ? "आपका शेष ₹28,000 है"
                    : "Your balance is ₹28,000"
            );
            timeout = setTimeout(() => {
                setState("IDLE");
                setToastMessage(null);
            }, 3000);
        }

        return () => clearTimeout(timeout);
    }, [state, language]);

    const handleClick = () => {
        if (state === "IDLE") {
            setState("LISTENING");
        }
    };

    return (
        <div className="fixed bottom-24 right-6 z-50 flex flex-col items-center gap-4 md:bottom-10 md:right-10">
            {/* Toast Notification Bubble */}
            {toastMessage && (
                <div
                    className="mb-2 animate-in fade-in slide-in-from-bottom-2 duration-300"
                >
                    <div className="rounded-xl bg-white px-4 py-3 shadow-xl border border-orange-100 text-gray-800 flex items-center gap-2 max-w-[200px] md:max-w-xs text-sm font-medium">
                        {state === 'SPEAKING' && <Volume2 className="h-4 w-4 text-orange-600" />}
                        {state === 'PROCESSING' && <Loader2 className="h-4 w-4 text-orange-600 animate-spin" />}
                        {state === 'LISTENING' && <Mic className="h-4 w-4 text-orange-600 animate-pulse" />}
                        <span>{toastMessage}</span>
                    </div>
                    {/* Speech bubble arrow */}
                    <div className="absolute left-1/2 -bottom-2 h-4 w-4 -translate-x-1/2 rotate-45 transform bg-white border-b border-r border-orange-100"></div>
                </div>
            )}

            {/* Main Floating Action Button */}
            <button
                onClick={handleClick}
                className={`relative flex h-16 w-16 items-center justify-center rounded-full shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 ${state === "IDLE"
                        ? "bg-orange-600 hover:bg-orange-700"
                        : state === "LISTENING"
                            ? "bg-red-500"
                            : state === "PROCESSING"
                                ? "bg-orange-500"
                                : "bg-green-600"
                    }`}
            >
                {/* Helper Rings for Animation */}
                {state === "IDLE" && (
                    <div className="absolute inset-0 rounded-full border-2 border-white/30 animate-ping opacity-75 duration-[3s]"></div>
                )}

                {state === "LISTENING" && (
                    <>
                        <div className="absolute inset-0 rounded-full border-4 border-red-300 animate-ping opacity-50"></div>
                        <div className="absolute -inset-2 rounded-full border border-red-200 animate-pulse opacity-30"></div>
                    </>
                )}

                {state === "PROCESSING" && (
                    <div className="absolute inset-0 rounded-full border-t-4 border-white animate-spin"></div>
                )}

                {/* Icons */}
                <div className="z-10 text-white">
                    {state === "IDLE" && <Mic className="h-8 w-8" />}
                    {state === "LISTENING" && <Mic className="h-8 w-8 animate-pulse" />}
                    {state === "PROCESSING" && <Loader2 className="h-8 w-8 animate-spin" />}
                    {state === "SPEAKING" && <Volume2 className="h-8 w-8 animate-bounce" />}
                </div>
            </button>
        </div>
    );
}
