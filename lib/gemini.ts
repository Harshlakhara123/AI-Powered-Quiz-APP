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
  formMetadata?: Record<string, unknown>;
}): Promise<GeminiGeneratedQuiz> {
  const apiKey = env("GEMINI_API_KEY");
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured.");
  }

  const modelName = env("GEMINI_MODEL") || "gemini-1.5-pro";

  let constraintsPrompt = "";
  if (params.formMetadata) {
    constraintsPrompt = "\n\nSTRICT CONSTRAINTS FROM USER:";
    if (params.formMetadata.questionTypes && Array.isArray(params.formMetadata.questionTypes)) {
      constraintsPrompt += "\nYou MUST perfectly match this exact question distribution and marks:";
      params.formMetadata.questionTypes.forEach((qt: { count: number; type: string; marks: number }) => {
        constraintsPrompt += `\n- Generate exactly ${qt.count} question(s) of type "${qt.type}", each worth exactly ${qt.marks} marks.`;
      });
    }
    if (params.formMetadata.additionalInfo) {
      constraintsPrompt += `\nAdditional Instructions: ${params.formMetadata.additionalInfo}`;
    }
  }

  const prompt = `
You are an AI teacher. Convert the provided document or image of an assignment sheet into structured quiz content.

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
- Derive marks and difficulty from the question context UNLESS overridden by strict constraints below.
- The "options" field is optional; include it only when appropriate.
${constraintsPrompt}
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

