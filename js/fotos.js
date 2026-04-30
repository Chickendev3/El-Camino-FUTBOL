/**
 * fotos.js — El Camino | Galería Visual del Futbolista
 * ═══════════════════════════════════════════════════════════════
 * Versión optimizada v3.0
 * - Compresión de imágenes vía canvas (max 1920px, max 5MB)
 * - Videos: solo metadata + objectURL temporal (NO base64)
 * - Persistencia metadata-only en localStorage (sin blobs)
 * - Lazy loading nativo en galería
 * - Paginación (PAGE_SIZE items por página)
 * - Lightbox con audio, teclado y swipe móvil
 * - Sistema de tags, highlight y categorías extendidas
 * - Stats de progreso mensual
 * ═══════════════════════════════════════════════════════════════
 */

'use strict';

/* ═══════════════════ CONSTANTES ══════════════════════════════ */
const LS_KEY        = 'elcamino_gallery_v3';
const PAGE_SIZE     = 18;        // Items por página
const IMG_MAX_W     = 1920;      // px máximo al comprimir
const IMG_QUALITY   = 0.82;      // Calidad JPEG comprimido
const IMG_MAX_BYTES = 5  * 1024 * 1024;  // 5 MB imágenes originales
const VID_MAX_BYTES = 50 * 1024 * 1024;  // 50 MB videos

const CATEGORY_MAP = {
  entrenamiento: { label: 'Entrenamiento', icon: 'fa-dumbbell' },
  partido:       { label: 'Partido',       icon: 'fa-futbol' },
  fisico:        { label: 'Físico',        icon: 'fa-running' },
  tecnica:       { label: 'Técnica',       icon: 'fa-crosshairs' },
  mentalidad:    { label: 'Mentalidad',    icon: 'fa-brain' },
  progreso:      { label: 'Progreso',      icon: 'fa-chart-line' },
};

const MONTH_NAMES = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];

/* ═══════════════════ ESTADO ══════════════════════════════════ */
const state = {
  items:         [],        // Todos los items (metadata)
  currentCat:    'all',     // Categoría activa
  currentType:   'all',     // Tipo activo (all|image|video)
  currentSort:   'newest',  // Orden activo
  page:          1,         // Página actual
  lbIndex:       -1,        // Índice en lightbox (sobre filtrado)
  lbFiltered:    [],        // Items filtrados para lightbox nav
  pendingFile:   null,      // { file, type, objectURL, compressedDataURL }
  tags:          [],        // Tags del formulario actual
  touchStartX:   0,         // Para swipe en lightbox
};

/* ═══════════════════ DOM REFS ════════════════════════════════ */
const $ = id => document.getElementById(id);

/* ═══════════════════════════════════════════════════════════════
   PERSISTENCIA — guarda solo metadata, nunca blobs de video
   ═══════════════════════════════════════════════════════════════ */

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    // Limpiar items de video sin src guardado (solo tenían objectURL)
    return parsed.filter(item => item.type === 'image' ? !!item.src : true);
  } catch (e) {
    console.warn('[Fotos] Error cargando localStorage:', e);
    return [];
  }
}

function saveToStorage() {
  try {
    // Solo guardar imágenes con src (dataURL comprimido) y videos con metadata
    const toSave = state.items.map(item => {
      if (item.type === 'video') {
        // Videos: guardamos todo EXCEPTO objectURL (temporal) y no guardamos base64
        const { objectURL, src, ...meta } = item;
        return { ...meta, type: 'video', noSrc: true };
      }
      return item;
    });
    localStorage.setItem(LS_KEY, JSON.stringify(toSave));
  } catch (e) {
    console.error('[Fotos] Error guardando en localStorage:', e);
    // Puede pasar si hay muchas imágenes grandes — notificar al usuario
    showToast('⚠️ Espacio de almacenamiento lleno. Eliminá algunos archivos.', 'error');
  }
}

/* ═══════════════════════════════════════════════════════════════
   COMPRESIÓN DE IMÁGENES — canvas, asíncrono, no bloquea UI
   ═══════════════════════════════════════════════════════════════ */

/**
 * Comprime una imagen usando canvas.
 * Retorna una Promise<string> con el dataURL resultante.
 * Si la imagen es menor al target, retorna el original.
 */
