import * as vscode from "vscode";
import {
  summarizeTypeScriptError,
  summarizeTypeScriptErrorUserPrompt,
} from "../lib/prompts";
import { hasValidCredentials } from "../services/credentialsService";
import { getErrorSummary } from "../services/apiService";

const createErrorHoverMessage = (errorSummary: {
  errorExplanation: string;
  fixExplanation: string[];
}) => {
  const message = new vscode.MarkdownString();
  message.isTrusted = true;
  message.supportHtml = true;

  message.appendMarkdown(`### TypeScript Error Explanation\n\n`);
  message.appendMarkdown(`- ${errorSummary.errorExplanation}\n\n`);
  message.appendMarkdown(`### How to Fix\n\n`);
  message.appendMarkdown(
    errorSummary.fixExplanation.map((fix: string) => `- ${fix}`).join("\n")
  );

  return message;
};

export const createHoverProvider = (context: vscode.ExtensionContext) =>
  vscode.languages.registerHoverProvider(["typescript", "typescriptreact"], {
    provideHover: async (document, position) => {
      if (!(await hasValidCredentials(context))) {
        return null;
      }

      const diagnostics = vscode.languages.getDiagnostics(document.uri);

      const diagnostic = diagnostics.find((d) => {
        const isInRange = d.range.contains(position);
        return isInRange;
      });

      if (diagnostic) {
        try {
          // Try VS Code Language Model first
          const [model] = await vscode.lm.selectChatModels({
            vendor: "copilot",
            family: "gpt-4o-mini",
          });

          let errorSummary;

          if (model) {
            const messages = [
              vscode.LanguageModelChatMessage.User(summarizeTypeScriptError()),
              vscode.LanguageModelChatMessage.User(
                summarizeTypeScriptErrorUserPrompt({
                  error: diagnostic.message,
                  errorCode: diagnostic.code?.toString() || "",
                })
              ),
            ];

            const chatResponse = await model.sendRequest(
              messages,
              {},
              new vscode.CancellationTokenSource().token
            );

            let accumulatedResponse = "";
            for await (const fragment of chatResponse.text) {
              accumulatedResponse += fragment;
            }

            try {
              errorSummary = JSON.parse(accumulatedResponse);
            } catch (e) {
              const message = new vscode.MarkdownString();
              message.appendText(
                "Failed to parse AI response. Raw response:\n\n"
              );
              message.appendText(accumulatedResponse);
              return new vscode.Hover(message, diagnostic.range);
            }
          } else {
            // Fallback to custom AI implementation
            errorSummary = await getErrorSummary({
              error: diagnostic.message,
              errorCode: diagnostic.code?.toString() || "",
              context,
            });
          }

          if (errorSummary) {
            return new vscode.Hover(
              createErrorHoverMessage(errorSummary),
              diagnostic.range
            );
          }
        } catch (err) {
          console.log(err);

          if (err instanceof vscode.LanguageModelError) {
            try {
              const errorSummary = await getErrorSummary({
                error: diagnostic.message,
                errorCode: diagnostic.code?.toString() || "",
                context,
              });

              if (errorSummary) {
                return new vscode.Hover(
                  createErrorHoverMessage(errorSummary),
                  diagnostic.range
                );
              }
            } catch (customAiError) {
              console.error("Custom AI error:", customAiError);
              return null;
            }
          }
          throw err;
        }
      }

      return null;
    },
  });
