export function validateContext<T>(
  context: T | undefined,
  hookName: string,
  providerName: string,
): T {
  if (!context) {
    throw new Error(`Use ${hookName} inside ${providerName}`);
  }
  return context;
}