function compressImage(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      URL.revokeObjectURL(url);

      let { width, height } = img;

      // Redimensionar si es necesario
      if (width > IMG_MAX_W) {
        const ratio = IMG_MAX_W / width;
        width  = IMG_MAX_W;
        height = Math.round(height * ratio);
      }

      const canvas = document.createElement('canvas');
      canvas.width  = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);

      const dataURL = canvas.toDataURL('image/jpeg', IMG_QUALITY);
      resolve(dataURL);
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('No se pudo leer la imagen'));
    };

    img.src = url;
  });
}

/* ═══════════════════════════════════════════════════════════════
   MANEJO DE ARCHIVOS
   ═══════════════════════════════════════════════════════════════ */

function handleFile(file) {
  if (!file) return;

  const isImage = file.type.startsWith('image/');
  const isVideo = file.type.startsWith('video/');

  if (!isImage && !isVideo) {
    showToast('❌ Formato no soportado. Usá JPG, PNG, GIF, MP4, MOV o WEBM.', 'error');
    return;
  }

  // Validar tamaño
  if (isImage && file.size > IMG_MAX_BYTES) {
    showToast(`⚠️ La imagen supera 5 MB (${(file.size/1024/1024).toFixed(1)} MB). Elegí una más pequeña.`, 'error');
    return;
  }
  if (isVideo && file.size > VID_MAX_BYTES) {
    showToast(`⚠️ El video supera 50 MB (${(file.size/1024/1024).toFixed(1)} MB). Elegí un video más corto.`, 'error');
    return;
  }

  showProgress(true, 'Procesando archivo...');

  if (isImage) {
    // Comprimir imagen en background
    compressImage(file)
      .then(dataURL => {
        state.pendingFile = { file, type: 'image', src: dataURL };
        showUploadPreview();
        showProgress(false);
      })
      .catch(err => {
        showToast('❌ Error al procesar la imagen.', 'error');
        showProgress(false);
        console.error('[Fotos] Error comprimiendo imagen:', err);
      });
  } else {
    // Video: crear objectURL temporal para preview (no convertir a base64)
    const objectURL = URL.createObjectURL(file);
    state.pendingFile = { file, type: 'video', objectURL };
    showUploadPreview();
    showProgress(false);
  }
}

function showProgress(visible, label = 'Procesando...') {
  const progressEl = $('dzProgress');
  const labelEl    = $('dzProgressLabel');
  if (!progressEl) return;
  progressEl.style.display = visible ? 'flex' : 'none';
  if (labelEl) labelEl.textContent = label;
}

/* ═══════════════════════════════════════════════════════════════
   UPLOAD UI
   ═══════════════════════════════════════════════════════════════ */

function showUploadPreview() {
  const dz      = $('dropZone');
  const panel   = $('uploadPreviewPanel');
  const media   = $('uppMedia');

  if (!state.pendingFile) return;

  dz.style.display    = 'none';
  panel.style.display = 'grid';
  media.innerHTML     = '';

  if (state.pendingFile.type === 'image') {
    const img = document.createElement('img');
    img.src   = state.pendingFile.src;
    img.style.cssText = 'width:100%;height:100%;object-fit:cover;';
    media.appendChild(img);
  } else {
    const video = document.createElement('video');
    video.src     = state.pendingFile.objectURL;
    // Preview muted (el usuario lo ve para confirmar)
    video.muted   = true;
    video.loop    = true;
    video.autoplay = true;
    video.playsInline = true;
    video.style.cssText = 'width:100%;height:100%;object-fit:cover;';
    media.appendChild(video);
  }
}

function resetUploadUI() {
  const dz    = $('dropZone');
  const panel = $('uploadPreviewPanel');

  // Revocar objectURL si existía
  if (state.pendingFile?.objectURL) {
    URL.revokeObjectURL(state.pendingFile.objectURL);
  }
  state.pendingFile = null;
  state.tags        = [];

  dz.style.display    = 'block';
  panel.style.display = 'none';
  $('uppMedia').innerHTML = '';
  $('mediaTitle').value   = '';
  $('mediaDesc').value    = '';
  $('mediaCategory').selectedIndex = 0;
  $('mediaHighlight').checked      = false;
  $('mediaTags').value    = '';
  renderTagChips();
  $('fileInput').value = '';
}

