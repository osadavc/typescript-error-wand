import { generateText } from "ai";
import * as vscode from "vscode";
import { openai } from "../lib/ai";
import { getCredentials } from "../services/credentialsService";

export const registerCredentialCommands = (
  context: vscode.ExtensionContext
) => {
  const setApiKeyCommand = vscode.commands.registerCommand(
    "typescript-error-wand.setOpenAIApiKey",
    async () => {
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

            return result.usage.completionTokens > 0 ? null : "Invalid API key";
          } catch (error) {
            return "Invalid API key";
          }
        },
      });

      if (apiKey) {
        await context.globalState.update("openai.apiKey", apiKey);
        vscode.window.showInformationMessage("OpenAI API key has been updated");
      }
    }
  );

  const clearCredentialsCommand = vscode.commands.registerCommand(
    "typescript-error-wand.clearOpenAICredentials",
    async () => {
      const config = vscode.workspace.getConfiguration(
        "typescriptErrorWand.openai"
      );
      await config.update(
        "baseUrl",
        undefined,
        vscode.ConfigurationTarget.Global
      );
      await config.update(
        "apiKey",
        undefined,
        vscode.ConfigurationTarget.Global
      );
      await config.update(
        "model",
        undefined,
        vscode.ConfigurationTarget.Global
      );
      vscode.window.showInformationMessage(
        "OpenAI credentials have been cleared"
      );
    }
  );

  return [setApiKeyCommand, clearCredentialsCommand];
};
