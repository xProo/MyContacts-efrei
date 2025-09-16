const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Le nom du contact est requis"],
      trim: true,
      minlength: [2, "Le nom doit contenir au moins 2 caractères"],
      maxlength: [50, "Le nom ne peut pas dépasser 50 caractères"],
    },
    email: {
      type: String,
      required: [true, "L'email du contact est requis"],
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Veuillez entrer un email valide",
      ],
    },
    phone: {
      type: String,
      required: [true, "Le numéro de téléphone est requis"],
      trim: true,
      match: [
        /^(\+33|0)[1-9](\d{8})$/,
        "Veuillez entrer un numéro de téléphone français valide",
      ],
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Un contact doit être associé à un utilisateur"],
    },
  },
  {
    timestamps: true, // Ajoute createdAt et updatedAt
  }
);

// Index pour améliorer les performances de recherche
contactSchema.index({ user: 1, name: 1 });
contactSchema.index({ user: 1, email: 1 });
contactSchema.index({ user: 1, phone: 1 });

contactSchema.index({ user: 1, email: 1 }, { unique: true });

contactSchema.methods.getPublicInfo = function () {
  const contactObject = this.toObject();
  return contactObject;
};

module.exports = mongoose.model("Contact", contactSchema);
