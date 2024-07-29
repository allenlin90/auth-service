export enum ConfigKeys {
  PORT = 'PORT',
  NODE_ENV = 'NODE_ENV',
  IS_PRODUCTION = 'IS_PRODUCTION',
  RESET_SERVICE_URL = 'RESET_SERVICE_URL',
  JWT_SECRET = 'jwt.secret',
  JWT_EXPIRES_IN = 'jwt.expiresIn',
  REFRESH_TOKEN_EXPIRES_IN = 'refreshToken.expiresIn',
  RESET_TOKEN_EXPIRES_IN = 'resetToken.expiresIn',
  DB_CONNECTION = 'database.connection',
  DB_NAME = 'database.name',
  REDIS_HOST = 'redis.host',
  REDIS_PORT = 'redis.port',
  EMAIL_SERVICE_OPTIONS = 'emailService.options',
  EMAIL_FROM = 'emailService.from',
}

export default () => {
  const emailServiceOptions = {
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT, 10),
    secure: process.env.NODE_ENV === 'production',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  };

  return {
    PORT: parseInt(process.env.PORT, 10) || 3000,
    NODE_ENV: process.env.NODE_ENV,
    RESET_SERVICE_URL: process.env.RESET_SERVICE_URL,
    IS_PRODUCTION: process.env.NODE_ENV === 'production',
    jwt: {
      secret: process.env.JWT_SECRET,
      expiresIn: '1h',
    },
    refreshToken: {
      expiresIn: 30, // days
    },
    resetToken: {
      expiresIn: 1, // hour
    },
    database: {
      connection: process.env.MONGODB_URI,
      name: 'auth_service',
    },
    redis: {
      host: process.env.REDIS_HOST,
      port: parseInt(process.env.REDIS_PORT, 10),
    },
    emailService: {
      from: process.env.EMAIL_FROM,
      options: emailServiceOptions,
    },
  };
};
