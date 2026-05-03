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
    { texto: "Mas buscad primeramente el reino de Dios y su justicia, y todas estas cosas os serán añadidas.", ref: "Mateo 6:33" },
    { texto: "El Señor es mi pastor; nada me faltará.", ref: "Salmos 23:1" },
    { texto: "Bienaventurado el hombre que persevera bajo la prueba.", ref: "Santiago 1:12" },
    { texto: "Todo lo que hagan, háganlo de corazón, como para el Señor.", ref: "Colosenses 3:23" },
    { texto: "El que es fiel en lo poco, también en lo mucho es fiel.", ref: "Lucas 16:10" },
    { texto: "Corramos con paciencia la carrera que tenemos por delante.", ref: "Hebreos 12:1" },
    { texto: "El Señor da esfuerzo al cansado y multiplica las fuerzas al que no tiene.", ref: "Isaías 40:29" },
    { texto: "Sean fuertes en el Señor y en el poder de su fuerza.", ref: "Efesios 6:10" },
    { texto: "El corazón del hombre piensa su camino, pero el Señor dirige sus pasos.", ref: "Proverbios 16:9" },
    { texto: "Me mostrarás la senda de la vida.", ref: "Salmos 16:11" },
    { texto: "El justo caerá siete veces, pero se levantará.", ref: "Proverbios 24:16" },
    { texto: "Guarda tu corazón, porque de él mana la vida.", ref: "Proverbios 4:23" },
    { texto: "Clama a mí y yo te responderé.", ref: "Jeremías 33:3" },
    { texto: "El Señor es bueno, fortaleza en el día de la angustia.", ref: "Nahúm 1:7" },
    { texto: "Sean hacedores de la palabra y no solo oidores.", ref: "Santiago 1:22" },
    { texto: "El Señor afirmará tus pasos.", ref: "Salmos 37:23" },
    { texto: "Todo tiene su tiempo.", ref: "Eclesiastés 3:1" },
    { texto: "Si Dios es por nosotros, ¿quién contra nosotros?", ref: "Romanos 8:31" },
    { texto: "El que confía en el Señor será prosperado.", ref: "Proverbios 28:25" },
    { texto: "Mi gracia es suficiente para ti.", ref: "2 Corintios 12:9" },
    { texto: "El Señor es mi luz y mi salvación; ¿de quién temeré?", ref: "Salmos 27:1" }, 

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
      imagen: "https://assets.goal.com/images/v3/blt3ac4fd3241c7a7dc/4587caf178e1f9ceaa38acf1e64176098543a49c.jpg?auto=webp&format=pjpg&width=3840&quality=60",
      frase: "Dios es el primero en todo. Antes que el fútbol, antes que la fama. Sin Él no soy nada."
    },
    {
      nombre: "Benzema",
      pais: "Francia 🇫🇷",
      imagen: "https://colimdo.org/wp-content/uploads/2023/01/20d86d25-karim-benzema.jpeg",
      frase: "La fe me da fuerza cuando el cuerpo quiere rendirse."
    },
    {
      nombre: "Vinicius Jr.",
      pais: "Brasil 🇧🇷",
      imagen: "https://www.planetsport.com/image-library/land/1600/1564940_vinicius-junior-29-jun-202416.webp",
      frase: "Dios siempre me dio fuerzas para superar las adversidades y seguir soñando."
    },
    {
      nombre: "C. Ronaldo",
      pais: "Portugal 🇵🇹",
      imagen: "https://editorial.uefa.com/resources/027b-16a6f83fcf8f-179708787343-1000/cristiano_ronaldo_of_portugal_celebrates_after_scoring_a.jpeg",
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

/* ════════════════════════════════════════════════════════════════
   CORRECCIÓN BUG: TARJETA DEL DÍA INDEPENDIENTE
   La tarjeta diaria se genera por fecha y es completamente
   independiente del historial de tarjetas guardadas/favoritas.
════════════════════════════════════════════════════════════════ */
const DailyCard = (() => {
  function todayKey() {
    return `dailyCard_${new Date().toISOString().slice(0, 10)}`; // dailyCard_YYYY-MM-DD
  }

  /** Obtiene la tarjeta del día (la crea si no existe aún hoy) */
  function getTodayCard() {
    const key = todayKey();
    try {
      const saved = localStorage.getItem(key);
      if (saved) return JSON.parse(saved);
    } catch {}
    // No existe → generarla con seed de la fecha
    const card = Engine.generateCard('auto', true);
    try { localStorage.setItem(key, JSON.stringify(card)); } catch {}
    return card;
  }

  /** Limpia claves antiguas de tarjetas diarias (mantiene solo 30 días) */
  function cleanup() {
    try {
      const keys = Object.keys(localStorage).filter(k => k.startsWith('dailyCard_'));
      if (keys.length > 30) {
        keys.sort().slice(0, keys.length - 30).forEach(k => localStorage.removeItem(k));
      }
    } catch {}
  }

  return { getTodayCard, cleanup };
})();

/* ════════════════════════════════════════════════════════════════
   11. PLAN ESPIRITUAL SEMANAL
════════════════════════════════════════════════════════════════ */
const WeeklyPlan = (() => {
  const KEY = 'elcamino_weekly_plan_v1';

  const PLAN = [
    {
      day: 1, theme: 'Fe', color: '#f5c518',
      verse: '"La fe es la certeza de lo que se espera, la convicción de lo que no se ve."',
      ref: 'Hebreos 11:1',
      reflection: 'Hoy entrená creyendo que el profesionalismo ya está escrito para vos. Aunque no lo veas, actúa como si ya lo tuvieras.'
    },
    {
      day: 2, theme: 'Disciplina', color: '#00c853',
      verse: '"Todo atleta se abstiene de todo. Ellos lo hacen para recibir una corona corruptible, pero nosotros una incorruptible."',
      ref: '1 Corintios 9:25',
      reflection: 'La disciplina no es castigo, es el lenguaje en que le hablas a tu sueño. Hoy hacé lo que tenés que hacer aunque no tengas ganas.'
    },
    {
      day: 3, theme: 'Humildad', color: '#5c8dff',
      verse: '"Dios resiste a los soberbios pero da gracia a los humildes."',
      ref: 'Santiago 4:6',
      reflection: 'El mejor en el campo muchas veces no es el más talentoso, sino el más entrenable. Hoy escuchá más, hablá menos y aprendé todo lo que puedas.'
    },
    {
      day: 4, theme: 'Esfuerzo', color: '#ff6b6b',
      verse: '"Sé fuerte y muy valiente. No te desanimes ni tengas miedo."',
      ref: 'Josué 1:9',
      reflection: 'El esfuerzo honesto nunca se pierde. Dios ve cada sprint, cada caída y cada vez que te levantaste. Tu sudor es una ofrenda.'
    },
    {
      day: 5, theme: 'Perseverancia', color: '#a78bfa',
      verse: '"El justo caerá siete veces, pero siete veces se levantará."',
      ref: 'Proverbios 24:16',
      reflection: 'No es el que tiene más talento sino el que se levanta más veces. Hoy, sin importar cómo salió el entrenamiento, prometé volver mañana.'
    },
    {
      day: 6, theme: 'Gratitud', color: '#f59e0b',
      verse: '"Estén siempre alegres, oren sin cesar, den gracias en todo."',
      ref: '1 Tesalonicenses 5:16-18',
      reflection: 'Agradecer transforma la perspectiva. Hoy escribí 3 cosas por las que estás agradecido en tu camino al fútbol profesional.'
    },
    {
      day: 7, theme: 'Descanso en Dios', color: '#34d399',
      verse: '"Vengan a mí todos los que están cansados y agobiados, y yo les daré descanso."',
      ref: 'Mateo 11:28',
      reflection: 'El descanso es parte del plan. Hoy suelta el control. Confía en que Dios trabaja incluso cuando vos descansás. Recarga cuerpo y espíritu.'
    }
  ];

  function getProgress() {
    try {
      const data = JSON.parse(localStorage.getItem(KEY)) || {};
      // Resetear si la semana cambió
      const weekKey = getWeekKey();
      if (data.weekKey !== weekKey) return { weekKey, completed: {} };
      return data;
    } catch { return { weekKey: getWeekKey(), completed: {} }; }
  }

  function getWeekKey() {
    const d = new Date();
    const startOfYear = new Date(d.getFullYear(), 0, 1);
    const week = Math.ceil(((d - startOfYear) / 86400000 + startOfYear.getDay() + 1) / 7);
    return `${d.getFullYear()}_W${week}`;
  }

  function saveProgress(data) {
    try { localStorage.setItem(KEY, JSON.stringify(data)); } catch {}
  }

  function render() {
    const grid = document.getElementById('weeklyPlanGrid');
    if (!grid) return;
    const progress = getProgress();
    const completedCount = Object.keys(progress.completed).length;

    grid.innerHTML = PLAN.map(day => {
      const done = !!progress.completed[day.day];
      return `
        <div class="weekly-day-card ${done ? 'completed' : ''}" style="--day-color:${day.color}">
          <div class="weekly-day-num">0${day.day}</div>
          <div class="weekly-day-theme">${day.theme}</div>
          <div class="weekly-day-verse">${day.verse}</div>
          <cite class="weekly-day-ref">${day.ref}</cite>
          <p class="weekly-day-reflection">${day.reflection}</p>
          <button class="weekly-day-btn" data-day="${day.day}">
            ${done ? '✅ Completado' : 'Marcar como completado'}
          </button>
        </div>
      `;
    }).join('');

    // Bind botones
    grid.querySelectorAll('.weekly-day-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const dayNum = parseInt(btn.dataset.day);
        const prog = getProgress();
        if (prog.completed[dayNum]) {
          delete prog.completed[dayNum];
        } else {
          prog.completed[dayNum] = new Date().toISOString();
        }
        saveProgress(prog);
        render();
        updateProgress();
        UI.showToast(
          prog.completed ? '🙏 ¡Día completado!' : 'Desmarcado',
          PLAN.find(p => p.day === dayNum).theme,
          'success'
        );
        AchievementsModule.check();
      });
    });

    updateProgress();
  }

  function updateProgress() {
    const progress = getProgress();
    const count = Object.keys(progress.completed).length;
    const pct = (count / 7) * 100;
    const fill = document.getElementById('weeklyProgressFill');
    const text = document.getElementById('weeklyProgressText');
    if (fill) fill.style.width = pct + '%';
    if (text) text.textContent = `${count} / 7 días`;
  }

  function getCompletedCount() {
    return Object.keys(getProgress().completed).length;
  }

  return { render, getCompletedCount };
})();

