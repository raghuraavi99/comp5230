module.exports = {
  getEncryptionKey: () => process.env.CONTENT_ENCRYPTION_KEY,
  getIvAndContentDelimiter: () => process.env.IV_CONTENT_DELIMITER,
  getMongoDbUri: () => process.env.MONGODB_URI,
  getJwtSecret: () => process.env.JWT_SECRET,
  getPort: () => process.env.PORT || 3000,
};
