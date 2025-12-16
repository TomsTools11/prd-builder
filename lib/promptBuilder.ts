import { SYSTEM_PROMPT } from "./prdTemplate";
import type { PRDFormData } from "@/types";

export function buildPRDPrompt(
  formData: PRDFormData,
  fileContents: Array<{ name: string; content: string; type: string }>
): string {
  const { productName, description, goals, targetAudience, features } = formData;

  let prompt = `# Product Requirements Document Request

## Product Name
${productName}

## Product Description
${description}
`;

  if (goals) {
    prompt += `
## Goals and Objectives
${goals}
`;
  }

  if (targetAudience) {
    prompt += `
## Target Audience
${targetAudience}
`;
  }

  if (features.length > 0) {
    prompt += `
## Key Features
${features.map((f) => `- ${f}`).join("\n")}
`;
  }

  if (fileContents.length > 0) {
    prompt += `
## Additional Context from Uploaded Files

`;
    fileContents.forEach((file) => {
      if (file.type.startsWith("image/")) {
        prompt += `### ${file.name}
[Image file attached for visual context]

`;
      } else {
        prompt += `### ${file.name}
${file.content}

---

`;
      }
    });
  }

  prompt += `
Please generate a comprehensive Product Requirements Document following the structure and guidelines in your instructions. Ensure all sections are well-detailed with specific, actionable requirements.`;

  return prompt;
}

export function getSystemPrompt(): string {
  return SYSTEM_PROMPT;
}

export interface GeminiMessage {
  role: "user" | "model";
  parts: Array<{ text?: string; inlineData?: { mimeType: string; data: string } }>;
}

export function buildGeminiMessages(
  formData: PRDFormData,
  fileContents: Array<{ name: string; content: string; type: string; base64?: string }>
): GeminiMessage[] {
  const textPrompt = buildPRDPrompt(
    formData,
    fileContents.filter((f) => !f.type.startsWith("image/"))
  );

  const parts: Array<{ text?: string; inlineData?: { mimeType: string; data: string } }> = [
    { text: textPrompt },
  ];

  // Add images as inline data
  fileContents
    .filter((f) => f.type.startsWith("image/") && f.base64)
    .forEach((imageFile) => {
      const base64Data = imageFile.base64!.split(",")[1]; // Remove data:image/...;base64, prefix
      parts.push({
        inlineData: {
          mimeType: imageFile.type,
          data: base64Data,
        },
      });
    });

  return [
    {
      role: "user",
      parts,
    },
  ];
}
