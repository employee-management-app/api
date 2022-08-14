export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      JWT_SECRET: string;
      GOOGLE_API_KEY: string;
      MONGODB_URL: string;
    }
  }
}
