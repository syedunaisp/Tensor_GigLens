import { NextRequest, NextResponse } from "next/server";
import { BackendFinancialData } from "@/types/voice-agent";
import { auth } from "@clerk/nextjs/server";

/**
 * DATA-GROUNDED SYSTEM PROMPTS
 * 
 * These prompts ensure the LLM only EXPLAINS backend data.
 * The LLM must NEVER:
 * - Compute financial scores
 * - Predict cashflow
 * - Decide Good/Neutral/Risky
 * - Override backend ML outputs
 * - Invent or hallucinate data
 */

function buildDataGroundedPrompt(language: string, data: BackendFinancialData): string {
    const basePrompts: Record<string, string> = {
        en: `You are GigLens AI Assistant, a friendly voice guide for gig workers in India.

CRITICAL RULES (NEVER VIOLATE):
1. You can ONLY explain the data provided below. Never invent numbers or predictions.
2. If data shows "unknown" or 0 values, say "I don't have enough data yet."
3. Never calculate or predict anything - all scores are pre-computed.
4. Never give financial advice beyond explaining the data.
5. Keep responses SHORT (2-3 sentences max) and conversational.
6. Speak like a helpful friend, not a formal advisor.

USER'S FINANCIAL DATA (pre-computed by backend):
- Name: ${data.userName}
- Current Balance: ₹${data.currentBalance.toLocaleString('en-IN')}
- Monthly Income: ₹${data.monthlyIncome.toLocaleString('en-IN')}
- Monthly Expenses: ₹${data.monthlyExpenses.toLocaleString('en-IN')}
- Gig Credit Score: ${data.gigCreditScore} (scale: 300-900)
- GigLens Health Score: ${data.gigLensScore}/100
- Karma Score (work consistency): ${data.karmaScore}/100
- Overall Status: ${data.overallStatus.toUpperCase()}
- Status Reason: ${data.statusReason}
- Streak: ${data.streak} days (Level: ${data.level})
- Cash Runway: ${data.forecast.safeDays} safe days
- Daily Save Target: ₹${data.forecast.dailySaveTarget}
- Detected Leaks: ${data.detectedLeaks.length > 0 ? data.detectedLeaks.map(l => `${l.type} (₹${l.amount})`).join(', ') : 'None detected'}
- Last 7 Days Income: ₹${data.recentActivity.totalIncome7Days.toLocaleString('en-IN')}
- Last 7 Days Expenses: ₹${data.recentActivity.totalExpenses7Days.toLocaleString('en-IN')}
- Top Expense Category: ${data.recentActivity.topExpenseCategory}
- Goals Progress: ${data.totalGoalProgress}%
- Data Complete: ${data.hasCompleteData ? 'Yes' : 'No - onboarding may be incomplete'}

RESPONSE STYLE:
- Be warm and supportive, like a trusted friend
- Reference specific numbers from above when relevant
- If asked something not in the data, say "I don't have that information right now"
- Always respond in English`,

        hi: `आप GigLens AI सहायक हैं, भारत में गिग वर्कर्स के लिए एक मैत्रीपूर्ण वॉइस गाइड।

महत्वपूर्ण नियम (कभी न तोड़ें):
1. आप केवल नीचे दिए गए डेटा की व्याख्या कर सकते हैं। कभी भी नंबर या अनुमान न बनाएं।
2. अगर डेटा "unknown" या 0 दिखाता है, कहें "मेरे पास अभी पर्याप्त डेटा नहीं है।"
3. कभी भी गणना या भविष्यवाणी न करें - सभी स्कोर पहले से गणना किए गए हैं।
4. डेटा समझाने के अलावा वित्तीय सलाह न दें।
5. जवाब छोटे (अधिकतम 2-3 वाक्य) और बातचीत जैसे रखें।

उपयोगकर्ता का वित्तीय डेटा:
- नाम: ${data.userName}
- मौजूदा बैलेंस: ₹${data.currentBalance.toLocaleString('en-IN')}
- मासिक आय: ₹${data.monthlyIncome.toLocaleString('en-IN')}
- मासिक खर्च: ₹${data.monthlyExpenses.toLocaleString('en-IN')}
- गिग क्रेडिट स्कोर: ${data.gigCreditScore} (300-900)
- स्वास्थ्य स्कोर: ${data.gigLensScore}/100
- कर्म स्कोर: ${data.karmaScore}/100
- स्थिति: ${data.overallStatus === 'healthy' ? 'स्वस्थ' : data.overallStatus === 'moderate' ? 'मध्यम' : data.overallStatus === 'risky' ? 'जोखिम भरा' : 'अज्ञात'}
- कारण: ${data.statusReason}
- स्ट्रीक: ${data.streak} दिन (${data.level})
- सुरक्षित दिन: ${data.forecast.safeDays}
- लीक्स: ${data.detectedLeaks.length > 0 ? data.detectedLeaks.map(l => `${l.type} (₹${l.amount})`).join(', ') : 'कोई नहीं'}

हमेशा हिंदी में जवाब दें।`,

        te: `మీరు GigLens AI అసిస్టెంట్, భారతదేశంలో గిగ్ వర్కర్లకు స్నేహపూర్వక వాయిస్ గైడ్.

కీలక నియమాలు (ఎప్పటికీ ఉల్లంఘించకూడదు):
1. మీరు క్రింద అందించిన డేటాను మాత్రమే వివరించగలరు. సంఖ్యలు లేదా అంచనాలను కల్పించకూడదు.
2. డేటా "unknown" లేదా 0 చూపిస్తే, "నా వద్ద ఇంకా తగినంత డేటా లేదు" అని చెప్పండి.
3. ఎప్పుడూ లెక్కించకూడదు లేదా అంచనా వేయకూడదు - అన్ని స్కోర్లు ముందుగా లెక్కించబడ్డాయి.
4. సమాధానాలు చిన్నవిగా (గరిష్టంగా 2-3 వాక్యాలు) ఉంచండి.

వినియోగదారు ఆర్థిక డేటా:
- పేరు: ${data.userName}
- ప్రస్తుత బ్యాలెన్స్: ₹${data.currentBalance.toLocaleString('en-IN')}
- నెలవారీ ఆదాయం: ₹${data.monthlyIncome.toLocaleString('en-IN')}
- నెలవారీ ఖర్చులు: ₹${data.monthlyExpenses.toLocaleString('en-IN')}
- గిగ్ క్రెడిట్ స్కోర్: ${data.gigCreditScore}
- ఆరోగ్య స్కోర్: ${data.gigLensScore}/100
- కర్మ స్కోర్: ${data.karmaScore}/100
- స్థితి: ${data.overallStatus}
- కారణం: ${data.statusReason}
- స్ట్రీక్: ${data.streak} రోజులు

ఎల్లప్పుడూ తెలుగులో ప్రతిస్పందించండి.`
    };

    return basePrompts[language] || basePrompts.en;
}

