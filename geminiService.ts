
import { SectionType, UISpec, UISection } from "./types";

/**
 * Client-side service that proxies requests to Netlify Functions.
 * This keeps the Gemini API key secure on the server.
 */

export async function generateFullPage(prompt: string): Promise<UISpec> {
  const response = await fetch("/.netlify/functions/generateFullPage", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "The design engine failed to respond.");
  }

  const data = await response.json();
  
  // Deterministic IDs for stable React rendering
  data.sections = data.sections.map((s: any) => ({
    ...s,
    id: `section-${s.type.toLowerCase()}`,
    type: s.type.toUpperCase() as SectionType
  }));
  
  return data as UISpec;
}

export async function regenerateSection(prompt: string, sectionType: SectionType, currentUI: UISpec): Promise<UISection> {
  const response = await fetch("/.netlify/functions/regenerateSection", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
          prompt,
          sectionType,
          brand: currentUI.name,
          theme: currentUI.theme.primaryColor
})
,
  });

  if (!response.ok) {
    throw new Error("Failed to refresh this section.");
  }

  const data = await response.json();
  return { ...data, type: sectionType, id: `section-${sectionType.toLowerCase()}` } as UISection;
}