/* ════════════════════════════════════════════════════════════════
   12. DIARIO PERSONAL (JOURNAL)
════════════════════════════════════════════════════════════════ */
const Journal = (() => {
  const KEY = 'elcamino_journal_v1';

  function getEntries() {
    try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch { return []; }
  }

  function saveEntries(entries) {
    try { localStorage.setItem(KEY, JSON.stringify(entries)); } catch {}
  }

  function getTodayStr() {
    return new Date().toISOString().slice(0, 10);
  }

  function formatDateNice(str) {
    return new Date(str + 'T12:00:00').toLocaleDateString('es-AR', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
  }

  function render() {
    // Header con fecha
    const header = document.getElementById('journalDateHeader');
    if (header) {
      header.textContent = `📅 ${formatDateNice(getTodayStr())}`;
    }

    // Preload si hay entrada de hoy
    const entries = getEntries();
    const todayEntry = entries.find(e => e.date === getTodayStr());
    if (todayEntry) {
      const q1 = document.getElementById('journalQ1');
      const q2 = document.getElementById('journalQ2');
      const q3 = document.getElementById('journalQ3');
      if (q1) q1.value = todayEntry.q1 || '';
      if (q2) q2.value = todayEntry.q2 || '';
      if (q3) q3.value = todayEntry.q3 || '';
    }

    renderHistory();
  }

  function renderHistory() {
    const container = document.getElementById('journalHistory');
    if (!container) return;
    const entries = getEntries();

    if (entries.length === 0) {
      container.innerHTML = `<p style="text-align:center;color:var(--gris);padding:20px;">
        Todavía no hay entradas. ¡Escribí tu primer día!
      </p>`;
      return;
    }

    container.innerHTML = entries.slice(0, 10).map(entry => `
      <div class="journal-entry" data-date="${entry.date}">
        <div class="journal-entry-date">
          <i class="fas fa-calendar-alt"></i>
          ${formatDateNice(entry.date)}
        </div>
        ${entry.q1 ? `<div class="journal-entry-q">
          <div class="journal-entry-q-label">💡 Qué aprendí</div>
          <div class="journal-entry-q-text">${entry.q1}</div>
        </div>` : ''}
        ${entry.q2 ? `<div class="journal-entry-q">
          <div class="journal-entry-q-label">👁 Cómo vi a Dios</div>
          <div class="journal-entry-q-text">${entry.q2}</div>
        </div>` : ''}
        ${entry.q3 ? `<div class="journal-entry-q">
          <div class="journal-entry-q-label">⬆️ Qué mejorar</div>
          <div class="journal-entry-q-text">${entry.q3}</div>
        </div>` : ''}
        <div class="journal-entry-actions">
          <button class="journal-entry-btn danger" data-delete="${entry.date}">
            <i class="fas fa-trash"></i> Eliminar
          </button>
        </div>
      </div>
    `).join('');

    // Bind delete
    container.querySelectorAll('[data-delete]').forEach(btn => {
      btn.addEventListener('click', () => {
        if (confirm('¿Eliminar esta entrada del diario?')) {
          const entries = getEntries().filter(e => e.date !== btn.dataset.delete);
          saveEntries(entries);
          renderHistory();
          UI.showToast('Entrada eliminada', '', 'warning');
        }
      });
    });
  }

  function save() {
    const q1 = document.getElementById('journalQ1').value.trim();
    const q2 = document.getElementById('journalQ2').value.trim();
    const q3 = document.getElementById('journalQ3').value.trim();

    if (!q1 && !q2 && !q3) {
      UI.showToast('Escribí algo primero', 'Las tres preguntas están vacías', 'warning');
      return;
    }

    const entries = getEntries().filter(e => e.date !== getTodayStr());
    entries.unshift({ date: getTodayStr(), q1, q2, q3, savedAt: new Date().toISOString() });
    saveEntries(entries);
    renderHistory();
    UI.showToast('✍️ Entrada guardada', 'Tu día quedó registrado', 'success');
    AchievementsModule.check();
  }

  function getEntryCount() { return getEntries().length; }

  function init() {
    render();
    const saveBtn = document.getElementById('btnJournalSave');
    if (saveBtn) saveBtn.addEventListener('click', save);
  }

  return { init, getEntryCount };
})();

/* ════════════════════════════════════════════════════════════════
   13. OBJETIVOS CON DIOS
════════════════════════════════════════════════════════════════ */
const GoalsModule = (() => {
  const KEY = 'elcamino_goals_v1';

  const DEFAULT_GOALS = [
    { id: 'pray', icon: '🙏', title: 'Orar todos los días', desc: 'Un mínimo de 5 minutos en comunión con Dios.' },
    { id: 'bible', icon: '📖', title: 'Leer la Biblia', desc: 'Al menos un capítulo o versículo meditado.' },
    { id: 'trust', icon: '⚽', title: 'Confiar en Dios en partidos', desc: 'Antes de cada entrenamiento o partido, entregar el resultado a Él.' },
    { id: 'gratitude', icon: '✨', title: 'Practicar gratitud', desc: 'Escribir o pensar 3 cosas por las que estar agradecido.' },
    { id: 'rest', icon: '😴', title: 'Descansar bien', desc: 'Dormir 7-8 horas. El cuerpo es templo de Dios.' },
    { id: 'noexcuse', icon: '🔥', title: 'Sin excusas hoy', desc: 'Entrenar con la máxima intensidad sin buscar salidas fáciles.' },
  ];

  function getData() {
    try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch { return {}; }
  }
  function saveData(data) { try { localStorage.setItem(KEY, JSON.stringify(data)); } catch {} }

  function todayStr() { return new Date().toISOString().slice(0, 10); }

  function render() {
    const grid = document.getElementById('goalsGrid');
    if (!grid) return;
    const data = getData();
    const today = todayStr();

    grid.innerHTML = DEFAULT_GOALS.map(goal => {
      const goalData = data[goal.id] || { streak: 0, total: 0, lastChecked: null };
      const doneToday = goalData.lastChecked === today;
      const pct = Math.min(100, (goalData.streak / 30) * 100);

      return `
        <div class="goal-card">
          <span class="goal-streak-badge">🔥 ${goalData.streak} días</span>
          <span class="goal-icon">${goal.icon}</span>
          <div class="goal-title">${goal.title}</div>
          <p class="goal-desc">${goal.desc}</p>
          <div class="goal-progress-wrap">
            <div class="goal-progress-label">
              <span>Progreso mensual</span>
              <span>${goalData.streak}/30</span>
            </div>
            <div class="goal-progress-bar">
              <div class="goal-progress-fill" style="width:${pct}%"></div>
            </div>
          </div>
          <button class="goal-check-btn ${doneToday ? 'done-today' : ''}" data-goal="${goal.id}">
            <i class="fas ${doneToday ? 'fa-check-circle' : 'fa-circle'}"></i>
            ${doneToday ? '¡Cumplido hoy!' : 'Marcar cumplido'}
          </button>
        </div>
      `;
    }).join('');

    grid.querySelectorAll('.goal-check-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const goalId = btn.dataset.goal;
        const data = getData();
        const today = todayStr();
        const gd = data[goalId] || { streak: 0, total: 0, lastChecked: null };

        if (gd.lastChecked === today) {
          UI.showToast('Ya lo marcaste hoy', '', 'info'); return;
        }

        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yStr = yesterday.toISOString().slice(0, 10);
        gd.streak = (gd.lastChecked === yStr) ? gd.streak + 1 : 1;
        gd.total++;
        gd.lastChecked = today;
        data[goalId] = gd;
        saveData(data);
        render();
        UI.showToast('✅ ¡Meta cumplida!', DEFAULT_GOALS.find(g => g.id === goalId).title, 'success');
        AchievementsModule.check();
      });
    });
  }

  function getTotalGoalsCompleted() {
    const data = getData();
    return Object.values(data).reduce((sum, g) => sum + (g.total || 0), 0);
  }

  function getPrayStreak() {
    const data = getData();
    return (data['pray'] || {}).streak || 0;
  }

  function getBibleReadings() {
    const data = getData();
    return (data['bible'] || {}).total || 0;
  }

  return { render, getTotalGoalsCompleted, getPrayStreak, getBibleReadings };
})();

