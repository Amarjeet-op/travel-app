import { GoogleGenerativeAI } from '@google/generative-ai';
import type { SafetyCheck, SafetyResult } from '@/types/safety';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const SYSTEM_PROMPT = `You are a travel safety expert for India. Analyze the safety of a given area/city for a specific traveler type and time.

Return your response as a JSON object with these exact fields:
- signal: "green", "yellow", or "red" (overall safety level)
- score: number from 1-10 (safety score)
- findings: array of 3-5 key safety findings about the area
- womenSafety: string with specific safety notes for women travelers
- nightSafety: string with specific nighttime safety information
- transport: string with transportation recommendations
- emergencyNumbers: object with police, hospital, womenHelpline phone numbers
- sources: array of objects with title and url for sources

Be factual, concise, and India-specific. Consider local crime statistics, women's safety, night safety, and transport safety.`;

async function callGeminiModel(modelName: string, prompt: string, systemPrompt: string): Promise<string> {
  const model = genAI.getGenerativeModel({
    model: modelName,
    systemInstruction: systemPrompt,
    generationConfig: {
      temperature: 0.3,
      maxOutputTokens: 2048,
      responseMimeType: 'application/json',
    },
  });

  const result = await model.generateContent(prompt);
  return (await result.response).text();
}

export async function checkSafety(check: SafetyCheck): Promise<SafetyResult> {
  const prompt = `
Area: ${check.area}
City: ${check.city}
Traveler Type: ${check.travelerType}
Time of Visit: ${check.timeOfVisit}
${check.concerns ? `Specific Concerns: ${check.concerns}` : ''}

Provide a comprehensive safety assessment for this location and traveler profile.
`;

  // Comprehensive pool of models available for this specific API key
  const models = [
    'gemini-flash-latest', 
    'gemini-2.5-flash', 
    'gemini-pro-latest', 
    'gemini-1.5-flash',
    'gemini-2.0-flash'
  ];
  
  let lastError = null;

  for (const modelName of models) {
    try {
      console.log(`Checking safety using ${modelName}...`);
      const text = await callGeminiModel(modelName, prompt, SYSTEM_PROMPT);
      const parsed = JSON.parse(text) as SafetyResult;
      return parsed;
    } catch (error: any) {
      lastError = error;
      const msg = error.message.toLowerCase();
      // Expanded retry logic to include quota, demand, and 404/503/429 status codes
      const isRetryable = 
        msg.includes('404') || 
        msg.includes('503') || 
        msg.includes('429') || 
        msg.includes('demand') || 
        msg.includes('quota') || 
        msg.includes('limit');
      
      if (isRetryable) {
        console.warn(`${modelName} unavailable/limit reached. Trying next model...`);
        continue;
      }
      throw error;
    }
  }

  throw new Error(`Safety check failed on all available models. Last error: ${lastError?.message}`);
}