function saveItem() {
  if (!state.pendingFile) {
    showToast('⚠️ No hay archivo seleccionado.', 'error');
    return;
  }

  const title = $('mediaTitle').value.trim();
  if (!title) {
    showToast('✏️ Escribí un título para el contenido.', 'error');
    $('mediaTitle').focus();
    return;
  }

  const isHighlight = $('mediaHighlight').checked;
  const category    = $('mediaCategory').value;
  const desc        = $('mediaDesc').value.trim();

  let newItem = {
    id:          Date.now(),
    type:        state.pendingFile.type,
    title,
    description: desc,
    category,
    highlight:   isHighlight,
    tags:        [...state.tags],
    createdAt:   new Date().toISOString(),
  };

  if (state.pendingFile.type === 'image') {
    newItem.src = state.pendingFile.src; // dataURL comprimida
  } else {
    // Videos: no guardamos el src permanentemente (objectURL es temporal)
    // El usuario sabe que los videos se pierden al recargar — se muestra aviso
    newItem.noSrc     = true;
    newItem.fileName  = state.pendingFile.file.name;
    newItem.fileSize  = state.pendingFile.file.size;
    // Guardamos objectURL solo en memoria para esta sesión
    newItem.objectURL = state.pendingFile.objectURL;
    state.pendingFile.objectURL = null; // ya no es "nuestro" para revocar
  }

  // Destacadas van primero
  if (isHighlight) {
    state.items.unshift(newItem);
  } else {
    state.items.unshift(newItem);
  }

  saveToStorage();
  renderGallery();
  updateStats();
  updateProgressSection();
  resetUploadUI();

  showToast('✅ ¡Guardado correctamente!', 'success');

  setTimeout(() => {
    $('gallerySection').scrollIntoView({ behavior: 'smooth' });
  }, 400);
}

/* ═══════════════════════════════════════════════════════════════
   TAGS
   ═══════════════════════════════════════════════════════════════ */

function addTag(raw) {
  const cleaned = raw.replace(/[^a-záéíóúüñA-ZÁÉÍÓÚÜÑA-Za-z0-9_]/g, '').slice(0, 20);
  if (!cleaned || state.tags.includes(cleaned) || state.tags.length >= 6) return;
  state.tags.push(cleaned);
  renderTagChips();
}

function removeTag(tag) {
  state.tags = state.tags.filter(t => t !== tag);
  renderTagChips();
}

function renderTagChips() {
  const list = $('tagsList');
  if (!list) return;
  list.innerHTML = '';
  state.tags.forEach(tag => {
    const chip = document.createElement('span');
    chip.className = 'tag-chip';
    chip.innerHTML = `#${escapeHtml(tag)} <button type="button" aria-label="Quitar ${tag}" data-tag="${escapeHtml(tag)}">&times;</button>`;
    chip.querySelector('button').addEventListener('click', () => removeTag(tag));
    list.appendChild(chip);
  });
}

/* ═══════════════════════════════════════════════════════════════
   RENDERIZADO GALERÍA
   ═══════════════════════════════════════════════════════════════ */

function getFilteredItems() {
  let items = [...state.items];

  // Filtro por tipo
  if (state.currentType !== 'all') {
    items = items.filter(i => i.type === state.currentType);
  }

  // Filtro por categoría
  if (state.currentCat !== 'all') {
    items = items.filter(i => i.category === state.currentCat);
  }

  // Ordenamiento
  switch (state.currentSort) {
    case 'newest':
      items.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
      break;
    case 'oldest':
      items.sort((a,b) => new Date(a.createdAt) - new Date(b.createdAt));
      break;
    case 'highlights':
      items.sort((a,b) => (b.highlight ? 1 : 0) - (a.highlight ? 1 : 0));
      break;
  }

  return items;
}

function renderGallery(resetPage = true) {
  const grid     = $('galleryGrid');
  const emptyEl  = $('galleryEmpty');
  const loadWrap = $('loadMoreWrap');

  if (resetPage) state.page = 1;

  // Limpiar cards previas
  grid.querySelectorAll('.g-card').forEach(el => el.remove());

  const filtered = getFilteredItems();
  state.lbFiltered = filtered; // para navegación en lightbox

  if (filtered.length === 0) {
    emptyEl.style.display  = 'flex';
    loadWrap.style.display = 'none';
    return;
  }

  emptyEl.style.display = 'none';

  const pageItems = filtered.slice(0, state.page * PAGE_SIZE);
  const hasMore   = filtered.length > pageItems.length;

  pageItems.forEach((item, idx) => {
    const card = createCard(item, idx);
    card.style.animationDelay = `${(idx % PAGE_SIZE) * 0.04}s`;
    grid.appendChild(card);
  });

  loadWrap.style.display = hasMore ? 'block' : 'none';
}

