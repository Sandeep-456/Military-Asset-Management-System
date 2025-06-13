// src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://military-asset-management-system-gtah.onrender.com',
  headers: {
    'Content-Type': 'application/json'
  }
});

export default api;
