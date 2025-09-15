# 📚 Documentation API MyContacts

## 🚀 Base URL

```
http://localhost:3001
```

## 🔐 Authentification

Toutes les routes protégées nécessitent un token JWT dans l'en-tête Authorization :

```
Authorization: Bearer <votre_token_jwt>
```

---

## 👤 Routes d'Authentification

### POST /api/auth/register

**Inscription d'un nouvel utilisateur**

**Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "motdepasse123"
}
```

**Réponse:**

```json
{
  "success": true,
  "message": "Utilisateur créé avec succès",
  "data": {
    "user": {
      "_id": "...",
      "name": "John Doe",
      "email": "john@example.com",
      "isActive": true,
      "createdAt": "...",
      "updatedAt": "..."
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### POST /api/auth/login

**Connexion d'un utilisateur**

**Body:**

```json
{
  "email": "john@example.com",
  "password": "motdepasse123"
}
```

**Réponse:**

```json
{
  "success": true,
  "message": "Connexion réussie",
  "data": {
    "user": { ... },
    "token": "..."
  }
}
```

### GET /api/auth/me

**Récupérer les informations de l'utilisateur connecté**

- **Authentification requise**

**Réponse:**

```json
{
  "success": true,
  "data": {
    "user": { ... }
  }
}
```

### PUT /api/auth/profile

**Mettre à jour le profil utilisateur**

- **Authentification requise**

**Body:**

```json
{
  "name": "John Smith"
}
```

---

## 📞 Routes des Contacts

### GET /api/contacts

**Récupérer tous les contacts de l'utilisateur**

- **Authentification requise**

**Query Parameters:**

- `page` (optionnel): Numéro de page (défaut: 1)
- `limit` (optionnel): Nombre de contacts par page (défaut: 10)
- `search` (optionnel): Recherche dans nom, email, téléphone, entreprise
- `sortBy` (optionnel): Champ de tri (défaut: "name")
- `sortOrder` (optionnel): Ordre de tri "asc" ou "desc" (défaut: "asc")

**Exemple:**

```
GET /api/contacts?page=1&limit=5&search=john&sortBy=name&sortOrder=asc
```

**Réponse:**

```json
{
  "success": true,
  "data": {
    "contacts": [
      {
        "_id": "...",
        "name": "John Doe",
        "email": "john@example.com",
        "phone": "0123456789",
        "address": {
          "street": "123 Rue de la Paix",
          "city": "Paris",
          "postalCode": "75001",
          "country": "France"
        },
        "company": "Acme Corp",
        "jobTitle": "Développeur",
        "notes": "Contact important",
        "tags": ["travail", "important"],
        "isFavorite": true,
        "user": "...",
        "createdAt": "...",
        "updatedAt": "..."
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 3,
      "totalContacts": 25,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

### GET /api/contacts/:id

**Récupérer un contact spécifique**

- **Authentification requise**

**Réponse:**

```json
{
  "success": true,
  "data": {
    "contact": { ... }
  }
}
```

### POST /api/contacts

**Créer un nouveau contact**

- **Authentification requise**

**Body:**

```json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "phone": "0987654321",
  "address": {
    "street": "456 Avenue des Champs",
    "city": "Lyon",
    "postalCode": "69000",
    "country": "France"
  },
  "company": "Tech Corp",
  "jobTitle": "Designer",
  "notes": "Contact créatif",
  "tags": ["design", "créatif"],
  "isFavorite": false
}
```

### PUT /api/contacts/:id

**Mettre à jour un contact**

- **Authentification requise**

**Body:** (mêmes champs que POST, tous optionnels)

### DELETE /api/contacts/:id

**Supprimer un contact**

- **Authentification requise**

**Réponse:**

```json
{
  "success": true,
  "message": "Contact supprimé avec succès"
}
```

### PUT /api/contacts/:id/favorite

**Basculer le statut favori d'un contact**

- **Authentification requise**

**Réponse:**

```json
{
  "success": true,
  "message": "Contact ajouté aux favoris",
  "data": {
    "contact": { ... }
  }
}
```

---

## 🧪 Routes de Test

### GET /

**Informations générales de l'API**

### GET /api/test-db

**Test de connexion à la base de données**

---

## 📝 Codes d'Erreur

- **200**: Succès
- **201**: Créé avec succès
- **400**: Données invalides
- **401**: Non authentifié
- **404**: Ressource non trouvée
- **500**: Erreur serveur

## 🔒 Sécurité

- Mots de passe hachés avec bcrypt
- Tokens JWT avec expiration
- Validation des données d'entrée
- Protection CORS configurée
- Chaque utilisateur ne peut accéder qu'à ses propres contacts
