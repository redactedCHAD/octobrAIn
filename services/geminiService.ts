import { GoogleGenAI, Modality } from "@google/genai";
import { GEMINI_TEXT_MODEL, GEMINI_IMAGE_MODEL } from "../constants";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API_KEY environment variable is missing");
  }
  return new GoogleGenAI({ apiKey });
};

export const generateCampaignContent = async (
  brandName: string,
  productDesc: string,
  targetAudience: string
) => {
  const client = getClient();
  
  const prompt = `
    Act as a senior digital marketing strategist.
    Brand: ${brandName}
    Product: ${productDesc}
    Target Audience: ${targetAudience}

    Generate a mini-marketing campaign in STRICT JSON format with the following fields:
    - "script": A 30-second video script with visual cues and narration.
    - "social_posts": An array of 3 objects with "platform" (e.g., LinkedIn, Instagram, Twitter) and "content" (the post text).
    - "seo_keywords": An array of 10 high-value semantic keywords.
    - "image_prompt_suggestion": A descriptive prompt to generate an image for this campaign.

    Do not use markdown formatting for the JSON. Just return the raw JSON string.
  `;

  const response = await client.models.generateContent({
    model: GEMINI_TEXT_MODEL,
    contents: prompt,
    config: {
      responseMimeType: 'application/json'
    }
  });

  return response.text;
};

export const generateImage = async (prompt: string) => {
  const client = getClient();
  
  const response = await client.models.generateContent({
    model: GEMINI_IMAGE_MODEL,
    contents: {
      parts: [{ text: prompt }]
    },
    config: {
      responseModalities: [Modality.IMAGE]
    }
  });

  // Extract base64 data
  const part = response.candidates?.[0]?.content?.parts?.[0];
  if (part && part.inlineData && part.inlineData.data) {
    return `data:image/png;base64,${part.inlineData.data}`;
  }
  
  throw new Error("No image generated");
};

export const analyzeSeoText = async (text: string) => {
  const client = getClient();
  
  const prompt = `
    Analyze the following marketing copy for SEO:
    "${text}"

    Return a JSON object with:
    - "score": number (1-100)
    - "sentiment": string (Positive, Neutral, Negative)
    - "keywords_detected": array of strings
    - "improvements": array of strings (suggestions to improve SEO/readability)
  `;

  const response = await client.models.generateContent({
    model: GEMINI_TEXT_MODEL,
    contents: prompt,
    config: {
        responseMimeType: 'application/json'
    }
  });

  return response.text;
};