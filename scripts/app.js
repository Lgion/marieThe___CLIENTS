// Application Principale
// Madame Marie-Thérèse Affoué : "Les Perles et Moi" & "Voyages et Découvertes"

import { INITIAL_JEWELRY, CLIENT_INFO } from './data.js';
import { initTripsModule } from './trips.js';
import { initAdminModule } from './admin.js';

let jewelryCatalog = [];
let cart = [];
let currentFilter = 'all';
let currentUniverse = 'bijoux'; // 'bijoux' | 'voyages'
let activeAudio = null;

document.addEventListener('DOMContentLoaded', () => {
  loadCatalogData();
  initTripsModule();
  initAdminModule();
  setupEventListeners();
  renderCatalog();
  updateCartUI();
});

function loadCatalogData() {
  const localSaved = localStorage.getItem('mme_affoue_jewelry');
  if (localSaved) {
    try {
      const parsed = JSON.parse(localSaved);
      jewelryCatalog = [...INITIAL_JEWELRY, ...parsed];
    } catch (e) {
      jewelryCatalog = [...INITIAL_JEWELRY];
    }
  } else {
    jewelryCatalog = [...INITIAL_JEWELRY];
  }
}

export function addNewJewelryItem(item) {
  jewelryCatalog.unshift(item);

  // Sauvegarde des créations personnalisées
  const customItems = jewelryCatalog.filter(j => j.id.startsWith('custom-'));
  localStorage.setItem('mme_affoue_jewelry', JSON.stringify(customItems));

  renderCatalog();
}

export function refreshJewelryCatalog() {
  renderCatalog();
}

function setupEventListeners() {
  // Universe Switcher (Desktop & Mobile)
  document.querySelectorAll('[data-universe-target]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const target = e.currentTarget.getAttribute('data-universe-target');
      switchUniverse(target);
    });
  });

  // Filter Pills
  document.querySelectorAll('.filter-pill').forEach(pill => {
    pill.addEventListener('click', (e) => {
      document.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
      e.currentTarget.classList.add('active');
      currentFilter = e.currentTarget.getAttribute('data-filter');
      renderCatalog();
    });
  });

  // Cart Drawer toggling
  const cartBtn = document.getElementById('btn-open-cart');
  const cartDrawerOverlay = document.getElementById('cart-drawer-overlay');
  const closeCartBtn = document.getElementById('btn-close-cart');

  if (cartBtn) cartBtn.addEventListener('click', openCartDrawer);
  if (closeCartBtn) closeCartBtn.addEventListener('click', closeCartDrawer);
  if (cartDrawerOverlay) {
    cartDrawerOverlay.addEventListener('click', (e) => {
      if (e.target === cartDrawerOverlay) closeCartDrawer();
    });
  }

  // Audio Story Player
  const audioPlayBtn = document.getElementById('btn-play-voice-story');
  if (audioPlayBtn) {
    audioPlayBtn.addEventListener('click', toggleAudioStory);
  }
}

// Commutateur d'Univers Fluide
export function switchUniverse(universe) {
  currentUniverse = universe;

  // Mise à jour des boutons du switcher
  document.querySelectorAll('.universe-btn, .mobile-action-btn').forEach(btn => {
    if (btn.getAttribute('data-universe-target') === universe) {
      btn.classList.add('active');
    } else if (btn.hasAttribute('data-universe-target')) {
      btn.classList.remove('active');
    }
  });

  const heroJewelry = document.getElementById('hero-slide-bijoux');
  const heroTrips = document.getElementById('hero-slide-voyages');
  const sectionCatalog = document.getElementById('section-catalogue-bijoux');
  const sectionTrips = document.getElementById('section-voyages-club');

  if (universe === 'bijoux') {
    if (heroJewelry) heroJewelry.classList.add('active');
    if (heroTrips) heroTrips.classList.remove('active');
    if (sectionCatalog) sectionCatalog.style.display = 'block';
    if (sectionTrips) sectionTrips.style.display = 'none';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } else {
    if (heroJewelry) heroJewelry.classList.remove('active');
    if (heroTrips) heroTrips.classList.add('active');
    if (sectionCatalog) sectionCatalog.style.display = 'none';
    if (sectionTrips) sectionTrips.style.display = 'block';
    if (sectionTrips) sectionTrips.scrollIntoView({ behavior: 'smooth' });
  }
}
window.switchUniverse = switchUniverse;

