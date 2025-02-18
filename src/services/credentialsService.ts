import * as vscode from "vscode";

export const DEFAULT_BASE_URL = "https://api.openai.com/v1";
export const DEFAULT_MODEL = "gpt-4o-mini";

export const checkAndPromptForCredentials = (
  context: vscode.ExtensionContext
) => {
  const { apiKey } = getCredentials(context);

  if (!apiKey) {
    vscode.window
      .showInformationMessage(
        "Please set OpenAI compatible API Key to use all features",
        "Set API Key"
      )
      .then((selection) => {
        if (selection === "Set API Key") {
          vscode.commands.executeCommand(
            "typescript-error-wand.set-openai-api-key"
          );
        }
      });
  }
};

export const getCredentials = (context: vscode.ExtensionContext) => {
  const config = vscode.workspace.getConfiguration(
    "typescript-error-wand.openai"
  );

  return {
    baseUrl: config.get<string>("baseUrl") || DEFAULT_BASE_URL,
    apiKey: context.globalState.get<string>(
      "typescript-error-wand.openai.apiKey"
    ),
    model: config.get<string>("model") || DEFAULT_MODEL,
  };
};

export const hasValidCredentials = (
  context: vscode.ExtensionContext
): boolean => {
  const { apiKey } = getCredentials(context);
  return Boolean(apiKey);
};
