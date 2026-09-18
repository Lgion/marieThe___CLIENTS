// Module "Voyages et Découvertes"
// Escapades, gestion des places, modal de réservation et Fiche d'Inscription Imprimable

import { INITIAL_TRIPS, CLIENT_INFO } from './data.js';

let tripsData = [...INITIAL_TRIPS];

export function initTripsModule() {
  renderTripsList();
  setupTripModalEvents();
}

export function renderTripsList() {
  const container = document.getElementById('trips-grid-container');
  if (!container) return;

  container.innerHTML = tripsData.map(trip => {
    const seatsRemaining = trip.maxCapacity - trip.bookedSeats;
    const progressPercent = Math.round((trip.bookedSeats / trip.maxCapacity) * 100);
    const isFull = seatsRemaining <= 0;

    return `
      <article class="trip-card" data-trip-id="${trip.id}">
        <div class="trip-media">
          <img src="${trip.image}" alt="${trip.title}" loading="lazy">
          <span class="trip-date-pill">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
            ${trip.date}
          </span>
          <span class="trip-age-badge">${trip.minAge} ans minimum</span>
        </div>

        <div class="trip-body">
          <div class="trip-destination-tag">${trip.destination} • ${trip.duration}</div>
          <h3 class="trip-title font-serif">${trip.title}</h3>
          <p class="trip-subtitle">${trip.subtitle}</p>

          <div class="seats-gauge-wrap">
            <div class="seats-header">
              <span>Places disponibles</span>
              <span class="seats-count-highlight">${isFull ? 'COMPLET' : `Plus que ${seatsRemaining} place${seatsRemaining > 1 ? 's' : ''} sur ${trip.maxCapacity}`}</span>
            </div>
            <div class="seats-progress-bar">
              <div class="seats-progress-fill" style="width: ${progressPercent}%;"></div>
            </div>
          </div>

          <ul class="trip-highlights-list">
            ${trip.highlights.slice(0, 3).map(hl => `
              <li>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
                <span>${hl}</span>
              </li>
            `).join('')}
          </ul>

          <div class="trip-footer">
            <div class="price-box">
              <span class="trip-price-amount">${trip.priceCFA.toLocaleString('fr-FR')} FCFA</span>
              <span class="trip-price-note">Tout compris • Transport, repas & visites</span>
            </div>
            <button class="btn-book-trip" onclick="window.openTripModal('${trip.id}')" ${isFull ? 'disabled style="opacity:0.5;"' : ''}>
              ${isFull ? 'Complet' : 'Réserver ma place'}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            </button>
          </div>
        </div>
      </article>
    `;
  }).join('');
}