/* ════════════════════════════════════════════════════════════════
   14. BIBLIA RÁPIDA
════════════════════════════════════════════════════════════════ */
const BibleModule = (() => {

  const VERSES = [
    { text: 'Todo lo puedo en Cristo que me fortalece.', ref: 'Filipenses 4:13', topics: ['fe', 'fortaleza', 'futbol'] },
    { text: 'Esfuérzate y sé valiente, porque el Señor tu Dios estará contigo dondequiera que vayas.', ref: 'Josué 1:9', topics: ['fortaleza', 'disciplina', 'miedo'] },
    { text: 'Porque yo sé los planes que tengo para ustedes, planes de bienestar y no de calamidad.', ref: 'Jeremías 29:11', topics: ['fe'] },
    { text: 'No te dejes vencer por el mal, sino vence el mal con el bien.', ref: 'Romanos 12:21', topics: ['disciplina', 'futbol'] },
    { text: 'El Señor es mi fortaleza y mi escudo.', ref: 'Salmos 28:7', topics: ['fortaleza', 'miedo'] },
    { text: 'Confía en el Señor de todo tu corazón y no te apoyes en tu propio entendimiento.', ref: 'Proverbios 3:5', topics: ['fe'] },
    { text: 'Pero los que esperan al Señor renovarán sus fuerzas; volarán como las águilas.', ref: 'Isaías 40:31', topics: ['fortaleza', 'disciplina'] },
    { text: 'No temas, porque yo estoy contigo; no te angusties, porque yo soy tu Dios.', ref: 'Isaías 41:10', topics: ['miedo', 'fe'] },
    { text: 'Si Dios es por nosotros, ¿quién contra nosotros?', ref: 'Romanos 8:31', topics: ['fe', 'miedo'] },
    { text: 'Todo lo que hagan, háganlo de corazón, como para el Señor.', ref: 'Colosenses 3:23', topics: ['disciplina', 'futbol'] },
    { text: 'Corramos con paciencia la carrera que tenemos por delante.', ref: 'Hebreos 12:1', topics: ['disciplina', 'futbol'] },
    { text: 'El justo caerá siete veces, pero se levantará.', ref: 'Proverbios 24:16', topics: ['fortaleza', 'futbol'] },
    { text: 'Sé fuerte y no te desanimes. Tu trabajo tendrá recompensa.', ref: '2 Crónicas 15:7', topics: ['disciplina', 'fortaleza'] },
    { text: 'Deléitate en el Señor, y él te concederá los deseos de tu corazón.', ref: 'Salmos 37:4', topics: ['fe'] },
    { text: 'Porque nada hay imposible para Dios.', ref: 'Lucas 1:37', topics: ['fe', 'miedo'] },
    { text: 'Mi gracia es suficiente para ti, porque mi poder se perfecciona en la debilidad.', ref: '2 Corintios 12:9', topics: ['miedo', 'fortaleza'] },
    { text: 'Encomienda al Señor tus obras y tus planes se cumplirán.', ref: 'Proverbios 16:3', topics: ['fe', 'futbol'] },
    { text: 'Bienaventurado el hombre que persevera bajo la prueba.', ref: 'Santiago 1:12', topics: ['disciplina'] },
    { text: 'El Señor peleará por ustedes; ustedes quédense quietos.', ref: 'Éxodo 14:14', topics: ['fe', 'miedo'] },
    { text: 'Dios es nuestro refugio y nuestra fortaleza, nuestra ayuda en momentos de angustia.', ref: 'Salmos 46:1', topics: ['fortaleza', 'miedo'] },
    { text: 'Guarda tu corazón, porque de él mana la vida.', ref: 'Proverbios 4:23', topics: ['disciplina', 'futbol'] },
    { text: 'El que es fiel en lo poco, también en lo mucho es fiel.', ref: 'Lucas 16:10', topics: ['disciplina'] },
    { text: 'Sean fuertes en el Señor y en el poder de su fuerza.', ref: 'Efesios 6:10', topics: ['fortaleza'] },
    { text: 'Busca primeramente el reino de Dios y su justicia, y lo demás te será añadido.', ref: 'Mateo 6:33', topics: ['fe', 'futbol'] },
  ];

  let activeTopic = 'all';
  let searchTerm = '';

  function getFiltered() {
    return VERSES.filter(v => {
      const topicMatch = activeTopic === 'all' || v.topics.includes(activeTopic);
      const searchMatch = !searchTerm ||
        v.text.toLowerCase().includes(searchTerm) ||
        v.ref.toLowerCase().includes(searchTerm);
      return topicMatch && searchMatch;
    });
  }

  const TOPIC_LABELS = {
    all: 'Todos', fe: 'Fe', fortaleza: 'Fortaleza',
    disciplina: 'Disciplina', miedo: 'Sin Miedo', futbol: 'Fútbol'
  };

  function render() {
    const container = document.getElementById('bibleResults');
    if (!container) return;
    const verses = getFiltered();

    if (verses.length === 0) {
      container.innerHTML = `<p style="grid-column:1/-1;text-align:center;color:var(--gris);padding:20px;">
        No encontramos versículos con ese criterio.
      </p>`;
      return;
    }

    container.innerHTML = verses.map(v => `
      <div class="bible-card">
        <div class="bible-card-topic">${v.topics.map(t => TOPIC_LABELS[t] || t).join(' · ')}</div>
        <p class="bible-card-text">"${v.text}"</p>
        <span class="bible-card-ref">${v.ref}</span>
      </div>
    `).join('');
  }

  function init() {
    render();

    document.querySelectorAll('.bible-filter').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.bible-filter').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeTopic = btn.dataset.topic;
        render();
      });
    });

    const input = document.getElementById('bibleSearchInput');
    if (input) {
      input.addEventListener('input', () => {
        searchTerm = input.value.toLowerCase().trim();
        render();
      });
    }
  }

  return { init };
})();

