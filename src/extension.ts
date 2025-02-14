import * as vscode from "vscode";
import { registerCredentialCommands } from "./commands/credentials";
import { createHoverProvider } from "./providers/hoverProvider";
import { checkAndPromptForCredentials } from "./services/credentialsService";

export const activate = (context: vscode.ExtensionContext) => {
  // Check credentials on activation
  checkAndPromptForCredentials(context);

  // Register commands
  const credentialCommands = registerCredentialCommands(context);

  // Register providers
  const hoverProvider = createHoverProvider(context);

  // Add to subscriptions
  context.subscriptions.push(...credentialCommands);
  context.subscriptions.push(hoverProvider);
};

export const deactivate = () => {};
