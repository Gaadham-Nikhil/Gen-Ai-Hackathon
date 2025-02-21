import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export async function generateEmailContent(params: {
  recipientName: string;
  eventName: string;
  specialInstructions: string;
}): Promise<string> {
  try {
    if (!API_KEY) {
      throw new Error('Gemini API key is not configured');
    }

    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `Write a professional email with the following details:
      - Recipient: ${params.recipientName}
      - Event: ${params.eventName}
      - Special Instructions: ${params.specialInstructions}
      
      Make it concise, professional, and engaging. Include a proper greeting and closing.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    if (!text) {
      throw new Error('No content generated');
    }

    return text;
  } catch (error) {
    console.error('Error generating content:', error);
    throw error;
  }
}

export async function validateApiKey(): Promise<boolean> {
  try {
    if (!API_KEY) return false;

    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    // Simple test prompt to validate the API key
    await model.generateContent('Hello');
    return true;
  } catch {
    return false;
  }
}