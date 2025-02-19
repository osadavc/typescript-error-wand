# TypeScript Error Wand 🪄

A VS Code extension that enhances TypeScript error messages with AI-powered explanations and solutions. Get clear, human-friendly explanations for complex TypeScript errors right in your editor.

![TypeScript Error Wand](./assets/explanation.png)

## Features

- 🤖 **AI-Powered Error Explanations**: Hover over TypeScript errors to get clear, detailed explanations of what went wrong
- 🛠️ **Fix Suggestions**: Each error comes with practical suggestions on how to fix the issue
- 🎯 **TypeScript & TSX Support**: Works with both TypeScript (.ts) and TypeScript React (.tsx) files
- 🔄 **Smart AI Provider Selection**:
  - Uses GitHub Copilot if installed (free or paid subscription)
  - Falls back to custom AI models if Copilot isn't available
- 🔒 **Secure**: Uses your existing GitHub Copilot authentication or custom API key for fallback

## Requirements

- VS Code version 1.60.0 or higher
- GitHub Copilot extension (recommended) OR
- An API key from OpenAI or any OpenAI-compatible provider for fallback

## Setup

1. Install the extension from the VS Code marketplace
2. Primary Setup (Recommended):
   - Install GitHub Copilot extension
   - Sign in to GitHub Copilot
   - The extension will automatically use Copilot for error explanations
3. Fallback Setup (Optional):
   - Open the command palette (Cmd/Ctrl + Shift + P)
   - Search for "TypeScript Error Wand: Set OpenAI Compatible API Key"
   - Enter your API key when prompted
   - (Optional) Set a custom base URL if using an alternative provider

## Extension Settings

This extension contributes the following settings:

- `typescriptErrorWand.preferCopilot`: Toggle whether to prefer GitHub Copilot over custom AI providers (default: true)
- `typescriptErrorWand.openai.model`: The fallback AI model to use when Copilot is unavailable
- `typescriptErrorWand.openai.baseUrl`: Custom API base URL for fallback provider

## How It Works

1. When you hover over a TypeScript error in your code, the extension captures the error message and code
2. If GitHub Copilot is available, it uses Copilot's API to generate explanations
3. If Copilot isn't available, it falls back to the configured custom AI provider
4. The response is displayed in a hover card with:
   - A clear explanation of what caused the error
   - Step-by-step suggestions on how to fix it

## Privacy & Security

- Your code is never stored or logged
- Uses GitHub Copilot's secure authentication when available
- Fallback API calls use your personal API key
- All processing happens on your machine and the respective AI provider's servers

## Known Issues

Please report any issues on our GitHub repository.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This extension is licensed under the MIT License.

---

**Enjoy coding with clearer TypeScript errors!** 🚀
