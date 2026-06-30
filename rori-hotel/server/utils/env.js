const getRequiredEnv = (key) => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`${key} environment variable is required`);
  }
  return value;
};

const validateEnv = () => {
  getRequiredEnv('JWT_SECRET');

  if (process.env.NODE_ENV === 'production') {
    ['MONGODB_URI', 'CLIENT_URL_PROD'].forEach(getRequiredEnv);
  }
};

const shouldSeedDefaultUsers = () => process.env.SEED_DEFAULT_USERS === 'true';

module.exports = {
  getRequiredEnv,
  validateEnv,
  shouldSeedDefaultUsers
};
