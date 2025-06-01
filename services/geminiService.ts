import { GoogleGenerativeAI, GenerativeModel, Content } from "@google/generative-ai";
import { GEMINI_API_KEY, GEMINI_MODEL_NAME } from '../constants';

let genAI: GoogleGenerativeAI | null = null;
let model: GenerativeModel | null = null;

const initializeGemini = () => {
  if (!GEMINI_API_KEY) {
    console.error("Gemini API Key is missing. Please set it in constants.tsx or as an environment variable.");
    // Potentially throw an error or return a specific status to be handled by the UI
    // For now, we'll let it proceed, and API calls will fail.
  }
  // Ensure GEMINI_API_KEY is not undefined before passing it to GoogleGenerativeAI
  if (GEMINI_API_KEY && !genAI) {
    genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    model = genAI.getGenerativeModel({ model: GEMINI_MODEL_NAME });
  }
};

// Call initialize on load, but it's safe to call multiple times.
initializeGemini();

export const cleanApiResponse = (text: string): string => {
  // Remove Markdown formatting (e.g., **, ```, etc.)
  // This is a basic implementation. More robust parsing might be needed
  // depending on the complexity of the Gemini responses.
  return text
    .replace(/```[\s\S]*?```/g, content => content.replace(/```/g, '')) // Remove triple backticks but keep content
    .replace(/(\*\*|__)(.*?)/g, '$2') // Bold
    .replace(/(\*|_)(.*?)/g, '$2')   // Italics
    .replace(/`([^`]+)`/g, '$1')       // Inline code
    .trim();
};

const generateContentWithGemini = async (prompt: string | Content[]): Promise<string> => {
  if (!model) {
    initializeGemini(); // Attempt to re-initialize if model is not set
    if (!model) {
      console.error("Gemini model is not initialized. Check API Key and configuration.");
      return "Error: Gemini model not initialized. Please check your API Key.";
    }
  }

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    // Directly access the text property as per documentation for simple text responses
    return cleanApiResponse(response.text());
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error && error.message.includes("API key not valid")) {
        return "Error: Invalid Gemini API Key. Please check your configuration.";
    }
    return `Error generating content: ${error instanceof Error ? error.message : String(error)}`;
  }
};

export const improvePrompt = async (promptText: string, targetLanguage: string): Promise<string> => {
  const systemInstruction = `You are an AI assistant specialized in improving and refining user-provided prompts.
The user wants to improve the following prompt.
Analyze it and provide a revised version that is clearer, more effective, and tailored for Large Language Models.
Consider adding detail, context, or constraints if appropriate.
Respond ONLY with the improved prompt text, without any preamble or explanation.
The response should be in ${targetLanguage}.`;

  const fullPrompt: Content[] = [
    { role: "system", parts: [{ text: systemInstruction }] },
    { role: "user", parts: [{ text: promptText }] }
  ];
  return generateContentWithGemini(fullPrompt);
};

export const generateVariations = async (promptText: string, targetLanguage: string, count: number = 3): Promise<string[]> => {
  const systemInstruction = `You are an AI assistant specialized in generating variations of user-provided prompts.
Generate ${count} distinct variations of the following prompt. Each variation should offer a different angle, style, or focus.
List each variation clearly. Respond ONLY with the variations, each on a new line. Do not number them or add any extra text.
The response should be in ${targetLanguage}.`;

  const fullPrompt: Content[] = [
    { role: "system", parts: [{ text: systemInstruction }] },
    { role: "user", parts: [{ text: promptText }] }
  ];

  const singleStringResponse = await generateContentWithGemini(fullPrompt);
  // Assuming variations are separated by newlines
  return singleStringResponse.split('\n').map(v => cleanApiResponse(v.trim())).filter(v => v.length > 0);
};

export const suggestIdeas = async (promptText: string, targetLanguage: string): Promise<string[]> => {
  const systemInstruction = `You are an AI assistant specialized in brainstorming and suggesting improvements for prompts.
For the following prompt, provide a few actionable ideas or suggestions to enhance it, add new features, or explore related concepts.
List each idea clearly. Respond ONLY with the ideas, each on a new line. Do not number them or add any extra text.
The response should be in ${targetLanguage}.`;

  const fullPrompt: Content[] = [
    { role: "system", parts: [{ text: systemInstruction }] },
    { role: "user", parts: [{ text: promptText }] }
  ];

  const singleStringResponse = await generateContentWithGemini(fullPrompt);
  // Assuming ideas are separated by newlines
  return singleStringResponse.split('\n').map(idea => cleanApiResponse(idea.trim())).filter(idea => idea.length > 0);
};

// Ensure this file can be imported and used as a module
export {};
