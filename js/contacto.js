/* ════════════════════════════════════════════════════
   contacto.js — Lógica completa de la página
   Proyecto: El Camino al Fútbol Profesional
   ════════════════════════════════════════════════════ */

'use strict';

// ─── STORAGE KEY ───
const STORAGE_KEY = 'elCamino_inbox_messages';   // clave localStorage para mensajes

// ─── ESTADO LOCAL ───
let allMessages    = [];   // todos los mensajes en memoria
let activeMessageId = null; // id del mensaje actualmente visible

/* ══════════════════
   1. NAVBAR
══════════════════ */
const navbar    = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobileNav');
const mobileClose = document.getElementById('mobileClose');
const themeToggle = document.getElementById('themeToggle');
const themeIcon   = document.getElementById('themeIcon');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 30);
});

hamburger.addEventListener('click', () => mobileNav.classList.add('open'));
mobileClose.addEventListener('click', () => mobileNav.classList.remove('open'));
mobileNav.addEventListener('click', e => {
  if (e.target === mobileNav) mobileNav.classList.remove('open');
});

// ─── Tema ───
const savedTheme = localStorage.getItem('elCamino_theme') || 'dark';
document.documentElement.setAttribute('data-theme', savedTheme);
themeIcon.className = savedTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';

themeToggle.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('elCamino_theme', next);
  themeIcon.className = next === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
});

/* ══════════════════
   2. CURSOR
══════════════════ */
const cursor     = document.getElementById('cursor');
const cursorRing = document.getElementById('cursorRing');
let cx = 0, cy = 0, rx = 0, ry = 0;
document.addEventListener('mousemove', e => { cx = e.clientX; cy = e.clientY; });
(function animateCursor() {
  cursor.style.left = cx + 'px';
  cursor.style.top  = cy + 'px';
  rx += (cx - rx) * 0.1;
  ry += (cy - ry) * 0.1;
  cursorRing.style.left = rx + 'px';
  cursorRing.style.top  = ry + 'px';
  requestAnimationFrame(animateCursor);
})();

/* ══════════════════
   3. SCROLL REVEAL
══════════════════ */
const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });
revealEls.forEach(el => revealObserver.observe(el));

/* ══════════════════
   4. BARRAS DE HABILIDADES (animar al entrar en vista)
══════════════════ */
const skillFills = document.querySelectorAll('.skill-fill[data-width]');
const skillObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.style.width = e.target.dataset.width + '%';
      skillObs.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });
skillFills.forEach(el => skillObs.observe(el));

// ─── XP bars ───
const xpFills = document.querySelectorAll('.rep-xp-fill[data-width]');
const xpObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.style.width = e.target.dataset.width + '%';
      xpObs.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });
xpFills.forEach(el => xpObs.observe(el));

/* ══════════════════
   5. DATOS DESDE localStorage (estadísticas y reputación)
══════════════════ */
function loadPlayerStats() {
  // Intentar cargar estadísticas de partidos (si página estadísticas las guarda)
  const statsData = JSON.parse(localStorage.getItem('elCamino_stats') || '{}');
  document.getElementById('statGoals').textContent   = statsData.goles    ?? '—';
  document.getElementById('statAssists').textContent = statsData.asistencias ?? '—';
  document.getElementById('statMatches').textContent = statsData.partidos  ?? '—';
  document.getElementById('statRating').textContent  = statsData.rendimiento ?? '—';

  // XP / Reputación
  const xpData = JSON.parse(localStorage.getItem('elCamino_xp') || '{}');
  const trains  = xpData.entrenamientos ?? 42;
  const matches = xpData.partidos       ?? 18;
  const streak  = xpData.diasActivos    ?? 67;

  document.getElementById('rtrTrainings').textContent = trains;
  document.getElementById('rtrMatches').textContent   = matches;
  document.getElementById('rtrStreak').textContent    = streak;

  // Calcular niveles (simulado — ajustá con tu lógica real)
  const levelTech = Math.min(10, Math.floor(trains / 5));
  const levelFit  = Math.min(10, Math.floor((trains * 0.6 + matches) / 6));
  const levelMind = Math.min(10, Math.floor(streak / 7));

  document.getElementById('repLevelTech').textContent = levelTech || 7;
  document.getElementById('repLevelFit').textContent  = levelFit  || 6;
  document.getElementById('repLevelMind').textContent = levelMind || 9;

  // Último partido para el hero
  const lastMatch = localStorage.getItem('elCamino_lastMatch');
  if (lastMatch) {
    const days = Math.floor((Date.now() - new Date(lastMatch)) / 86400000);
    document.getElementById('lastActivityHero').textContent = days === 0 ? 'HOY' : days + 'd';
  }
}
loadPlayerStats();