// Rendu du Catalogue Bijoux
export function renderCatalog() {
  const container = document.getElementById('jewelry-grid-container');
  if (!container) return;

  const filtered = jewelryCatalog.filter(item => {
    if (currentFilter === 'all') return true;
    if (currentFilter === 'in_stock') return item.status === 'in_stock';
    if (currentFilter === 'on_order') return item.status === 'on_order';
    if (currentFilter === 'parure') return item.category === 'parure';
    if (currentFilter === 'collier') return item.category === 'collier';
    if (currentFilter === 'boucles') return item.category === 'boucles';
    return true;
  });

  // Mise à jour du compteur
  const totalCountEl = document.getElementById('catalog-total-count');
  if (totalCountEl) totalCountEl.textContent = filtered.length;

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px;">
        <p style="font-size: 1.1rem; color: var(--color-onyx-600);">Aucune pièce ne correspond à ce filtre.</p>
        <button class="btn-secondary-outline" style="margin-top: 16px;" onclick="document.querySelector('[data-filter=\\'all\\']').click()">Voir toutes les créations</button>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(item => {
    const isStock = item.status === 'in_stock';
    const statusText = isStock ? 'En Stock • Pièce Unique' : 'Sur Commande • Confection';
    const badgeClass = isStock ? 'in-stock' : 'on-order';

    return `
      <article class="jewelry-card" data-item-id="${item.id}">
        <div class="jewelry-media" onclick="window.openProductDetailModal('${item.id}')">
          <span class="status-badge ${badgeClass}">${statusText}</span>
          <img src="${item.image}" alt="${item.title}" loading="lazy">
          <button class="quick-view-btn" title="Vue détaillée">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="11" y1="8" x2="11" y2="14"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>
          </button>
        </div>

        <div class="jewelry-info">
          <div class="jewelry-category-tag">${item.type}</div>
          <h3 class="jewelry-title font-serif" onclick="window.openProductDetailModal('${item.id}')" style="cursor:pointer;">${item.title}</h3>
          <p class="jewelry-subtitle">${item.subtitle}</p>

          <div class="jewelry-specs-pills">
            ${item.stones.map(st => `<span class="stone-pill">${st}</span>`).join('')}
          </div>

          <div class="jewelry-footer">
            <div class="price-box">
              <span class="price-cfa">${item.priceCFA.toLocaleString('fr-FR')} FCFA</span>
              <span class="price-eur">Env. ${item.priceEUR} €</span>
            </div>

            <div class="card-actions-group">
              <a href="javascript:void(0)" class="btn-card-whatsapp" onclick="window.orderDirectWhatsApp('${item.id}')" title="Commander directement sur WhatsApp">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86.174.086.275.072.376-.044.101-.116.433-.506.549-.68.116-.173.231-.145.39-.086s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.099.824zm-3.423-14.416c-6.627 0-12 5.373-12 12 0 2.159.579 4.178 1.594 5.926l-1.594 5.83 6.012-1.577c1.701.954 3.659 1.503 5.753 1.503 6.627 0 12-5.373 12-12 0-6.627-5.373-12-12-12z"/></svg>
              </a>
              <button class="btn-add-cart" onclick="window.addToCart('${item.id}')">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
                Ajouter
              </button>
            </div>
          </div>
        </div>
      </article>
    `;
  }).join('');
}

