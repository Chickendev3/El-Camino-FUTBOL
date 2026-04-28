/**
 * fotos.js — El Camino | Galería Personal
 * ═══════════════════════════════════════════════════════════════
 * Maneja: carga de archivos, persistencia localStorage,
 * renderizado de galería, filtros, lightbox y notificaciones.
 * ═══════════════════════════════════════════════════════════════
 */

'use strict';

// ── Constantes ──────────────────────────────────────────────────
const LS_KEY       = 'elcamino_gallery_v2';
const MAX_FILE_MB  = 25; // Límite en MB para base64
const CATEGORY_LABELS = {
  all:            'Todos',
  destacadas:     '⭐ Destacadas',
  partidos:       '⚽ Partidos',
  entrenamientos: '💪 Entrenamientos',
  progreso:       '📈 Progreso',
  recuerdos:      '❤️ Recuerdos',
};

// ── Estado ───────────────────────────────────────────────────────
let state = {
  items:         [],      // Array de objetos multimedia
  currentFilter: 'all',   // Categoría activa
  lightboxIndex: -1,       // Índice actual en lightbox
  pendingFile:   null,     // Archivo seleccionado pendiente
};

// ── DOM Refs ─────────────────────────────────────────────────────
const $ = id => document.getElementById(id);

const DOM = {
  dropZone:       $('dropZone'),
  fileInput:      $('fileInput'),
  uploadPreview:  $('uploadPreview'),
  previewMedia:   $('previewMedia'),
  mediaTitle:     $('mediaTitle'),
  mediaDesc:      $('mediaDesc'),
  mediaCategory:  $('mediaCategory'),
  btnCancel:      $('btnCancel'),
  btnUpload:      $('btnUpload'),
  galleryGrid:    $('galleryGrid'),
  galleryEmpty:   $('galleryEmpty'),
  filterBtns:     document.querySelectorAll('.filter-btn'),
  lightbox:       $('lightbox'),
  lightboxOverlay:$('lightboxOverlay'),
  lightboxClose:  $('lightboxClose'),
  lightboxPrev:   $('lightboxPrev'),
  lightboxNext:   $('lightboxNext'),
  lightboxMedia:  $('lightboxMedia'),
  lightboxTitle:  $('lightboxTitle'),
  lightboxDesc:   $('lightboxDesc'),
  lightboxCat:    $('lightboxCategory'),
  lightboxDelete: $('lightboxDelete'),
  toastContainer: $('toastContainer'),
  statTotal:      $('statTotal'),
  statFotos:      $('statFotos'),
  statVideos:     $('statVideos'),
  hamburger:      $('hamburger'),
  navLinks:       $('navLinks'),
};

// ═══════════════════════════════════════════════════════════════
// PERSISTENCIA — localStorage
// ═══════════════════════════════════════════════════════════════

/**
 * Carga los items desde localStorage.
 * Retorna un array vacío si no hay datos o si hay error.
 */
function loadFromStorage() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.warn('[Fotos] Error leyendo localStorage:', e);
    return [];
  }
}

/**
 * Guarda el array de items en localStorage.
 */
function saveToStorage() {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(state.items));
  } catch (e) {
    // Puede ocurrir si el base64 supera la cuota del navegador
    console.error('[Fotos] Error guardando en localStorage:', e);
    showToast('⚠️ El archivo es demasiado grande para guardar. Intentá con uno más pequeño.', 'error');
  }
}

// ═══════════════════════════════════════════════════════════════
// ESTADÍSTICAS — contador del hero
// ═══════════════════════════════════════════════════════════════
function updateStats() {
  const fotos  = state.items.filter(i => i.type === 'image').length;
  const videos = state.items.filter(i => i.type === 'video').length;
  DOM.statTotal.textContent  = state.items.length;
  DOM.statFotos.textContent  = fotos;
  DOM.statVideos.textContent = videos;
}

// ═══════════════════════════════════════════════════════════════
// RENDERIZADO — galería
// ═══════════════════════════════════════════════════════════════

