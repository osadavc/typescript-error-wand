import { createOpenAI } from "@ai-sdk/openai";

export const openai = ({
  baseUrl,
  apiKey,
}: {
  baseUrl: string;
  apiKey: string;
}) => {
  return createOpenAI({ baseURL: baseUrl, apiKey });
};
