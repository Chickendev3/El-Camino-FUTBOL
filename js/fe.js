/**
 * ═══════════════════════════════════════════════════════════════
 * fe.js — Lógica completa de Fe & Motivación
 * Proyecto: El Camino al Fútbol Profesional con Dios
 *
 * ARQUITECTURA:
 *  1. CONFIG & DATOS (contenido estático embebido)
 *  2. STORAGE MODULE   → maneja localStorage
 *  3. ENGINE MODULE    → genera contenido diario
 *  4. UI MODULE        → renderiza tarjetas y secciones
 *  5. STREAK MODULE    → calcula y muestra rachas
 *  6. CURSOR MODULE    → cursor animado personalizado
 *  7. PARTICLES MODULE → canvas de partículas de fondo
 *  8. THEME MODULE     → modo oscuro/claro
 *  9. NAV MODULE       → navbar y hamburger
 * 10. INIT             → arranca todo
 * ═══════════════════════════════════════════════════════════════
 */

'use strict';

/* ═══════════════════════════════════════════════════════════════
   1. CONFIG & BASE DE DATOS DE CONTENIDO
   ─ Todo el contenido inspiracional está aquí.
   ─ Para agregar más frases, simplemente añadí objetos a cada array.
═══════════════════════════════════════════════════════════════ */