/**
 * Renderiza TODOS los items de state.items en el grid.
 * Llamado al inicio y cada vez que se agrega/elimina un item.
 */
function renderGallery() {
  // Limpiar cards existentes (mantener el empty state)
  const existing = DOM.galleryGrid.querySelectorAll('.gallery-card');
  existing.forEach(el => el.remove());

  if (state.items.length === 0) {
    DOM.galleryEmpty.style.display = 'flex';
    updateStats();
    return;
  }

  DOM.galleryEmpty.style.display = 'none';

  // Renderizar cada item con delay escalonado
  state.items.forEach((item, index) => {
    const card = createCard(item, index);
    card.style.animationDelay = `${index * 0.05}s`;
    DOM.galleryGrid.appendChild(card);
  });

  // Aplicar filtro activo
  applyFilter(state.currentFilter, false);
  updateStats();
}

/**
 * Crea el elemento DOM de una card de galería.
 */
function createCard(item, index) {
  const card = document.createElement('div');
  card.className = 'gallery-card';
  card.dataset.index    = index;
  card.dataset.category = item.category;

  // Media (imagen o video)
  let mediaEl;
  if (item.type === 'image') {
    mediaEl = document.createElement('img');
    mediaEl.className = 'gallery-card__media';
    mediaEl.src = item.src;
    mediaEl.alt = item.title || 'Foto';
    mediaEl.loading = 'lazy';
  } else {
    mediaEl = document.createElement('video');
    mediaEl.className = 'gallery-card__media';
    mediaEl.src = item.src;
    mediaEl.muted = true;
    mediaEl.loop  = true;
    mediaEl.preload = 'metadata';
    // Play on hover
    card.addEventListener('mouseenter', () => mediaEl.play().catch(() => {}));
    card.addEventListener('mouseleave', () => { mediaEl.pause(); mediaEl.currentTime = 0; });
  }

  // Tipo badge
  const typeIcon = document.createElement('div');
  typeIcon.className = 'gallery-card__type';
  typeIcon.innerHTML = item.type === 'video'
    ? '<i class="fas fa-play"></i>'
    : '<i class="fas fa-image"></i>';

  // Overlay
  const overlay = document.createElement('div');
  overlay.className = 'gallery-card__overlay';
  overlay.innerHTML = `
    <span class="gallery-card__badge">${CATEGORY_LABELS[item.category] || item.category}</span>
    <div class="gallery-card__title">${escapeHtml(item.title || 'Sin título')}</div>
    ${item.description ? `<div class="gallery-card__desc">${escapeHtml(item.description)}</div>` : ''}
    <div class="gallery-card__actions">
      <button class="card-action-btn card-action-btn--view" data-action="view">
        <i class="fas fa-expand"></i> Ver
      </button>
      <button class="card-action-btn card-action-btn--delete" data-action="delete">
        <i class="fas fa-trash"></i>
      </button>
    </div>
  `;

  card.appendChild(mediaEl);
  card.appendChild(typeIcon);
  card.appendChild(overlay);

  // Eventos
  card.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-action]');
    if (!btn) {
      openLightbox(index);
      return;
    }
    if (btn.dataset.action === 'view')   openLightbox(index);
    if (btn.dataset.action === 'delete') deleteItem(index, card);
  });

  return card;
}

// ═══════════════════════════════════════════════════════════════
// FILTRADO
// ═══════════════════════════════════════════════════════════════
function applyFilter(filter, animate = true) {
  state.currentFilter = filter;

  // Actualizar botones
  DOM.filterBtns.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.filter === filter);
  });

  // Mostrar/ocultar cards
  const cards = DOM.galleryGrid.querySelectorAll('.gallery-card');
  let visible = 0;

  cards.forEach(card => {
    const match = filter === 'all' || card.dataset.category === filter;
    if (match) {
      card.classList.remove('hidden');
      if (animate) {
        card.style.animation = 'none';
        card.offsetHeight; // Reflow
        card.style.animation = '';
      }
      visible++;
    } else {
      card.classList.add('hidden');
    }
  });

  // Mostrar empty si no hay resultados con ese filtro
  DOM.galleryEmpty.style.display = (visible === 0 && state.items.length > 0) ? 'flex' : (state.items.length === 0 ? 'flex' : 'none');
}

