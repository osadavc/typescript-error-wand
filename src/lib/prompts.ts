export const summarizeTypeScriptError = (error: string) => {
  return `
  You are a helpful assistant that summarizes TypeScript errors.
  Here is the error:
  ${error}
  `;
};
