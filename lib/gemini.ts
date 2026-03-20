import { GoogleGenerativeAI } from "@google/generative-ai";

function env(name: string): string | undefined {
  return process.env[name];
}

export type GeminiGeneratedQuiz = {
  sections: Array<{
    title: string;
    questions: Array<{
      question: string;
      marks: number;
      options?: string[];
      difficulty: string;
    }>;
  }>;
};

function coerceToJson(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    const match = text.match(/\{[\s\S]*\}/);
    if (match) return JSON.parse(match[0]);
    throw new Error("Gemini did not return valid JSON.");
  }
}

export async function generateAssignmentContent(params: {
  imageBase64: string;
  mimeType: string;
}): Promise<GeminiGeneratedQuiz> {
  const apiKey = env("GEMINI_API_KEY");
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured.");
  }

  const modelName = env("GEMINI_MODEL") || "gemini-1.5-pro";

  const prompt = `
You are an AI teacher. Convert the provided image of an assignment sheet into structured quiz content.

Return ONLY a valid JSON object (no markdown, no extra text) matching this schema:
{
  "sections": [
    {
      "title": "string",
      "questions": [
        {
          "question": "string",
          "marks": number,
          "difficulty": "easy|medium|hard",
          "options": ["string", "string", "string", "string"]   // include only if the question is MCQ
        }
      ]
    }
  ]
}

Important rules:
- Ensure the JSON is parseable.
- Do not omit required keys.
- If the image contains multiple sections, group them accordingly.
- Derive marks and difficulty from the question context.
- The "options" field is optional; include it only when appropriate.
`.trim();

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: modelName });

  const result = await model.generateContent([
    { text: prompt },
    {
      inlineData: {
        mimeType: params.mimeType,
        data: params.imageBase64,
      },
    },
  ]);

  const responseText = result.response.text();
  const parsed = coerceToJson(responseText);
  return parsed as GeminiGeneratedQuiz;
}

