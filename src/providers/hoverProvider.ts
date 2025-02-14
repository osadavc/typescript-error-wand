import * as vscode from "vscode";
import { getErrorSummary } from "../services/apiService";
import { hasValidCredentials } from "../services/credentialsService";

export const createHoverProvider = (context: vscode.ExtensionContext) =>
  vscode.languages.registerHoverProvider(["typescript", "typescriptreact"], {
    provideHover: async (document, position) => {
      if (!hasValidCredentials(context)) {
        return null;
      }

      const diagnostics = vscode.languages.getDiagnostics(document.uri);

      const diagnostic = diagnostics.find((d) => {
        const isInRange = d.range.contains(position);
        return isInRange;
      });

      if (diagnostic) {
        const errorSummary = await getErrorSummary({
          error: diagnostic.message,
          errorCode: diagnostic.code?.toString() || "",
          context,
        });

        if (errorSummary) {
          const message = new vscode.MarkdownString();

          message.isTrusted = true;
          message.supportHtml = true;

          message.appendMarkdown(`### TypeScript Error Explanation\n\n`);
          message.appendMarkdown(`${errorSummary.errorExplanation}\n\n`);
          message.appendMarkdown(`### How to Fix\n\n`);
          message.appendMarkdown(
            errorSummary.fixExplanation.map((fix) => `- ${fix}`).join("\n")
          );

          return new vscode.Hover(message, diagnostic.range);
        }
      }

      return null;
    },
  });