function createCard(item, visibleIndex) {
  const card = document.createElement('div');
  card.className = 'g-card';
  card.dataset.id = item.id;
  if (item.highlight) card.classList.add('is-highlight');

  // Media
  if (item.type === 'image' && item.src) {
    const img = document.createElement('img');
    img.className = 'g-card__media';
    img.src       = item.src;
    img.alt       = item.title || 'Foto';
    img.loading   = 'lazy';
    img.decoding  = 'async';
    card.appendChild(img);
  } else if (item.type === 'video' && item.objectURL) {
    const video = document.createElement('video');
    video.className  = 'g-card__media';
    video.src        = item.objectURL;
    video.muted      = true;
    video.loop       = true;
    video.preload    = 'metadata';
    video.playsInline = true;
    // Play on hover — sin audio (solo preview)
    card.addEventListener('mouseenter', () => video.play().catch(() => {}));
    card.addEventListener('mouseleave', () => { video.pause(); video.currentTime = 0; });
    card.appendChild(video);
  } else {
    // Placeholder para videos sin objectURL (recargados desde localStorage)
    const placeholder = document.createElement('div');
    placeholder.style.cssText = `
      position:absolute; inset:0; display:flex; align-items:center;
      justify-content:center; flex-direction:column; gap:0.5rem;
      background:var(--surface2); color:var(--muted2);
    `;
    placeholder.innerHTML = `
      <i class="fas fa-video" style="font-size:2rem; opacity:0.4"></i>
      <span style="font-size:0.7rem; text-align:center; padding:0 1rem; opacity:0.5">
        Video no disponible<br>en esta sesión
      </span>
    `;
    card.appendChild(placeholder);
  }

  // Tipo badge
  const typeBadge = document.createElement('div');
  typeBadge.className = 'g-card__type';
  typeBadge.innerHTML = item.type === 'video'
    ? '<i class="fas fa-play"></i>'
    : '<i class="fas fa-camera"></i>';
  card.appendChild(typeBadge);

  // Highlight badge
  if (item.highlight) {
    const hBadge = document.createElement('div');
    hBadge.className = 'g-card__highlight';
    hBadge.innerHTML = '<i class="fas fa-star"></i>';
    card.appendChild(hBadge);
  }

  // Overlay con info
  const catInfo = CATEGORY_MAP[item.category] || { label: item.category };
  const tagsHtml = item.tags?.length
    ? `<div class="g-card__tags">${item.tags.map(t => `<span class="g-card__tag">#${escapeHtml(t)}</span>`).join('')}</div>`
    : '';

  const overlay = document.createElement('div');
  overlay.className = 'g-card__overlay';
  overlay.innerHTML = `
    <span class="g-card__cat-badge">${escapeHtml(catInfo.label)}</span>
    <div class="g-card__title">${escapeHtml(item.title || 'Sin título')}</div>
    ${item.description ? `<div class="g-card__desc">${escapeHtml(item.description)}</div>` : ''}
    ${tagsHtml}
    <div class="g-card__actions">
      <button class="g-card__btn" data-action="view" aria-label="Ver en detalle">
        <i class="fas fa-expand"></i> Ver
      </button>
      <button class="g-card__btn g-card__btn--delete" data-action="delete" aria-label="Eliminar">
        <i class="fas fa-trash"></i>
      </button>
    </div>
  `;
  card.appendChild(overlay);

  // Eventos
  card.addEventListener('click', e => {
    const btn = e.target.closest('[data-action]');
    if (!btn) { openLightbox(visibleIndex); return; }
    if (btn.dataset.action === 'view')   openLightbox(visibleIndex);
    if (btn.dataset.action === 'delete') deleteItem(item.id, card);
  });

  return card;
}

/* ═══════════════════════════════════════════════════════════════
   FILTROS
   ═══════════════════════════════════════════════════════════════ */

function setTypeFilter(type) {
  state.currentType = type;
  document.querySelectorAll('.ftype-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.type === type);
  });
  renderGallery();
}

function setCatFilter(cat) {
  state.currentCat = cat;
  document.querySelectorAll('.cat-fbtn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.cat === cat);
    btn.setAttribute('aria-selected', btn.dataset.cat === cat ? 'true' : 'false');
  });
  renderGallery();
}

function setSort(sort) {
  state.currentSort = sort;
  renderGallery();
}

/* ═══════════════════════════════════════════════════════════════
   ESTADÍSTICAS
   ═══════════════════════════════════════════════════════════════ */