const CONTENT_DB = {

  /**
   * Versículos bíblicos con su referencia
   * Todos seleccionados por su relación con el esfuerzo, la valentía y el deporte
   */
  versiculos: [
    { texto: "Todo lo puedo en Cristo que me fortalece.", ref: "Filipenses 4:13" },
    { texto: "No te dejes vencer por el mal, sino vence el mal con el bien.", ref: "Romanos 12:21" },
    { texto: "Esfuérzate y sé valiente, porque el Señor tu Dios estará contigo dondequiera que vayas.", ref: "Josué 1:9" },
    { texto: "Porque yo sé los planes que tengo para ustedes, planes de bienestar y no de calamidad, para darles un futuro y una esperanza.", ref: "Jeremías 29:11" },
    { texto: "El Señor es mi fortaleza y mi escudo; en él confía mi corazón.", ref: "Salmos 28:7" },
    { texto: "¿No saben que en una carrera todos los corredores compiten, pero solo uno recibe el premio? Corran de tal manera que lo obtengan.", ref: "1 Corintios 9:24" },
    { texto: "Encomienda al Señor tus obras y tus planes se cumplirán.", ref: "Proverbios 16:3" },
    { texto: "Confía en el Señor de todo tu corazón y no te apoyes en tu propio entendimiento.", ref: "Proverbios 3:5" },
    { texto: "Pero los que esperan al Señor renovarán sus fuerzas; volarán como las águilas.", ref: "Isaías 40:31" },
    { texto: "Yo soy el camino, la verdad y la vida.", ref: "Juan 14:6" },
    { texto: "El que comenzó en ustedes la buena obra, la perfeccionará hasta el día de Cristo Jesús.", ref: "Filipenses 1:6" },
    { texto: "Puedo hacer todo a través de Él que me da fuerzas.", ref: "Filipenses 4:13 (MSG)" },
    { texto: "Sé fuerte y no te desanimes. Tu trabajo tendrá recompensa.", ref: "2 Crónicas 15:7" },
    { texto: "Así que no temas, porque yo estoy contigo; no te angusties, porque yo soy tu Dios.", ref: "Isaías 41:10" },
    { texto: "El Señor peleará por ustedes; ustedes quédense quietos.", ref: "Éxodo 14:14" },
    { texto: "¿Acaso no lo sabes? El Señor es el Dios eterno. Él no se cansa ni se fatiga.", ref: "Isaías 40:28" },
    { texto: "Deléitate en el Señor, y él te concederá los deseos de tu corazón.", ref: "Salmos 37:4" },
    { texto: "Porque nada hay imposible para Dios.", ref: "Lucas 1:37" },
    { texto: "Dios es nuestro refugio y nuestra fortaleza, nuestra ayuda en momentos de angustia.", ref: "Salmos 46:1" },
    { texto: "Mas buscad primeramente el reino de Dios y su justicia, y todas estas cosas os serán añadidas.", ref: "Mateo 6:33" }
  ],

  /**
   * Frases motivacionales de fútbol
   * De leyendas del deporte y grandes entrenadores
   */
  frases: [
    { texto: "El fútbol es el deporte más bonito del mundo. Y yo nací para jugarlo.", autor: "Ronaldo Nazário" },
    { texto: "No celebro goles porque lo considero mi trabajo. Solo hago lo que se supone que debo hacer.", autor: "Ronaldo Nazário" },
    { texto: "No hay presión cuando juegas con el corazón.", autor: "Ronaldinho" },
    { texto: "Cuando el talento no trabaja, el trabajo vence al talento.", autor: "Cristiano Ronaldo" },
    { texto: "El éxito no es solo sobre el fútbol. Es sobre convertirte en una mejor persona.", autor: "Lionel Messi" },
    { texto: "Si caes siete veces, levántate ocho. Eso es lo que hace un campeón.", autor: "Kylian Mbappé" },
    { texto: "No tengo miedo de fallar. Es parte del proceso.", autor: "Vinicius Jr." },
    { texto: "El talento gana partidos, pero el trabajo en equipo y la inteligencia ganan campeonatos.", autor: "Michael Jordan" },
    { texto: "La diferencia entre lo imposible y lo posible está en la determinación de una persona.", autor: "Tommy Lasorda" },
    { texto: "Entrena duro, sueña en grande, y nunca dejes de creer.", autor: "Anonymous" },
    { texto: "Los campeones siguen jugando hasta hacerlo bien.", autor: "Billie Jean King" },
    { texto: "No cuentes los días. Haz que los días cuenten.", autor: "Muhammad Ali" },
    { texto: "Cada día es una nueva oportunidad de mejorar.", autor: "Zinedine Zidane" },
    { texto: "Un verdadero campeón no se rinde cuando la vida se pone difícil.", autor: "Pelé" },
    { texto: "El dolor de hoy es la fuerza de mañana.", autor: "Arnold Schwarzenegger" },
    { texto: "Para ganar tienes que sacrificar todo. Absolultamente todo.", autor: "Cristiano Ronaldo" },
    { texto: "No importa cuántas veces caigas, lo que importa es cuántas veces te levantes.", autor: "Vince Lombardi" },
    { texto: "La preparación se ve en el entrenamiento. El carácter se ve en el partido.", autor: "Anónimo" },
    { texto: "Sueña en grande. Trabaja duro. Mantente enfocado. Rodéate de gente buena.", autor: "Unknown" },
    { texto: "No hay atajos para ningún lugar que valga la pena ir.", autor: "Beverly Sills" }
  ],

  /**
   * Reflexiones que conectan fútbol, disciplina y Dios
   */
  reflexiones: [
    {
      titulo: "El Entrenamiento como Oración",
      texto: "Cada vez que pisás el campo a entrenar, estás honrando el cuerpo que Dios te dio. El sudor que derramás es una forma de agradecimiento. Cuando tus piernas digan basta, dejá que tu fe diga un paso más.",
      versiculo: "1 Corintios 6:19-20"
    },
    {
      titulo: "Dios en los Momentos Difíciles",
      texto: "Cuando el scouta no te llama, cuando el entrenador no te ve, cuando las puertas parecen cerradas... recuerda: Dios tiene un plan mayor que cualquier contrato. Seguí entrenando con fe.",
      versiculo: "Jeremías 29:11"
    },
    {
      titulo: "La Humildad del Campeón",
      texto: "Los mejores futbolistas del mundo tienen algo en común: la humildad de saber que siempre pueden mejorar. El orgullo cierra puertas; la humildad las abre. Sé grande en el campo, humilde fuera de él.",
      versiculo: "Proverbios 11:2"
    },
    {
      titulo: "Cuerpo, Mente y Espíritu",
      texto: "El fútbol profesional exige el 100% del cuerpo. Pero también exige el 100% de la mente y el 100% del espíritu. Entrená los tres. Lee la Palabra. Medita. Ora. Tu espíritu fuerte hará tu cuerpo más fuerte.",
      versiculo: "3 Juan 1:2"
    },
    {
      titulo: "Perseverancia Cuando Duele",
      texto: "Vai chegar um dia en que el entrenamiento duele tanto que quieras parar. En ese momento exacto, recordá por qué empezaste. Recordá que Dios no prometió un camino fácil, sino que prometió acompañarte en el difícil.",
      versiculo: "Romanos 5:3-4"
    },
    {
      titulo: "Gratitud Antes del Partido",
      texto: "Antes de cada partido, respirá profundo y agradecé. Agradecé que podés correr, que tenés salud, que tenés el don del fútbol. La gratitud transforma el nervio en energía positiva.",
      versiculo: "1 Tesalonicenses 5:18"
    },
    {
      titulo: "El Talento es un Don, no un Logro",
      texto: "Tu velocidad, tu visión de juego, tu pie hábil... ninguno de esos talentos los fabricaste vos. Son regalos de Dios. Tu responsabilidad es desarrollarlos al máximo y usarlos para Su gloria.",
      versiculo: "1 Pedro 4:10"
    },
    {
      titulo: "Cuando te Lesionás",
      texto: "Las lesiones son parte del camino. En esos momentos de quietud forzada, Dios te habla diferente. Te enseña paciencia, te fortalece el carácter. Cada recuperación es un testimonio de resiliencia.",
      versiculo: "Santiago 1:3-4"
    },
    {
      titulo: "Jugar para la Gloria de Dios",
      texto: "Imaginate jugar cada partido como si Dios mismo estuviese en las tribunas viéndote. No por miedo, sino por amor. Esa mentalidad transforma la presión en propósito.",
      versiculo: "Colosenses 3:23"
    },
    {
      titulo: "El Equipo como Familia",
      texto: "El fútbol te enseña que nadie llega solo. Dios nos creó para la comunidad. Honrá a tus compañeros, serví al equipo, sé el jugador que eleva a los demás. Eso es ser cristiano en el campo.",
      versiculo: "Eclesiastés 4:9-10"
    }
  ],

  /**
   * Oraciones para el futbolista cristiano
   */
  oraciones: [
    `Señor, gracias por este nuevo día de entrenamiento. Gracias por la salud, por las piernas que corren, por el corazón que late con pasión por este deporte. Que cada toque de balón sea un acto de adoración. Que mi esfuerzo te glorifique. Amén.`,
    `Padre, en los momentos difíciles cuando siento que no llego, recordame que Tú me creaste para esto. Dame la fuerza de Sansón en los músculos, la sabiduría de Salomón en las decisiones dentro del campo, y la fe de Abraham para creer en lo que no veo todavía. Amén.`,
    `Dios mío, que cada gol que convierta sea un grito de gloria hacia Ti. Que cada asistencia sea un acto de servicio. Que en cada derrota encuentre el aprendizaje que Tú querés mostrarme. No me dejes olvidar que soy Tu hijo primero, futbolista después. Amén.`,
    `Señor, protegé mi cuerpo hoy. Guardá mis rodillas, mis tobillos, mis músculos. Que llegue sano al entrenamiento y vuelva sano a casa. Pero sobre todo, que mi alma llegue más cerca de Ti después de cada sesión. Amén.`,
    `Padre celestial, dame la humildad de servir a mi equipo por encima de mi gloria personal. Que pueda ser luz para mis compañeros, que mi actitud en el campo refleje tu amor. Que sea el jugador que nadie ve en las estadísticas pero que todos sienten en el grupo. Amén.`,
    `Señor, hoy me siento cansado. El camino parece largo y el sueño lejano. Pero Tú dijiste que los que esperan en Ti renovarán sus fuerzas. Hoy espero en Ti. Renovame. Dame el ánimo de seguir entrenando aunque no vea los resultados todavía. Amén.`,
    `Dios, gracias por el don del fútbol. Ayudame a no desperdiciar ni un talento que me diste. Que entrene con la intensidad de quien sabe que el tiempo es un regalo. Que cada sesión sea un peldaño más hacia el propósito que diseñaste para mi vida. Amén.`,
    `Señor Jesús, cuando llegue el día del gran debut, cuando el estadio esté lleno y las luces encendidas, recordame que todo lo que soy viene de Ti. Que pueda señalar al cielo y decir: esto es para vos, Señor. Amén.`
  ],

  /**
   * Futbolistas conocidos por su fe cristiana (para la sección de referentes)
   */
  atletas: [
    {
      nombre: "Kaká",
      pais: "Brasil 🇧🇷",
      imagen: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80",
      frase: "Dios es el primero en todo. Antes que el fútbol, antes que la fama. Sin Él no soy nada."
    },
    {
      nombre: "Benzema",
      pais: "Francia 🇫🇷",
      imagen: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&q=80",
      frase: "La fe me da fuerza cuando el cuerpo quiere rendirse."
    },
    {
      nombre: "Vinicius Jr.",
      pais: "Brasil 🇧🇷",
      imagen: "https://images.unsplash.com/photo-1552667466-07770ae110d0?w=400&q=80",
      frase: "Dios siempre me dio fuerzas para superar las adversidades y seguir soñando."
    },
    {
      nombre: "C. Ronaldo",
      pais: "Portugal 🇵🇹",
      imagen: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=400&q=80",
      frase: "El talento sin trabajo no es nada. Trabajo todos los días porque sé que Dios me dio este don."
    }
  ],

  /**
   * Versículo del día — rotación diaria automática
   */
  versiculosDia: [
    { texto: "Todo lo puedo en Cristo que me fortalece.", ref: "Filipenses 4:13" },
    { texto: "Esfuérzate y sé valiente.", ref: "Josué 1:9" },
    { texto: "Porque yo sé los planes que tengo para ustedes.", ref: "Jeremías 29:11" },
    { texto: "El que comenzó en ustedes la buena obra, la perfeccionará.", ref: "Filipenses 1:6" },
    { texto: "No temas, porque yo estoy contigo.", ref: "Isaías 41:10" },
    { texto: "Confía en el Señor de todo tu corazón.", ref: "Proverbios 3:5" },
    { texto: "Los que esperan al Señor renovarán sus fuerzas.", ref: "Isaías 40:31" }
  ]
};

