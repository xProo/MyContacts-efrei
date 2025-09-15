const express = require("express");
const Contact = require("../models/Contact");
const { authenticateToken } = require("../middleware/auth");

const router = express.Router();

// @route   GET /api/contacts
// @desc    Récupérer tous les contacts de l'utilisateur
// @access  Private
router.get("/", authenticateToken, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      sortBy = "name",
      sortOrder = "asc",
    } = req.query;

    // Construire la requête de recherche
    const searchQuery = {
      user: req.user._id,
    };

    if (search) {
      searchQuery.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
        { company: { $regex: search, $options: "i" } },
      ];
    }

    // Options de tri
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === "desc" ? -1 : 1;

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const contacts = await Contact.find(searchQuery)
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Contact.countDocuments(searchQuery);

    res.json({
      success: true,
      data: {
        contacts,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / parseInt(limit)),
          totalContacts: total,
          hasNext: skip + contacts.length < total,
          hasPrev: parseInt(page) > 1,
        },
      },
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des contacts:", error);
    res.status(500).json({
      success: false,
      message: "Erreur serveur lors de la récupération des contacts",
    });
  }
});

// @route   GET /api/contacts/:id
// @desc    Récupérer un contact spécifique
// @access  Private
router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const contact = await Contact.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact non trouvé",
      });
    }

    res.json({
      success: true,
      data: {
        contact,
      },
    });
  } catch (error) {
    console.error("Erreur lors de la récupération du contact:", error);
    res.status(500).json({
      success: false,
      message: "Erreur serveur",
    });
  }
});

// @route   POST /api/contacts
// @desc    Créer un nouveau contact
// @access  Private
router.post("/", authenticateToken, async (req, res) => {
  try {
    const contactData = {
      ...req.body,
      user: req.user._id,
    };

    const contact = new Contact(contactData);
    await contact.save();

    res.status(201).json({
      success: true,
      message: "Contact créé avec succès",
      data: {
        contact,
      },
    });
  } catch (error) {
    console.error("Erreur lors de la création du contact:", error);

    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: "Données invalides",
        errors,
      });
    }

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Un contact avec cet email existe déjà",
      });
    }

    res.status(500).json({
      success: false,
      message: "Erreur serveur lors de la création du contact",
    });
  }
});

// @route   PUT /api/contacts/:id
// @desc    Mettre à jour un contact
// @access  Private
router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const contact = await Contact.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact non trouvé",
      });
    }

    res.json({
      success: true,
      message: "Contact mis à jour avec succès",
      data: {
        contact,
      },
    });
  } catch (error) {
    console.error("Erreur lors de la mise à jour du contact:", error);

    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: "Données invalides",
        errors,
      });
    }

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Un contact avec cet email existe déjà",
      });
    }

    res.status(500).json({
      success: false,
      message: "Erreur serveur lors de la mise à jour",
    });
  }
});

// @route   DELETE /api/contacts/:id
// @desc    Supprimer un contact
// @access  Private
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const contact = await Contact.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact non trouvé",
      });
    }

    res.json({
      success: true,
      message: "Contact supprimé avec succès",
    });
  } catch (error) {
    console.error("Erreur lors de la suppression du contact:", error);
    res.status(500).json({
      success: false,
      message: "Erreur serveur lors de la suppression",
    });
  }
});

// @route   PUT /api/contacts/:id/favorite
// @desc    Basculer le statut favori d'un contact
// @access  Private
router.put("/:id/favorite", authenticateToken, async (req, res) => {
  try {
    const contact = await Contact.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact non trouvé",
      });
    }

    contact.isFavorite = !contact.isFavorite;
    await contact.save();

    res.json({
      success: true,
      message: `Contact ${
        contact.isFavorite ? "ajouté aux" : "retiré des"
      } favoris`,
      data: {
        contact,
      },
    });
  } catch (error) {
    console.error("Erreur lors de la mise à jour du favori:", error);
    res.status(500).json({
      success: false,
      message: "Erreur serveur",
    });
  }
});

// @route   DELETE /api/contacts/bulk
// @desc    Supprimer plusieurs contacts en lot
// @access  Private
router.delete("/bulk", authenticateToken, async (req, res) => {
  try {
    const { contactIds } = req.body;

    if (!contactIds || !Array.isArray(contactIds) || contactIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Liste des IDs de contacts requise",
      });
    }

    // Vérifier que tous les contacts appartiennent à l'utilisateur
    const contacts = await Contact.find({
      _id: { $in: contactIds },
      user: req.user._id,
    });

    if (contacts.length !== contactIds.length) {
      return res.status(400).json({
        success: false,
        message:
          "Certains contacts n'existent pas ou ne vous appartiennent pas",
      });
    }

    // Supprimer les contacts
    const result = await Contact.deleteMany({
      _id: { $in: contactIds },
      user: req.user._id,
    });

    res.json({
      success: true,
      message: `${result.deletedCount} contact(s) supprimé(s) avec succès`,
      data: {
        deletedCount: result.deletedCount,
      },
    });
  } catch (error) {
    console.error("Erreur lors de la suppression en lot:", error);
    res.status(500).json({
      success: false,
      message: "Erreur serveur lors de la suppression en lot",
    });
  }
});

// @route   GET /api/contacts/search/advanced
// @desc    Recherche avancée des contacts
// @access  Private
router.get("/search/advanced", authenticateToken, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      isFavorite,
      company,
      sortBy = "name",
      sortOrder = "asc",
    } = req.query;

    // Construire la requête de recherche
    const searchQuery = {
      user: req.user._id,
    };

    if (search) {
      searchQuery.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
        { company: { $regex: search, $options: "i" } },
      ];
    }

    if (isFavorite !== undefined) {
      searchQuery.isFavorite = isFavorite === "true";
    }

    if (company) {
      searchQuery.company = { $regex: company, $options: "i" };
    }

    // Options de tri
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === "desc" ? -1 : 1;

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const contacts = await Contact.find(searchQuery)
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Contact.countDocuments(searchQuery);

    res.json({
      success: true,
      data: {
        contacts,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / parseInt(limit)),
          totalContacts: total,
          hasNext: skip + contacts.length < total,
          hasPrev: parseInt(page) > 1,
        },
        filters: {
          search,
          isFavorite,
          company,
          sortBy,
          sortOrder,
        },
      },
    });
  } catch (error) {
    console.error("Erreur lors de la recherche avancée:", error);
    res.status(500).json({
      success: false,
      message: "Erreur serveur lors de la recherche avancée",
    });
  }
});

module.exports = router;
