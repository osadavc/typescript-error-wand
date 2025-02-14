import * as vscode from "vscode";
import { fetchDataFromJsonPlaceholder } from "../services/apiService";
import { hasValidCredentials } from "../services/credentialsService";

export const createHoverProvider = (context: vscode.ExtensionContext) =>
  vscode.languages.registerHoverProvider(["typescript", "typescriptreact"], {
    provideHover: async (document, position, token) => {
      if (!hasValidCredentials(context)) {
        return null;
      }

      const diagnostics = vscode.languages.getDiagnostics(document.uri);

      const diagnostic = diagnostics.find((d) => {
        const isInRange = d.range.contains(position);
        return isInRange;
      });

      if (diagnostic) {
        const jsonData = await fetchDataFromJsonPlaceholder();

        if (jsonData) {
          const message = new vscode.MarkdownString();

          message.isTrusted = true;
          message.supportHtml = true;

          message.appendMarkdown("<br>");
          message.appendMarkdown("**JSON Placeholder Data:**\n```json\n");
          message.appendMarkdown(JSON.stringify(jsonData, null, 2));
          message.appendMarkdown("\n```\n\n");
          message.appendMarkdown(`**Original Error:** ${diagnostic.message}\n`);

          return new vscode.Hover(message, diagnostic.range);
        }
      }

      return null;
    },
  });