/* ════════════════════════════════════════════════════════════════
   15. FRASES FÚTBOL + FE
════════════════════════════════════════════════════════════════ */
const QuotesFE = (() => {

  const QUOTES = [
    { text: 'Entrená como si todo dependiera de vos, pero confiá como si todo dependiera de Dios.', source: '— Mentalidad del Campeón', cat: 'motivacion' },
    { text: 'No te levantás porque sos el mejor. Te levantás porque Dios todavía tiene planes para vos en este campo.', source: '— El Camino', cat: 'motivacion' },
    { text: 'El partido más importante de tu vida no es el que jugás hoy. Es el que seguís preparando mañana.', source: '— Anónimo', cat: 'motivacion' },
    { text: 'La disciplina es elegir entre lo que querés ahora y lo que querés más. Yo elijo el profesionalismo.', source: '— Mentalidad Atleta', cat: 'disciplina' },
    { text: 'El talento abre puertas, el carácter las mantiene abiertas. Dios nos da los dos.', source: '— Anónimo', cat: 'disciplina' },
    { text: 'Cuando otros descansan, yo entreno. Pero siempre con Dios al centro, no con el ego.', source: '— El Camino', cat: 'disciplina' },
    { text: 'No hay entrenamiento perdido si tu corazón está alineado con el propósito de Dios.', source: '— El Camino', cat: 'disciplina' },
    { text: 'El fracaso no es caer. Es quedarse en el suelo cuando Dios ya te tendió la mano para levantarte.', source: '— El Camino', cat: 'fracaso' },
    { text: 'Cada "no" de un scout es Dios diciendo: todavía no estás donde quiero que llegues. Seguí trabajando.', source: '— Fe Deportiva', cat: 'fracaso' },
    { text: 'No te rompas por las críticas. Usalas como combustible. El fuego refina el oro.', source: '— Anónimo', cat: 'fracaso' },
    { text: 'La derrota de hoy es el capítulo más importante de la historia que Dios está escribiendo sobre tu vida.', source: '— El Camino', cat: 'fracaso' },
    { text: 'Jugá para la gloria de Dios, no para los aplausos del estadio. Los aplausos pasan, la gloria permanece.', source: '— Mentalidad Cristiana', cat: 'motivacion' },
    { text: 'Si Dios te dio el sueño, también te dio lo necesario para alcanzarlo. Confiá.', source: '— El Camino', cat: 'fe' },
  ];

  let activeCat = 'all';

  function render() {
    const grid = document.getElementById('quotesFEGrid');
    if (!grid) return;
    const filtered = activeCat === 'all' ? QUOTES : QUOTES.filter(q => q.cat === activeCat);

    grid.innerHTML = filtered.map(q => `
      <div class="qfe-card">
        <span class="qfe-cat-badge ${q.cat}">${q.cat === 'fracaso' ? 'Resiliencia' : q.cat.charAt(0).toUpperCase() + q.cat.slice(1)}</span>
        <p class="qfe-text">"${q.text}"</p>
        <span class="qfe-source"><i class="fas fa-quote-right"></i> ${q.source}</span>
      </div>
    `).join('');
  }

  function init() {
    render();
    document.querySelectorAll('.qfe-filter').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.qfe-filter').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeCat = btn.dataset.cat;
        render();
      });
    });
  }

  return { init };
})();

