
import { GoogleGenAI } from "@google/genai";
import { UI_SPEC_SCHEMA, SYSTEM_INSTRUCTION } from "./schemas";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

export const handler = async (event: any) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const { prompt } = JSON.parse(event.body);

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Design a premium landing page for: "${prompt}"`,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: UI_SPEC_SCHEMA,
      },
    });

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: response.text,
    };
  } catch (error: any) {
    console.error("Function Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to generate layout." }),
    };
  }
};
