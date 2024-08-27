// src/config/api.js

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000/api';

export default {
  API_BASE_URL,
  CSRF_TOKEN_URL: `${API_BASE_URL}/csrf-token/`
};