function updateStats() {
  const fotos      = state.items.filter(i => i.type === 'image').length;
  const videos     = state.items.filter(i => i.type === 'video').length;
  const highlights = state.items.filter(i => i.highlight).length;

  animateNumber($('statTotal'),      state.items.length);
  animateNumber($('statFotos'),      fotos);
  animateNumber($('statVideos'),     videos);
  animateNumber($('statHighlights'), highlights);
}

function animateNumber(el, target) {
  if (!el) return;
  const start    = parseInt(el.textContent, 10) || 0;
  const duration = 600;
  const startTs  = performance.now();

  const step = ts => {
    const progress = Math.min((ts - startTs) / duration, 1);
    const eased    = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(start + (target - start) * eased);
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

/* ═══════════════════════════════════════════════════════════════
   SECCIÓN DE PROGRESO MENSUAL
   ═══════════════════════════════════════════════════════════════ */

function updateProgressSection() {
  updateProgressStats();
  updateMonthlyTimeline();
}

function updateProgressStats() {
  const grid = $('progressStatsGrid');
  if (!grid) return;

  const entrenamientos = state.items.filter(i => i.category === 'entrenamiento').length;
  const partidos       = state.items.filter(i => i.category === 'partido').length;
  const total          = state.items.length;

  // Calcular racha mensual actual
  const now     = new Date();
  const thisMonth = now.getMonth();
  const thisYear  = now.getFullYear();
  const thisMonthCount = state.items.filter(i => {
    const d = new Date(i.createdAt);
    return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
  }).length;

  grid.innerHTML = `
    <div class="pstat-card">
      <div class="pstat-icon green"><i class="fas fa-dumbbell"></i></div>
      <span class="pstat-num" id="pstatEntr">${entrenamientos}</span>
      <span class="pstat-label">Entrenamientos</span>
    </div>
    <div class="pstat-card">
      <div class="pstat-icon orange"><i class="fas fa-futbol"></i></div>
      <span class="pstat-num" id="pstatPart">${partidos}</span>
      <span class="pstat-label">Partidos</span>
    </div>
    <div class="pstat-card">
      <div class="pstat-icon blue"><i class="fas fa-images"></i></div>
      <span class="pstat-num">${total}</span>
      <span class="pstat-label">Total archivos</span>
    </div>
    <div class="pstat-card">
      <div class="pstat-icon accent"><i class="fas fa-calendar-check"></i></div>
      <span class="pstat-num">${thisMonthCount}</span>
      <span class="pstat-label">Este mes</span>
    </div>
  `;
}

function updateMonthlyTimeline() {
  const timeline = $('monthlyTimeline');
  if (!timeline) return;

  if (state.items.length === 0) {
    timeline.innerHTML = '<p style="color:var(--muted2);font-size:0.85rem;padding:1rem 0">Aún no hay contenido registrado.</p>';
    return;
  }

  // Obtener los últimos 12 meses
  const months = [];
  const now    = new Date();
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({ month: d.getMonth(), year: d.getFullYear() });
  }

  // Contar items por mes
  const counts = months.map(({ month, year }) => {
    return state.items.filter(item => {
      const d = new Date(item.createdAt);
      return d.getMonth() === month && d.getFullYear() === year;
    }).length;
  });

  const maxCount = Math.max(...counts, 1);

  timeline.innerHTML = months.map(({ month, year }, i) => {
    const count   = counts[i];
    const pct     = Math.round((count / maxCount) * 100);
    const hasContent = count > 0;
    return `
      <div class="month-block ${hasContent ? 'has-content' : ''}">
        <span class="mb-name">${MONTH_NAMES[month]} ${String(year).slice(2)}</span>
        <span class="mb-count ${hasContent ? 'has-content' : ''}">${count}</span>
        <div class="mb-bar">
          <div class="mb-bar-fill" style="width:${pct}%"></div>
        </div>
      </div>
    `;
  }).join('');
}

/* ═══════════════════════════════════════════════════════════════
   LIGHTBOX
   ═══════════════════════════════════════════════════════════════ */

function openLightbox(filteredIndex) {
  if (filteredIndex < 0 || filteredIndex >= state.lbFiltered.length) return;
  state.lbIndex = filteredIndex;
  renderLightbox();
  const overlay = $('lightboxOverlay');
  overlay.classList.add('open');
  overlay.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  const overlay = $('lightboxOverlay');
  overlay.classList.remove('open');
  overlay.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';

  // Pausar videos al cerrar
  const video = overlay.querySelector('video');
  if (video) { video.pause(); video.src = ''; }
}

function navigateLightbox(dir) {
  const newIndex = state.lbIndex + dir;
  if (newIndex < 0 || newIndex >= state.lbFiltered.length) return;
  state.lbIndex = newIndex;
  renderLightbox();
}

function renderLightbox() {
  const item = state.lbFiltered[state.lbIndex];
  if (!item) return;

  // Actualizar botones prev/next
  $('lbPrev').disabled = state.lbIndex === 0;
  $('lbNext').disabled = state.lbIndex === state.lbFiltered.length - 1;

  // Media
  const mediaWrap = $('lbMediaWrap');
  mediaWrap.innerHTML = '';

  if (item.type === 'image' && item.src) {
    const img  = document.createElement('img');
    img.src    = item.src;
    img.alt    = item.title || 'Imagen';
    mediaWrap.appendChild(img);
  } else if (item.type === 'video' && item.objectURL) {
    const video = document.createElement('video');
    // Controles visibles, audio habilitado (NO muted)
    video.controls   = true;
    video.playsInline = true;
    video.autoplay   = false;
    // Múltiples sources para compatibilidad
    const source = document.createElement('source');
    source.src  = item.objectURL;
    source.type = item.file?.type || 'video/mp4';
    video.appendChild(source);
    mediaWrap.appendChild(video);
  } else {
    mediaWrap.innerHTML = `
      <div style="display:flex;flex-direction:column;align-items:center;gap:1rem;
        color:var(--muted2);padding:3rem;text-align:center;">
        <i class="fas fa-video" style="font-size:3rem;opacity:0.3"></i>
        <p style="font-size:0.9rem;opacity:0.6">
          ${item.type === 'video'
            ? 'El video no está disponible en esta sesión.<br>Los videos deben ser subidos nuevamente al recargar la página.'
            : 'No hay previsualización disponible.'}
        </p>
      </div>
    `;
  }

  // Metadata
  const catInfo = CATEGORY_MAP[item.category] || { label: item.category };

  const topBadges = $('lbTopBadges');
  topBadges.innerHTML = `
    <span class="lb-cat-badge">${escapeHtml(catInfo.label)}</span>
    <span class="lb-type-badge">${item.type === 'video' ? '🎬 Video' : '📷 Foto'}</span>
    ${item.highlight ? '<span class="lb-highlight-badge">⭐ Highlight</span>' : ''}
  `;

  $('lbTitle').textContent = item.title || 'Sin título';
  $('lbDesc').textContent  = item.description || '';

  // Tags
  const lbTags = $('lbTags');
  lbTags.innerHTML = item.tags?.length
    ? item.tags.map(t => `<span class="lb-tag">#${escapeHtml(t)}</span>`).join('')
    : '';

  // Fecha
  const dateStr = item.createdAt
    ? new Date(item.createdAt).toLocaleDateString('es-AR', { day:'numeric', month:'long', year:'numeric' })
    : '';
  $('lbDate').innerHTML = dateStr ? `<i class="fas fa-calendar" style="margin-right:0.4rem;color:var(--muted2)"></i>${dateStr}` : '';

  // Botón highlight
  const hlBtn   = $('lbHighlight');
  const hlLabel = $('lbHighlightLabel');
  if (item.highlight) {
    hlBtn.classList.add('active');
    hlLabel.textContent = 'Quitar Highlight';
  } else {
    hlBtn.classList.remove('active');
    hlLabel.textContent = 'Destacar';
  }
  hlBtn.dataset.id = item.id;

  // Botón eliminar
  $('lbDelete').dataset.id = item.id;
}

/* ═══════════════════════════════════════════════════════════════
   TOGGLE HIGHLIGHT
   ═══════════════════════════════════════════════════════════════ */

function toggleHighlight(id) {
  const item = state.items.find(i => i.id === id);
  if (!item) return;
  item.highlight = !item.highlight;
  saveToStorage();
  renderGallery(false);
  updateStats();
  renderLightbox(); // re-render lightbox con nuevo estado
  showToast(item.highlight ? '⭐ Marcado como Highlight' : '✓ Quitado de Highlights', 'success');
}

/* ═══════════════════════════════════════════════════════════════
   ELIMINAR ITEM
   ═══════════════════════════════════════════════════════════════ */

function deleteItem(id, cardEl) {
  if (!confirm('¿Eliminar este elemento de la galería?')) return;

  const itemIndex = state.items.findIndex(i => i.id === id);
  if (itemIndex === -1) return;

  // Revocar objectURL si existía
  const item = state.items[itemIndex];
  if (item.objectURL) {
    URL.revokeObjectURL(item.objectURL);
  }

  if (cardEl) {
    cardEl.style.transition = 'all 0.3s ease';
    cardEl.style.transform  = 'scale(0.85)';
    cardEl.style.opacity    = '0';
    setTimeout(() => {
      state.items.splice(itemIndex, 1);
      saveToStorage();
      renderGallery(false);
      updateStats();
      updateProgressSection();
    }, 300);
  } else {
    state.items.splice(itemIndex, 1);
    saveToStorage();
    renderGallery(false);
    updateStats();
    updateProgressSection();
  }

  closeLightbox();
  showToast('🗑️ Eliminado correctamente.', 'success');
}

/* ═══════════════════════════════════════════════════════════════
   TOAST
   ═══════════════════════════════════════════════════════════════ */

function showToast(message, type = 'success') {
  const cont  = $('toastCont');
  if (!cont) return;

  const icons = { success: 'fa-check-circle', error: 'fa-exclamation-circle', info: 'fa-info-circle' };
  const toast = document.createElement('div');
  toast.className = `toast toast--${type}`;
  toast.innerHTML = `<i class="fas ${icons[type] || icons.info}"></i><span>${message}</span>`;
  cont.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = 'toastOut 0.4s cubic-bezier(0.4,0,0.2,1) forwards';
    setTimeout(() => toast.remove(), 400);
  }, 3500);
}

