const express = require("express");
const cors = require("cors");
const connectDB = require("./config/database");
const config = require("./config/config");

// Charger les variables d'environnement
require("dotenv").config();

const app = express();

// Middleware
app.use(
  cors({
    origin: config.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connexion à la base de données
connectDB();

// Import des routes
const authRoutes = require("./routes/auth");
const contactRoutes = require("./routes/contacts");

// Routes principales
app.get("/", (req, res) => {
  res.json({
    message: "🚀 API MyContacts démarrée avec succès !",
    status: "OK",
    database: "MongoDB Atlas connecté",
    version: "1.0.0",
    endpoints: {
      auth: "/api/auth",
      contacts: "/api/contacts",
      test: "/api/test-db",
    },
  });
});

// Route de test de la base de données
app.get("/api/test-db", async (req, res) => {
  try {
    const mongoose = require("mongoose");
    const dbStatus = mongoose.connection.readyState;
    const dbName = mongoose.connection.name;

    res.json({
      message: "Test de connexion à la base de données",
      status: dbStatus === 1 ? "Connecté" : "Déconnecté",
      database: dbName,
      readyState: dbStatus,
    });
  } catch (error) {
    res.status(500).json({
      error: "Erreur lors du test de la base de données",
      message: error.message,
    });
  }
});

// Utilisation des routes
app.use("/api/auth", authRoutes);
app.use("/api/contacts", contactRoutes);

// Middleware de gestion des erreurs 404
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Route non trouvée",
    path: req.originalUrl,
  });
});

// Middleware de gestion des erreurs globales
app.use((error, req, res, next) => {
  console.error("Erreur globale:", error);
  res.status(500).json({
    success: false,
    message: "Erreur serveur interne",
    ...(config.NODE_ENV === "development" && { error: error.message }),
  });
});

const PORT = config.PORT;

app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
  console.log(`📱 URL: http://localhost:${PORT}`);
  console.log(`🔗 Test DB: http://localhost:${PORT}/api/test-db`);
});
