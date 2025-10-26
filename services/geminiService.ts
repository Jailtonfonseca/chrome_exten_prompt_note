
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { GEMINI_API_KEY, GEMINI_TEXT_MODEL, SUPPORTED_AI_LANGUAGES } from '../constants';

if (!GEMINI_API_KEY) {
  console.error("API_KEY is not set. Please ensure the API_KEY environment variable is configured.");
}

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY || "YOUR_API_KEY_PLACEHOLDER" });

const cleanApiResponse = (text: string): string => {
  let cleanedText = text.trim();
  const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
  const match = cleanedText.match(fenceRegex);
  if (match && match[2]) {
    cleanedText = match[2].trim();
  }
  return cleanedText;
};

const getLanguageName = (languageCode: string): string => {
  const lang = SUPPORTED_AI_LANGUAGES.find(l => l.code === languageCode);
  return lang ? lang.name : 'English'; // Default to English if code not found
};

export const improvePromptWithGemini = async (promptText: string, aiLanguage: string): Promise<string> => {
  if (!GEMINI_API_KEY) {
    throw new Error("Gemini API key is not configured.");
  }
  try {
    const languageName = getLanguageName(aiLanguage);
    const systemInstruction = `You are an AI assistant specialized in refining and improving user-provided AI prompts. Make the prompt more effective, clear, and concise. Return only the improved prompt text, without any conversational fluff or explanations about your changes. Please provide your response in ${languageName}.`;

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: GEMINI_TEXT_MODEL,
      contents: `Improve this AI prompt: "${promptText}"`,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      }
    });

    return cleanApiResponse(response.text);
  } catch (error) {
    console.error('Error improving prompt with Gemini:', error);
    if (error instanceof Error) {
       throw new Error(`Gemini API error: ${error.message}. Check your API key and network connection.`);
    }
    throw new Error('An unknown error occurred while improving the prompt with Gemini.');
  }
};

export const generatePromptVariationsWithGemini = async (promptText: string, aiLanguage: string): Promise<string[]> => {
  if (!GEMINI_API_KEY) {
    throw new Error("Gemini API key is not configured.");
  }
  try {
    const languageName = getLanguageName(aiLanguage);
    const systemInstruction = `You are an AI assistant that generates 3 distinct variations of a given AI prompt. Each variation should explore a different angle or style. Return the variations as a plain text list, each variation on a new line, prefixed with 'Variation X: '. Do not include any other conversational text or markdown formatting beyond this simple list. Please provide your response in ${languageName}.`;

    const requestPrompt = `Generate 3 distinct variations for the following AI prompt. Format them as a list:\n\n"${promptText}"`;

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: GEMINI_TEXT_MODEL,
      contents: requestPrompt,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.8,
      }
    });

    const rawText = cleanApiResponse(response.text);
    const variations = rawText
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .map(line => line.replace(/^Variation\s*\d*:\s*/i, '').trim())
      .filter(line => line.length > 0);

    if (variations.length === 0 && rawText.length > 0) {
        return [rawText];
    }
    return variations.slice(0,3);

  } catch (error) {
    console.error('Error generating prompt variations with Gemini:', error);
     if (error instanceof Error) {
       throw new Error(`Gemini API error: ${error.message}. Check your API key and network connection.`);
    }
    throw new Error('An unknown error occurred while generating prompt variations with Gemini.');
  }
};

export const getPromptEnhancementIdeasWithGemini = async (promptText: string, aiLanguage: string): Promise<string[]> => {
  if (!GEMINI_API_KEY) {
    throw new Error("Gemini API key is not configured.");
  }
  try {
    const languageName = getLanguageName(aiLanguage);
    const systemInstruction = `You are an AI assistant. Given a user's AI prompt, provide 3-5 concise ideas to enhance it or add specific features.
Example Input: 'Create a platformer game'
Example Output (if English is selected):
Add multiple levels with increasing difficulty
Implement a power-up system
Include a character customization option

Return these ideas as a plain text list, each idea on a new line.
Do not use markdown list formatting (e.g., '-', '*', or numbers).
Do not include any conversational intro/outro or explanations about your suggestions.
Please provide your response in ${languageName}.`;

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: GEMINI_TEXT_MODEL,
      contents: `Here is the current prompt, provide enhancement ideas for it: "${promptText}"`,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.75,
      }
    });

    const rawText = cleanApiResponse(response.text);
    const ideas = rawText
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);

    if (ideas.length === 0 && rawText.length > 0) {
        return [rawText];
    }
    return ideas.slice(0, 5);

  } catch (error) {
    console.error('Error getting prompt enhancement ideas with Gemini:', error);
    if (error instanceof Error) {
      throw new Error(`Gemini API error: ${error.message}. Check your API key and network connection.`);
    }
    throw new Error('An unknown error occurred while getting prompt enhancement ideas.');
  }
};