/* ═══════════════════════════════════════════════════════════════
   DRAG & DROP
   ═══════════════════════════════════════════════════════════════ */

function initDragDrop() {
  const dz = $('dropZone');
  if (!dz) return;

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
    if (file) handleFile(file);
  });

  // Click en la zona abre el selector
  dz.addEventListener('click', e => {
    if (e.target.closest('#btnSelectFile')) return;
    $('fileInput').click();
  });

  // Accesibilidad: Enter/Space también abren el selector
  dz.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      $('fileInput').click();
    }
  });
}

/* ═══════════════════════════════════════════════════════════════
   KEYBOARD & SWIPE (LIGHTBOX)
   ═══════════════════════════════════════════════════════════════ */

function initKeyboard() {
  document.addEventListener('keydown', e => {
    if (!$('lightboxOverlay').classList.contains('open')) return;
    if (e.key === 'Escape')     closeLightbox();
    if (e.key === 'ArrowLeft')  navigateLightbox(-1);
    if (e.key === 'ArrowRight') navigateLightbox(1);
  });
}

function initSwipe() {
  const container = $('lbContainer');
  if (!container) return;

  container.addEventListener('touchstart', e => {
    state.touchStartX = e.touches[0].clientX;
  }, { passive: true });

  container.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - state.touchStartX;
    if (Math.abs(dx) < 50) return;
    navigateLightbox(dx < 0 ? 1 : -1);
  }, { passive: true });
}

