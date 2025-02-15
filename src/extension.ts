import * as vscode from "vscode";
import { registerCredentialCommands } from "./commands/credentials";
import { createHoverProvider } from "./providers/hoverProvider";
import { checkAndPromptForCredentials } from "./services/credentialsService";

export const activate = (context: vscode.ExtensionContext) => {
  checkAndPromptForCredentials(context);

  const credentialCommands = registerCredentialCommands(context);

  const hoverProvider = createHoverProvider(context);

  context.subscriptions.push(...credentialCommands);
  context.subscriptions.push(hoverProvider);
};

export const deactivate = () => {};
