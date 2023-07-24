declare global {
  namespace NodeJS {
    interface ProcessEnv {
      CLIENT_ID: string;
      CLIENT_SECRET: string;
      REDIS_USERNAME: string;
      REDIS_PASSWORD: string;
    }
  }
}

export {};
