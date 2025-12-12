import { GoogleGenAI } from "@google/genai";
import { Transaction } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const getFinancialAdvice = async (
  transactions: Transaction[],
  userProfession: string,
  userAge: number,
  userQuery: string
): Promise<string> => {
  if (!apiKey) {
    return "API Key is missing. Please configure the environment.";
  }

  const transactionSummary = transactions.map(t => 
    `${t.date}: ${t.type.toUpperCase()} - $${t.amount} (${t.category})`
  ).join('\n');

  const prompt = `
    You are an expert financial advisor for the "Wealth Waves" app.
    
    User Profile:
    - Profession: ${userProfession}
    - Age: ${userAge}

    Recent Transactions:
    ${transactionSummary}

    User Question: "${userQuery}"

    Provide a concise, helpful, and professional answer (max 100 words).
    Focus on financial health, savings opportunities, and budget management relevant to their profession and age.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "I couldn't generate advice at this moment.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Sorry, I'm having trouble connecting to the financial brain right now.";
  }
};

export const getStockMarketAnalysis = async (): Promise<string> => {
    if (!apiKey) {
      return "API Key is missing. Please configure the environment.";
    }
  
    const prompt = `
      Act as a senior stock market analyst for the Indian (NSE/BSE) and Global markets. 
      Provide a "Real-time" style market recommendation report for the Wealth Waves app.
      
      Structure your response in Markdown:
      
      ### 🇮🇳 Top Indian Stock Picks (Long Term)
      List 3 solid blue-chip or growth stocks from NSE/BSE. Include the Ticker and a 1-sentence reason.
      
      ### 🌍 Top Global Stock Picks
      List 2 solid stocks (e.g., US Market). Include Ticker and reason.
      
      ### 🚀 Emerging Sector to Watch
      Identify one sector (e.g., EV, AI, Green Energy) that is booming in India right now.
      
      Disclaimer: Standard financial disclaimer.
      
      Keep it professional, data-driven, and concise. Assume the current date is today.
    `;
  
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });
      return response.text || "Market analysis unavailable.";
    } catch (error) {
      console.error("Gemini API Error:", error);
      return "Unable to fetch market data at this time.";
    }
  };

export const getAdvisorChatResponse = async (
  advisorName: string,
  advisorRole: string,
  advisorExpertise: string,
  userQuery: string,
  chatHistory: { role: string, text: string }[] = []
): Promise<string> => {
  if (!apiKey) return "Unable to connect to advisor.";

  const historyContext = chatHistory.slice(-5).map(m => `${m.role === 'user' ? 'User' : advisorName}: ${m.text}`).join('\n');

  const prompt = `
    Roleplay Instructions:
    You are ${advisorName}, a ${advisorRole} specializing in ${advisorExpertise}.
    You work for "Wealth Waves".
    
    Tone: Professional, empathetic, and encouraging. You are talking to a beginner who might not know much about money.
    
    Conversation History:
    ${historyContext}
    
    Current User Question: "${userQuery}"
    
    Answer as ${advisorName}. Keep it under 80 words. Be specific to your expertise.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "I apologize, I didn't quite catch that.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I am currently offline. Please try again later.";
  }
};