// Welcome messages for different languages
const WELCOME_MESSAGES: Record<string, string> = {
    en: "Hello! I'm your GigLens assistant. I can see your financial data and help explain your status. What would you like to know?",
    hi: "नमस्ते! मैं आपका गिगलेंस सहायक हूँ। मैं आपका वित्तीय डेटा देख सकता हूं। आप क्या जानना चाहेंगे?",
    te: "నమస్కారం! నేను మీ గిగ్‌లెన్స్ అసిస్టెంట్. మీ ఆర్థిక డేటా చూడగలను. మీరు ఏమి తెలుసుకోవాలనుకుంటున్నారు?"
};

// No data messages
const NO_DATA_MESSAGES: Record<string, string> = {
    en: "I don't have enough data yet to answer that accurately. Please complete your financial profile first.",
    hi: "मेरे पास अभी इसका सही जवाब देने के लिए पर्याप्त डेटा नहीं है। कृपया पहले अपनी वित्तीय प्रोफाइल पूरी करें।",
    te: "దానికి సరిగ్గా సమాధానం చెప్పడానికి నా వద్ద ఇంకా తగినంత డేటా లేదు. దయచేసి ముందుగా మీ ఆర్థిక ప్రొఫైల్ పూర్తి చేయండి."
};

interface VoiceAgentRequest {
    message: string;
    language: "en" | "hi" | "te";
    backendData?: BackendFinancialData;
    // Legacy support for old requests
    context?: string;
    userProfile?: {
        balance?: number;
        earnings?: number;
        expenses?: number;
        creditScore?: number;
    };
}

