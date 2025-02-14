import { generateText } from "ai";
import * as vscode from "vscode";
import { openai } from "../lib/ai";
import { getCredentials } from "../services/credentialsService";

export const registerCredentialCommands = (
  context: vscode.ExtensionContext
) => {
  const setBaseUrlCommand = vscode.commands.registerCommand(
    "pretty-typescript-errors-plus.setOpenAIBaseUrl",
    async () => {
      const url = await vscode.window.showInputBox({
        prompt: "Enter OpenAI compatible API base URL",
        placeHolder: "https://api.openai.com/v1",
        validateInput: (value) => {
          try {
            new URL(value);
            return null;
          } catch {
            return "Please enter a valid URL";
          }
        },
      });

      if (url) {
        await context.globalState.update("openai.baseUrl", url);
        vscode.window.showInformationMessage(
          "OpenAI base URL has been updated"
        );
      }
    }
  );

  const setApiKeyCommand = vscode.commands.registerCommand(
    "pretty-typescript-errors-plus.setOpenAIApiKey",
    async () => {
      const apiKey = await vscode.window.showInputBox({
        prompt: "Enter OpenAI compatible API Key",
        password: true,
        validateInput: async (value) => {
          if (value.length === 0) {
            return "API key cannot be empty";
          }

          const { baseUrl } = getCredentials(context);

          const result = await generateText({
            model: openai({
              baseUrl,
              apiKey: value,
            })("gpt-4o-mini"),
            prompt: "Respond with 'success' if the API key is valid",
          });

          return result.usage.completionTokens > 0 ? null : "Invalid API key";
        },
      });

      if (apiKey) {
        await context.globalState.update("openai.apiKey", apiKey);
        vscode.window.showInformationMessage("OpenAI API key has been updated");
      }
    }
  );

  const clearCredentialsCommand = vscode.commands.registerCommand(
    "pretty-typescript-errors-plus.clearOpenAICredentials",
    async () => {
      await context.globalState.update("openai.baseUrl", undefined);
      await context.globalState.update("openai.apiKey", undefined);
      vscode.window.showInformationMessage(
        "OpenAI credentials have been cleared"
      );
    }
  );

  const setModelCommand = vscode.commands.registerCommand(
    "pretty-typescript-errors-plus.setOpenAIModel",
    async () => {
      const model = await vscode.window.showInputBox({
        prompt: "Enter model name",
        placeHolder: "gpt-4o-mini",
        validateInput: async (value) => {
          const { baseUrl, apiKey } = getCredentials(context);

          if (!apiKey) {
            return "Please set OpenAI API key first";
          }

          const result = await generateText({
            model: openai({
              baseUrl,
              apiKey,
            })(value),
            prompt: "Respond with 'success' if the model is valid",
          });

          return result.usage.completionTokens > 0 ? null : "Invalid model";
        },
      });

      if (model) {
        await context.globalState.update("openai.model", model);
        vscode.window.showInformationMessage("OpenAI model has been updated");
      }
    }
  );

  return [
    setBaseUrlCommand,
    setApiKeyCommand,
    clearCredentialsCommand,
    setModelCommand,
  ];
};