// Modal de Détail & Réservation d'escapade
window.openTripModal = function(tripId) {
  const trip = tripsData.find(t => t.id === tripId);
  if (!trip) return;

  const modal = document.getElementById('trip-booking-modal');
  const modalContent = document.getElementById('trip-modal-dynamic-content');
  if (!modal || !modalContent) return;

  const seatsRemaining = trip.maxCapacity - trip.bookedSeats;

  modalContent.innerHTML = `
    <div style="padding: 32px;">
      <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px; margin-bottom: 20px; padding-right: 46px;">
        <span class="trip-destination-tag">${trip.destination}</span>
        <span class="trip-age-badge" style="position: static; box-shadow: none;">Conditions : ${trip.minAge} ans minimum</span>
      </div>

      <h2 class="font-serif" style="font-size: 2rem; color: var(--color-onyx-900); margin-bottom: 8px;">${trip.title}</h2>
      <p style="color: var(--color-onyx-600); margin-bottom: 24px;">${trip.subtitle}</p>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 30px;">
        <div style="background: var(--color-sand-100); padding: 18px; border-radius: var(--radius-md);">
          <strong style="display: block; font-size: 0.85rem; color: var(--color-gold-deep); text-transform: uppercase;">Date & Horaires</strong>
          <span style="font-size: 1.05rem; font-weight: 700; color: var(--color-onyx-900);">${trip.date}</span>
          <p style="font-size: 0.85rem; color: var(--color-onyx-600); margin-top: 4px;">${trip.duration}</p>
        </div>
        <div style="background: var(--color-sand-100); padding: 18px; border-radius: var(--radius-md);">
          <strong style="display: block; font-size: 0.85rem; color: var(--color-gold-deep); text-transform: uppercase;">Tarif Tout Inclus</strong>
          <span style="font-size: 1.35rem; font-weight: 700; color: var(--color-onyx-900);">${trip.priceCFA.toLocaleString('fr-FR')} FCFA</span>
          <p style="font-size: 0.85rem; color: var(--color-onyx-600); margin-top: 4px;">Transport VIP, repas & accès</p>
        </div>
      </div>

      <div style="margin-bottom: 28px;">
        <h4 class="font-serif" style="font-size: 1.3rem; margin-bottom: 14px; color: var(--color-onyx-900);">Programme Prévisionnel de la Journée</h4>
        <div style="border-left: 2px solid var(--color-gold); padding-left: 20px; display: flex; flex-direction: column; gap: 14px;">
          ${trip.schedule.map(item => `
            <div>
              <span style="font-weight: 700; color: var(--color-gold-deep); font-size: 0.9rem;">${item.time}</span>
              <p style="font-size: 0.95rem; color: var(--color-onyx-800); margin-top: 2px;">${item.activity}</p>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Formulaire de Réservation & Génération Fiche Inscription -->
      <div style="background: var(--color-sand-50); border: 1.5px solid var(--color-sand-300); border-radius: var(--radius-md); padding: 24px;">
        <h4 class="font-serif" style="font-size: 1.25rem; margin-bottom: 16px; color: var(--color-onyx-900);">Formulaire d'Inscription</h4>
        
        <form id="trip-registration-form" onsubmit="event.preventDefault(); window.submitTripRegistration('${trip.id}');">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px;">
            <div class="form-group" style="margin-bottom: 0;">
              <label class="form-label">Nom et Prénom *</label>
              <input type="text" id="reg-name" class="form-input" placeholder="Ex: Kouassi Jean" required>
            </div>
            <div class="form-group" style="margin-bottom: 0;">
              <label class="form-label">Téléphone / WhatsApp *</label>
              <input type="tel" id="reg-phone" class="form-input" placeholder="Ex: +225 07 12 34 56" required>
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px;">
            <div class="form-group" style="margin-bottom: 0;">
              <label class="form-label">Nombre de participants *</label>
              <select id="reg-guests" class="form-select" required>
                <option value="1">1 Personne</option>
                <option value="2">2 Personnes</option>
                <option value="3">3 Personnes</option>
                <option value="4">4 Personnes</option>
              </select>
            </div>
            <div class="form-group" style="margin-bottom: 0;">
              <label class="form-label">Âge des participants (Min. 10 ans) *</label>
              <input type="text" id="reg-ages" class="form-input" placeholder="Ex: 34 ans, 12 ans" required>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Régime alimentaire ou remarques particulières</label>
            <input type="text" id="reg-notes" class="form-input" placeholder="Ex: Végétarien, allergies...">
          </div>

          <div style="display: flex; gap: 14px; flex-wrap: wrap; margin-top: 24px;">
            <button type="submit" class="btn-primary-gold" style="flex: 1;">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
              Confirmer via WhatsApp
            </button>
            <button type="button" class="btn-secondary-outline" onclick="window.previewAndPrintSheet('${trip.id}')">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
              Générer Fiche PDF / Impression
            </button>
          </div>
        </form>
      </div>
    </div>
  `;

  modal.classList.add('active');
};

window.closeTripModal = function() {
  const modal = document.getElementById('trip-booking-modal');
  if (modal) modal.classList.remove('active');
};

function setupTripModalEvents() {
  const modal = document.getElementById('trip-booking-modal');
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) window.closeTripModal();
    });
  }
}

// Confirmation de Réservation WhatsApp
window.submitTripRegistration = function(tripId) {
  const trip = tripsData.find(t => t.id === tripId);
  if (!trip) return;

  const name = document.getElementById('reg-name').value;
  const phone = document.getElementById('reg-phone').value;
  const guests = document.getElementById('reg-guests').value;
  const ages = document.getElementById('reg-ages').value;
  const notes = document.getElementById('reg-notes').value || "Aucune";

  const totalPrice = trip.priceCFA * parseInt(guests);

  const message = `Bonjour Madame Affoué,\n\nJe souhaite réserver des places pour l'escapade "Voyages et Découvertes" :\n🌴 *${trip.title}*\n📅 Date : ${trip.date}\n👥 Places souhaitées : ${guests} personne(s)\n🎂 Âges déclarés : ${ages} (Conditions respectées : 10 ans et +)\n👤 Nom du participant principal : ${name}\n📞 Téléphone : ${phone}\n💬 Remarques : ${notes}\n💰 Montant total : ${totalPrice.toLocaleString('fr-FR')} FCFA\n\nJe souhaite effectuer le règlement via Wave. Pouvez-vous me confirmer la disponibilité ? Merci !`;

  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/2250700000000?text=${encodedMessage}`;

  window.open(whatsappUrl, '_blank');
  window.closeTripModal();
};

// Génération de la Fiche d'Inscription Officielle Imprimable
window.previewAndPrintSheet = function(tripId) {
  const trip = tripsData.find(t => t.id === tripId);
  if (!trip) return;

  const name = document.getElementById('reg-name')?.value || "_________________________";
  const phone = document.getElementById('reg-phone')?.value || "_________________________";
  const guests = document.getElementById('reg-guests')?.value || "1";
  const ages = document.getElementById('reg-ages')?.value || "_________________________";
  const notes = document.getElementById('reg-notes')?.value || "Néant";

  const printArea = document.getElementById('printable-sheet-container');
  if (!printArea) return;

  printArea.innerHTML = `
    <div class="registration-sheet-preview printable-area">
      <div class="sheet-header-box">
        <div>
          <h2 style="font-family: 'Cinzel', serif; font-size: 1.5rem; text-transform: uppercase; margin-bottom: 4px;">Voyages et Découvertes</h2>
          <p style="font-size: 0.85rem; color: #666;">Sous la direction de Madame Marie-Thérèse Affoué • Abidjan, Côte d'Ivoire</p>
        </div>
        <div style="text-align: right;">
          <span class="sheet-badge-age">RÈGLEMENT STRICT : 10 ANS MINIMUM</span>
          <p style="font-size: 0.8rem; margin-top: 4px; color: #444;">Fiche N° : VD-${Date.now().toString().slice(-6)}</p>
        </div>
      </div>

      <div style="margin-bottom: 24px;">
        <h3 style="font-family: 'Cormorant Garamond', serif; font-size: 1.6rem; color: #111; margin-bottom: 6px;">${trip.title}</h3>
        <p style="font-size: 0.95rem; color: #444;"><strong>Destination :</strong> ${trip.destination} | <strong>Date :</strong> ${trip.date} (${trip.duration})</p>
        <p style="font-size: 0.95rem; color: #444;"><strong>Tarif unitaire :</strong> ${trip.priceCFA.toLocaleString('fr-FR')} FCFA tout compris</p>
      </div>

      <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 0.9rem;">
        <tr>
          <td style="padding: 10px; border: 1px solid #ddd; background: #fafafa; width: 35%;"><strong>Participant Référent :</strong></td>
          <td style="padding: 10px; border: 1px solid #ddd;">${name}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border: 1px solid #ddd; background: #fafafa;"><strong>Contact / WhatsApp :</strong></td>
          <td style="padding: 10px; border: 1px solid #ddd;">${phone}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border: 1px solid #ddd; background: #fafafa;"><strong>Nombre de participants :</strong></td>
          <td style="padding: 10px; border: 1px solid #ddd;">${guests} place(s) réservée(s)</td>
        </tr>
        <tr>
          <td style="padding: 10px; border: 1px solid #ddd; background: #fafafa;"><strong>Âges des inscrits (≥ 10 ans) :</strong></td>
          <td style="padding: 10px; border: 1px solid #ddd;">${ages}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border: 1px solid #ddd; background: #fafafa;"><strong>Régime / Observations :</strong></td>
          <td style="padding: 10px; border: 1px solid #ddd;">${notes}</td>
        </tr>
      </table>

      <div style="background: #fdfaf3; border: 1px solid #e2d2a4; padding: 14px; border-radius: 6px; font-size: 0.85rem; line-height: 1.5; margin-bottom: 28px;">
        <strong>Engagements & Sécurité :</strong> Les excursions de « Voyages et Découvertes » sont organisées dans un esprit convivial, familial et respectueux de la tranquillité de tous. Conformément aux consignes de sécurité et au bien-être du groupe, les enfants de moins de 10 ans ne sont pas admis. Le règlement s'effectue à la confirmation par Wave ou Mobile Money.
      </div>

      <div style="display: flex; justify-content: space-between; margin-top: 40px; padding-top: 20px; border-top: 1px dashed #ccc;">
        <div style="text-align: center; width: 45%;">
          <p style="font-size: 0.85rem; font-weight: bold; margin-bottom: 50px;">Signature du Participant</p>
          <div style="border-bottom: 1px solid #999; width: 80%; margin: 0 auto;"></div>
        </div>
        <div style="text-align: center; width: 45%;">
          <p style="font-size: 0.85rem; font-weight: bold; margin-bottom: 50px;">Pour l'Organisation (Mme Affoué)</p>
          <div style="border-bottom: 1px solid #999; width: 80%; margin: 0 auto;"></div>
        </div>
      </div>
    </div>
  `;

  window.print();
};