export async function POST(request: NextRequest) {
    try {
        const session = await auth();
        if (!session.userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body: VoiceAgentRequest = await request.json();
        const { message, language = "en", backendData } = body;

        // Check for Groq API key
        const groqApiKey = process.env.GROQ_API_KEY;

        if (!groqApiKey) {
            console.warn("GROQ_API_KEY not configured, using fallback responses");
            return NextResponse.json({
                response: getFallbackResponse(message, language, backendData),
                source: "fallback",
                dataUsed: !!backendData?.hasCompleteData
            });
        }

        // Check if we have complete backend data
        if (!backendData || !backendData.hasCompleteData) {
            // Return a data-aware fallback
            return NextResponse.json({
                response: NO_DATA_MESSAGES[language] || NO_DATA_MESSAGES.en,
                source: "fallback",
                dataUsed: false
            });
        }

        // Build the data-grounded system prompt
        const systemPrompt = buildDataGroundedPrompt(language, backendData);

        // Call Groq API with LLaMA 3.3 70B
        const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${groqApiKey}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: [
                    {
                        role: "system",
                        content: systemPrompt
                    },
                    {
                        role: "user",
                        content: message
                    }
                ],
                temperature: 0.5,  // Lower temperature for more factual responses
                max_tokens: 200,
                top_p: 0.9
            })
        });

        if (!groqResponse.ok) {
            const errorData = await groqResponse.text();
            console.error("Groq API error:", errorData);
            throw new Error(`Groq API error: ${groqResponse.status}`);
        }

        const data = await groqResponse.json();
        const aiResponse = data.choices?.[0]?.message?.content ||
            getFallbackResponse(message, language, backendData);

        return NextResponse.json({
            response: aiResponse,
            source: "groq",
            model: "llama-3.3-70b-versatile",
            dataUsed: true
        });

    } catch (error) {
        console.error("Voice agent API error:", error);

        // Return fallback response on error
        return NextResponse.json({
            response: getFallbackResponse("", "en", undefined),
            source: "fallback",
            error: error instanceof Error ? error.message : "Unknown error",
            dataUsed: false
        }, { status: 200 }); // Return 200 with fallback to not break the UI
    }
}

/**
 * Data-aware fallback responses
 * Uses backend data when available, otherwise provides generic guidance
 */
