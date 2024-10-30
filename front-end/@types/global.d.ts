declare global {
  namespace NodeJs {
    interface ProcessEnv {
      API_BASE_URL: string;
      REGISTER_USER: string;
    }
  }
}

export {};
