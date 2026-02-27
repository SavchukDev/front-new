import { apiFetch, clearToken, getToken } from './api.js';

const BASE_PATH = import.meta.env.BASE_URL;

if (!getToken()) window.location.href = `${BASE_PATH}login.html`;

const listEl = document.querySelector('#productsList');
const createForm = document.querySelector('#createForm');
const logoutBtn = document.querySelector('#logoutBtn');

logoutBtn.addEventListener('click', () => {
  clearToken();
  window.location.href = `${BASE_PATH}login.html`;
});

async function loadProducts() {
  const products = await apiFetch('/products');
  listEl.innerHTML = '';

  products.forEach((p) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <b>${p.name}</b>
      ${p.badge ? ` — <span>${p.badge}</span>` : ''}
      <button data-del="${p.id}">Удалить</button>
    `;
    listEl.appendChild(li);
  });
}

listEl.addEventListener('click', async (e) => {
  const delId = e.target.dataset.del;
  if (!delId) return;

  try {
    await apiFetch(`/products/${delId}`, { method: 'DELETE' });
    await loadProducts();
  } catch (err) {
    alert(err.message);
  }
});

createForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = createForm.name.value.trim();
  const badge = createForm.badge.value.trim() || null;
  const geos = createForm.geos.value.trim() || null;
  const button_text = createForm.button_text.value.trim() || 'Купить';
  const button_link = createForm.button_link.value.trim() || 'https://t.me/tmlfarm';
  const variant = createForm.variant.value || 'default';

  const prices = createForm.prices.value
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean)
    .map((line) => {
      const [label, value] = line.split('|').map((x) => x?.trim());
      return { label, value };
    });

  const features = createForm.features.value
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean);

  try {
    await apiFetch('/products', {
      method: 'POST',
      body: JSON.stringify({
        name,
        badge,
        variant,
        button_text,
        button_link,
        geos,
        prices,
        features,
      }),
    });

    createForm.reset();
    createForm.button_text.value = 'Купить';
    createForm.button_link.value = 'https://t.me/tmlfarm';

    await loadProducts();
  } catch (err) {
    alert(err.message);
  }
});

loadProducts();