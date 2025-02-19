import * as vscode from "vscode";

export const DEFAULT_BASE_URL = "https://api.openai.com/v1";
export const DEFAULT_MODEL = "gpt-4o-mini";

export const checkAndPromptForCredentials = async (
  context: vscode.ExtensionContext
) => {
  const validCredentials = await hasValidCredentials(context);

  if (!validCredentials) {
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

export const hasValidCredentials = async (
  context: vscode.ExtensionContext
): Promise<boolean> => {
  const { apiKey } = getCredentials(context);

  const [model] = await vscode.lm.selectChatModels({
    vendor: "copilot",
    family: "gpt-4o",
  });

  // it is an OR because either the apiKey or the copilot model is needed
  return Boolean(apiKey || model);
};