// Modal de Détail Bijou avec Zoom
window.openProductDetailModal = function(id) {
  const item = jewelryCatalog.find(j => j.id === id);
  if (!item) return;

  const modal = document.getElementById('product-detail-modal');
  const modalBody = document.getElementById('product-modal-dynamic-body');
  if (!modal || !modalBody) return;

  const isStock = item.status === 'in_stock';
  const statusBadge = isStock
    ? `<span class="status-badge in-stock">Disponible Immédiatement (Pièce Unique)</span>`
    : `<span class="status-badge on-order">Sur Commande (Archive d'Exception)</span>`;

  modalBody.innerHTML = `
    <div class="modal-product-layout">
      <div class="product-zoom-container" id="modal-zoom-box" onmousemove="window.handleImageZoom(event)" onmouseleave="window.resetImageZoom()">
        <img src="${item.image}" id="modal-zoom-image" alt="${item.title}">
      </div>

      <div>
        <div style="margin-bottom: 12px;">${statusBadge}</div>
        <div class="jewelry-category-tag">${item.type}</div>
        <h2 class="font-serif" style="font-size: 2.2rem; color: var(--color-onyx-900); margin-bottom: 8px;">${item.title}</h2>
        <p style="color: var(--color-onyx-400); font-size: 0.95rem; margin-bottom: 20px;">${item.subtitle}</p>

        <div style="background: var(--color-sand-100); padding: 18px 22px; border-radius: var(--radius-md); margin-bottom: 24px; border: 1px solid var(--color-sand-200);">
          <div class="price-cfa" style="font-size: 2rem;">${item.priceCFA.toLocaleString('fr-FR')} FCFA</div>
          <span style="font-size: 0.85rem; color: var(--color-onyx-600);">Paiement sécurisé par <strong>Wave</strong> & Mobile Money • Livraison Yango Abidjan</span>
        </div>

        <div style="margin-bottom: 20px;">
          <h4 style="font-size: 0.9rem; text-transform: uppercase; letter-spacing: 1px; color: var(--color-gold-deep); margin-bottom: 8px;">Description & Histoire de la Pièce</h4>
          <p style="color: var(--color-onyx-700); line-height: 1.7; font-size: 0.95rem;">${item.description}</p>
        </div>

        <div style="margin-bottom: 20px;">
          <h4 style="font-size: 0.9rem; text-transform: uppercase; letter-spacing: 1px; color: var(--color-gold-deep); margin-bottom: 8px;">Symbolique & Vertus</h4>
          <p style="font-style: italic; color: var(--color-onyx-600); font-size: 0.9rem;">« ${item.symbolism} »</p>
        </div>

        <div style="border-top: 1px solid var(--color-sand-200); padding-top: 18px; margin-bottom: 28px; font-size: 0.85rem; color: var(--color-onyx-600);">
          <p><strong>Matières :</strong> ${item.materials}</p>
          <p style="margin-top: 4px;"><strong>Dimensions :</strong> ${item.dimensions}</p>
        </div>

        <div style="display: flex; gap: 14px; flex-wrap: wrap;">
          <a href="javascript:void(0)" class="btn-primary-gold" onclick="window.orderDirectWhatsApp('${item.id}')" style="flex: 1; text-decoration: none; justify-content: center;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86.174.086.275.072.376-.044.101-.116.433-.506.549-.68.116-.173.231-.145.39-.086s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.099.824zm-3.423-14.416c-6.627 0-12 5.373-12 12 0 2.159.579 4.178 1.594 5.926l-1.594 5.83 6.012-1.577c1.701.954 3.659 1.503 5.753 1.503 6.627 0 12-5.373 12-12 0-6.627-5.373-12-12-12z"/></svg>
            Commander via WhatsApp
          </a>
          <button class="btn-secondary-outline" onclick="window.addToCart('${item.id}')">
            Ajouter au panier
          </button>
        </div>
      </div>
    </div>
  `;

  modal.classList.add('active');
};

window.closeProductDetailModal = function() {
  const modal = document.getElementById('product-detail-modal');
  if (modal) modal.classList.remove('active');
};

// Effet loupe haute définition
window.handleImageZoom = function(e) {
  const container = e.currentTarget;
  const img = document.getElementById('modal-zoom-image');
  if (!img) return;

  const rect = container.getBoundingClientRect();
  const x = ((e.clientX - rect.left) / rect.width) * 100;
  const y = ((e.clientY - rect.top) / rect.height) * 100;

  img.style.transformOrigin = `${x}% ${y}%`;
  img.style.transform = "scale(2.2)";
};

window.resetImageZoom = function() {
  const img = document.getElementById('modal-zoom-image');
  if (img) {
    img.style.transform = "scale(1)";
    img.style.transformOrigin = "center center";
  }
};

// Commande directe par WhatsApp en 1 clic
window.orderDirectWhatsApp = function(id) {
  const item = jewelryCatalog.find(j => j.id === id);
  if (!item) return;

  const statusLabel = item.status === 'in_stock' ? 'En stock (Disponibilité immédiate)' : 'Sur commande (Confection artisanale sur-mesure)';

  const text = `Bonjour Madame Affoué,\n\nJe suis très intéressé(e) par votre bijou artisanal :\n✨ *${item.title}*\n💎 Type : ${item.type}\n🏷️ Statut : ${statusLabel}\n💰 Prix : ${item.priceCFA.toLocaleString('fr-FR')} FCFA\n\nPourriez-vous m'indiquer la disponibilité pour une livraison par Yango à Abidjan (ou expédition) et vos coordonnées Wave pour le règlement ?\nMerci beaucoup !`;

  const url = `https://wa.me/2250700000000?text=${encodeURIComponent(text)}`;
  window.open(url, '_blank');
};

