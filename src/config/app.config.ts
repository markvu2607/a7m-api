import * as process from 'node:process';

type AppConfig = {
  app: {
    environment: 'dev' | 'prod' | 'test';
    port: number;
    timeout: number;
  };
  web: {
    url: string;
  };
  database: {
    url: string;
  };
};

export default (): AppConfig => ({
  app: {
    environment: (process.env.ENVIRONMENT || 'dev') as 'dev' | 'prod' | 'test',
    port: parseInt(process.env.PORT || '9999', 10),
    timeout: parseInt(process.env.TIMEOUT || '5000', 10),
  },
  web: {
    url: process.env.WEB_URL || 'http://localhost:5173',
  },
  database: {
    url: process.env.DATABASE_URL || 'postgresql://localhost:5432/a7m',
  },
});
