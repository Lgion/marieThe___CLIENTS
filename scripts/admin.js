// Module "Studio Créatrice" pour Madame Marie-Thérèse Affoué
// Ajout de nouveaux bijoux avec photo, détails et dictée vocale intelligente (Web Speech API)

import { refreshJewelryCatalog, addNewJewelryItem } from './app.js';

let recognition = null;
let isRecording = false;

export function initAdminModule() {
  setupSpeechRecognition();
  setupAdminModalEvents();
}

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

window.openAdminModal = function() {
  const modal = document.getElementById('studio-admin-modal');
  if (modal) modal.classList.add('active');
};

window.closeAdminModal = function() {
  const modal = document.getElementById('studio-admin-modal');
  if (modal) modal.classList.remove('active');
};

// Redimensionne et compresse la photo avant stockage (le localStorage est limité
// à ~5 Mo et les photos brutes d'un téléphone pèsent souvent plusieurs Mo chacune)
function compressImageForStorage(sourceDataUrl, maxDimension = 900, quality = 0.72) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      let { width, height } = img;
      if (width > maxDimension || height > maxDimension) {
        if (width > height) {
          height = Math.round(height * (maxDimension / width));
          width = maxDimension;
        } else {
          width = Math.round(width * (maxDimension / height));
          height = maxDimension;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      canvas.getContext('2d').drawImage(img, 0, 0, width, height);

      resolve(canvas.toDataURL('image/jpeg', quality));
    };
    img.onerror = () => resolve(sourceDataUrl); // Repli sur l'image d'origine si le décodage échoue
    img.src = sourceDataUrl;
  });
}

function setupAdminModalEvents() {
  const modal = document.getElementById('studio-admin-modal');
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) window.closeAdminModal();
    });
  }

  // Image preview
  const photoInput = document.getElementById('admin-photo');
  const previewImg = document.getElementById('admin-photo-preview');

  if (photoInput && previewImg) {
    photoInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (loadEvt) => {
        compressImageForStorage(loadEvt.target.result).then((compressedDataUrl) => {
          previewImg.src = compressedDataUrl;
          previewImg.style.display = 'block';
        });
      };
      reader.readAsDataURL(file);
    });
  }

  // Form submission
  const form = document.getElementById('admin-add-product-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      saveNewProductFromForm();
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
