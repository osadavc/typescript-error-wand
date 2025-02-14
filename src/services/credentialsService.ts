import * as vscode from "vscode";

export const DEFAULT_BASE_URL = "https://api.openai.com/v1";

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
            "pretty-typescript-errors-plus.setOpenAIApiKey"
          );
        }
      });
  }
};

export const getCredentials = (context: vscode.ExtensionContext) => ({
  baseUrl: (context.globalState.get("openai.baseUrl") ||
    DEFAULT_BASE_URL) as string,
  apiKey: context.globalState.get("openai.apiKey") as string,
  model: (context.globalState.get("openai.model") || "gpt-4o-mini") as string,
});

export const hasValidCredentials = (
  context: vscode.ExtensionContext
): boolean => {
  const { apiKey } = getCredentials(context);
  return Boolean(apiKey);
};
