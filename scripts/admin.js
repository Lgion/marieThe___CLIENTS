// Module "Studio Créatrice" pour Madame Marie-Thérèse Affoué
// Gestion complète : Ajout de bijoux, création d'escapades/voyages et paramétrage des médias

import { refreshJewelryCatalog, addNewJewelryItem, updateMediaSources, switchUniverse } from './app.js';
import { addNewTripItem } from './trips.js';

let recognition = null;
let isRecording = false;
let currentStudioTab = 'jewelry';

export function initAdminModule() {
  setupSpeechRecognition();
  setupAdminModalEvents();
  initMediaInputs();
}

function initMediaInputs() {
  const audioInput = document.getElementById('admin-audio-input');
  const videoInput = document.getElementById('admin-video-input');
  if (audioInput) {
    audioInput.value = localStorage.getItem('mme_affoue_audio_url') || 'assets/audio/interview-part2.mp4';
  }
  if (videoInput) {
    videoInput.value = localStorage.getItem('mme_affoue_video_url') || '';
  }
}

export function switchStudioTab(tabName) {
  currentStudioTab = tabName;
  document.querySelectorAll('.studio-tab-btn').forEach(btn => {
    if (btn.getAttribute('data-studio-tab') === tabName) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  const panelJewelry = document.getElementById('studio-panel-jewelry');
  const panelTrip = document.getElementById('studio-panel-trip');
  const panelMedia = document.getElementById('studio-panel-media');

  if (panelJewelry) panelJewelry.classList.toggle('active', tabName === 'jewelry');
  if (panelTrip) panelTrip.classList.toggle('active', tabName === 'trip');
  if (panelMedia) panelMedia.classList.toggle('active', tabName === 'media');

  if (tabName === 'media') {
    initMediaInputs();
  }
}
window.switchStudioTab = switchStudioTab;

window.openAdminModalWithTab = function(tabName) {
  window.openAdminModal();
  switchStudioTab(tabName);
};

window.openAdminModal = function() {
  const modal = document.getElementById('studio-admin-modal');
  if (modal) modal.classList.add('active');
  initMediaInputs();
};

window.closeAdminModal = function() {
  const modal = document.getElementById('studio-admin-modal');
  if (modal) modal.classList.remove('active');
};

function setupSpeechRecognition() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    console.warn("La reconnaissance vocale n'est pas supportée sur ce navigateur.");
    return;
  }

  recognition = new SpeechRecognition();
  recognition.lang = 'fr-FR';
  recognition.continuous = false;
  recognition.interimResults = false;

  recognition.onstart = () => {
    isRecording = true;
    updateMicUI(true);
    const transcriptEl = document.getElementById('voice-transcript-output');
    if (transcriptEl) transcriptEl.textContent = "Je vous écoute, Madame Affoué...";
  };

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    const transcriptEl = document.getElementById('voice-transcript-output');
    if (transcriptEl) transcriptEl.textContent = `« ${transcript} »`;

    parseVoiceCommand(transcript);
  };

  recognition.onerror = (event) => {
    console.error("Erreur reconnaissance vocale:", event.error);
    isRecording = false;
    updateMicUI(false);
    const transcriptEl = document.getElementById('voice-transcript-output');
    if (transcriptEl) transcriptEl.textContent = "Impossible d'écouter. Vous pouvez remplir les champs manuellement.";
  };

  recognition.onend = () => {
    isRecording = false;
    updateMicUI(false);
  };
}

function updateMicUI(recording) {
  const micBtn = document.getElementById('btn-toggle-mic');
  const micLabel = document.getElementById('mic-status-label');
  if (micBtn) {
    if (recording) {
      micBtn.classList.add('recording');
      if (micLabel) micLabel.textContent = "Écoute en cours... Parlez naturellement";
    } else {
      micBtn.classList.remove('recording');
      if (micLabel) micLabel.textContent = "Appuyez pour dicter votre bijou";
    }
  }
}

