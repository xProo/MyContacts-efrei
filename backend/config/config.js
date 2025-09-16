module.exports = {
  // Configuration MongoDB
  MONGODB_URI:
    process.env.MONGODB_URI ||
    "mongodb+srv://sohanechamen_db_user:4zeIaWqQyFUAB3LA@mycontactcluster.mmmlkqq.mongodb.net/?retryWrites=true&w=majority&appName=myContactCluster",

  // Configuration JWT
  JWT_SECRET:
    process.env.JWT_SECRET ||
    "MyContacts_App_2024_SecureJWT_Key_9x7k2m8f4e1a6b3c5d7h",
  JWT_EXPIRE: process.env.JWT_EXPIRE || "7d",

  // Configuration du serveur
  PORT: process.env.PORT || 3001,
  NODE_ENV: process.env.NODE_ENV || "development",

  // Configuration CORS
  CORS_ORIGIN: process.env.CORS_ORIGIN || "*",
};
