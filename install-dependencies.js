const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

console.log("🚀 Installation des dépendances pour MyContacts...\n");

// Vérifier si Node.js est installé
try {
  const nodeVersion = execSync("node --version", { encoding: "utf8" });
  console.log(`✅ Node.js détecté: ${nodeVersion.trim()}`);
} catch (error) {
  console.error(
    "❌ Node.js n'est pas installé. Veuillez installer Node.js 16+"
  );
  process.exit(1);
}

// Installer les dépendances du backend
console.log("\n📦 Installation des dépendances backend...");
try {
  execSync("cd backend && npm install", { stdio: "inherit" });
  console.log("✅ Dépendances backend installées");
} catch (error) {
  console.error("❌ Erreur lors de l'installation des dépendances backend");
  process.exit(1);
}

// Créer le fichier .env s'il n'existe pas
const envPath = path.join(__dirname, "backend", ".env");
if (!fs.existsSync(envPath)) {
  console.log("\n📝 Création du fichier .env...");
  const envContent = `# Configuration MongoDB Atlas
MONGODB_URI=mongodb+srv://sohanechamen_db_user:4zeIaWqQyFUAB3LA@mycontactcluster.mmmlkqq.mongodb.net/?retryWrites=true&w=majority&appName=myContactCluster

# Configuration JWT
JWT_SECRET=votre_secret_jwt_super_securise_2024

# Configuration du serveur
PORT=5000
NODE_ENV=development
`;

  fs.writeFileSync(envPath, envContent);
  console.log("✅ Fichier .env créé");
} else {
  console.log("✅ Fichier .env existe déjà");
}

console.log("\n🎉 Installation terminée !");
console.log("\n📋 Prochaines étapes :");
console.log("1. cd backend");
console.log("2. npm run dev");
console.log("3. Ouvrir http://localhost:5000");
console.log("4. Tester la connexion DB : http://localhost:5000/api/test-db");
