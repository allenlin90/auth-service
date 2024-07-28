export default () => ({
  PORT: parseInt(process.env.PORT, 10) || 3000,
  NODE_ENV: process.env.NODE_ENV,
  IS_PRODUCTION: process.env.NODE_ENV === 'production',
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: '1h',
  },
  refreshToken: {
    expiresIn: 30, // days
  },
  database: {
    connection: process.env.MONGODB_URI,
    name: 'auth_service',
  },
});