/* ════════════════════════════════════════════════════════════════
   16. LOGROS (GAMIFICACIÓN)
════════════════════════════════════════════════════════════════ */
const AchievementsModule = (() => {
  const KEY = 'elcamino_achievements_v1';

  const ACHIEVEMENTS = [
    { id: 'first_card', medal: '⭐', title: 'Primer Paso', desc: 'Guardaste tu primera tarjeta de inspiración.', condition: () => Storage.getCards().length >= 1 },
    { id: 'streak_3', medal: '🔥', title: 'Constante', desc: '3 días seguidos visitando la sección.', condition: () => Storage.getStreakData().currentStreak >= 3 },
    { id: 'streak_7', medal: '⚡', title: 'Fuego Vivo', desc: '7 días seguidos de constancia espiritual.', condition: () => Storage.getStreakData().currentStreak >= 7 },
    { id: 'bible_7', medal: '📖', title: 'Discípulo', desc: 'Marcaste "Leer la Biblia" 7 veces.', condition: () => GoalsModule.getBibleReadings() >= 7 },
    { id: 'pray_10', medal: '🙏', title: 'Hombre de Fe', desc: 'Cumpliste el objetivo de orar 10 días.', condition: () => GoalsModule.getPrayStreak() >= 10 },
    { id: 'journal_5', medal: '✍️', title: 'Cronista del Alma', desc: 'Escribiste 5 entradas en tu diario.', condition: () => Journal.getEntryCount() >= 5 },
    { id: 'weekly_complete', medal: '🏆', title: 'Semana Santa', desc: 'Completaste los 7 días del plan espiritual.', condition: () => WeeklyPlan.getCompletedCount() >= 7 },
    { id: 'cards_10', medal: '🌟', title: 'Coleccionista', desc: '10 tarjetas de inspiración guardadas.', condition: () => Storage.getCards().length >= 10 },
    { id: 'favs_5', medal: '❤️', title: 'Corazón Pleno', desc: '5 tarjetas marcadas como favoritas.', condition: () => Storage.getCards().filter(c => c.favorito).length >= 5 },
    { id: 'goals_30', medal: '👑', title: 'Campeón con Dios', desc: '30 objetivos completados en total.', condition: () => GoalsModule.getTotalGoalsCompleted() >= 30 },
  ];

  function getUnlocked() {
    try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch { return []; }
  }

  function saveUnlocked(list) {
    try { localStorage.setItem(KEY, JSON.stringify(list)); } catch {}
  }

  function check() {
    const unlocked = getUnlocked();
    let newUnlock = false;

    ACHIEVEMENTS.forEach(ach => {
      if (!unlocked.includes(ach.id) && ach.condition()) {
        unlocked.push(ach.id);
        newUnlock = true;
        setTimeout(() => {
          UI.showToast(`${ach.medal} ¡Logro desbloqueado!`, ach.title, 'success', 5000);
        }, 500);
      }
    });

    if (newUnlock) { saveUnlocked(unlocked); render(); }
  }

  function render() {
    const grid = document.getElementById('achievementsGrid');
    if (!grid) return;
    const unlocked = getUnlocked();

    grid.innerHTML = ACHIEVEMENTS.map(ach => {
      const isUnlocked = unlocked.includes(ach.id);
      return `
        <div class="achievement-card ${isUnlocked ? 'unlocked' : ''}">
          <span class="achievement-medal">${ach.medal}</span>
          <div class="achievement-title">${ach.title}</div>
          <p class="achievement-desc">${ach.desc}</p>
          <span class="achievement-status">${isUnlocked ? '✅ Desbloqueado' : '🔒 Pendiente'}</span>
        </div>
      `;
    }).join('');
  }

  return { render, check };
})();