// Analyse intelligente des mots-clés parlés (prix, type, nom, stock)
function parseVoiceCommand(text) {
  const lower = text.toLowerCase();

  // 1. Détection du prix (ex: "prix 25000", "trente mille", "30000 francs")
  const priceMatch = lower.match(/(\d+[\d\s]*)\s*(francs|mille|cfa|fcfa)?/i);
  if (priceMatch) {
    const rawNumber = priceMatch[1].replace(/\s+/g, '');
    const num = parseInt(rawNumber, 10);
    if (!isNaN(num) && num > 1000) {
      const priceInput = document.getElementById('admin-price');
      if (priceInput) priceInput.value = num;
    }
  }

  // 2. Détection de la catégorie
  const catSelect = document.getElementById('admin-category');
  if (catSelect) {
    if (lower.includes('collier')) catSelect.value = 'collier';
    else if (lower.includes('bracelet')) catSelect.value = 'bracelet';
    else if (lower.includes('boucle')) catSelect.value = 'boucles';
    else if (lower.includes('parure') || lower.includes('ensemble')) catSelect.value = 'parure';
  }

  // 3. Détection du titre ou des pierres
  const titleInput = document.getElementById('admin-title');
  if (titleInput && !titleInput.value) {
    titleInput.value = text.charAt(0).toUpperCase() + text.slice(1);
  }

  const descInput = document.getElementById('admin-desc');
  if (descInput && !descInput.value) {
    descInput.value = `Création artisanale unique faite main : ${text}. Poids africains dorés à l'or et perles fines.`;
  }

  // 4. Détection statut
  const statusSelect = document.getElementById('admin-status');
  if (statusSelect) {
    if (lower.includes('commande') || lower.includes('vendu') || lower.includes('sur commande')) {
      statusSelect.value = 'on_order';
    } else {
      statusSelect.value = 'in_stock';
    }
  }
}

window.toggleVoiceDictation = function() {
  if (!recognition) {
    alert("Votre navigateur ne supporte pas la dictée vocale directe. Vous pouvez saisir les informations directement dans le formulaire ci-dessous.");
    return;
  }

  if (isRecording) {
    recognition.stop();
  } else {
    try {
      recognition.start();
    } catch (e) {
      console.warn("Reconnaissance déjà lancée", e);
    }
  }
};

function setupAdminModalEvents() {
  const modal = document.getElementById('studio-admin-modal');
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) window.closeAdminModal();
    });
  }

  // Onglets Studio
  document.querySelectorAll('.studio-tab-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const tab = e.currentTarget.getAttribute('data-studio-tab');
      switchStudioTab(tab);
    });
  });

  // Photo Bijou Preview
  const photoInput = document.getElementById('admin-photo');
  const previewImg = document.getElementById('admin-photo-preview');

  if (photoInput && previewImg) {
    photoInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (loadEvt) => {
          previewImg.src = loadEvt.target.result;
          previewImg.style.display = 'block';
        };
        reader.readAsDataURL(file);
      }
    });
  }

  // Photo Escapade Preset & File
  const tripPresetSelect = document.getElementById('admin-trip-photo-preset');
  const tripFileInput = document.getElementById('admin-trip-photo-file');
  const tripPreview = document.getElementById('admin-trip-photo-preview');

  if (tripPresetSelect && tripPreview) {
    tripPresetSelect.addEventListener('change', (e) => {
      const val = e.target.value;
      if (val !== 'custom') {
        tripPreview.src = val;
        tripPreview.style.display = 'block';
      } else if (tripFileInput) {
        tripFileInput.click();
      }
    });
  }

  if (tripFileInput && tripPreview) {
    tripFileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (loadEvt) => {
          tripPreview.src = loadEvt.target.result;
          tripPreview.style.display = 'block';
          if (tripPresetSelect) tripPresetSelect.value = 'custom';
        };
        reader.readAsDataURL(file);
      }
    });
  }

  // Formulaire Bijou
  const productForm = document.getElementById('admin-add-product-form');
  if (productForm) {
    productForm.addEventListener('submit', (e) => {
      e.preventDefault();
      saveNewProductFromForm();
    });
  }

  // Formulaire Escapade / Voyage
  const tripForm = document.getElementById('admin-add-trip-form');
  if (tripForm) {
    tripForm.addEventListener('submit', (e) => {
      e.preventDefault();
      saveNewTripFromForm();
    });
  }

  // Formulaire Médias (Audio & Vidéo)
  const mediaForm = document.getElementById('admin-media-settings-form');
  if (mediaForm) {
    mediaForm.addEventListener('submit', (e) => {
      e.preventDefault();
      saveMediaSettingsFromForm();
    });
  }
}