/* ══════════════════
   6. FRASES ROTATIVAS
══════════════════ */
const quotes = [
  { text: '"La diferencia entre el campeón y el que casi fue campeón, es lo que hizo cuando nadie miraba."', by: '— Filosofía del Camino' },
  { text: '"Fe sin obras está muerta. Entrena como si todo dependiera de vos, ora como si todo dependiera de Dios."', by: '— Principio del Camino' },
  { text: '"No busco reconocimiento. Busco resultados. El reconocimiento viene solo."', by: '— Mentalidad del Jugador' },
  { text: '"Cada entrenamiento que nadie vio es una deuda que el fútbol te debe."', by: '— El Camino' },
  { text: '"Todo lo puedo en Cristo que me fortalece."', by: '— Filipenses 4:13' },
];
let quoteIdx = 0;
const quoteEl = document.getElementById('rotatingQuote');
if (quoteEl) {
  setInterval(() => {
    quoteIdx = (quoteIdx + 1) % quotes.length;
    quoteEl.style.opacity = '0';
    setTimeout(() => {
      quoteEl.textContent = quotes[quoteIdx].text;
      quoteEl.style.opacity = '1';
    }, 400);
  }, 5000);
  quoteEl.style.transition = 'opacity .4s ease';
}

/* ══════════════════
   7. MODO SCOUT
══════════════════ */
let scoutModeActive = false;
const scoutBanner = document.getElementById('scoutModeBanner');
const scoutBtn    = document.getElementById('scoutModeBtn');

function toggleScoutMode() {
  scoutModeActive = !scoutModeActive;
  document.body.classList.toggle('scout-active', scoutModeActive);
  scoutBanner.classList.toggle('active', scoutModeActive);

  if (scoutModeActive) {
    showToast('info', '🔍 Modo Scout', 'Vista de informe profesional activada');
    scoutBtn.innerHTML = '<i class="fas fa-times"></i> Salir del Modo Scout';
    // Scroll to datos clave
    setTimeout(() => document.getElementById('scoutData').scrollIntoView({ behavior: 'smooth', block: 'start' }), 200);
  } else {
    showToast('success', '✅ Vista Normal', 'Volviste a la vista completa');
    scoutBtn.innerHTML = '<i class="fas fa-binoculars"></i> Modo Scout';
  }
}
window.toggleScoutMode = toggleScoutMode;

/* ══════════════════
   8. TOAST
══════════════════ */
function showToast(type, title, subtitle = '', duration = 3500) {
  const cont = document.getElementById('toastCont');
  const icons = { success: 'fas fa-check-circle', warning: 'fas fa-exclamation-triangle',
                  error: 'fas fa-times-circle', info: 'fas fa-info-circle' };
  const toast = document.createElement('div');
  toast.className = `toast-item ${type}`;
  toast.innerHTML = `
    <i class="${icons[type] || icons.info} toast-icon"></i>
    <div class="toast-txt"><strong>${title}</strong>${subtitle ? `<span>${subtitle}</span>` : ''}</div>
  `;
  cont.appendChild(toast);
  setTimeout(() => {
    toast.classList.add('hide');
    toast.addEventListener('animationend', () => toast.remove());
  }, duration);
}

/* ══════════════════
   9. localStorage — MENSAJES
══════════════════ */

/** Leer mensajes del localStorage */
function getMessages() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch { return []; }
}

/** Guardar mensajes en localStorage */
function saveMessages(msgs) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(msgs));
}