// Gestion du Panier & Commande Groupée
window.addToCart = function(id) {
  const item = jewelryCatalog.find(j => j.id === id);
  if (!item) return;

  const existing = cart.find(c => c.id === id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...item, qty: 1 });
  }

  updateCartUI();
  openCartDrawer();
};

window.removeFromCart = function(id) {
  cart = cart.filter(c => c.id !== id);
  updateCartUI();
};

export function openCartDrawer() {
  const drawer = document.getElementById('cart-drawer-overlay');
  if (drawer) drawer.classList.add('active');
}
window.openCartDrawer = openCartDrawer;

export function closeCartDrawer() {
  const drawer = document.getElementById('cart-drawer-overlay');
  if (drawer) drawer.classList.remove('active');
}
window.closeCartDrawer = closeCartDrawer;

function updateCartUI() {
  const countBadges = document.querySelectorAll('.cart-badge-count');
  const totalItems = cart.reduce((acc, curr) => acc + curr.qty, 0);

  countBadges.forEach(b => b.textContent = totalItems);

  const container = document.getElementById('cart-items-container');
  const subtotalEl = document.getElementById('cart-subtotal-price');

  if (!container || !subtotalEl) return;

  if (cart.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 40px 10px; color: var(--color-onyx-400);">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin-bottom: 12px; opacity: 0.6;"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
        <p>Votre panier est vide.</p>
        <p style="font-size: 0.85rem; margin-top: 6px;">Découvrez nos parures uniques faites main.</p>
      </div>
    `;
    subtotalEl.textContent = "0 FCFA";
    return;
  }

  let totalCFA = 0;

  container.innerHTML = cart.map(item => {
    const itemTotal = item.priceCFA * item.qty;
    totalCFA += itemTotal;

    return `
      <div class="cart-item-row">
        <img src="${item.image}" alt="${item.title}" class="cart-item-thumb">
        <div class="cart-item-details">
          <div class="cart-item-name">${item.title}</div>
          <div class="cart-item-price">${item.qty} × ${item.priceCFA.toLocaleString('fr-FR')} FCFA</div>
        </div>
        <button class="cart-item-remove" onclick="window.removeFromCart('${item.id}')" title="Retirer">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
      </div>
    `;
  }).join('');

  subtotalEl.textContent = `${totalCFA.toLocaleString('fr-FR')} FCFA`;
}

window.checkoutCartWhatsApp = function() {
  if (cart.length === 0) {
    alert("Votre panier est vide.");
    return;
  }

  let totalCFA = 0;
  let itemsListText = cart.map((it, idx) => {
    const sub = it.priceCFA * it.qty;
    totalCFA += sub;
    return `${idx + 1}. *${it.title}* (${it.qty} ex.) - ${sub.toLocaleString('fr-FR')} FCFA [${it.status === 'in_stock' ? 'En stock' : 'Sur commande'}]`;
  }).join('\n');

  const text = `Bonjour Madame Affoué,\n\nJe souhaite passer commande pour ma sélection de bijoux artisanaux :\n\n${itemsListText}\n\n💰 *Total panier :* ${totalCFA.toLocaleString('fr-FR')} FCFA\n💳 *Mode de paiement souhaité :* Wave / Mobile Money\n🛵 *Livraison :* Yango Delivery Abidjan\n\nMerci de m'indiquer comment procéder au règlement et pour convenir du lieu de livraison !`;

  const url = `https://wa.me/2250700000000?text=${encodeURIComponent(text)}`;
  window.open(url, '_blank');
};

// Lecteur Audio pour Madame Affoué
function toggleAudioStory() {
  const player = document.getElementById('voice-story-player-box');
  const btn = document.getElementById('btn-play-voice-story');

  if (!activeAudio) {
    // Utilise le premier enregistrement d'interview fourni
    activeAudio = new Audio('assets/audio/interview-part2.mp4');
    activeAudio.onended = () => {
      if (player) player.classList.remove('playing');
      updatePlayIcon(false);
    };
  }

  if (activeAudio.paused) {
    activeAudio.play().then(() => {
      if (player) player.classList.add('playing');
      updatePlayIcon(true);
    }).catch(err => {
      console.warn("Lecture bloquée par le navigateur:", err);
    });
  } else {
    activeAudio.pause();
    if (player) player.classList.remove('playing');
    updatePlayIcon(false);
  }
}

function updatePlayIcon(isPlaying) {
  const icon = document.getElementById('play-voice-icon');
  if (!icon) return;

  if (isPlaying) {
    icon.innerHTML = `<rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect>`;
  } else {
    icon.innerHTML = `<polygon points="5 3 19 12 5 21 5 3"></polygon>`;
  }
}