function getFallbackResponse(
    message: string,
    language: string,
    backendData?: BackendFinancialData
): string {
    const lowerMessage = message.toLowerCase();

    // If we have backend data, provide data-grounded fallbacks
    if (backendData?.hasCompleteData) {
        // Balance query
        if (lowerMessage.includes("balance") || lowerMessage.includes("बैलेंस") || lowerMessage.includes("బ్యాలెన్స్")) {
            const responses: Record<string, string> = {
                en: `Your current balance is ₹${backendData.currentBalance.toLocaleString('en-IN')}. In the last 7 days, you earned ₹${backendData.recentActivity.totalIncome7Days.toLocaleString('en-IN')}.`,
                hi: `आपका मौजूदा बैलेंस ₹${backendData.currentBalance.toLocaleString('en-IN')} है। पिछले 7 दिनों में आपने ₹${backendData.recentActivity.totalIncome7Days.toLocaleString('en-IN')} कमाए।`,
                te: `మీ ప్రస్తుత బ్యాలెన్స్ ₹${backendData.currentBalance.toLocaleString('en-IN')}. గత 7 రోజుల్లో మీరు ₹${backendData.recentActivity.totalIncome7Days.toLocaleString('en-IN')} సంపాదించారు.`
            };
            return responses[language] || responses.en;
        }

        // Status/score query
        if (lowerMessage.includes("status") || lowerMessage.includes("score") || lowerMessage.includes("स्थिति") || lowerMessage.includes("స్థితి")) {
            const statusText = {
                healthy: { en: "healthy", hi: "स्वस्थ", te: "ఆరోగ్యకరమైన" },
                moderate: { en: "moderate", hi: "मध्यम", te: "మధ్యస్థ" },
                risky: { en: "risky", hi: "जोखिम भरा", te: "ప్రమాదకరమైన" },
                unknown: { en: "unknown", hi: "अज्ञात", te: "తెలియని" }
            };
            const status = statusText[backendData.overallStatus] || statusText.unknown;

            const responses: Record<string, string> = {
                en: `Your financial status is ${status.en}. ${backendData.statusReason} Your GigLens score is ${backendData.gigLensScore}/100.`,
                hi: `आपकी वित्तीय स्थिति ${status.hi} है। ${backendData.statusReason} आपका गिगलेंस स्कोर ${backendData.gigLensScore}/100 है।`,
                te: `మీ ఆర్థిక స్థితి ${status.te}. ${backendData.statusReason} మీ గిగ్‌లెన్స్ స్కోర్ ${backendData.gigLensScore}/100.`
            };
            return responses[language] || responses.en;
        }

        // Leak query
        if (lowerMessage.includes("leak") || lowerMessage.includes("expense") || lowerMessage.includes("खर्च") || lowerMessage.includes("ఖర్చు")) {
            if (backendData.detectedLeaks.length > 0) {
                const leakInfo = backendData.detectedLeaks[0];
                const responses: Record<string, string> = {
                    en: `I detected a ${leakInfo.type} of ₹${leakInfo.amount}. Your top expense category is ${backendData.recentActivity.topExpenseCategory}.`,
                    hi: `मुझे ₹${leakInfo.amount} का ${leakInfo.type} मिला। आपकी शीर्ष खर्च श्रेणी ${backendData.recentActivity.topExpenseCategory} है।`,
                    te: `నేను ₹${leakInfo.amount} ${leakInfo.type} గుర్తించాను. మీ అగ్ర ఖర్చు వర్గం ${backendData.recentActivity.topExpenseCategory}.`
                };
                return responses[language] || responses.en;
            } else {
                const responses: Record<string, string> = {
                    en: `No major expense leaks detected. Your top expense category is ${backendData.recentActivity.topExpenseCategory}.`,
                    hi: `कोई बड़ी खर्च लीक नहीं मिली। आपकी शीर्ष खर्च श्रेणी ${backendData.recentActivity.topExpenseCategory} है।`,
                    te: `పెద్ద ఖర్చు లీక్‌లు గుర్తించబడలేదు. మీ అగ్ర ఖర్చు వర్గం ${backendData.recentActivity.topExpenseCategory}.`
                };
                return responses[language] || responses.en;
            }
        }

        // Hello/greeting
        if (lowerMessage.includes("hello") || lowerMessage.includes("hi") || lowerMessage.includes("नमस्ते") || lowerMessage.includes("నమస్కారం")) {
            return WELCOME_MESSAGES[language] || WELCOME_MESSAGES.en;
        }

        // Default with data
        const responses: Record<string, string> = {
            en: `I can see your financial data. Your balance is ₹${backendData.currentBalance.toLocaleString('en-IN')} and your status is ${backendData.overallStatus}. What would you like to know more about?`,
            hi: `मैं आपका वित्तीय डेटा देख सकता हूं। आपका बैलेंस ₹${backendData.currentBalance.toLocaleString('en-IN')} है और स्थिति ${backendData.overallStatus} है। आप और क्या जानना चाहेंगे?`,
            te: `మీ ఆర్థిक డేటా చూడగలను. మీ బ్యాలెన్స్ ₹${backendData.currentBalance.toLocaleString('en-IN')} మరియు స్థితి ${backendData.overallStatus}. మీరు ఇంకా ఏమి తెలుసుకోవాలనుకుంటున్నారు?`
        };
        return responses[language] || responses.en;
    }

    // No backend data - provide generic fallbacks (original behavior)
    if (lowerMessage.includes("hello") || lowerMessage.includes("hi") || lowerMessage.includes("नमस्ते") || lowerMessage.includes("నమస్కారం")) {
        return WELCOME_MESSAGES[language] || WELCOME_MESSAGES.en;
    }

    // Default no-data response
    return NO_DATA_MESSAGES[language] || NO_DATA_MESSAGES.en;
}

// GET endpoint for health check
export async function GET() {
    return NextResponse.json({
        status: "ok",
        service: "voice-agent",
        model: "llama-3.3-70b-versatile",
        version: "2.0-data-aware",
        hasApiKey: !!process.env.GROQ_API_KEY
    });
}
