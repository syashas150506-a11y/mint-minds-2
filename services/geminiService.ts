
import { GoogleGenAI } from "@google/genai";
import { Transaction } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getFinancialAdvice = async (
  transactions: Transaction[],
  userProfession: string,
  userAge: number,
  userQuery: string
): Promise<string> => {
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
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "I couldn't generate advice at this moment.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Sorry, I'm having trouble connecting to the financial brain right now.";
  }
};

export const getGeneralChatResponse = async (
  userName: string,
  userProfession: string,
  userQuery: string,
  chatHistory: { role: string, text: string }[] = []
): Promise<string> => {
  const historyContext = chatHistory.slice(-6).map(m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.text}`).join('\n');

  const prompt = `
    System Instruction: You are "Wavey", the official AI assistant of Wealth Waves. 
    You are friendly, witty, and extremely knowledgeable about Indian personal finance.
    Your goal is to help ${userName} (a ${userProfession}) navigate the app and answer any financial or general questions.
    
    Current Task: Respond to the user's message.
    
    Conversation History:
    ${historyContext}
    
    User message: "${userQuery}"
    
    Instructions:
    - Keep it under 60 words.
    - Use occasional emojis.
    - Be encouraging.
    - If the user asks about app features, guide them to sections like "Mutual Funds", "Budget Planner", or "Student Corner".
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "I'm here to help! Wavey is listening.";
  } catch (error) {
    console.error("Gemini General Chat Error:", error);
    return "Wavey is momentarily under the tide. Please try again in a bit!";
  }
};

export const getStockMarketAnalysis = async (): Promise<string> => {
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
        model: 'gemini-3-flash-preview',
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
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "I apologize, I didn't quite catch that.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I am currently offline. Please try again later.";
  }
};

export const getMutualFundAnalysis = async (fundCategory: string): Promise<string> => {
    const prompt = `
      Analyze the "${fundCategory}" Mutual Fund category for an Indian investor.
      
      Provide a brief 3-point summary in Markdown covering:
      1. Who should invest? (Risk profile/Time horizon)
      2. Average expected returns (Historic ballpark)
      3. Key risks to be aware of.

      Keep it very concise (max 100 words).
    `;

    try {
        const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: prompt,
        });
        return response.text || "Analysis unavailable.";
    } catch (error) {
        console.error("Gemini MF Analysis Error", error);
        return "Could not analyze fund category.";
    }
};

export const generatePortfolio = async (
  amount: string,
  duration: string,
  returnRate: string
): Promise<string> => {
  const prompt = `
    You are an expert AI Portfolio Manager for the Indian Stock Market.
    
    Client Profile:
    - Investment Amount: ₹${amount}
    - Investment Horizon: ${duration} Years
    - Target Annual Return: ${returnRate}%

    Task:
    Create a detailed stock portfolio allocation plan using stocks listed on NSE/BSE.
    
    Guidelines:
    1. Select 5-8 specific Indian stocks that align with the risk profile required to achieve ${returnRate}% annual return.
    2. If the return expectation is high (>18%), focus more on Mid/Small caps. If conservative (<12%), focus on Large caps.
    3. Calculate the approximate amount to invest in each stock based on the total ₹${amount}.
    
    Output Format (Markdown):
    ### 🎯 Strategy Overview
    [1-2 sentences on the strategy type, e.g., "Aggressive Growth", "Balanced Value", "Dividend Yield"]

    ### 📊 Recommended Allocation
    | Stock | Sector | Allocation % | Amount (₹) | Rationale |
    |---|---|---|---|---|
    | [Ticker] | [Sector] | [XX%] | [₹XXXX] | [Brief Reason] |
    
    ### 💡 Execution Tips
    *   [Tip 1]
    *   [Tip 2]

    *Disclaimer: This is AI-generated advice for educational purposes. Consult a SEBI registered advisor before investing.*
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
    });
    return response.text || "Could not generate portfolio strategy.";
  } catch (error) {
    console.error("Gemini Portfolio Error:", error);
    return "Service temporarily unavailable.";
  }
};