/** Generar ID único */
function genId() {
  return 'msg_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7);
}

/** Agregar un nuevo mensaje */
function addMessage(data) {
  const msgs = getMessages();
  const newMsg = {
    id:      genId(),
    nombre:  data.nombre,
    club:    data.club,
    pais:    data.pais || 'Sin especificar',
    tipo:    data.tipo,
    email:   data.email,
    mensaje: data.mensaje,
    fecha:   new Date().toISOString(),
    leido:   false,
    starred: false,
  };
  msgs.unshift(newMsg); // más reciente primero
  saveMessages(msgs);
  return newMsg;
}

/** Formatear fecha legible */
function formatDate(iso) {
  const d = new Date(iso);
  const now = new Date();
  const diff = Math.floor((now - d) / 60000); // minutos
  if (diff < 1)   return 'Ahora mismo';
  if (diff < 60)  return `hace ${diff} min`;
  if (diff < 1440) return `hace ${Math.floor(diff/60)}h`;
  return d.toLocaleDateString('es-AR', { day:'2-digit', month:'short' });
}

/** Tipo a etiqueta visual */
function tipoToTag(tipo) {
  const map = {
    prueba: 'tag-prueba',
    fichaje: 'tag-fichaje',
    scouting: 'tag-scouting',
    colaboracion: 'tag-colaboracion',
  };
  const labels = { prueba:'Prueba', fichaje:'Fichaje', scouting:'Scouting', colaboracion:'Colaboración' };
  return `<span class="inbox-type-tag ${map[tipo] || 'tag-scouting'}">${labels[tipo] || tipo}</span>`;
}

/* ══════════════════
   10. RENDER INBOX
══════════════════ */
function renderInbox() {
  allMessages = getMessages();
  const list  = document.getElementById('inboxMessagesList');
  const count = document.getElementById('inboxCount');

  // Actualizar badge
  const unread = allMessages.filter(m => !m.leido).length;
  count.textContent = allMessages.length;
  count.style.background = unread > 0 ? 'var(--verde)' : 'var(--gris)';

  if (allMessages.length === 0) {
    list.innerHTML = `
      <div class="inbox-no-messages">
        <i class="fas fa-inbox"></i>
        <p>Sin mensajes todavía</p>
        <span class="inm-hint">Los mensajes de scouts aparecerán aquí</span>
      </div>`;
    return;
  }

  list.innerHTML = allMessages.map(msg => `
    <div class="inbox-message-item ${msg.leido ? '' : 'unread'} ${msg.starred ? 'starred' : ''} ${activeMessageId === msg.id ? 'active' : ''}"
         data-id="${msg.id}" onclick="openMessage('${msg.id}')">
      <div class="iml-top">
        <span class="iml-name">${escapeHtml(msg.nombre)}</span>
        <span class="iml-date">${formatDate(msg.fecha)}</span>
      </div>
      ${tipoToTag(msg.tipo)}
      <div class="iml-club"><i class="fas fa-shield-alt" style="font-size:.6rem"></i> ${escapeHtml(msg.club)} · ${escapeHtml(msg.pais)}</div>
      <div class="iml-preview">${escapeHtml(msg.mensaje)}</div>
    </div>
  `).join('');
}