// ═══════════════════════════════════════════════════════════════
// LIGHTBOX
// ═══════════════════════════════════════════════════════════════
function openLightbox(index) {
  const filteredItems = getFilteredItems();
  const filteredIndex = filteredItems.findIndex(fi => fi._originalIndex === index);
  state.lightboxIndex = filteredIndex >= 0 ? filteredIndex : 0;
  renderLightbox(filteredItems);
  DOM.lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function getFilteredItems() {
  return state.items
    .map((item, i) => ({ ...item, _originalIndex: i }))
    .filter(item => state.currentFilter === 'all' || item.category === state.currentFilter);
}

function renderLightbox(filteredItems) {
  const item = filteredItems[state.lightboxIndex];
  if (!item) return;

  DOM.lightboxMedia.innerHTML = '';

  let media;
  if (item.type === 'image') {
    media = document.createElement('img');
    media.src = item.src;
    media.alt = item.title || 'Foto';
  } else {
    media = document.createElement('video');
    media.src = item.src;
    media.controls = true;
    media.autoplay = true;
  }

  DOM.lightboxMedia.appendChild(media);
  DOM.lightboxTitle.textContent    = item.title || 'Sin título';
  DOM.lightboxDesc.textContent     = item.description || '';
  DOM.lightboxCat.textContent      = CATEGORY_LABELS[item.category] || item.category;

  // Guardar índice original para eliminar
  DOM.lightboxDelete.dataset.originalIndex = item._originalIndex;

  // Nav arrows
  DOM.lightboxPrev.style.opacity = state.lightboxIndex > 0 ? '1' : '0.2';
  DOM.lightboxNext.style.opacity = state.lightboxIndex < filteredItems.length - 1 ? '1' : '0.2';
  DOM.lightboxPrev.disabled = state.lightboxIndex === 0;
  DOM.lightboxNext.disabled = state.lightboxIndex === filteredItems.length - 1;
}

function closeLightbox() {
  DOM.lightbox.classList.remove('open');
  document.body.style.overflow = '';
  // Pausar videos
  const video = DOM.lightboxMedia.querySelector('video');
  if (video) video.pause();
}

function navigateLightbox(dir) {
  const filteredItems = getFilteredItems();
  const newIndex = state.lightboxIndex + dir;
  if (newIndex < 0 || newIndex >= filteredItems.length) return;
  state.lightboxIndex = newIndex;
  renderLightbox(filteredItems);
}

// ═══════════════════════════════════════════════════════════════
// SUBIDA DE ARCHIVO
// ═══════════════════════════════════════════════════════════════
function handleFile(file) {
  if (!file) return;

  // Validar tipo
  const isImage = file.type.startsWith('image/');
  const isVideo = file.type.startsWith('video/');

  if (!isImage && !isVideo) {
    showToast('⚠️ Tipo de archivo no soportado. Usá imagen o video.', 'error');
    return;
  }

  // Validar tamaño
  const sizeMB = file.size / (1024 * 1024);
  if (sizeMB > MAX_FILE_MB) {
    showToast(`⚠️ Archivo muy grande (${sizeMB.toFixed(1)}MB). Máximo ${MAX_FILE_MB}MB.`, 'error');
    return;
  }

  state.pendingFile = { file, type: isImage ? 'image' : 'video' };

  // Mostrar preview
  DOM.uploadPreview.style.display = 'grid';
  DOM.dropZone.style.display = 'none';
  DOM.previewMedia.innerHTML = '';

  const reader = new FileReader();
  reader.onload = (e) => {
    const src = e.target.result;
    state.pendingFile.src = src;

    let mediaEl;
    if (isImage) {
      mediaEl = document.createElement('img');
      mediaEl.src = src;
      mediaEl.style.cssText = 'width:100%;height:100%;object-fit:cover;';
    } else {
      mediaEl = document.createElement('video');
      mediaEl.src = src;
      mediaEl.muted = true;
      mediaEl.loop  = true;
      mediaEl.autoplay = true;
      mediaEl.style.cssText = 'width:100%;height:100%;object-fit:cover;';
    }

    DOM.previewMedia.appendChild(mediaEl);
  };

  reader.readAsDataURL(file);
}

function resetUploadUI() {
  DOM.uploadPreview.style.display = 'none';
  DOM.dropZone.style.display = 'block';
  DOM.previewMedia.innerHTML = '';
  DOM.mediaTitle.value = '';
  DOM.mediaDesc.value  = '';
  DOM.mediaCategory.selectedIndex = 0;
  DOM.fileInput.value  = '';
  state.pendingFile = null;
}

function saveItem() {
  if (!state.pendingFile || !state.pendingFile.src) {
    showToast('⚠️ No hay archivo seleccionado.', 'error');
    return;
  }

  const title = DOM.mediaTitle.value.trim();
  if (!title) {
    showToast('✏️ Escribí un título para el contenido.', 'error');
    DOM.mediaTitle.focus();
    return;
  }

  const newItem = {
    id:          Date.now(),
    src:         state.pendingFile.src,
    type:        state.pendingFile.type,
    title:       title,
    description: DOM.mediaDesc.value.trim(),
    category:    DOM.mediaCategory.value,
    createdAt:   new Date().toISOString(),
  };

  // Agregar al inicio para que aparezca primero
  state.items.unshift(newItem);
  saveToStorage();
  renderGallery();
  resetUploadUI();

  showToast('✅ ¡Guardado correctamente!', 'success');

  // Scroll a la galería
  setTimeout(() => {
    $('gallerySection').scrollIntoView({ behavior: 'smooth' });
  }, 400);
}

// ═══════════════════════════════════════════════════════════════
// ELIMINAR
// ═══════════════════════════════════════════════════════════════
function deleteItem(index, cardEl) {
  if (!confirm('¿Eliminar este elemento de la galería?')) return;

  // Animación de salida
  if (cardEl) {
    cardEl.style.transition = 'all 0.3s ease';
    cardEl.style.transform  = 'scale(0.8)';
    cardEl.style.opacity    = '0';
    setTimeout(() => {
      state.items.splice(index, 1);
      saveToStorage();
      renderGallery();
    }, 300);
  } else {
    state.items.splice(index, 1);
    saveToStorage();
    renderGallery();
  }

  showToast('🗑️ Elemento eliminado.', 'success');
  closeLightbox();
}

// ═══════════════════════════════════════════════════════════════
// TOAST NOTIFICATIONS
// ═══════════════════════════════════════════════════════════════
function showToast(message, type = 'success') {
  const icon  = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle';
  const toast = document.createElement('div');
  toast.className = `toast toast--${type}`;
  toast.innerHTML = `<i class="fas ${icon}"></i><span>${message}</span>`;

  DOM.toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = 'toastOut 0.4s cubic-bezier(0.4,0,0.2,1) forwards';
    setTimeout(() => toast.remove(), 400);
  }, 3500);
}