/* ═══════════════════════════════════════════════════════════════
   NAVBAR MOBILE
   ═══════════════════════════════════════════════════════════════ */

function initNavbar() {
  const hamburger = $('hamburger');
  const mobileNav = $('mobileNav');
  const closeBtn  = $('mobileClose');

  if (!hamburger || !mobileNav) return;

  hamburger.addEventListener('click', () => {
    mobileNav.classList.toggle('open');
  });

  closeBtn?.addEventListener('click', () => {
    mobileNav.classList.remove('open');
  });

  mobileNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => mobileNav.classList.remove('open'));
  });
}

/* ═══════════════════════════════════════════════════════════════
   CURSOR PERSONALIZADO (igual que nutricion.js)
   ═══════════════════════════════════════════════════════════════ */

function initCursor() {
  const cursor     = $('cursor');
  const cursorRing = $('cursorRing');
  if (!cursor || !cursorRing) return;

  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top  = my + 'px';
  });

  const animateRing = () => {
    rx += (mx - rx) * 0.15;
    ry += (my - ry) * 0.15;
    cursorRing.style.left = rx + 'px';
    cursorRing.style.top  = ry + 'px';
    requestAnimationFrame(animateRing);
  };
  animateRing();

  // Hover effects
  document.querySelectorAll('button, a, [role="button"]').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursorRing.style.width  = '48px';
      cursorRing.style.height = '48px';
      cursorRing.style.borderColor = 'rgba(61,220,132,0.7)';
    });
    el.addEventListener('mouseleave', () => {
      cursorRing.style.width  = '32px';
      cursorRing.style.height = '32px';
      cursorRing.style.borderColor = 'rgba(61,220,132,0.4)';
    });
  });
}

