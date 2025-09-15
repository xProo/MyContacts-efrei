const express = require("express");
const cors = require("cors");
const connectDB = require("./config/database");
const config = require("./config/config");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

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

// Configuration Swagger
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "MyContacts API",
      version: "1.0.0",
      description: "API pour la gestion de contacts personnels",
      contact: {
        name: "Sohane Chamen",
        email: "sohane.chamen@efrei.net",
      },
    },
    servers: [
      {
        url: `http://localhost:${config.PORT}`,
        description: "Serveur de développement",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        User: {
          type: "object",
          properties: {
            _id: { type: "string" },
            name: { type: "string" },
            email: { type: "string", format: "email" },
            isActive: { type: "boolean" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        Contact: {
          type: "object",
          properties: {
            _id: { type: "string" },
            name: { type: "string" },
            email: { type: "string", format: "email" },
            phone: { type: "string" },
            user: { type: "string" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        Error: {
          type: "object",
          properties: {
            success: { type: "boolean", example: false },
            message: { type: "string" },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

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

// Route Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

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