// ═══════════════════════════════════════════════════════════════
// UTILIDADES
// ═══════════════════════════════════════════════════════════════
function escapeHtml(str) {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

// ═══════════════════════════════════════════════════════════════
// DRAG & DROP
// ═══════════════════════════════════════════════════════════════
function initDragDrop() {
  const dz = DOM.dropZone;

  dz.addEventListener('dragover', e => {
    e.preventDefault();
    dz.classList.add('drag-over');
  });

  dz.addEventListener('dragleave', e => {
    if (!dz.contains(e.relatedTarget)) {
      dz.classList.remove('drag-over');
    }
  });

  dz.addEventListener('drop', e => {
    e.preventDefault();
    dz.classList.remove('drag-over');
    const file = e.dataTransfer.files[0];
    handleFile(file);
  });

  // Click en el area (excepto el botón)
  dz.addEventListener('click', e => {
    if (e.target.closest('.btn-select')) return;
    DOM.fileInput.click();
  });
}

// ═══════════════════════════════════════════════════════════════
// KEYBOARD NAVIGATION
// ═══════════════════════════════════════════════════════════════
function initKeyboard() {
  document.addEventListener('keydown', e => {
    if (!DOM.lightbox.classList.contains('open')) return;
    if (e.key === 'Escape')      closeLightbox();
    if (e.key === 'ArrowLeft')   navigateLightbox(-1);
    if (e.key === 'ArrowRight')  navigateLightbox(1);
  });
}

// ═══════════════════════════════════════════════════════════════
// NAVBAR MOBILE
// ═══════════════════════════════════════════════════════════════
function initNavbar() {
  if (!DOM.hamburger || !DOM.navLinks) return;

  DOM.hamburger.addEventListener('click', () => {
    DOM.navLinks.classList.toggle('open');
  });

  // Cerrar al hacer click en link
  DOM.navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => DOM.navLinks.classList.remove('open'));
  });
}