/* ═══════════════════════════════════════════════════════════════
   SCROLL HERO
   ═══════════════════════════════════════════════════════════════ */

function initHeroScroll() {
  const scrollEl = $('heroScroll');
  if (!scrollEl) return;
  scrollEl.addEventListener('click', () => {
    $('uploadSection').scrollIntoView({ behavior: 'smooth' });
  });
}

/* ═══════════════════════════════════════════════════════════════
   UTILIDADES
   ═══════════════════════════════════════════════════════════════ */

function escapeHtml(str) {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(String(str)));
  return div.innerHTML;
}

/* ═══════════════════════════════════════════════════════════════
   INICIALIZACIÓN PRINCIPAL
   ═══════════════════════════════════════════════════════════════ */

function init() {
  /* 1. Cargar datos desde localStorage */
  state.items = loadFromStorage();

  /* 2. Renderizar galería */
  renderGallery();
  updateStats();
  updateProgressSection();

  /* 3. Drag & Drop */
  initDragDrop();

  /* 4. Input de archivo */
  $('fileInput')?.addEventListener('change', e => {
    const file = e.target.files[0];
    if (file) handleFile(file);
  });

  /* 5. Botón seleccionar archivo */
  $('btnSelectFile')?.addEventListener('click', () => $('fileInput').click());

  /* 6. Formulario de subida */
  $('btnSaveUpload')?.addEventListener('click', saveItem);
  $('btnCancelUpload')?.addEventListener('click', resetUploadUI);

  /* 7. Tags input */
  $('mediaTags')?.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const val = e.target.value.trim().replace(/^#/, '');
      if (val) addTag(val);
      e.target.value = '';
    }
  });
  $('mediaTags')?.addEventListener('blur', e => {
    const val = e.target.value.trim().replace(/^#/, '');
    if (val) { addTag(val); e.target.value = ''; }
  });

  /* 8. Filtros por tipo */
  document.querySelectorAll('.ftype-btn').forEach(btn => {
    btn.addEventListener('click', () => setTypeFilter(btn.dataset.type));
  });

  /* 9. Filtros por categoría */
  document.querySelectorAll('.cat-fbtn').forEach(btn => {
    btn.addEventListener('click', () => setCatFilter(btn.dataset.cat));
  });

  /* 10. Ordenamiento */
  $('sortSelect')?.addEventListener('change', e => setSort(e.target.value));

  /* 11. Load more */
  $('btnLoadMore')?.addEventListener('click', () => {
    state.page++;
    renderGallery(false);
  });

  /* 12. Botón "subir primer archivo" */
  $('btnUploadFirst')?.addEventListener('click', () => {
    $('uploadSection').scrollIntoView({ behavior: 'smooth' });
  });

  /* 13. Lightbox controles */
  $('lbBackdrop')?.addEventListener('click', closeLightbox);
  $('lbClose')?.addEventListener('click', closeLightbox);
  $('lbPrev')?.addEventListener('click', () => navigateLightbox(-1));
  $('lbNext')?.addEventListener('click', () => navigateLightbox(1));

  $('lbHighlight')?.addEventListener('click', e => {
    const id = parseInt(e.currentTarget.dataset.id, 10);
    if (!isNaN(id)) toggleHighlight(id);
  });

  $('lbDelete')?.addEventListener('click', e => {
    const id = parseInt(e.currentTarget.dataset.id, 10);
    if (!isNaN(id)) deleteItem(id);
  });

  /* 14. Keyboard navigation */
  initKeyboard();

  /* 15. Swipe touch */
  initSwipe();

  /* 16. Navbar mobile */
  initNavbar();

  /* 17. Cursor personalizado */
  initCursor();

  /* 18. Hero scroll hint */
  initHeroScroll();

  /* 19. Nota sobre videos al usuario (si tiene items de video guardados sin src) */
  const videosSinSrc = state.items.filter(i => i.type === 'video' && i.noSrc).length;
  if (videosSinSrc > 0) {
    setTimeout(() => {
      showToast(`ℹ️ Tenés ${videosSinSrc} video(s) guardado(s) solo como metadata. Los videos no persisten entre sesiones.`, 'info');
    }, 1500);
  }

  console.log(`[Fotos v3] Listo. ${state.items.length} items cargados.`);
}

document.addEventListener('DOMContentLoaded', init);
