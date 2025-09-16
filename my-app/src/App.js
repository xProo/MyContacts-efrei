import React, { useState, useEffect } from "react";
import { apiService } from "./api";
import "./App.css";

// pour la connexio, ca le composant quoi
function Login({ onLogin }) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [message, setMessage] = useState({ text: "", type: "" });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await apiService.login(formData.email, formData.password);

    if (result.success) {
      localStorage.setItem("authToken", result.data.token);
      localStorage.setItem("currentUser", JSON.stringify(result.data.user));
      setMessage({ text: result.message, type: "success" });
      onLogin(result.data.user, result.data.token);
    } else {
      setMessage({ text: result.message, type: "error" });
    }
  };

  return (
    <div className="auth-container">
      <h2>Connexion</h2>

      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label htmlFor="email">Email :</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Mot de passe :</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
        </div>

        <button type="submit" className="btn-primary">
          Se connecter
        </button>
      </form>

      <p className="auth-switch">
        Pas encore de compte ?{" "}
        <button
          onClick={() => (window.location.hash = "#register")}
          className="link-btn"
        >
          S'inscrire
        </button>
      </p>

      {message.text && (
        <div className={`message ${message.type}`}>{message.text}</div>
      )}
    </div>
  );
}

// Composant d'inscription
function Register({ onLogin }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState({ text: "", type: "" });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await apiService.register(
      formData.name,
      formData.email,
      formData.password
    );

    if (result.success) {
      localStorage.setItem("authToken", result.data.token);
      localStorage.setItem("currentUser", JSON.stringify(result.data.user));
      setMessage({ text: result.message, type: "success" });
      onLogin(result.data.user, result.data.token);
    } else {
      setMessage({ text: result.message, type: "error" });
    }
  };

  return (
    <div className="auth-container">
      <h2>Inscription</h2>

      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label htmlFor="name">Nom :</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email :</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Mot de passe :</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
        </div>

        <button type="submit" className="btn-primary">
          S'inscrire
        </button>
      </form>

      <p className="auth-switch">
        Déjà un compte ?{" "}
        <button
          onClick={() => (window.location.hash = "#login")}
          className="link-btn"
        >
          Se connecter
        </button>
      </p>

      {message.text && (
        <div className={`message ${message.type}`}>{message.text}</div>
      )}
    </div>
  );
}

// Composant principal des contacts
function Contacts({ currentUser, onLogout }) {
  const [contacts, setContacts] = useState([]);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentEditId, setCurrentEditId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  // Charger les contacts au montage
  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    const result = await apiService.getContacts();
    if (result.success) {
      setContacts(result.data.contacts);
    } else {
      showMessage("Erreur lors du chargement des contacts", "error");
    }
  };

  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 3000);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let result;
    if (isEditMode) {
      result = await apiService.updateContact(currentEditId, formData);
    } else {
      result = await apiService.createContact(formData);
    }

    if (result.success) {
      showMessage(
        isEditMode
          ? "Contact mis à jour avec succès !"
          : "Contact ajouté avec succès !",
        "success"
      );
      setFormData({ name: "", email: "", phone: "" });
      setIsEditMode(false);
      setCurrentEditId(null);
      loadContacts();
    } else {
      showMessage(result.message, "error");
    }
  };

  const editContact = (contact) => {
    setFormData({
      name: contact.name,
      email: contact.email,
      phone: contact.phone,
    });
    setIsEditMode(true);
    setCurrentEditId(contact._id);
  };

  const cancelEdit = () => {
    setIsEditMode(false);
    setCurrentEditId(null);
    setFormData({ name: "", email: "", phone: "" });
  };

  const deleteContact = async (contactId) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce contact ?")) {
      return;
    }

    const result = await apiService.deleteContact(contactId);

    if (result.success) {
      showMessage("Contact supprimé avec succès !", "success");
      loadContacts();
    } else {
      showMessage(result.message, "error");
    }
  };

  return (
    <div className="contacts-container">
      <div className="header">
        <h2>Mes Contacts</h2>
        <button onClick={onLogout} className="btn-logout">
          Déconnexion
        </button>
      </div>

      {/* Formulaire de contact */}
      <div className="contact-form">
        <h3>{isEditMode ? "Modifier le contact" : "Ajouter un contact"}</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="contactName">Nom :</label>
            <input
              type="text"
              id="contactName"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="contactEmail">Email :</label>
            <input
              type="email"
              id="contactEmail"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="contactPhone">Téléphone :</label>
            <input
              type="tel"
              id="contactPhone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-primary">
              {isEditMode ? "Mettre à jour" : "Ajouter le contact"}
            </button>

            {isEditMode && (
              <button
                type="button"
                onClick={cancelEdit}
                className="btn-secondary"
              >
                Annuler
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Liste des contacts */}
      <div className="contact-list">
        <h3>Liste des contacts</h3>
        {contacts.length === 0 ? (
          <p>Aucun contact trouvé.</p>
        ) : (
          <div className="contacts-grid">
            {contacts.map((contact) => (
              <div key={contact._id} className="contact-item">
                <h4>{contact.name}</h4>
                <p>
                  <strong>Email :</strong> {contact.email}
                </p>
                <p>
                  <strong>Téléphone :</strong> {contact.phone}
                </p>
                <p>
                  <strong>Créé le :</strong>{" "}
                  {new Date(contact.createdAt).toLocaleDateString()}
                </p>
                <div className="contact-actions">
                  <button
                    className="btn-edit"
                    onClick={() => editContact(contact)}
                  >
                    Modifier
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => deleteContact(contact._id)}
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {message.text && (
        <div className={`message ${message.type}`}>{message.text}</div>
      )}
    </div>
  );
}

// Composant principal de l'application
function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [authToken, setAuthToken] = useState(null);
  const [currentView, setCurrentView] = useState("login");

  // Vérifier si l'utilisateur est connecté au chargement
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const user = localStorage.getItem("currentUser");

    if (token && user) {
      setAuthToken(token);
      setCurrentUser(JSON.parse(user));
      setCurrentView("contacts");
    }
  }, []);

  // Gérer le routage simple avec hash
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.substring(1);
      if (hash === "register") {
        setCurrentView("register");
      } else if (hash === "login") {
        setCurrentView("login");
      } else if (hash === "contacts") {
        setCurrentView("contacts");
      }
    };

    window.addEventListener("hashchange", handleHashChange);
    handleHashChange(); // Appeler une fois au chargement

    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const handleLogin = (user, token) => {
    setCurrentUser(user);
    setAuthToken(token);
    setCurrentView("contacts");
    window.location.hash = "#contacts";
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setAuthToken(null);
    localStorage.removeItem("authToken");
    localStorage.removeItem("currentUser");
    setCurrentView("login");
    window.location.hash = "#login";
  };

  return (
    <div className="App">
      <h1>MyContacts</h1>

      {currentView === "login" && <Login onLogin={handleLogin} />}
      {currentView === "register" && <Register onLogin={handleLogin} />}
      {currentView === "contacts" && currentUser && (
        <Contacts currentUser={currentUser} onLogout={handleLogout} />
      )}
    </div>
  );
}

export default App;
