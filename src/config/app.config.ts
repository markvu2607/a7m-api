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
  jwt: {
    access: {
      secret: string;
      expiresIn: string;
    };
    refresh: {
      secret: string;
      expiresIn: string;
    };
    verifyEmail: {
      secret: string;
      expiresIn: string;
    };
    resetPassword: {
      secret: string;
      expiresIn: string;
    };
  };
  salt: {
    rounds: number;
  };
  mailer: {
    host: string;
    port: number;
    secure: boolean;
    auth: {
      user: string;
      password: string;
    };
    defaultFrom: string;
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
  jwt: {
    access: {
      secret: process.env.JWT_ACCESS_SECRET!,
      expiresIn: process.env.JWT_ACCESS_EXPIRES_IN!,
    },
    refresh: {
      secret: process.env.JWT_REFRESH_SECRET!,
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN!,
    },
    verifyEmail: {
      secret: process.env.JWT_VERIFY_EMAIL_SECRET!,
      expiresIn: process.env.JWT_VERIFY_EMAIL_EXPIRES_IN!,
    },
    resetPassword: {
      secret: process.env.JWT_RESET_PASSWORD_SECRET!,
      expiresIn: process.env.JWT_RESET_PASSWORD_EXPIRES_IN!,
    },
  },
  salt: {
    rounds: parseInt(process.env.SALT_ROUNDS || '10', 10),
  },
  mailer: {
    host: process.env.MAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.MAIL_PORT || '587', 10),
    secure: process.env.MAIL_SECURE === 'true',
    auth: {
      user: process.env.MAIL_AUTH_USER || 'test',
      password: process.env.MAIL_AUTH_PASSWORD || 'test',
    },
    defaultFrom: process.env.MAIL_DEFAULT_FROM || 'noreply@a7m.dev',
  },
});