/* ═══════════════════════════════════════════════════════════════
   2. STORAGE MODULE
   ─ Toda la persistencia de datos pasa por aquí.
   ─ Usa localStorage con fallback graceful si no está disponible.
   ─ Clave principal: "elcamino_fe_v2"
═══════════════════════════════════════════════════════════════ */

const Storage = (() => {
  const KEY_CARDS   = 'elcamino_fe_cards_v2';     // Array de tarjetas guardadas
  const KEY_STREAK  = 'elcamino_fe_streak_v2';     // Datos de racha
  const KEY_THEME   = 'elcamino_fe_theme_v1';      // Tema oscuro/claro
  const KEY_VISITS  = 'elcamino_fe_visits_v1';     // Historial de visitas (días)

  /** Obtiene las tarjetas guardadas */
  function getCards() {
    try {
      return JSON.parse(localStorage.getItem(KEY_CARDS)) || [];
    } catch {
      return [];
    }
  }

  /** Guarda el array completo de tarjetas */
  function saveCards(cards) {
    try {
      localStorage.setItem(KEY_CARDS, JSON.stringify(cards));
      return true;
    } catch (e) {
      console.warn('Storage lleno o no disponible:', e);
      return false;
    }
  }

  /** Agrega una nueva tarjeta al inicio del array */
  function addCard(card) {
    const cards = getCards();
    cards.unshift(card); // Más reciente primero
    return saveCards(cards);
  }

  /** Togglea el favorito de una tarjeta por su ID */
  function toggleFavorite(cardId) {
    const cards = getCards();
    const card = cards.find(c => c.id === cardId);
    if (card) {
      card.favorito = !card.favorito;
      saveCards(cards);
      return card.favorito;
    }
    return false;
  }

  /** Elimina una tarjeta por ID */
  function deleteCard(cardId) {
    const cards = getCards().filter(c => c.id !== cardId);
    return saveCards(cards);
  }

  /** Borra todas las tarjetas */
  function clearAllCards() {
    try { localStorage.removeItem(KEY_CARDS); return true; } catch { return false; }
  }

  /** Obtiene / actualiza datos de racha */
  function getStreakData() {
    try {
      return JSON.parse(localStorage.getItem(KEY_STREAK)) || {
        lastVisit: null,
        currentStreak: 0,
        bestStreak: 0,
        totalVisits: 0,
        visitedDays: []  // Array de strings "YYYY-MM-DD"
      };
    } catch {
      return { lastVisit: null, currentStreak: 0, bestStreak: 0, totalVisits: 0, visitedDays: [] };
    }
  }

  function saveStreakData(data) {
    try { localStorage.setItem(KEY_STREAK, JSON.stringify(data)); } catch {}
  }

  /** Guarda/lee el tema */
  function getTheme() {
    try { return localStorage.getItem(KEY_THEME) || 'dark'; } catch { return 'dark'; }
  }
  function saveTheme(theme) {
    try { localStorage.setItem(KEY_THEME, theme); } catch {}
  }

  return { getCards, saveCards, addCard, toggleFavorite, deleteCard, clearAllCards, getStreakData, saveStreakData, getTheme, saveTheme };
})();

/* ═══════════════════════════════════════════════════════════════
   3. ENGINE MODULE
   ─ Genera el contenido diario (o bajo demanda).
   ─ Usa un algoritmo pseudo-aleatorio seeded por fecha
     para que cada día tenga contenido diferente pero consistente.
═══════════════════════════════════════════════════════════════ */

