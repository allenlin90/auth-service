export default () => ({
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: '1h',
  },
  database: {
    connection: process.env.MONGODB_URI,
    name: 'auth_service',
  },
});
