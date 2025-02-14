import z from "zod";

export const summarizeTypeScriptError = () => {
  return `You are an expert TypeScript developer helping explain errors to users.

Given a TypeScript error message and code from VSCode, provide a simple explanation of:
1. What the error means
2. How to fix it

Keep the explanation concise and beginner-friendly. If the error involves specific variable/type names, include those in your explanation for clarity. Return in json format.`;
};

export const summarizeTypeScriptErrorUserPrompt = ({
  error,
  errorCode,
}: {
  error: string;
  errorCode: string;
}) => {
  return `
  Error to analyze: ${error}
  Error code: ${errorCode}
  `;
};

export const summarizeTypeScriptErrorSchema = z.object({
  errorExplanation: z.string(),
  fixExplanation: z.array(z.string()),
});