const Engine = (() => {

  /** Seed numérico basado en fecha (cambia cada día) */
  function dateSeed() {
    const d = new Date();
    return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
  }

  /** Pseudo-random determinista (mismo seed = mismo resultado) */
  function seededRandom(seed, max) {
    const x = Math.sin(seed + 1) * 10000;
    return Math.floor((x - Math.floor(x)) * max);
  }

  /** Elige un ítem al azar del array (puro aleatorio para botón manual) */
  function randomItem(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  /** Genera ID único para cada tarjeta */
  function generateId() {
    return `card_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
  }

  /** Formatea fecha legible */
  function formatDate(date = new Date()) {
    return date.toLocaleDateString('es-AR', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
  }

  /**
   * Genera una tarjeta completa.
   * @param {string} type - 'versiculo' | 'frase' | 'reflexion' | 'auto'
   * @param {boolean} seeded - Si true, usa seed de fecha (reproducible)
   */
  function generateCard(type = 'auto', seeded = false) {
    const seed = dateSeed();
    const now  = new Date();

    // Si 'auto', rota por tipo según el día de la semana
    if (type === 'auto') {
      const day = now.getDay(); // 0=dom ... 6=sab
      if (day === 0 || day === 3) type = 'versiculo';
      else if (day === 1 || day === 4) type = 'frase';
      else type = 'reflexion';
    }

    let card = {
      id:       generateId(),
      tipo:     type,
      fecha:    now.toISOString(),
      fechaStr: formatDate(now),
      favorito: false,
      reflexion: null,
      autor: null,
      ref: null
    };

    switch (type) {
      case 'versiculo': {
        const v = seeded
          ? CONTENT_DB.versiculos[seededRandom(seed, CONTENT_DB.versiculos.length)]
          : randomItem(CONTENT_DB.versiculos);
        card.texto    = v.texto;
        card.ref      = v.ref;
        card.titulo   = 'Palabra de Dios';
        // Reflexión automática que acompaña el versículo
        card.reflexion = randomItem(CONTENT_DB.reflexiones).texto;
        break;
      }
      case 'frase': {
        const f = seeded
          ? CONTENT_DB.frases[seededRandom(seed + 1, CONTENT_DB.frases.length)]
          : randomItem(CONTENT_DB.frases);
        card.texto  = f.texto;
        card.autor  = f.autor;
        card.titulo = 'Motivación Futbolística';
        break;
      }
      case 'reflexion': {
        const r = seeded
          ? CONTENT_DB.reflexiones[seededRandom(seed + 2, CONTENT_DB.reflexiones.length)]
          : randomItem(CONTENT_DB.reflexiones);
        card.texto     = r.titulo;
        card.reflexion = r.texto;
        card.ref       = r.versiculo;
        card.titulo    = 'Reflexión Diaria';
        break;
      }
    }

    return card;
  }

  /** Devuelve el versículo del día (rotación semanal) */
  function getVersiculoDelDia() {
    const seed  = dateSeed();
    const idx   = seededRandom(seed, CONTENT_DB.versiculosDia.length);
    return CONTENT_DB.versiculosDia[idx];
  }

  /** Devuelve una oración aleatoria */
  function getOracion() {
    return randomItem(CONTENT_DB.oraciones);
  }

  return { generateCard, getVersiculoDelDia, getOracion, formatDate };
})();

/* ═══════════════════════════════════════════════════════════════
   4. UI MODULE
   ─ Renderiza tarjetas, secciones, modales, toasts.
   ─ Es el módulo más grande: maneja toda la manipulación del DOM.
═══════════════════════════════════════════════════════════════ */

const UI = (() => {

  /* ─ Estado interno ─ */
  let allCards        = [];         // Todas las tarjetas cargadas
  let filteredCards   = [];         // Cards después de filtro/búsqueda
  let activeFilter    = 'all';      // Filtro activo actual
  let searchTerm      = '';         // Término de búsqueda
  let visibleCount    = 12;         // Cuántas tarjetas mostrar (paginación)
  const CARDS_PER_PAGE = 12;

  /* ─ Referencias DOM ─ */
  const cardsGrid    = document.getElementById('cardsGrid');
  const emptyState   = document.getElementById('emptyState');
  const cardsCount   = document.getElementById('cardsCount');
  const loadMoreWrap = document.getElementById('loadMoreWrap');
  const modalOverlay = document.getElementById('cardModal');
  const modalContent = document.getElementById('modalContent');
  const toastCont    = document.getElementById('toastContainer');
  const prayerBody   = document.getElementById('prayerBody');
  const athletesGrid = document.getElementById('athletesGrid');

  /* ─────────────────────────────────────────────
     TOASTS (notificaciones flotantes)
  ───────────────────────────────────────────── */
  function showToast(title, sub = '', type = 'success', duration = 3000) {
    const icons = { success: 'fa-check-circle', warning: 'fa-exclamation-circle', error: 'fa-times-circle', info: 'fa-info-circle' };
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
      <i class="fas ${icons[type]} toast-icon"></i>
      <div class="toast-text">
        <span class="toast-title">${title}</span>
        ${sub ? `<span class="toast-sub">${sub}</span>` : ''}
      </div>
    `;
    toastCont.appendChild(toast);
    setTimeout(() => {
      toast.classList.add('hide');
      setTimeout(() => toast.remove(), 350);
    }, duration);
  }

  /* ─────────────────────────────────────────────
     RENDERIZAR UNA TARJETA HTML
  ───────────────────────────────────────────── */
  function buildCardHTML(card) {
    const iconMap = { versiculo: 'fa-cross', frase: 'fa-futbol', reflexion: 'fa-brain' };
    const labelMap = { versiculo: 'Versículo', frase: 'Frase', reflexion: 'Reflexión' };
    const badgeClass = `badge-${card.tipo}`;
    const iconClass  = `icon-${card.tipo}`;
    const icon       = iconMap[card.tipo] || 'fa-star';
    const label      = labelMap[card.tipo] || card.tipo;

    const refOrAutor = card.ref
      ? `<span class="card-ref ref-${card.tipo}">${card.ref}</span>`
      : (card.autor ? `<span class="card-ref ref-frase">— ${card.autor}</span>` : '');

    const reflexionPreview = card.reflexion
      ? `<p class="card-reflection-preview">${card.reflexion}</p>`
      : '';

    const favClass = card.favorito ? 'active' : '';

    // Fecha legible corta
    const dateShort = new Date(card.fecha).toLocaleDateString('es-AR', {
      day: 'numeric', month: 'short', year: 'numeric'
    });

    return `
      <article class="inspiration-card" data-id="${card.id}" data-type="${card.tipo}">
        <div class="card-header">
          <span class="card-type-badge ${badgeClass}">
            <i class="fas ${icon}"></i> ${label}
          </span>
          <div class="card-actions">
            <button class="card-action-btn fav-btn ${favClass}"
              title="${card.favorito ? 'Quitar favorito' : 'Agregar a favoritos'}"
              data-id="${card.id}">
              <i class="fas fa-heart"></i>
            </button>
            <button class="card-action-btn share-btn" title="Compartir" data-id="${card.id}">
              <i class="fas fa-share-alt"></i>
            </button>
            <button class="card-action-btn delete-btn" title="Eliminar" data-id="${card.id}">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
        <div class="card-body">
          <div class="card-icon-wrap ${iconClass}">
            <i class="fas ${icon}"></i>
          </div>
          <p class="card-title-text">${card.texto}</p>
          ${refOrAutor}
          ${reflexionPreview}
        </div>
        <div class="card-footer">
          <span class="card-date"><i class="fas fa-calendar-alt" style="margin-right:5px;opacity:.5;"></i>${dateShort}</span>
          <button class="card-expand" data-id="${card.id}">
            Ver completo <i class="fas fa-arrow-right"></i>
          </button>
        </div>
      </article>
    `;
  }

  /* ─────────────────────────────────────────────
     RENDERIZAR GRID COMPLETO
  ───────────────────────────────────────────── */
  function renderCards() {
    // Filtrar
    filteredCards = allCards.filter(card => {
      const matchFilter =
        activeFilter === 'all' ||
        activeFilter === card.tipo ||
        (activeFilter === 'favorito' && card.favorito);

      const matchSearch = !searchTerm ||
        card.texto.toLowerCase().includes(searchTerm) ||
        (card.ref    && card.ref.toLowerCase().includes(searchTerm)) ||
        (card.autor  && card.autor.toLowerCase().includes(searchTerm)) ||
        (card.reflexion && card.reflexion.toLowerCase().includes(searchTerm));

      return matchFilter && matchSearch;
    });

    // Mostrar/ocultar estado vacío
    const showEmpty = filteredCards.length === 0;
    emptyState.style.display = showEmpty ? 'flex' : 'none';

    // Counter
    const noun = filteredCards.length === 1 ? 'tarjeta' : 'tarjetas';
    cardsCount.textContent = `${filteredCards.length} ${noun}`;

    // Limpiar grid (sin el emptyState)
    const existingCards = cardsGrid.querySelectorAll('.inspiration-card');
    existingCards.forEach(c => c.remove());

    // Slice visible
    const visible = filteredCards.slice(0, visibleCount);
    visible.forEach(card => {
      cardsGrid.insertAdjacentHTML('beforeend', buildCardHTML(card));
    });

    // Load more
    loadMoreWrap.style.display = filteredCards.length > visibleCount ? 'block' : 'none';

    // Re-bind eventos de las tarjetas
    bindCardEvents();

    // Actualizar quick stats
    updateQuickStats();
  }

  /* ─────────────────────────────────────────────
     EVENTOS DE TARJETAS (delegación)
  ───────────────────────────────────────────── */
  function bindCardEvents() {
    // Favorito
    cardsGrid.querySelectorAll('.fav-btn').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        const id = btn.dataset.id;
        const isFav = Storage.toggleFavorite(id);
        btn.classList.toggle('active', isFav);
        const card = allCards.find(c => c.id === id);
        if (card) {
          card.favorito = isFav;
          showToast(
            isFav ? '❤️ Agregado a favoritos' : 'Removido de favoritos',
            card.texto.substring(0, 50) + '...',
            isFav ? 'success' : 'info'
          );
          updateQuickStats();
        }
      });
    });

    // Compartir
    cardsGrid.querySelectorAll('.share-btn').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        const card = allCards.find(c => c.id === btn.dataset.id);
        if (card) shareCard(card);
      });
    });

    // Eliminar
    cardsGrid.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        const id = btn.dataset.id;
        if (confirm('¿Eliminar esta tarjeta?')) {
          Storage.deleteCard(id);
          allCards = Storage.getCards();
          renderCards();
          showToast('Tarjeta eliminada', '', 'warning');
        }
      });
    });

    // Expandir (modal)
    cardsGrid.querySelectorAll('.card-expand, .inspiration-card').forEach(el => {
      el.addEventListener('click', e => {
        // Solo si no hizo click en un botón
        if (e.target.closest('button')) return;
        const cardEl = el.closest('.inspiration-card') || el;
        if (!cardEl) return;
        const id = cardEl.dataset.id || el.dataset.id;
        const card = allCards.find(c => c.id === id);
        if (card) openModal(card);
      });
    });
  }

  /* ─────────────────────────────────────────────
     AGREGAR NUEVA TARJETA (con animación)
  ───────────────────────────────────────────── */
  function addNewCard(card) {
    allCards.unshift(card);
    renderCards();
    // Pulso en la primera tarjeta
    const firstCard = cardsGrid.querySelector('.inspiration-card');
    if (firstCard) {
      firstCard.classList.add('new-pulse');
      setTimeout(() => firstCard.classList.remove('new-pulse'), 1000);
      // Scroll suave a las tarjetas
      setTimeout(() => {
        document.querySelector('.cards-main').scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 200);
    }
  }

  /* ─────────────────────────────────────────────
     MODAL
  ───────────────────────────────────────────── */
  function openModal(card) {
    const iconMap = { versiculo: 'fa-cross', frase: 'fa-futbol', reflexion: 'fa-brain' };
    const labelMap = { versiculo: 'Versículo Bíblico', frase: 'Frase Motivacional', reflexion: 'Reflexión' };
    const badgeClass = `badge-${card.tipo}`;
    const icon = iconMap[card.tipo] || 'fa-star';
    const label = labelMap[card.tipo] || card.tipo;

    const refHTML = card.ref
      ? `<cite class="modal-ref ref-${card.tipo}">${card.ref}</cite>`
      : (card.autor ? `<cite class="modal-ref ref-frase">— ${card.autor}</cite>` : '');

    const reflexionHTML = card.reflexion ? `
      <div class="modal-reflection">
        <span class="modal-reflection-label"><i class="fas fa-lightbulb"></i> Reflexión</span>
        ${card.reflexion}
      </div>` : '';

    const favClass = card.favorito ? 'active' : '';
    const favText  = card.favorito ? '❤️ En favoritos' : '🤍 Favorito';

    modalContent.setAttribute('data-modal-type', card.tipo);
    modalContent.innerHTML = `
      <div class="modal-type-badge">
        <span class="card-type-badge ${badgeClass}"><i class="fas ${icon}"></i> ${label}</span>
      </div>
      <p class="modal-main-text">${card.texto}</p>
      ${refHTML}
      ${reflexionHTML}
      <div class="modal-meta">
        <span class="modal-date"><i class="fas fa-calendar-alt"></i> ${card.fechaStr}</span>
        <div class="modal-actions">
          <button class="modal-btn fav ${favClass}" id="modalFavBtn" data-id="${card.id}">
            ${favText}
          </button>
          <button class="modal-btn" id="modalShareBtn" data-id="${card.id}">
            <i class="fas fa-share-alt"></i> Compartir
          </button>
        </div>
      </div>
    `;

    // Eventos del modal
    document.getElementById('modalFavBtn').addEventListener('click', () => {
      const isFav = Storage.toggleFavorite(card.id);
      card.favorito = isFav;
      const btn = document.getElementById('modalFavBtn');
      btn.textContent = isFav ? '❤️ En favoritos' : '🤍 Favorito';
      btn.classList.toggle('active', isFav);
      allCards = Storage.getCards();
      renderCards();
      showToast(isFav ? '❤️ Agregado a favoritos' : 'Removido de favoritos', '', 'success');
    });

    document.getElementById('modalShareBtn').addEventListener('click', () => shareCard(card));

    modalOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modalOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  /* ─────────────────────────────────────────────
     COMPARTIR TARJETA
  ───────────────────────────────────────────── */
  function shareCard(card) {
    const text = card.ref
      ? `"${card.texto}" — ${card.ref}\n\nVía: El Camino | Mi camino al fútbol profesional con fe ⚽✝️`
      : `"${card.texto}"${card.autor ? ' — ' + card.autor : ''}\n\nVía: El Camino | Mi camino al fútbol profesional con fe ⚽✝️`;

    if (navigator.share) {
      navigator.share({ text, title: 'Fe & Motivación | El Camino' })
        .then(() => showToast('¡Compartido!', '', 'success'))
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(text)
        .then(() => showToast('Copiado al portapapeles', 'Pegalo donde quieras', 'success'))
        .catch(() => showToast('No se pudo copiar', '', 'error'));
    }
  }

  /* ─────────────────────────────────────────────
     VERSÍCULO DEL DÍA
  ───────────────────────────────────────────── */
  function renderVersiculo() {
    const v = Engine.getVersiculoDelDia();
    const vodText = document.getElementById('vodText');
    const vodRef  = document.getElementById('vodRef');

    if (vodText && vodRef) {
      // Animación de fade
      vodText.style.opacity = '0';
      setTimeout(() => {
        vodText.textContent = `"${v.texto}"`;
        vodRef.textContent  = `— ${v.ref}`;
        vodText.style.opacity = '1';
      }, 300);
    }
  }

  /* ─────────────────────────────────────────────
     ORACIÓN DEL DÍA
  ───────────────────────────────────────────── */
  function renderOracion() {
    if (prayerBody) {
      prayerBody.style.opacity = '0';
      setTimeout(() => {
        prayerBody.textContent = Engine.getOracion();
        prayerBody.style.opacity = '1';
        prayerBody.style.transition = 'opacity 0.5s ease';
      }, 200);
    }
  }

  /* ─────────────────────────────────────────────
     ATLETAS CON FE
  ───────────────────────────────────────────── */
  function renderAtletas() {
    if (!athletesGrid) return;
    athletesGrid.innerHTML = CONTENT_DB.atletas.map(a => `
      <div class="athlete-card reveal">
        <div class="athlete-img-wrap">
          <img src="${a.imagen}" alt="${a.nombre}" loading="lazy"/>
          <div class="athlete-img-overlay"></div>
          <div class="athlete-cross-badge"><i class="fas fa-cross"></i></div>
        </div>
        <div class="athlete-body">
          <div class="athlete-name">${a.nombre}</div>
          <div class="athlete-country">${a.pais}</div>
          <blockquote class="athlete-quote">"${a.frase}"</blockquote>
        </div>
      </div>
    `).join('');
  }

  /* ─────────────────────────────────────────────
     ACTUALIZAR QUICK STATS (hero)
  ───────────────────────────────────────────── */
  function updateQuickStats() {
    const cards = Storage.getCards();
    const favs  = cards.filter(c => c.favorito).length;
    const streak = Storage.getStreakData();

    animateNum('totalCards', cards.length);
    animateNum('totalFavs', favs);
    animateNum('streakDays', streak.currentStreak);
  }

  function animateNum(id, target) {
    const el = document.getElementById(id);
    if (!el) return;
    const current = parseInt(el.textContent) || 0;
    if (current === target) return;
    let count = current;
    const step = target > current ? 1 : -1;
    const interval = setInterval(() => {
      count += step;
      el.textContent = count;
      if (count === target) clearInterval(interval);
    }, 40);
  }

  /* ─────────────────────────────────────────────
     FILTROS Y BÚSQUEDA
  ───────────────────────────────────────────── */
  function setFilter(filter) {
    activeFilter = filter;
    visibleCount = CARDS_PER_PAGE;
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.filter === filter);
    });
    renderCards();
  }

  function setSearch(term) {
    searchTerm = term.toLowerCase().trim();
    visibleCount = CARDS_PER_PAGE;
    renderCards();
  }

  function loadMore() {
    visibleCount += CARDS_PER_PAGE;
    renderCards();
  }

  /* ─────────────────────────────────────────────
     EXPORT A JSON
  ───────────────────────────────────────────── */
  function exportCards() {
    const cards = Storage.getCards();
    const blob = new Blob([JSON.stringify(cards, null, 2)], { type: 'application/json' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = `elcamino_fe_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Exportado', `${cards.length} tarjetas guardadas`, 'success');
  }

  /* ─────────────────────────────────────────────
     INICIALIZAR UI
  ───────────────────────────────────────────── */
  function init() {
    allCards = Storage.getCards();
    renderCards();
    renderVersiculo();
    renderOracion();
    renderAtletas();

    // Modal cerrar
    document.getElementById('modalClose').addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', e => {
      if (e.target === modalOverlay) closeModal();
    });

    // Compartir versículo del día
    document.getElementById('vodShare').addEventListener('click', () => {
      const v = Engine.getVersiculoDelDia();
      navigator.clipboard.writeText(`"${v.texto}" — ${v.ref}\n\nVía: El Camino ⚽✝️`)
        .then(() => showToast('Versículo copiado', v.ref, 'success'))
        .catch(() => {});
    });

    // Nueva oración
    document.getElementById('btnNewPrayer').addEventListener('click', renderOracion);

    // Filtros
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => setFilter(btn.dataset.filter));
    });

    // Búsqueda
    const searchInput = document.getElementById('searchInput');
    const searchClear = document.getElementById('searchClear');
    searchInput.addEventListener('input', () => {
      searchClear.classList.toggle('visible', searchInput.value.length > 0);
      setSearch(searchInput.value);
    });
    searchClear.addEventListener('click', () => {
      searchInput.value = '';
      searchClear.classList.remove('visible');
      setSearch('');
    });

    // Load more
    document.getElementById('btnLoadMore').addEventListener('click', loadMore);

    // Botón generar (principal y vacío)
    [document.getElementById('btnGenerate'), document.getElementById('btnGenerateEmpty')]
      .forEach(btn => btn && btn.addEventListener('click', handleGenerate));

    // Export
    document.getElementById('btnExport').addEventListener('click', exportCards);

    // Clear all
    document.getElementById('btnClearAll').addEventListener('click', () => {
      if (confirm('¿Borrar TODAS las tarjetas? Esta acción no se puede deshacer.')) {
        Storage.clearAllCards();
        allCards = [];
        renderCards();
        showToast('Todo borrado', 'Empezá de nuevo con fe', 'warning');
      }
    });
  }

  /* ─────────────────────────────────────────────
     MANEJAR GENERACIÓN (con feedback visual)
  ───────────────────────────────────────────── */
  async function handleGenerate() {
    const btn = document.getElementById('btnGenerate');
    btn.classList.add('loading');
    btn.querySelector('.btn-gen-icon').innerHTML = '<i class="fas fa-circle-notch spin"></i>';
    btn.querySelector('.btn-gen-text').textContent = 'Generando...';

    // Simula un pequeño delay (como si fuese una API)
    await new Promise(r => setTimeout(r, 900));

    const card = Engine.generateCard('auto', false);
    Storage.addCard(card);
    allCards = Storage.getCards();
    addNewCard(card);

    const typeLabels = { versiculo: 'un versículo', frase: 'una frase', reflexion: 'una reflexión' };
    showToast(
      `✨ Nueva tarjeta generada`,
      `Generaste ${typeLabels[card.tipo]}`,
      'success'
    );

    btn.classList.remove('loading');
    btn.querySelector('.btn-gen-icon').innerHTML = '<i class="fas fa-bolt"></i>';
    btn.querySelector('.btn-gen-text').textContent = 'Generar Tarjeta de Hoy';

    // Actualizar sub-texto del botón con contador
    const total = Storage.getCards().length;
    document.getElementById('genSubText').textContent = `${total} tarjetas en total`;

    updateQuickStats();
  }

  return { init, showToast, setFilter, renderCards, updateQuickStats };
})();

/* ═══════════════════════════════════════════════════════════════
   5. STREAK MODULE
   ─ Registra visitas diarias y calcula la racha.
   ─ Muestra el calendario de los últimos 30 días.
═══════════════════════════════════════════════════════════════ */

const Streak = (() => {

  function todayStr() {
    return new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"
  }

  function update() {
    const data = Storage.getStreakData();
    const today = todayStr();

    if (data.lastVisit !== today) {
      // Nueva visita hoy
      data.totalVisits++;

      // ¿Es día consecutivo?
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().slice(0, 10);

      if (data.lastVisit === yesterdayStr) {
        data.currentStreak++;
      } else {
        data.currentStreak = 1; // Rompe racha
      }

      data.bestStreak = Math.max(data.bestStreak, data.currentStreak);
      data.lastVisit  = today;

      if (!data.visitedDays.includes(today)) {
        data.visitedDays.push(today);
        // Conservar solo los últimos 90 días para no crecer indefinidamente
        if (data.visitedDays.length > 90) {
          data.visitedDays = data.visitedDays.slice(-90);
        }
      }

      Storage.saveStreakData(data);
    }

    return data;
  }

  function renderCalendar(data) {
    const cal = document.getElementById('streakCalendar');
    if (!cal) return;

    cal.innerHTML = '';
    const today = new Date();

    // Mostrar los últimos 30 días
    for (let i = 29; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const str = d.toISOString().slice(0, 10);
      const dayNum = d.getDate();

      const div = document.createElement('div');
      div.className = 'streak-day';
      div.textContent = dayNum;
      div.title = str;

      if (str === todayStr()) {
        div.classList.add('today');
      } else if (data.visitedDays.includes(str)) {
        div.classList.add('visited');
      }

      cal.appendChild(div);
    }
  }

  function renderStats(data) {
    const el = (id, val) => {
      const e = document.getElementById(id);
      if (e) e.textContent = val;
    };
    el('currentStreak', data.currentStreak);
    el('bestStreak',    data.bestStreak);
    el('totalVisits',   data.totalVisits);
  }

  function init() {
    const data = update();
    renderCalendar(data);
    renderStats(data);
  }

  return { init };
})();

/* ═══════════════════════════════════════════════════════════════
   6. CURSOR MODULE
   ─ Cursor personalizado con lag animado.
═══════════════════════════════════════════════════════════════ */

const CursorModule = (() => {
  function init() {
    const cursor     = document.getElementById('cursor');
    const cursorRing = document.getElementById('cursorRing');
    if (!cursor || !cursorRing) return;

    let cx = 0, cy = 0, rx = 0, ry = 0;

    document.addEventListener('mousemove', e => {
      cx = e.clientX; cy = e.clientY;
      cursor.style.transform = `translate(${cx}px, ${cy}px) translate(-50%,-50%)`;
    });

    function animateRing() {
      rx += (cx - rx) * 0.1;
      ry += (cy - ry) * 0.1;
      cursorRing.style.transform = `translate(${rx}px, ${ry}px) translate(-50%,-50%)`;
      requestAnimationFrame(animateRing);
    }
    animateRing();

    // Hover en elementos interactivos
    document.querySelectorAll('a, button, .inspiration-card, .athlete-card').forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.style.transform += ' scale(2)';
        cursor.style.background = 'var(--dorado)';
        cursorRing.style.width  = '54px';
        cursorRing.style.height = '54px';
        cursorRing.style.borderColor = 'var(--dorado)';
      });
      el.addEventListener('mouseleave', () => {
        cursor.style.background = 'var(--verde)';
        cursorRing.style.width  = '36px';
        cursorRing.style.height = '36px';
        cursorRing.style.borderColor = 'var(--verde)';
      });
    });
  }

  return { init };
})();

/* ═══════════════════════════════════════════════════════════════
   7. PARTICLES MODULE
   ─ Canvas de partículas flotantes (balones + estrellas).
   ─ Performante: usa requestAnimationFrame con throttling.
═══════════════════════════════════════════════════════════════ */

const Particles = (() => {
  function init() {
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let W, H, particles;

    function resize() {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
    }

    // Clase de partícula
    function Particle() {
      this.reset = function() {
        this.x    = Math.random() * W;
        this.y    = Math.random() * H + H;
        this.size = Math.random() * 2 + 1;
        this.speed= Math.random() * 0.4 + 0.1;
        this.alpha= Math.random() * 0.4 + 0.05;
        this.type = Math.random() > 0.7 ? 'cross' : 'dot';
      };
      this.reset();
      this.y = Math.random() * H; // No empezar todos desde abajo
    }

    function drawCross(x, y, size, alpha) {
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.strokeStyle = '#f5c518';
      ctx.lineWidth   = size * 0.5;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(x, y - size);
      ctx.lineTo(x, y + size);
      ctx.moveTo(x - size * 0.6, y - size * 0.3);
      ctx.lineTo(x + size * 0.6, y - size * 0.3);
      ctx.stroke();
      ctx.restore();
    }

    function animate() {
      ctx.clearRect(0, 0, W, H);

      particles.forEach(p => {
        p.y -= p.speed;
        if (p.y < -20) p.reset();

        if (p.type === 'cross') {
          drawCross(p.x, p.y, p.size * 3, p.alpha);
        } else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(0, 200, 83, ${p.alpha})`;
          ctx.fill();
        }
      });

      requestAnimationFrame(animate);
    }

    resize();
    particles = Array.from({ length: 60 }, () => new Particle());
    window.addEventListener('resize', resize);
    animate();
  }

  return { init };
})();