function openMessage(id) {
  const msg = allMessages.find(m => m.id === id);
  if (!msg) return;

  // Marcar como leído automáticamente
  if (!msg.leido) {
    msg.leido = true;
    saveMessages(allMessages);
  }

  activeMessageId = id;
  renderInbox(); // re-render para actualizar estado activo/leído

  const body    = document.getElementById('inboxDetailBody');
  const actions = document.getElementById('idhActions');
  const starBtn = document.getElementById('starBtn');
  actions.style.display = 'flex';
  starBtn.classList.toggle('active', msg.starred);

  const initial = msg.nombre.charAt(0).toUpperCase();
  body.innerHTML = `
    <div class="idb-sender">
      <div class="idb-avatar">${initial}</div>
      <div class="idb-sender-info">
        <div class="idb-sname">${escapeHtml(msg.nombre)}</div>
        <div class="idb-smeta">${escapeHtml(msg.club)} · ${escapeHtml(msg.pais)} · ${escapeHtml(msg.email)}</div>
      </div>
    </div>
    <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;">
      ${tipoToTag(msg.tipo)}
      <span style="font-size:.65rem;color:var(--gris);">${new Date(msg.fecha).toLocaleString('es-AR')}</span>
    </div>
    <div class="idb-msg-body">${escapeHtml(msg.mensaje).replace(/\n/g,'<br>')}</div>
    <div class="idb-footer">
      <a href="mailto:${escapeHtml(msg.email)}" class="btn-secondary" style="font-size:.75rem;padding:9px 18px;">
        <i class="fas fa-reply"></i> Responder por Email
      </a>
      <a href="https://wa.me/" target="_blank" class="btn-secondary" style="font-size:.75rem;padding:9px 18px;color:#25d366;border-color:rgba(37,211,102,.3);">
        <i class="fab fa-whatsapp"></i> WhatsApp
      </a>
    </div>
  `;
}

function toggleStar() {
  if (!activeMessageId) return;
  const msg = allMessages.find(m => m.id === activeMessageId);
  if (!msg) return;
  msg.starred = !msg.starred;
  saveMessages(allMessages);
  renderInbox();
  openMessage(activeMessageId);
  showToast('info', msg.starred ? '⭐ Destacado' : 'Quitado de destacados', '');
}
window.toggleStar = toggleStar;

function markRead() {
  if (!activeMessageId) return;
  const msg = allMessages.find(m => m.id === activeMessageId);
  if (!msg) return;
  msg.leido = true;
  saveMessages(allMessages);
  renderInbox();
  showToast('success', '✓ Marcado como leído', '');
}
window.markRead = markRead;

function deleteMessage() {
  if (!activeMessageId) return;
  if (!confirm('¿Eliminar este mensaje? No se puede deshacer.')) return;
  allMessages = allMessages.filter(m => m.id !== activeMessageId);
  saveMessages(allMessages);
  activeMessageId = null;
  document.getElementById('idhActions').style.display = 'none';
  document.getElementById('inboxDetailBody').innerHTML = `
    <div class="idb-empty">
      <i class="fas fa-envelope-open"></i>
      <p>Ningún mensaje seleccionado</p>
    </div>`;
  renderInbox();
  showToast('warning', 'Mensaje eliminado', '');
}
window.deleteMessage = deleteMessage;

