"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useUser } from "@clerk/nextjs";

export default function RootPage() {
  const router = useRouter();
  const { isSignedIn, isLoaded, user } = useUser();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Check auth state on mount and redirect if already authenticated
  useEffect(() => {
    if (isLoaded) {
      if (isSignedIn && user) {
        const stored = localStorage.getItem(`gigfin_onboarding_${user.id}`);
        if (stored === 'true') {
          router.replace('/land');
        } else {
          router.replace('/onboarding');
        }
      } else {
        setIsCheckingAuth(false);
      }
    }
  }, [isLoaded, isSignedIn, user, router]);

  const handleLanguageSelect = (lang: 'en' | 'hi') => {
    localStorage.setItem('app_language', lang);
    router.push('/login');
  };

  // Show loading state while checking auth - prevents hydration mismatch
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 dark:from-slate-900 dark:to-slate-800 flex flex-col items-center justify-center p-6">
        <Loader2 className="h-12 w-12 text-orange-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 dark:from-slate-900 dark:to-slate-800 flex flex-col items-center justify-center p-6 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold tracking-tight text-slate-800 dark:text-white">
          Welcome to GigLens
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-300">
          Choose your language / अपनी भाषा चुनें
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
        <Card
          className="cursor-pointer hover:shadow-xl transition-all border-l-8 border-l-blue-500 hover:scale-105"
          onClick={() => handleLanguageSelect('en')}
        >
          <CardContent className="flex flex-col items-center justify-center py-10 space-y-4">
            <span className="text-5xl">🇬🇧</span>
            <div className="text-center">
              <h2 className="text-2xl font-bold">English</h2>
              <p className="text-muted-foreground">Continue in English</p>
            </div>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer hover:shadow-xl transition-all border-l-8 border-l-orange-500 hover:scale-105"
          onClick={() => handleLanguageSelect('hi')}
        >
          <CardContent className="flex flex-col items-center justify-center py-10 space-y-4">
            <span className="text-5xl">🇮🇳</span>
            <div className="text-center">
              <h2 className="text-2xl font-bold">हिंदी</h2>
              <p className="text-muted-foreground">हिंदी में आगे बढ़ें</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
