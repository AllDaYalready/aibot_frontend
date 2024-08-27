// src/utils/csrf.js

import axios from 'axios';
import apiConfig from '../config/api';

export function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

export function getCsrfToken() {
  return getCookie('csrftoken');
}

export async function fetchCsrfToken() {
  try {
    await axios.get(apiConfig.CSRF_TOKEN_URL, { withCredentials: true });
    return getCsrfToken();
  } catch (error) {
    console.error('Failed to fetch CSRF token:', error);
    return null;
  }
}

export default getCsrfToken;