/* ══════════════════
   11. FORMULARIO DE CONTACTO
══════════════════ */
function handleFormSubmit(e) {
  e.preventDefault();
  const btn = document.getElementById('submitBtn');

  // Validación manual
  const nombre  = document.getElementById('inputNombre').value.trim();
  const club    = document.getElementById('inputClub').value.trim();
  const email   = document.getElementById('inputEmail').value.trim();
  const tipo    = document.getElementById('inputTipo').value;
  const pais    = document.getElementById('inputPais').value.trim();
  const mensaje = document.getElementById('inputMensaje').value.trim();

  if (!nombre || !club || !email || !tipo || !mensaje) {
    showToast('error', 'Campos incompletos', 'Completá todos los campos requeridos.');
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showToast('error', 'Email inválido', 'Revisá la dirección de email.');
    return;
  }

  // Loading state
  btn.disabled = true;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';

  // Simulación de envío (acá irá la integración real: Firebase, EmailJS, etc.)
  setTimeout(() => {
    // Guardar en localStorage (modo demo)
    const newMsg = addMessage({ nombre, club, pais, email, tipo, mensaje });

    // Reset formulario
    document.getElementById('contactForm').reset();
    btn.disabled = false;
    btn.innerHTML = '<i class="fas fa-paper-plane"></i> Enviar Mensaje';

    // Feedback
    showToast('success', '✅ Mensaje enviado', `Recibimos tu propuesta, ${nombre}. Respondo en 24hs.`, 5000);

    // Actualizar inbox
    allMessages.unshift(newMsg);
    renderInbox();

    // Scroll suave al inbox
    setTimeout(() => {
      document.getElementById('inboxSection').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 1200);

  }, 1400);
}

/* ══════════════════
   12. SCROLL HELPERS
══════════════════ */
function scrollToForm() {
  trackClick();
  document.getElementById('formSection').scrollIntoView({ behavior: 'smooth', block: 'start' });
}
function scrollToInbox() {
  document.getElementById('inboxSection').scrollIntoView({ behavior: 'smooth', block: 'start' });
}
window.scrollToForm  = scrollToForm;
window.scrollToInbox = scrollToInbox;

/* ══════════════════
   13. DESCARGA CV
══════════════════ */
function downloadCV() {
  // Modo demo: genera texto
  const fecha = new Date().toLocaleDateString('es-AR');
  const content = `EL CAMINO AL FÚTBOL PROFESIONAL
CV DEPORTIVO — ${fecha}
${'═'.repeat(40)}

DATOS PERSONALES
Nombre: [Tu Nombre Completo]
Edad: 21 años
Nacionalidad: Argentina
Ubicación: [Tu Ciudad]
Email: tucorreo@gmail.com
WhatsApp: +54 9 [número]

POSICIÓN
Principal: Mediocampista (MC Ofensivo / Enganche)
Secundaria: Extremo, Segunda Delantera
Pierna dominante: Derecha

FÍSICO
Altura: [X.XX] m
Peso: [XX] kg

HABILIDADES DESTACADAS
- Regate (92/100) ⭐ FORTALEZA
- Pase (88/100)
- Resistencia (85/100)
- Velocidad (81/100)

ESTADO ACTUAL
✅ Disponible para pruebas INMEDIATAS
✅ Sin cláusulas pendientes
✅ Respuesta en menos de 24 horas
✅ Apto para Argentina y exterior

MENTALIDAD
Fe · Disciplina · Constancia · Propósito

"Este jugador no está improvisando.
Está construyendo su carrera en serio."

${'─'.repeat(40)}
Generado desde: El Camino al Fútbol Profesional
`;

  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url;
  a.download = 'CV_Deportivo_ElCamino.txt';
  a.click();
  URL.revokeObjectURL(url);

  showToast('success', '📄 CV Descargado', 'Reemplazá los datos con tu info real para usarlo en serio.');
}
window.downloadCV = downloadCV;

/* ══════════════════
   14. VIDEO MODAL REAL
══════════════════ */
function openVideoModal() {
  // Registrar clic en contacto/video
  trackClick();
  const overlay = document.getElementById('videoModalOverlay');
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeVideoModal(e) {
  if (e && e.target !== document.getElementById('videoModalOverlay') && !e.target.closest('.video-modal-close')) return;
  if (e && e.target.closest('.video-modal-inner') && e.target !== document.getElementById('videoModalOverlay')) return;
  document.getElementById('videoModalOverlay').classList.remove('open');
  document.body.style.overflow = '';
}
function loadYouTubeVideo() {
  const input = document.getElementById('ytLinkInput').value.trim();
  if (!input) return;
  let videoId = '';
  // Detectar ID de YouTube
  const match = input.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  if (match) videoId = match[1];
  else { showToast('error','Link inválido','Usá un link de YouTube válido (watch?v=...)'); return; }
  const frame = document.getElementById('videoModalFrame');
  frame.innerHTML = `<iframe src="https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0" allowfullscreen allow="autoplay"></iframe>`;
  // Guardar en localStorage para la próxima vez
  localStorage.setItem('elCamino_ytVideoId', videoId);
}
// Cargar video guardado si existe
(function loadSavedVideo() {
  const saved = localStorage.getItem('elCamino_ytVideoId');
  if (saved) {
    // Pre-cargar en el modal para la próxima apertura
    document.addEventListener('DOMContentLoaded', () => {
      const input = document.getElementById('ytLinkInput');
      if (input) input.value = 'https://youtube.com/watch?v=' + saved;
    });
  }
})();
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    document.getElementById('videoModalOverlay').classList.remove('open');
    document.body.style.overflow = '';
  }
});
function openGallery() {
  window.location.href = 'fotos.html';
}
window.openVideoModal = openVideoModal;
window.closeVideoModal = closeVideoModal;
window.loadYouTubeVideo = loadYouTubeVideo;
window.openGallery = openGallery;

