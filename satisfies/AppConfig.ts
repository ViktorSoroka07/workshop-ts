// The shape of the application settings the lessons validate with `satisfies`.
export type AppConfig = {
  apiUrl: {
    host: string;
    port: number;
  };
  retryCount: number;
};
