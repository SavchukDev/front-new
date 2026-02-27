import { BASE } from './admin/api.js';

const API_URL = `${BASE}/public/products`;

function productCardTemplate(p) {
  const variantClass = p.variant ? ` ${p.variant}` : '';

  const badge = p.badge
    ? `<div class="badge">${escapeHtml(p.badge)}</div>`
    : '';

  const title = `
    <h3>
      ${escapeHtml(p.name || '')}<br>
      ${p.sub_h ? `<span class="sub-h">${escapeHtml(p.sub_h)}</span>` : ''}
    </h3>
  `;

  const prices = (p.prices || [])
  .map((pr) => {
    const label = pr?.label ?? '';
    const value = pr?.value;

    // если value нет — показываем только label (без "undefined")
    if (value === undefined || value === null || value === '') {
      return `
        <div class="price-row">
          <span>${escapeHtml(label)}</span>
        </div>
      `;
    }

    return `
      <div class="price-row">
        <span>${escapeHtml(label)}:</span>
        <strong>${escapeHtml(value)}</strong>
      </div>
    `;
  })
  .join('');

  const features = (p.features || [])
    .map(f => `<li>${escapeHtml(f)}</li>`)
    .join('');

  const geos = p.geos
    ? `<div class="geos">${escapeHtml(p.geos)}</div>`
    : '';

  return `
    <div class="product-card${variantClass}">
      ${badge}
      ${title}

      <div class="pricing">
        ${prices}
      </div>

      <ul class="card-features">
        ${features}
      </ul>

      ${geos}

      <a href="${p.button_link || '#'}" class="buy-btn">
        ${escapeHtml(p.button_text || 'Купить')}
      </a>
    </div>
  `;
}

// минимальная защита от спецсимволов
function escapeHtml(str) {
  return String(str)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

async function loadProducts() {
  const grid = document.querySelector('#productGrid');
  if (!grid) return; // если секции нет на странице

  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const products = await res.json();

    if (!products.length) {
      grid.innerHTML = `<p>Нет товаров</p>`;
      return;
    }

    grid.innerHTML = products.map(productCardTemplate).join('');
  } catch (e) {
    console.error(e);
    // можно показать красивое сообщение или просто молча
  }
}

loadProducts();