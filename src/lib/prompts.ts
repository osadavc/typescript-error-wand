import z from "zod";

export const summarizeTypeScriptError = () => {
  return `You are an expert TypeScript developer helping explain errors to users.

Given a TypeScript error message and code from VSCode, provide a simple explanation of:
1. What the error means
2. How to fix it

Also keep an eye on common erros, sometimes the mistake is quite simple but the error message is not helpful.

eg: when you have passed a function to something that expects a object, the error message will be something like "Type 'thing' is missing the following properties from type 'thing': thing2, thing3, thing4, thing5, and 2 more.." Always try to pinpoint erros like this and give a simple explanation of what the error is.

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
