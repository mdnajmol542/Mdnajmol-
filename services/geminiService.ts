
import { GoogleGenAI, Type } from "@google/genai";
// Correctly importing AppIdea and RoadmapItem from types
import { AppIdea, RoadmapItem } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateAppRoadmap = async (idea: AppIdea): Promise<RoadmapItem[]> => {
  const prompt = `Create a 4-phase development roadmap for an app called "${idea.title}". 
  Description: ${idea.description}. 
  Target Audience: ${idea.targetAudience}. 
  Provide specific, actionable technical and business tasks for each phase.`;

  // Using gemini-3-flash-preview for structured text generation
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            phase: { type: Type.STRING },
            tasks: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING } 
            }
          },
          required: ["phase", "tasks"]
        }
      }
    }
  });

  try {
    return JSON.parse(response.text || '[]');
  } catch (e) {
    console.error("Failed to parse roadmap JSON", e);
    return [];
  }
};

export const generateAppMockup = async (idea: AppIdea): Promise<string | undefined> => {
  const prompt = `A professional, high-fidelity mobile/web UI mockup for an app called "${idea.title}". 
  The app is for ${idea.targetAudience} and its purpose is ${idea.description}. 
  Clean, modern design, soft shadows, vibrant color palette, beautiful typography. 
  The mockup should look like a Dribbble masterpiece.`;

  // Using gemini-2.5-flash-image for standard image generation
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: { parts: [{ text: prompt }] },
    config: {
        imageConfig: {
            aspectRatio: "9:16"
        }
    }
  });

  // Iterating through all response parts to find the image data as per guidelines
  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  return undefined;
};

export const generateStarterCode = async (idea: AppIdea): Promise<{ title: string, code: string, lang: string }[]> => {
  const prompt = `Generate 3 essential code snippets for the app "${idea.title}" (${idea.description}).
  Include: 
  1. A core React component (TypeScript/Tailwind).
  2. A sample backend API route (Node.js/Express or Python/FastAPI).
  3. A database schema (Prisma/SQL or MongoDB).
  Return as a JSON array of objects with 'title', 'code', and 'lang' fields.`;

  // Using gemini-3-pro-preview for complex reasoning and coding tasks
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            code: { type: Type.STRING },
            lang: { type: Type.STRING }
          },
          required: ["title", "code", "lang"]
        }
      }
    }
  });

  try {
    return JSON.parse(response.text || '[]');
  } catch (e) {
    console.error("Failed to parse code snippets", e);
    return [];
  }
};