// ═══════════════════════════════════════════════════════════════
// INICIALIZACIÓN PRINCIPAL
// ═══════════════════════════════════════════════════════════════

/**
 * Punto de entrada de la aplicación.
 * 1. Carga datos desde localStorage
 * 2. Renderiza la galería (CRÍTICO: nunca olvidar este paso)
 * 3. Registra todos los event listeners
 */
function init() {
  // ── 1. Cargar datos guardados ──────────────────────────────
  state.items = loadFromStorage();

  // ── 2. Renderizar galería con datos persistidos ────────────
  renderGallery();

  // ── 3. Drag & Drop ────────────────────────────────────────
  initDragDrop();

  // ── 4. Input de archivo ───────────────────────────────────
  DOM.fileInput.addEventListener('change', e => {
    handleFile(e.target.files[0]);
  });

  // ── 5. Formulario de subida ───────────────────────────────
  DOM.btnUpload.addEventListener('click', saveItem);
  DOM.btnCancel.addEventListener('click', resetUploadUI);

  // ── 6. Filtros ────────────────────────────────────────────
  DOM.filterBtns.forEach(btn => {
    btn.addEventListener('click', () => applyFilter(btn.dataset.filter));
  });

  // ── 7. Lightbox controls ──────────────────────────────────
  DOM.lightboxClose.addEventListener('click', closeLightbox);
  DOM.lightboxOverlay.addEventListener('click', closeLightbox);

  DOM.lightboxPrev.addEventListener('click', () => navigateLightbox(-1));
  DOM.lightboxNext.addEventListener('click', () => navigateLightbox(1));

  DOM.lightboxDelete.addEventListener('click', () => {
    const idx = parseInt(DOM.lightboxDelete.dataset.originalIndex, 10);
    if (!isNaN(idx)) deleteItem(idx);
  });

  // ── 8. Keyboard ───────────────────────────────────────────
  initKeyboard();

  // ── 9. Navbar mobile ─────────────────────────────────────
  initNavbar();

  // ── 10. Prevenir envío con Enter en inputs ────────────────
  [DOM.mediaTitle, DOM.mediaDesc].forEach(el => {
    el.addEventListener('keydown', e => {
      if (e.key === 'Enter' && e.target === DOM.mediaTitle) {
        e.preventDefault();
        DOM.mediaDesc.focus();
      }
    });
  });

  console.log(`[Fotos] Inicializado. ${state.items.length} items cargados desde localStorage.`);
}

// ── Arrancar cuando el DOM esté listo ───────────────────────────
document.addEventListener('DOMContentLoaded', init);