function saveNewProductFromForm() {
  const title = document.getElementById('admin-title').value.trim();
  const category = document.getElementById('admin-category').value;
  const status = document.getElementById('admin-status').value;
  const price = parseInt(document.getElementById('admin-price').value, 10) || 25000;
  const stones = document.getElementById('admin-stones').value.trim();
  const desc = document.getElementById('admin-desc').value.trim();
  const previewImg = document.getElementById('admin-photo-preview');

  const imageUrl = (previewImg && previewImg.style.display !== 'none' && previewImg.src)
    ? previewImg.src
    : "assets/images/bijoux/parure-cristal-azur-or.jpeg";

  const newBijou = {
    id: "custom-" + Date.now(),
    title: title,
    subtitle: `Création unique ${category} en perles et poids africains dorés`,
    category: category,
    type: category.charAt(0).toUpperCase() + category.slice(1),
    status: status,
    stockCount: status === 'in_stock' ? 1 : 0,
    priceCFA: price,
    priceEUR: Math.round(price / 655.957),
    image: imageUrl,
    description: desc || "Création originale confectionnée à la main par Madame Marie-Thérèse Affoué.",
    stones: stones ? stones.split(',').map(s => s.trim()) : ["Perles rares", "Poids akan dorés"],
    symbolism: "Élégance, prestige et protection traditionnelle.",
    materials: "Perles sélectionnées, orfèvrerie africaine dorée à l'or fin",
    dimensions: "Standard sur mesure"
  };

  addNewJewelryItem(newBijou);

  alert(`Félicitations Madame Affoué !\nLe bijou "${title}" a été ajouté avec succès dans votre vitrine.`);
  window.closeAdminModal();

  // Reset form
  const form = document.getElementById('admin-add-product-form');
  if (form) form.reset();
  if (previewImg) previewImg.style.display = 'none';
  const transcriptEl = document.getElementById('voice-transcript-output');
  if (transcriptEl) transcriptEl.textContent = "";
}

function saveNewTripFromForm() {
  const title = document.getElementById('admin-trip-title').value.trim();
  const destination = document.getElementById('admin-trip-destination').value.trim();
  const date = document.getElementById('admin-trip-date').value.trim();
  const duration = document.getElementById('admin-trip-duration').value.trim() || "1 Journée (07h30 - 18h30)";
  const price = parseInt(document.getElementById('admin-trip-price').value, 10) || 35000;
  const capacity = parseInt(document.getElementById('admin-trip-capacity').value, 10) || 15;
  const minAge = parseInt(document.getElementById('admin-trip-minage').value, 10) || 10;
  const rawHighlights = document.getElementById('admin-trip-highlights').value.trim();
  const desc = document.getElementById('admin-trip-desc').value.trim();
  const previewImg = document.getElementById('admin-trip-photo-preview');

  const imageUrl = (previewImg && previewImg.src) ? previewImg.src : "assets/images/trips/assinie-lagune.jpg";

  const highlights = rawHighlights
    ? rawHighlights.split(/[,;\n]+/).map(h => h.trim()).filter(Boolean)
    : [
        `Découverte exclusive de ${destination}`,
        "Repas complet convivial et rafraîchissements",
        "Ambiance sereine, échanges chaleureux et sécurité"
      ];

  const newTrip = {
    id: "trip-custom-" + Date.now(),
    title: title,
    subtitle: desc ? (desc.length > 120 ? desc.slice(0, 117) + '...' : desc) : `Escapade chaleureuse et dépaysante à ${destination}`,
    destination: destination,
    image: imageUrl,
    date: date,
    duration: duration,
    priceCFA: price,
    priceEUR: Math.round(price / 655.957),
    maxCapacity: capacity,
    bookedSeats: 0,
    minAge: minAge,
    highlights: highlights,
    schedule: [
      { time: "08h00", activity: `Rassemblement et départ depuis Abidjan vers ${destination}` },
      { time: "10h00", activity: `Arrivée à ${destination}, accueil chaleureux et collation locale` },
      { time: "12h30", activity: "Grand repas partagé et détente au bord de l'eau" },
      { time: "15h00", activity: "Balade, causerie bien-être et partages conviviaux" },
      { time: "17h30", activity: "Retour serein vers Abidjan" }
    ],
    included: [
      "Transport climatisé aller-retour depuis Abidjan",
      "Repas complet, boissons locales et pauses gourmandes",
      "Visites, droits d'accès et encadrement bienveillant"
    ]
  };

  addNewTripItem(newTrip);

  alert(`Félicitations Madame Affoué !\nL'escapade "${title}" a été ajoutée avec succès au calendrier de Voyages et Découvertes.`);
  window.closeAdminModal();

  // Basculer sur l'univers voyages pour voir le voyage immédiatement
  switchUniverse('voyages');

  const form = document.getElementById('admin-add-trip-form');
  if (form) form.reset();
}

function saveMediaSettingsFromForm() {
  const audioVal = document.getElementById('admin-audio-input').value.trim();
  const videoVal = document.getElementById('admin-video-input').value.trim();

  updateMediaSources(audioVal, videoVal);

  alert("Paramètres médias enregistrés avec succès ! Le message vocal et la vidéo ont été mis à jour.");
  window.closeAdminModal();
}
