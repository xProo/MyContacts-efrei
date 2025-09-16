const jwt = require("jsonwebtoken");
const User = require("../models/User");
const config = require("../config/config");

// Vérifier l'authentification
const authenticateToken = async (req, res, next) => {
  try {
    // Récupérer le token
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token requis",
      });
    }

    // Vérifier le token
    const decoded = jwt.verify(token, config.JWT_SECRET);

    // Trouver l'utilisateur
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Utilisateur non trouvé",
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: "Compte désactivé",
      });
    }

    // Ajouter l'utilisateur à la requête
    req.user = user;
    next();
  } catch (error) {
    console.log("Erreur auth:", error);

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Token invalide",
      });
    }

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token expiré",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Erreur d'authentification",
    });
  }
};

// Auth optionnelle (ne bloque pas si pas de token)
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (token) {
      const decoded = jwt.verify(token, config.JWT_SECRET);
      const user = await User.findById(decoded.userId).select("-password");

      if (user && user.isActive) {
        req.user = user;
      }
    }

    next();
  } catch (error) {
    // Continuer sans utilisateur
    next();
  }
};

module.exports = {
  authenticateToken,
  optionalAuth,
};
