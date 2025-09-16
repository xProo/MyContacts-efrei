import axios from "axios";

const API_BASE = "http://localhost:3001/api";

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const apiService = {
  async login(email, password) {
    try {
      const response = await api.post("/auth/login", { email, password });
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Erreur de connexion",
      };
    }
  },

  async register(name, email, password) {
    try {
      const response = await api.post("/auth/register", {
        name,
        email,
        password,
      });
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Erreur d'inscription",
      };
    }
  },

  async getContacts() {
    try {
      const response = await api.get("/contacts");
      return response.data;
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message ||
          "Erreur lors du chargement des contacts",
      };
    }
  },

  async createContact(contactData) {
    try {
      const response = await api.post("/contacts", contactData);
      return response.data;
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message ||
          "Erreur lors de la création du contact",
      };
    }
  },

  async updateContact(contactId, contactData) {
    try {
      const response = await api.put(`/contacts/${contactId}`, contactData);
      return response.data;
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message ||
          "Erreur lors de la mise à jour du contact",
      };
    }
  },

  async deleteContact(contactId) {
    try {
      const response = await api.delete(`/contacts/${contactId}`);
      return response.data;
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message ||
          "Erreur lors de la suppression du contact",
      };
    }
  },
};
