import { apiFetch, setToken, getToken } from './api.js';

const BASE_PATH = import.meta.env.BASE_URL;

// если уже залогинен → сразу в админку
if (getToken()) {
  window.location.href = `${BASE_PATH}admin.html`;
}

const form = document.querySelector('#loginForm');
const errorEl = document.querySelector('#loginError');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  errorEl.textContent = '';

  const name = form.name.value.trim();
  const password = form.password.value;

  try {
    const data = await apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ name, password }),
    });

    setToken(data.token);

    // редирект после логина
    window.location.href = `${BASE_PATH}admin.html`;

  } catch (err) {
    errorEl.textContent = err.message;
  }
});