/* ════════════════════════════════════════════════════════════════
   17. RECORDATORIOS
════════════════════════════════════════════════════════════════ */
const RemindersModule = (() => {
  const KEY = 'elcamino_reminders_v1';

  const DEFAULT_REMINDERS = [
    { id: 'prayer', icon: 'fa-hands', title: 'Hora de Orar', defaultTime: '07:00' },
    { id: 'reflection', icon: 'fa-brain', title: 'Hora de Reflexionar', defaultTime: '21:00' },
    { id: 'training', icon: 'fa-futbol', title: 'Recordatorio de Entreno', defaultTime: '09:00' },
    { id: 'gratitude', icon: 'fa-heart', title: 'Momento de Gratitud', defaultTime: '20:00' },
  ];

  function getData() {
    try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch { return {}; }
  }
  function saveData(d) { try { localStorage.setItem(KEY, JSON.stringify(d)); } catch {} }

  function render() {
    const grid = document.getElementById('remindersGrid');
    if (!grid) return;
    const data = getData();

    grid.innerHTML = DEFAULT_REMINDERS.map(rem => {
      const saved = data[rem.id] || { time: rem.defaultTime, active: false };
      return `
        <div class="reminder-card">
          <div class="reminder-icon"><i class="fas ${rem.icon}"></i></div>
          <div class="reminder-info">
            <div class="reminder-title">${rem.title}</div>
            <input type="time" class="reminder-time-input" data-rem="${rem.id}" value="${saved.time}"/>
          </div>
          <button class="reminder-toggle ${saved.active ? 'on' : ''}" data-rem-toggle="${rem.id}" title="${saved.active ? 'Desactivar' : 'Activar'}"></button>
        </div>
      `;
    }).join('');

    // Bind time change
    grid.querySelectorAll('.reminder-time-input').forEach(input => {
      input.addEventListener('change', () => {
        const data = getData();
        const remId = input.dataset.rem;
        if (!data[remId]) data[remId] = { time: input.value, active: false };
        data[remId].time = input.value;
        saveData(data);
        UI.showToast('⏰ Recordatorio actualizado', input.value, 'info');
      });
    });

    // Bind toggle
    grid.querySelectorAll('[data-rem-toggle]').forEach(btn => {
      btn.addEventListener('click', () => {
        const data = getData();
        const remId = btn.dataset.remToggle;
        if (!data[remId]) data[remId] = { time: '08:00', active: false };
        data[remId].active = !data[remId].active;
        saveData(data);
        btn.classList.toggle('on', data[remId].active);
        UI.showToast(
          data[remId].active ? '🔔 Recordatorio activado' : '🔕 Recordatorio desactivado',
          DEFAULT_REMINDERS.find(r => r.id === remId).title,
          data[remId].active ? 'success' : 'info'
        );
      });
    });
  }

  return { render };
})();

