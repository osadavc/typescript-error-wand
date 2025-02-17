import { generateObject } from "ai";
import { getCredentials } from "./credentialsService";
import { openai } from "../lib/ai";
import {
  summarizeTypeScriptError,
  summarizeTypeScriptErrorSchema,
  summarizeTypeScriptErrorUserPrompt,
} from "../lib/prompts";
import * as vscode from "vscode";

export const getErrorSummary = async ({
  error,
  errorCode,
  context,
}: {
  error: string;
  errorCode: string;
  context: vscode.ExtensionContext;
}) => {
  const { apiKey, baseUrl, model } = getCredentials(context);

  if (!apiKey) {
    return null;
  }

  const result = await generateObject({
    model: openai({
      baseUrl,
      apiKey,
    })(model),
    schema: summarizeTypeScriptErrorSchema,
    messages: [
      {
        role: "system",
        content: summarizeTypeScriptError(),
      },
      {
        role: "user",
        content: summarizeTypeScriptErrorUserPrompt({ error, errorCode }),
      },
    ],
  });

  return result.object;
};
