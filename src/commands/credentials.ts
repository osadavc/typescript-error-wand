import { generateText } from "ai";
import * as vscode from "vscode";
import { openai } from "../lib/ai";
import { getCredentials } from "../services/credentialsService";

export const registerCredentialCommands = (
  context: vscode.ExtensionContext
) => {
  const setApiKeyCommand = vscode.commands.registerCommand(
    "typescript-error-wand.set-openai-api-key",
    async () => {
      try {
        const { apiKey: savedAPIKey } = getCredentials(context);

        const apiKey = await vscode.window.showInputBox({
          prompt: "Enter OpenAI compatible API Key",
          password: true,
          value: savedAPIKey || undefined,
          validateInput: async (value) => {
            if (value.length === 0) {
              return "API key cannot be empty";
            }

            const { baseUrl, model } = getCredentials(context);

            try {
              const result = await generateText({
                model: openai({
                  baseUrl,
                  apiKey: value,
                })(model),
                prompt: "Respond with 'success' if the API key is valid",
              });

              return result.usage.completionTokens > 0
                ? null
                : "Invalid API key";
            } catch (error) {
              return "Invalid API key";
            }
          },
        });

        if (apiKey) {
          await context.globalState.update(
            "typescript-error-wand.openai.apiKey",
            apiKey
          );
          vscode.window.showInformationMessage(
            "OpenAI API key has been updated"
          );
        }
      } catch (error) {
        vscode.window.showErrorMessage(
          "Failed to set OpenAI API key: " +
            (error instanceof Error ? error.message : "Unknown error")
        );
      }
    }
  );

  const clearCredentialsCommand = vscode.commands.registerCommand(
    "typescript-error-wand.clear-openai-credentials",
    async () => {
      try {
        const config = vscode.workspace.getConfiguration(
          "typescript-error-wand.openai"
        );

        await config.update(
          "baseUrl",
          undefined,
          vscode.ConfigurationTarget.Global
        );
        await config.update(
          "model",
          undefined,
          vscode.ConfigurationTarget.Global
        );
        await context.globalState.update(
          "typescript-error-wand.openai.apiKey",
          undefined
        );

        vscode.window.showInformationMessage(
          "OpenAI credentials have been cleared"
        );
      } catch (error) {
        vscode.window.showErrorMessage(
          "Failed to clear credentials: " +
            (error instanceof Error ? error.message : "Unknown error")
        );
      }
    }
  );

  return [setApiKeyCommand, clearCredentialsCommand];
};