/* ═══════════════════════════════════════════════════════════════
   8. THEME MODULE
   ─ Modo oscuro / claro con persistencia.
═══════════════════════════════════════════════════════════════ */

const ThemeModule = (() => {
  function init() {
    const btn  = document.getElementById('themeToggle');
    const icon = document.getElementById('themeIcon');
    if (!btn) return;

    const saved = Storage.getTheme();
    applyTheme(saved, icon);

    btn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      applyTheme(next, icon);
      Storage.saveTheme(next);
      UI.showToast(
        next === 'light' ? '☀️ Modo claro' : '🌙 Modo oscuro',
        '', 'info', 2000
      );
    });
  }

  function applyTheme(theme, icon) {
    document.documentElement.setAttribute('data-theme', theme);
    if (icon) {
      icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }
  }

  return { init };
})();

/* ═══════════════════════════════════════════════════════════════
   9. NAV MODULE
   ─ Navbar scroll effect + hamburger + reveal on scroll.
═══════════════════════════════════════════════════════════════ */

const NavModule = (() => {
  function init() {
    // Scroll effect
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 50);
    }, { passive: true });

    // Hamburger
    const hamburger = document.getElementById('hamburger');
    const mobileNav = document.getElementById('mobileNav');
    const mobileClose = document.getElementById('mobileClose');

    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      mobileNav.classList.toggle('open');
      document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
    });

    [mobileClose, mobileNav].forEach(el => {
      el.addEventListener('click', e => {
        if (e.target === mobileNav || e.target === mobileClose || e.target.closest('.mobile-nav-close')) {
          hamburger.classList.remove('open');
          mobileNav.classList.remove('open');
          document.body.style.overflow = '';
        }
      });
    });

    // Cerrar mobile nav al hacer click en link
    mobileNav.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileNav.classList.remove('open');
        document.body.style.overflow = '';
      });
    });

    // Intersection Observer para reveal
    const observer = new IntersectionObserver(entries => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add('visible'), i * 80);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    // Scroll hint
    const scrollHint = document.querySelector('.hero-scroll-hint');
    if (scrollHint) {
      scrollHint.addEventListener('click', () => {
        document.querySelector('.verse-of-day').scrollIntoView({ behavior: 'smooth' });
      });
    }
  }

  return { init };
})();