/* ════════════════════════════════════════════════════════════════
   18. MODO REFLEXIÓN
════════════════════════════════════════════════════════════════ */
const ReflectionMode = (() => {
  function open() {
    const overlay = document.getElementById('reflectionMode');
    if (!overlay) return;
    // Usar versículo del día
    const v = Engine.getVersiculoDelDia();
    const verseEl = document.getElementById('reflectionVerse');
    const refEl   = document.getElementById('reflectionRef');
    if (verseEl) verseEl.textContent = `"${v.texto}"`;
    if (refEl)   refEl.textContent   = `— ${v.ref}`;
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    const overlay = document.getElementById('reflectionMode');
    if (!overlay) return;
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  function init() {
    const floatBtn = document.getElementById('btnReflectionFloat');
    const closeBtn = document.getElementById('reflectionClose');
    const overlay  = document.getElementById('reflectionMode');
    if (floatBtn) floatBtn.addEventListener('click', open);
    if (closeBtn) closeBtn.addEventListener('click', close);
    if (overlay) overlay.addEventListener('click', e => {
      if (e.target === overlay) close();
    });
    // ESC key
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') close();
    });
  }

  return { init };
})();

/* ════════════════════════════════════════════════════════════════
   INIT PRINCIPAL — actualizado con todos los nuevos módulos
════════════════════════════════════════════════════════════════ */

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

  // ── CORRECCIÓN BUG TARJETA DEL DÍA ──
  // La tarjeta del día es INDEPENDIENTE del historial de guardadas
  DailyCard.cleanup();
  const todayCard = DailyCard.getTodayCard();
  // Solo auto-guardar si el historial está completamente vacío (primera vez)
  if (Storage.getCards().length === 0) {
    Storage.addCard(todayCard);
    UI.init(); // Re-render con la tarjeta inicial
    setTimeout(() => {
      UI.showToast('¡Bienvenido!', 'Tu tarjeta del día fue generada', 'success', 4000);
    }, 1500);
  }
  // La tarjeta diaria existe independientemente de si fue guardada o no

  // Actualizar sub-texto del botón generar
  const total = Storage.getCards().length;
  const genSub = document.getElementById('genSubText');
  if (genSub) {
    genSub.textContent = total > 0
      ? `${total} tarjetas guardadas`
      : 'Tu primera inspiración del día';
  }

  // ── INICIALIZAR NUEVOS MÓDULOS ──
  WeeklyPlan.render();
  Journal.init();
  GoalsModule.render();
  BibleModule.init();
  QuotesFE.init();
  AchievementsModule.render();
  AchievementsModule.check();
  RemindersModule.render();
  ReflectionMode.init();

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

});

/* ─── Fin de fe.js ─── */
