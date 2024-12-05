export const devConsoleError = (message: string, error: unknown = ''): void => {
  if (process.env.NODE_ENV === 'development') {
    if (error instanceof Error) {
      console.error(`${message}: ${error.message}`, error.stack);
    } else {
      console.error(`${message}:`, error);
    }
  }
};
