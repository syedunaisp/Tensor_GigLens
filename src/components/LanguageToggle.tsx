"use client";

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';

export function LanguageToggle() {
    const { language, toggleLanguage } = useLanguage();

    return (
        <button
            onClick={toggleLanguage}
            className="px-3 py-1 bg-orange-100 text-orange-800 text-sm font-bold rounded-full hover:bg-orange-200 transition-colors border border-orange-200"
        >
            {language === 'en' ? 'EN | हिंदी' : 'हिंदी | EN'}
        </button>
    );
}
