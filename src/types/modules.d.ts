import { Secret } from 'jsonwebtoken';

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      JWT_SECRET: Secret;
      GOOGLE_API_KEY: string;
      MONGODB_URL: string;
    }
  }
}

export {};
