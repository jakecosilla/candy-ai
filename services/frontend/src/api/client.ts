import { config } from '../config/env';

export const apiClient = {
  async get(endpoint: string, base: string = config.apiUrl) {
    const res = await fetch(`${base}${endpoint}`);
    if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
    return res.json();
  },
  async post(endpoint: string, payload?: any, base: string = config.adminUrl) {
    const res = await fetch(`${base}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload || {}),
    });
    if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
    return res.json();
  }
};
