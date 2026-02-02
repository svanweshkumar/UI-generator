
import { Type } from "@google/genai";

export const SECTION_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    type: { 
      type: Type.STRING, 
      description: "Must be one of: NAVBAR, HERO, FEATURES, CTA",
      enum: ["NAVBAR", "HERO", "FEATURES", "CTA"]
    },
    content: {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING },
        subtitle: { type: Type.STRING },
        description: { type: Type.STRING },
        buttonText: { type: Type.STRING },
        items: {
          type: Type.ARRAY,
          minItems: 3,
          maxItems: 3,
          description: "Exactly 3 features required.",
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              icon: { type: Type.STRING, description: "FontAwesome icon class" }
            },
            required: ["title", "description"]
          }
        }
      },
      required: ["title"]
    }
  },
  required: ["type", "content"]
};

export const UI_SPEC_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    name: { type: Type.STRING },
    theme: {
      type: Type.OBJECT,
      properties: {
        primaryColor: { 
          type: Type.STRING, 
          enum: ["indigo", "sky", "rose", "emerald", "amber", "slate"]
        }
      },
      required: ["primaryColor"]
    },
    sections: {
      type: Type.ARRAY,
      items: SECTION_SCHEMA
    }
  },
  required: ["name", "theme", "sections"]
};

export const SYSTEM_INSTRUCTION = `You are a Senior UI/UX Design Engineer.
Output a landing page specification in JSON for the 'Tambo' design system.
Aesthetic characteristics: 32px border radii, high contrast, soft layered shadows, and premium typography.
STRICT RULES:
1. Provide exactly 4 sections: NAVBAR, HERO, FEATURES (3 items), CTA.
2. Content must be high-conversion and tailored to the prompt.
3. No conversational output, just valid JSON.`;