/* ══════════════════
   TRACKING DE INTERÉS (localStorage)
══════════════════ */
const TRACK_KEY = 'elCamino_tracking';

function getTracking() {
  return JSON.parse(localStorage.getItem(TRACK_KEY) || '{"views":0,"clicks":0,"lastVisit":null}');
}
function saveTracking(data) {
  localStorage.setItem(TRACK_KEY, JSON.stringify(data));
}
function trackPageView() {
  const t = getTracking();
  t.views = (t.views || 0) + 1;
  t.lastVisit = new Date().toISOString();
  saveTracking(t);
  updateTrackingUI(t);
}
function trackClick() {
  const t = getTracking();
  t.clicks = (t.clicks || 0) + 1;
  saveTracking(t);
  updateTrackingUI(t);
}
function updateTrackingUI(t) {
  const views = document.getElementById('itViews');
  const clicks = document.getElementById('itClicks');
  const lastVisit = document.getElementById('itLastVisit');
  if (views) views.textContent = t.views || 0;
  if (clicks) clicks.textContent = t.clicks || 0;
  if (lastVisit && t.lastVisit) {
    const d = new Date(t.lastVisit);
    lastVisit.textContent = d.toLocaleDateString('es-AR', {day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'});
  }
}
// Registrar esta visita
trackPageView();

// Tracking en botones de contacto
document.querySelectorAll('.btn-primary, .btn-submit-form, .fcc-item, .wa-btn-main').forEach(btn => {
  btn.addEventListener('click', () => trackClick());
});

/* ══════════════════
   MÉTRICAS desde localStorage
══════════════════ */
(function loadMetrics() {
  const statsData = JSON.parse(localStorage.getItem('elCamino_stats') || '{}');
  const setEl = (id, val) => { const el = document.getElementById(id); if(el) el.textContent = val ?? '—'; };
  setEl('mGoals',   statsData.goles);
  setEl('mAssists', statsData.asistencias);
  setEl('mMatches', statsData.partidos);
  setEl('mMinutes', statsData.minutos || '—');
})();

/* ══════════════════
   15. ESCAPE HTML (seguridad)
══════════════════ */
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/* ══════════════════
   16. INIT
══════════════════ */
(function init() {
  renderInbox();

  // Agregar datos demo si el inbox está vacío (para mostrar funcionamiento)
  if (getMessages().length === 0) {
    const demos = [
      {
        nombre: 'Diego Martínez', club: 'Club Atlético Independiente',
        pais: 'Argentina', email: 'scout@independiente.com',
        tipo: 'scouting', mensaje: 'Hola, te vi en un video en redes y me pareció muy interesante tu perfil técnico. ¿Podemos coordinar una observación en un entrenamiento la semana que viene?',
      },
      {
        nombre: 'Carlos Rojas', club: 'Academia de Fútbol São Paulo',
        pais: 'Brasil', email: 'crojas@academia-sp.br',
        tipo: 'prueba', mensaje: 'Buenos días, somos una academia de fútbol en Brasil buscando perfiles técnicos para prueba internacional. Tenemos cupos disponibles para el próximo mes. ¿Te interesa participar?',
      },
      {
        nombre: 'Federico Álvarez', club: 'Agencia FuturoXI',
        pais: 'Argentina', email: 'falvarez@futuroxI.com',
        tipo: 'colaboracion', mensaje: 'Somos agentes de jugadores y tu perfil nos generó mucho interés. Trabajamos con clubes del ascenso argentino y ligas del exterior. Nos gustaría presentarte opciones.',
      },
    ];
    // Guardar demos con fechas escalonadas
    const msgs = demos.map((d, i) => ({
      id: genId(),
      ...d,
      fecha: new Date(Date.now() - i * 3600000 * 12).toISOString(),
      leido: i > 0,
      starred: i === 1,
    }));
    saveMessages(msgs);
    renderInbox();
  }
})();
