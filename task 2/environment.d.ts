declare global {
  namespace NodeJS {
    interface ProcessEnv {
      // Common
      NATS_URI: string;
      // Api
      PORT: number;
      HOST: string;
      // Storage
      DB_HOST: string;
      DB_PORT: number;
      DB_PASSWORD: string;
    }
  }
}

export {}
