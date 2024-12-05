export const devConsoleError = (message: string, error: unknown = ''): void => {
  if (process.env.NODE_ENV === 'development') {
    console.error(message, error);
  }
};