/* ═══════════════════════════════════════════════════════════════
   10. INIT — Punto de entrada principal
   ─ Se ejecuta cuando el DOM está listo.
   ─ Orquesta la inicialización de todos los módulos en orden.
═══════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  console.log('%c⚽ El Camino — Fe & Motivación ✝️', 'color:#00c853;font-size:1.2rem;font-weight:bold;');
  console.log('%cFue diseñado para tu camino al fútbol profesional con Dios.', 'color:#f5c518;');

  // Orden importa: Theme primero para evitar flash
  ThemeModule.init();
  NavModule.init();
  Particles.init();
  CursorModule.init();
  Streak.init();
  UI.init();

  // Actualizar sub-texto del botón generar con total
  const total = Storage.getCards().length;
  const genSub = document.getElementById('genSubText');
  if (genSub) {
    genSub.textContent = total > 0
      ? `${total} tarjetas guardadas`
      : 'Tu primera inspiración del día';
  }

  // Re-observar elementos reveal dinámicos
  setTimeout(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add('visible'), i * 80);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll('.reveal:not(.visible)').forEach(el => observer.observe(el));
  }, 100);

  // Si no hay tarjetas, generar automáticamente la primera del día
  const cards = Storage.getCards();
  if (cards.length === 0) {
    console.log('%c→ Primera visita detectada. Generando tarjeta inicial...', 'color:#8a9e8a;');
    setTimeout(() => {
      const card = Engine.generateCard('versiculo', true);
      Storage.addCard(card);
      UI.init(); // Re-render
      UI.showToast('¡Bienvenido!', 'Tu primera tarjeta fue generada automáticamente', 'success', 4000);
    }, 1500);
  }

});

/* ─── Fin de fe.js ─── */
