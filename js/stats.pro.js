/* ═══════════════════════════════════════════════════════════════════════════
   STATS PRO — El Camino
   Archivo único para todas las funcionalidades avanzadas.

   CÓMO FUNCIONA:
   - estadisitcas.js ya está parcheado para llamar ProStats.renderAll()
     al final de cada renderAll().
   - Este archivo usa las variables globales ya existentes:
     matches, trainings, mentalLog (definidas en estadisitcas.js)
   - NO redefine nada. Solo agrega.
   ═══════════════════════════════════════════════════════════════════════════ */

'use strict';

const ProStats = (() => {

  /* ── HELPERS internos ──────────────────────────────────────────────────── */
  function $id(id) { return document.getElementById(id); }
  function setText(id, val) { const e = $id(id); if (e) e.textContent = val; }

  /* ── ACCESO SEGURO a arrays globales ───────────────────────────────────── */
  function getMatches()   { return (typeof matches   !== 'undefined') ? matches   : []; }
  function getTrainings() { return (typeof trainings !== 'undefined') ? trainings : []; }
  function getMental()    { return (typeof mentalLog !== 'undefined') ? mentalLog : []; }

  /* ═══════════════════════════════════════════════════════════════════════
     CALCULADORES
     ═══════════════════════════════════════════════════════════════════════ */

  /* ── Atributos FIFA (0-100) ────────────────────────────────────────────── */
  function calcAttributes() {
    const M = getMatches();
    const T = getTrainings();

    const fastT   = T.filter(t => t.type === 'fisico' && ['alta','máxima'].includes(t.intensity)).length;
    const fastEm  = M.filter(m => m.emotion === 'rápido').length;
    const velocidad = Math.min(100, fastT * 8 + fastEm * 6 + (T.length > 0 ? 20 : 0));

    const physT   = T.filter(t => t.type === 'fisico').length;
    const avgDur  = T.length ? T.reduce((a,t) => a + (parseInt(t.duration)||60), 0) / T.length : 0;
    const fisico  = Math.min(100, physT * 6 + (avgDur > 75 ? 15 : avgDur > 45 ? 8 : 3) + (M.length > 0 ? 10 : 0));

    const totalG  = M.reduce((a,m) => a + (m.goals||0), 0);
    const avgG    = M.length ? totalG / M.length : 0;
    const bigM    = M.filter(m => m.type === '11v11').length;
    const definicion = Math.min(100, totalG * 4 + avgG * 18 + bigM * 3);

    const techT   = T.filter(t => t.type === 'tecnico').length;
    const totalA  = M.reduce((a,m) => a + (m.assists||0), 0);
    const highP   = M.filter(m => m.participation === 'alta').length;
    const tecnica = Math.min(100, techT * 7 + totalA * 5 + highP * 4 + (T.length > 0 ? 10 : 0));

    const tactT   = T.filter(t => ['tactico','mental'].includes(t.type)).length;
    const avgR    = M.length ? M.reduce((a,m) => a + (m.rating||5), 0) / M.length : 5;
    const wins    = M.filter(m => m.result === 'win').length;
    const wr      = M.length ? wins / M.length : 0;
    const iq      = Math.min(100, tactT * 7 + avgR * 4 + wr * 30 + (M.length > 5 ? 12 : 0));

    return { velocidad, fisico, definicion, tecnica, iq };
  }

  function calcOVR() {
    const a = calcAttributes();
    return Math.round((a.velocidad + a.fisico + a.definicion + a.tecnica + a.iq) / 5);
  }

  /* ── Disciplina ────────────────────────────────────────────────────────── */
  function calcDiscipline() {
    const T = getTrainings();
    const now = new Date();
    const weeks = [];

    for (let w = 0; w < 8; w++) {
      const ws = new Date(now);
      ws.setDate(now.getDate() - now.getDay() - w * 7);
      ws.setHours(0,0,0,0);
      const we = new Date(ws);
      we.setDate(ws.getDate() + 6);
      we.setHours(23,59,59,999);
      const count = T.filter(t => {
        if (!t.date) return false;
        const d = new Date(t.date + 'T00:00:00');
        return d >= ws && d <= we;
      }).length;
      weeks.unshift({ count, start: new Date(ws) });
    }

    const activeWeeks = weeks.filter(w => w.count > 0).length;
    const consistency = Math.round((activeWeeks / 8) * 100);

    let diasSinActividad = 0;
    if (T.length) {
      const last = [...T].sort((a,b) => b.date > a.date ? 1 : -1)[0].date;
      diasSinActividad = Math.round((now - new Date(last + 'T00:00:00')) / 86400000);
    }

    const last4 = weeks.slice(4);
    const avgDaysPerWeek = +(last4.reduce((a,w) => a + w.count, 0) / 4).toFixed(1);

    return { consistency, diasSinActividad, avgDaysPerWeek, weeks };
  }

  /* ── Rendimiento avanzado ──────────────────────────────────────────────── */
  function calcAdvPerformance() {
    const M = getMatches();
    if (!M.length) return { gpp:0, app:0, ofensiva:0, last5Rating:0, last5Goals:0 };
    const tg   = M.reduce((a,m) => a + (m.goals||0), 0);
    const ta   = M.reduce((a,m) => a + (m.assists||0), 0);
    const gpp  = +(tg / M.length).toFixed(2);
    const app  = +(ta / M.length).toFixed(2);
    const of   = +((tg + ta) / M.length).toFixed(2);
    const l5   = M.slice(-5);
    const l5r  = l5.length ? +(l5.reduce((a,m) => a + (m.rating||5), 0) / l5.length).toFixed(1) : 0;
    const l5g  = l5.reduce((a,m) => a + (m.goals||0), 0);
    return { gpp, app, ofensiva: of, last5Rating: l5r, last5Goals: l5g };
  }

  /* ── Rendimiento por tipo ──────────────────────────────────────────────── */
  function calcByType() {
    const M = getMatches();
    const byType = {};
    M.forEach(m => {
      if (!byType[m.type]) byType[m.type] = { goals:0, assists:0, wins:0, count:0, rating:0 };
      byType[m.type].goals   += (m.goals||0);
      byType[m.type].assists += (m.assists||0);
      byType[m.type].wins    += m.result === 'win' ? 1 : 0;
      byType[m.type].rating  += (m.rating||5);
      byType[m.type].count++;
    });
    return Object.entries(byType).map(([type, d]) => ({
      type,
      goals:     d.goals,
      assists:   d.assists,
      winrate:   Math.round((d.wins / d.count) * 100),
      avgRating: +(d.rating / d.count).toFixed(1),
      count:     d.count
    })).sort((a,b) => b.count - a.count);
  }

  /* ── Evolución semanal (8 semanas) ────────────────────────────────────── */
  function calcWeeklyEvo() {
    const M  = getMatches();
    const ML = getMental();
    const now = new Date();
    const weeks = [];

    for (let w = 7; w >= 0; w--) {
      const ws = new Date(now);
      ws.setDate(now.getDate() - now.getDay() - w * 7);
      ws.setHours(0,0,0,0);
      const we = new Date(ws);
      we.setDate(ws.getDate() + 6);
      we.setHours(23,59,59,999);

      const label = ws.toLocaleDateString('es-AR', { day:'numeric', month:'short' });

      const wm = M.filter(m => {
        if (!m.date) return false;
        const d = new Date(m.date + 'T00:00:00');
        return d >= ws && d <= we;
      });
      const wml = ML.filter(m => {
        if (!m.date) return false;
        const d = new Date(m.date + 'T00:00:00');
        return d >= ws && d <= we;
      });

      const goals  = wm.reduce((a,m) => a + (m.goals||0), 0);
      const rating = wm.length ? +(wm.reduce((a,m) => a + (m.rating||5), 0) / wm.length).toFixed(1) : null;
      const mental = wml.length
        ? +(wml.reduce((a,m) => a + ((m.energia + m.motivacion + m.enfoque + m.disciplina) / 4 || 5), 0) / wml.length).toFixed(1)
        : null;

      weeks.push({ label, goals, rating, mental });
    }
    return weeks;
  }

  /* ── Scout Report ──────────────────────────────────────────────────────── */
  function calcScout() {
    const M  = getMatches();
    const T  = getTrainings();
    const ML = getMental();
    const totalM = M.length;
    const totalT = T.length;

    if (totalM < 2 && totalT < 2) {
      return {
        perfil: 'Jugador en Inicio',
        desc: 'Registrá al menos 2 partidos y 2 entrenamientos para activar el análisis automático.',
        fortalezas: [], mejoras: [], rating: 0,
        recom: 'Comenzá a registrar datos para ver tu informe completo.',
        tags: ['Inicio']
      };
    }

    const totalG  = M.reduce((a,m) => a + (m.goals||0), 0);
    const totalA  = M.reduce((a,m) => a + (m.assists||0), 0);
    const wins    = M.filter(m => m.result === 'win').length;
    const winrate = totalM ? Math.round((wins / totalM) * 100) : 0;
    const avgR    = totalM ? +(M.reduce((a,m) => a + (m.rating||5), 0) / totalM).toFixed(1) : 0;
    const attrs   = calcAttributes();
    const perf    = calcAdvPerformance();
    const disc    = calcDiscipline();

    let mental = { energia:5, motivacion:5, enfoque:5, disciplina:5 };
    if (ML.length) {
      const last7 = ML.slice(-7);
      const n = last7.length;
      mental = {
        energia:    +(last7.reduce((a,m) => a + (m.energia||5), 0) / n).toFixed(1),
        motivacion: +(last7.reduce((a,m) => a + (m.motivacion||5), 0) / n).toFixed(1),
        enfoque:    +(last7.reduce((a,m) => a + (m.enfoque||5), 0) / n).toFixed(1),
        disciplina: +(last7.reduce((a,m) => a + (m.disciplina||5), 0) / n).toFixed(1)
      };
    }

    const esGoleador  = totalG > totalA * 1.8;
    const esCreador   = totalA > totalG * 1.2;
    const esGanador   = winrate >= 60;
    const esMotor     = M.filter(m => m.participation === 'alta').length > totalM * 0.55;
    const esConstante = disc.consistency >= 60;

    let perfil = 'Jugador en Crecimiento';
    if (esGoleador && esCreador) perfil = 'Jugador Total Ofensivo';
    else if (esGoleador)         perfil = 'Goleador Puro';
    else if (esCreador)          perfil = 'Creador de Juego';
    else if (esGanador && esMotor) perfil = 'Motor Ganador';
    else if (esGanador)          perfil = 'Jugador de Alto Rendimiento';
    else if (esMotor)            perfil = 'Trabajador del Campo';
    else if (esConstante)        perfil = 'Atleta Disciplinado';

    let desc = totalM + ' partido' + (totalM !== 1 ? 's' : '') + ' · ';
    desc    += totalT + ' entreno' + (totalT !== 1 ? 's' : '') + '. ';
    if (esGoleador) desc += perf.gpp + ' goles/partido promedio. ';
    if (esCreador)  desc += perf.app + ' asistencias/partido. ';
    if (esGanador)  desc += winrate + '% de efectividad. ';
    desc += 'Calificacion promedio: ' + avgR + '/10.';

    const fortalezas = [];
    if (attrs.definicion >= 40) fortalezas.push({ icon:'🎯', texto:'Definicion (' + attrs.definicion + '/100)' });
    if (attrs.tecnica >= 40)    fortalezas.push({ icon:'⚽', texto:'Tecnica (' + attrs.tecnica + '/100)' });
    if (attrs.iq >= 40)         fortalezas.push({ icon:'🧠', texto:'IQ Futbolistico (' + attrs.iq + '/100)' });
    if (attrs.velocidad >= 40)  fortalezas.push({ icon:'⚡', texto:'Velocidad (' + attrs.velocidad + '/100)' });
    if (attrs.fisico >= 40)     fortalezas.push({ icon:'💪', texto:'Fisico (' + attrs.fisico + '/100)' });
    if (winrate >= 55)          fortalezas.push({ icon:'🏆', texto:'Winrate del ' + winrate + '%' });
    if (disc.consistency >= 60) fortalezas.push({ icon:'🔥', texto:'Consistencia del ' + disc.consistency + '%' });
    if (!fortalezas.length)     fortalezas.push({ icon:'📈', texto:'En construccion: registra mas datos' });

    const mejoras = [];
    const attrArr  = [
      ['Velocidad', attrs.velocidad],
      ['Fisico', attrs.fisico],
      ['Definicion', attrs.definicion],
      ['Tecnica', attrs.tecnica],
      ['IQ Futbolistico', attrs.iq]
    ].sort((a,b) => a[1] - b[1]);
    attrArr.slice(0,2).forEach(([name, val]) => {
      mejoras.push({ icon:'⬆️', texto:'Mejorar ' + name + ' (' + val + '/100)' });
    });
    if (winrate < 40 && totalM >= 5) mejoras.push({ icon:'📊', texto:'Winrate del ' + winrate + '% — analizar derrotas' });
    if (disc.consistency < 50)       mejoras.push({ icon:'📅', texto:'Consistencia ' + disc.consistency + '% — entrenar mas seguido' });

    const ovr = calcOVR();
    const scoutRating = Math.min(100, Math.round(
      ovr * 0.4 + winrate * 0.2 + disc.consistency * 0.15 +
      Math.min(100, avgR * 10) * 0.15 +
      Math.min(100, (perf.gpp + perf.app) * 20) * 0.1
    ));

    let recom = 'Etapa inicial. Cada entreno cuenta.';
    if (scoutRating >= 75)      recom = 'Potencial destacado. Mantene la constancia.';
    else if (scoutRating >= 55) recom = 'Perfil prometedor. Trabajar las areas marcadas.';
    else if (scoutRating >= 35) recom = 'En desarrollo. La clave es la consistencia.';

    const tags = [perfil];
    if (esGoleador)    tags.push('Goleador');
    if (esCreador)     tags.push('Asistidor');
    if (esConstante)   tags.push('Constante');
    if (winrate >= 65) tags.push('Ganador');
    if (avgR >= 8)     tags.push('Top Performer');

    return { perfil, desc, fortalezas, mejoras, rating: scoutRating, recom, tags };
  }

  /* ── Plan Semanal ──────────────────────────────────────────────────────── */
  function calcPlan() {
    const M  = getMatches();
    const T  = getTrainings();
    const ML = getMental();
    const attrs = calcAttributes();
    const disc  = calcDiscipline();

    const avgG   = M.length ? M.reduce((a,m) => a + (m.goals||0), 0) / M.length : 0;
    const wins   = M.filter(m => m.result === 'win').length;
    const wr     = M.length ? Math.round((wins / M.length) * 100) : 50;

    let motiv = 5;
    if (ML.length) {
      const l7 = ML.slice(-7);
      motiv = +(l7.reduce((a,m) => a + (m.motivacion||5), 0) / l7.length).toFixed(1);
    }

    // Tipos de sesión disponibles
    const sesiones = {
      tecnico:  { label:'Técnico',  emoji:'⚽', color:'#00c853', desc:'Rondos, pases, disparos al arco y primer toque.', dur:75, intensidad:'media' },
      fisico:   { label:'Físico',   emoji:'💪', color:'#ff6d00', desc:'Sprints, aceleraciones y trabajo de resistencia.', dur:70, intensidad:'alta' },
      tactico:  { label:'Táctico',  emoji:'🧩', color:'#2979ff', desc:'Posicionamiento, pressing y movimientos sin pelota.', dur:60, intensidad:'media' },
      mental:   { label:'Mental',   emoji:'🧠', color:'#9c27b0', desc:'Visualización, respiración y rutinas de activación.', dur:45, intensidad:'baja' },
      descanso: { label:'Descanso', emoji:'😴', color:'#8a9e8a', desc:'Recuperacion activa, elongacion e hidratacion.', dur:null, intensidad:null },
      partido:  { label:'Partido',  emoji:'🏟️', color:'#f5c518', desc:'Dia de partido o entrenamiento libre.', dur:null, intensidad:'alta' }
    };

    // Prioridad del ciclo semanal según datos
    let prioridad = ['tecnico','fisico','tactico','tecnico','fisico','partido','descanso'];

    if (motiv < 5)               prioridad[2] = 'mental';
    if (attrs.definicion < 35)   prioridad[0] = 'tecnico'; // refuerza definicion
    if (attrs.fisico < 35)       prioridad[1] = 'fisico';
    if (attrs.iq < 35)           prioridad[3] = 'tactico';
    if (wr < 40 && M.length >= 5) prioridad[3] = 'tactico';
    if (disc.avgDaysPerWeek >= 6) { prioridad[2] = 'descanso'; prioridad[4] = 'descanso'; }

    const dias = ['Lunes','Martes','Miércoles','Jueves','Viernes','Sábado','Domingo'];
    const today = new Date().getDay();
    const todayIdx = today === 0 ? 6 : today - 1;

    const plan = dias.map((dia, i) => {
      const tipo = prioridad[i] || 'descanso';
      const s = sesiones[tipo];
      return { dia, tipo, ...s, isToday: i === todayIdx };
    });

    let msg = 'Plan balanceado para seguir creciendo en todas las areas.';
    if (motiv < 5)             msg = '🧠 Estado mental bajo — plan con recuperacion incluida.';
    else if (disc.consistency >= 70) msg = '🔥 Consistencia elite. Esta semana empuja la intensidad.';
    else if (attrs.definicion < 35)  msg = '🎯 Foco en definicion esta semana. Los goles llegan con trabajo.';
    else if (wr < 40 && M.length >= 5) msg = '📊 Semana tactica para convertir mas partidos en victorias.';

    return { plan, msg };
  }

  /* ═══════════════════════════════════════════════════════════════════════
     RENDERS
     ═══════════════════════════════════════════════════════════════════════ */

  /* ── Radar chart instance ────────────────────────────────────────────── */
  let _radar = null;
  let _evoCharts = {};

  /* ── Perfil Avanzado ────────────────────────────────────────────────── */
  function renderAdvProfile() {
    const attrs = calcAttributes();
    const ovr   = calcOVR();

    setText('advOVR', ovr);

    const bars = [
      { id:'attrVelocidad', val: attrs.velocidad, color:'#f5c518' },
      { id:'attrFisico',    val: attrs.fisico,    color:'#ff6d00' },
      { id:'attrDefinicion',val: attrs.definicion,color:'#e53935' },
      { id:'attrTecnica',   val: attrs.tecnica,   color:'#00c853' },
      { id:'attrIQ',        val: attrs.iq,        color:'#2979ff' }
    ];
    bars.forEach(b => {
      const fill = $id(b.id + 'Fill');
      const num  = $id(b.id + 'Num');
      if (fill) {
        fill.style.width = b.val + '%';
        fill.style.background = 'linear-gradient(90deg,' + b.color + '88,' + b.color + ')';
      }
      if (num) num.textContent = b.val;
    });

    // Radar
    const canvas = $id('chartRadar');
    if (!canvas) return;
    if (_radar) { try { _radar.destroy(); } catch {} _radar = null; }

    const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
    const tc = isDark ? '#8a9e8a' : '#4a6a4a';
    const gc = isDark ? 'rgba(0,200,83,.12)' : 'rgba(0,100,40,.1)';

    _radar = new Chart(canvas, {
      type: 'radar',
      data: {
        labels: ['Velocidad','Físico','Definición','Técnica','IQ'],
        datasets: [{
          label: 'Atributos',
          data: [attrs.velocidad, attrs.fisico, attrs.definicion, attrs.tecnica, attrs.iq],
          backgroundColor: 'rgba(0,200,83,.15)',
          borderColor: '#00c853',
          borderWidth: 2,
          pointBackgroundColor: '#00c853',
          pointRadius: 4,
          pointHoverRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: isDark ? 'rgba(13,21,13,.95)' : '#fff',
            borderColor:'#00c853', borderWidth:1,
            titleColor: isDark ? '#f0f7f0' : '#0d1a0d', bodyColor: tc
          }
        },
        scales: {
          r: {
            min:0, max:100,
            ticks: { display: false },
            grid: { color: gc },
            angleLines: { color: gc },
            pointLabels: { color: tc, font:{ family:'DM Sans', size:11, weight:'600' } }
          }
        }
      }
    });
  }

  /* ── Disciplina ─────────────────────────────────────────────────────── */
  function renderDiscipline() {
    const d = calcDiscipline();
    setText('discConsistency', d.consistency + '%');
    setText('discAvgDays', d.avgDaysPerWeek);
    setText('discInactive', d.diasSinActividad + 'd');

    const badge = $id('discBadge');
    if (badge) {
      if (d.consistency >= 75)      { badge.textContent = '🔥 Élite';     badge.className = 'disc-badge green';  }
      else if (d.consistency >= 50) { badge.textContent = '💪 Constante'; badge.className = 'disc-badge orange'; }
      else if (d.consistency >= 25) { badge.textContent = '⚡ Irregular'; badge.className = 'disc-badge yellow'; }
      else                          { badge.textContent = '😐 Inicio';    badge.className = 'disc-badge gray';   }
    }

    const heatEl = $id('discHeatmap');
    if (heatEl) {
      heatEl.innerHTML = d.weeks.map(w => {
        const cls = w.count === 0 ? 'heat-0' : w.count <= 2 ? 'heat-1' : w.count <= 4 ? 'heat-2' : 'heat-3';
        const lbl = w.start.toLocaleDateString('es-AR',{day:'numeric',month:'short'});
        return '<div class="heat-cell ' + cls + '" title="' + lbl + ': ' + w.count + ' entreno' + (w.count!==1?'s':'') + '"><span class="heat-num">' + w.count + '</span></div>';
      }).join('');
    }
  }

  /* ── Rendimiento Avanzado ───────────────────────────────────────────── */
  function renderAdvPerformance() {
    const p = calcAdvPerformance();
    setText('perfGPP', p.gpp);
    setText('perfAPP', p.app);
    setText('perfOF',  p.ofensiva);
    setText('perfL5R', p.last5Rating + '/10');
    setText('perfL5G', p.last5Goals);

    const tbody = $id('typeStatsBody');
    if (!tbody) return;
    const rows = calcByType();
    if (!rows.length) {
      tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;color:var(--gris);padding:20px">Sin partidos registrados aún</td></tr>';
      return;
    }
    tbody.innerHTML = rows.map(r => {
      const wrc = r.winrate >= 60 ? 'var(--verde)' : r.winrate >= 40 ? 'var(--dorado)' : 'var(--naranja)';
      return '<tr><td><span class="type-badge">' + r.type + '</span></td><td>' + r.count + '</td><td>' + r.goals + ' <small style="color:var(--gris)">(' + (r.goals/r.count).toFixed(1) + '/p)</small></td><td style="color:' + wrc + ';font-weight:700">' + r.winrate + '%</td><td>' + r.avgRating + '/10</td></tr>';
    }).join('');
  }

  /* ── Evolución temporal ─────────────────────────────────────────────── */
  function renderEvoCharts() {
    Object.values(_evoCharts).forEach(c => { try { c.destroy(); } catch {} });
    _evoCharts = {};

    const evo = calcWeeklyEvo();
    const labels = evo.map(w => w.label);
    const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
    const gc = isDark ? 'rgba(0,200,83,.06)' : 'rgba(0,100,40,.08)';
    const tc = isDark ? '#8a9e8a' : '#4a6a4a';
    const ttOpts = {
      backgroundColor: isDark ? 'rgba(13,21,13,.95)' : '#fff',
      borderColor:'#00c853', borderWidth:1,
      titleColor: isDark ? '#f0f7f0' : '#0d1a0d', bodyColor: tc
    };
    const scaleBase = {
      x: { grid:{color:gc}, ticks:{color:tc, font:{family:'DM Sans',size:10}} },
      y: { grid:{color:gc}, ticks:{color:tc, font:{family:'DM Sans',size:10}}, beginAtZero:true }
    };
    const baseOpts = {
      responsive:true, maintainAspectRatio:false,
      plugins:{ legend:{display:false}, tooltip: ttOpts },
      scales: scaleBase
    };

    const cg = $id('chartEvoGoles');
    if (cg) {
      _evoCharts.goles = new Chart(cg, {
        type:'bar',
        data:{ labels, datasets:[{ label:'Goles', data:evo.map(w=>w.goals), backgroundColor:'rgba(0,200,83,.25)', borderColor:'#00c853', borderWidth:2, borderRadius:5 }] },
        options: baseOpts
      });
    }

    const cr = $id('chartEvoRating');
    if (cr) {
      _evoCharts.rating = new Chart(cr, {
        type:'line',
        data:{ labels, datasets:[{ label:'Rating', data:evo.map(w=>w.rating), borderColor:'#f5c518', backgroundColor:'rgba(245,197,24,.1)', borderWidth:2, pointBackgroundColor:'#f5c518', pointRadius:4, fill:true, tension:0.4, spanGaps:true }] },
        options: { ...baseOpts, scales:{ ...scaleBase, y:{ ...scaleBase.y, min:0, max:10 } } }
      });
    }

    const cm = $id('chartEvoMental');
    if (cm) {
      _evoCharts.mental = new Chart(cm, {
        type:'line',
        data:{ labels, datasets:[{ label:'Mental', data:evo.map(w=>w.mental), borderColor:'#9c27b0', backgroundColor:'rgba(156,39,176,.1)', borderWidth:2, pointBackgroundColor:'#9c27b0', pointRadius:4, fill:true, tension:0.4, spanGaps:true }] },
        options: { ...baseOpts, scales:{ ...scaleBase, y:{ ...scaleBase.y, min:0, max:10 } } }
      });
    }
  }

  /* ── Scout Mode ─────────────────────────────────────────────────────── */
  function renderScout() {
    const r = calcScout();
    setText('scoutPerfil', r.perfil);
    setText('scoutDesc', r.desc);
    setText('scoutRecom', r.recom);
    setText('scoutRating', r.rating);

    const ring = $id('scoutRatingRing');
    if (ring) {
      const circ = 2 * Math.PI * 45;
      ring.style.strokeDasharray  = circ;
      ring.style.strokeDashoffset = circ * (1 - r.rating / 100);
      ring.style.stroke = r.rating >= 75 ? '#00c853' : r.rating >= 55 ? '#f5c518' : '#ff6d00';
    }

    const tagsEl = $id('scoutTags');
    if (tagsEl) tagsEl.innerHTML = r.tags.map(t => '<span class="scout-tag">' + t + '</span>').join('');

    const fortEl = $id('scoutFortalezas');
    if (fortEl) fortEl.innerHTML = r.fortalezas.map(f =>
      '<div class="scout-item"><span class="scout-item-icon">' + f.icon + '</span><span>' + f.texto + '</span></div>'
    ).join('') || '<p style="color:var(--gris);font-size:.82rem">Registra mas datos</p>';

    const mejEl = $id('scoutMejoras');
    if (mejEl) mejEl.innerHTML = r.mejoras.map(m =>
      '<div class="scout-item"><span class="scout-item-icon">' + m.icon + '</span><span>' + m.texto + '</span></div>'
    ).join('') || '<p style="color:var(--gris);font-size:.82rem">Sin areas criticas detectadas</p>';
  }

  /* ── Plan Semanal ───────────────────────────────────────────────────── */
  function renderPlan() {
    const { plan, msg } = calcPlan();
    setText('recsMensaje', msg);

    const grid = $id('recsGrid');
    if (!grid) return;

    grid.innerHTML = plan.map(day => {
      const todayClass = day.isToday ? ' rec-today' : '';
      return '<div class="rec-card' + todayClass + '" style="--rec-color:' + day.color + '">' +
        '<div class="rec-card-top">' +
          '<span class="rec-dia">' + day.dia + (day.isToday ? ' <em>· hoy</em>' : '') + '</span>' +
          '<span class="rec-emoji">' + day.emoji + '</span>' +
        '</div>' +
        '<div class="rec-tipo" style="color:' + day.color + '">' + day.label + '</div>' +
        (day.intensidad ? '<span class="rec-intensidad">' + day.intensidad.toUpperCase() + '</span>' : '') +
        '<div class="rec-desc">' + day.desc + '</div>' +
        (day.dur ? '<div class="rec-dur"><i class="fas fa-clock" style="color:' + day.color + '"></i> ' + day.dur + ' min</div>' : '') +
      '</div>';
    }).join('');
  }

  /* ═══════════════════════════════════════════════════════════════════════
     ENTRADA PÚBLICA — llamada desde estadisitcas.js (renderAll)
     ═══════════════════════════════════════════════════════════════════════ */
  function renderAll() {
    try { renderAdvProfile();      } catch(e) { console.warn('[ProStats] advProfile:', e); }
    try { renderDiscipline();      } catch(e) { console.warn('[ProStats] discipline:', e); }
    try { renderAdvPerformance();  } catch(e) { console.warn('[ProStats] performance:', e); }
    try { renderEvoCharts();       } catch(e) { console.warn('[ProStats] evo charts:', e); }
    try { renderScout();           } catch(e) { console.warn('[ProStats] scout:', e); }
    try { renderPlan();            } catch(e) { console.warn('[ProStats] plan:', e); }
  }

  return { renderAll };

})(); // fin ProStats
