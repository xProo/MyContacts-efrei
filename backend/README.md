# MyContacts Backend

## 🚀 Démarrage rapide

### 1. Installation des dépendances

```bash
npm install
```

### 2. Configuration de l'environnement

Le fichier `.env` est déjà configuré avec votre URI MongoDB Atlas :

```
MONGODB_URI=mongodb+srv://sohanechamen_db_user:4zeIaWqQyFUAB3LA@mycontactcluster.mmmlkqq.mongodb.net/?retryWrites=true&w=majority&appName=myContactCluster
JWT_SECRET=votre_secret_jwt_super_securise_2024
PORT=5000
NODE_ENV=development
```

### 3. Lancement du serveur

```bash
# Mode développement (avec nodemon)
npm run dev

# Mode production
npm start
```

### 4. Test de la connexion

- **API principale** : http://localhost:5000
- **Test base de données** : http://localhost:5000/api/test-db

## 📁 Structure du projet

```
backend/
├── config/
│   ├── config.js      # Configuration des variables d'environnement
│   └── database.js    # Configuration de la connexion MongoDB
├── models/            # Modèles Mongoose (à créer)
├── routes/            # Routes API (à créer)
├── middleware/        # Middleware d'authentification (à créer)
├── server.js          # Point d'entrée du serveur
└── package.json       # Dépendances et scripts
```

## 🔧 Fonctionnalités implémentées

- ✅ Connexion à MongoDB Atlas
- ✅ Serveur Express de base
- ✅ Configuration CORS
- ✅ Gestion des erreurs de connexion
- ✅ Routes de test

## 🔗 Prochaines étapes

1. Créer les modèles Mongoose (User, Contact)
2. Implémenter l'authentification JWT
3. Créer les routes CRUD pour les contacts
4. Ajouter la validation des données
5. Implémenter les middlewares de sécurité

