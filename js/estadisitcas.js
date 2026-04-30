
'use strict';

/* ═══════════════════════════════════════════════════════
   STORAGE MODULE
   Todo se guarda y lee desde localStorage.
   Claves:
     elcamino_matches_v1   → Array de partidos
     elcamino_training_v1  → Array de entrenamientos
     elcamino_goals_v1     → Array de objetivos
     elcamino_mental_v1    → Array de registros mentales
     elcamino_stats_theme  → Tema oscuro/claro
   ═══════════════════════════════════════════════════════ */
const Storage = (() => {
  const K_MATCHES  = 'elcamino_matches_v1';
  const K_TRAINING = 'elcamino_training_v1';
  const K_GOALS    = 'elcamino_goals_v1';
  const K_MENTAL   = 'elcamino_mental_v1';
  const K_THEME    = 'elcamino_stats_theme';

  const get = key => { try { return JSON.parse(localStorage.getItem(key)) || []; } catch { return []; } };
  const set = (key, val) => { try { localStorage.setItem(key, JSON.stringify(val)); } catch {} };

  return {
    getMatches:  () => get(K_MATCHES),
    setMatches:  v  => set(K_MATCHES, v),
    getTraining: () => get(K_TRAINING),
    setTraining: v  => set(K_TRAINING, v),
    getGoals:    () => get(K_GOALS),
    setGoals:    v  => set(K_GOALS, v),
    getMental:   () => get(K_MENTAL),
    setMental:   v  => set(K_MENTAL, v),
    getTheme:    () => { try { return localStorage.getItem(K_THEME) || 'dark'; } catch { return 'dark'; } },
    setTheme:    v  => { try { localStorage.setItem(K_THEME, v); } catch {} }
  };
})();

/* ═══════════════════════════════════════════════════════
   TOAST MODULE
   ═══════════════════════════════════════════════════════ */
const Toast = (() => {
  const icons = { success: 'fa-check-circle', warning: 'fa-exclamation-circle', info: 'fa-info-circle', error: 'fa-times-circle' };
  function show(title, sub = '', type = 'success', ms = 3200) {
    const cont = document.getElementById('toastCont');
    if (!cont) return;
    const t = document.createElement('div');
    t.className = `toast ${type}`;
    t.innerHTML = `<i class="fas ${icons[type] || icons.info} toast-icon"></i>
      <div class="toast-txt"><strong>${title}</strong>${sub ? `<span>${sub}</span>` : ''}</div>`;
    cont.appendChild(t);
    setTimeout(() => { t.classList.add('hide'); setTimeout(() => t.remove(), 350); }, ms);
  }
  return { show };
})();

/* ═══════════════════════════════════════════════════════
   STATE — datos en memoria (sincronizados con localStorage)
   ═══════════════════════════════════════════════════════ */
let matches  = Storage.getMatches();
let trainings = Storage.getTraining();
let goals    = Storage.getGoals();
let mentalLog = Storage.getMental();

/* ═══════════════════════════════════════════════════════
   STATS CALCULATOR
   Calcula métricas derivadas de los datos crudos.
   ═══════════════════════════════════════════════════════ */
const Calc = (() => {
  function winrate() {
    if (!matches.length) return 0;
    const wins = matches.filter(m => m.result === 'win').length;
    return Math.round((wins / matches.length) * 100);
  }
  function totalGoals()     { return matches.reduce((a, m) => a + (m.goals || 0), 0); }
  function totalAssists()   { return matches.reduce((a, m) => a + (m.assists || 0), 0); }
  function avgRating()      { if (!matches.length) return 0; return (matches.reduce((a, m) => a + (m.rating || 5), 0) / matches.length).toFixed(1); }
  function avgGoals()       { if (!matches.length) return 0; return (totalGoals() / matches.length).toFixed(1); }

  // XP: 10 por partido, 5 por entreno, +bonus
  function xp() {
    let xp = matches.length * 10 + trainings.length * 5;
    xp += matches.filter(m => m.result === 'win').length * 5;
    xp += totalGoals() * 3;
    return xp;
  }
  function level() { return Math.floor(xp() / 100) + 1; }
  function xpPct() { return xp() % 100; }

  // Mejor tipo de partido (donde más goles)
  function bestMatchType() {
    const byType = {};
    matches.forEach(m => {
      if (!byType[m.type]) byType[m.type] = { goals: 0, count: 0 };
      byType[m.type].goals += (m.goals || 0);
      byType[m.type].count++;
    });
    let best = null, bestAvg = -1;
    Object.entries(byType).forEach(([t, d]) => {
      const avg = d.count ? d.goals / d.count : 0;
      if (avg > bestAvg) { bestAvg = avg; best = t; }
    });
    return best;
  }

  // Racha de entrenos (días consecutivos)
  function currentStreak() {
    if (!trainings.length) return 0;
    const dates = [...new Set(trainings.map(t => t.date))].sort().reverse();
    let streak = 0;
    let ref = new Date(); ref.setHours(0,0,0,0);
    for (const d of dates) {
      const day = new Date(d + 'T00:00:00');
      const diff = Math.round((ref - day) / 86400000);
      if (diff === 0 || diff === 1) { streak++; ref = day; }
      else break;
    }
    return streak;
  }

  function bestStreak() {
    if (!trainings.length) return 0;
    const dates = [...new Set(trainings.map(t => t.date))].sort();
    let best = 1, cur = 1;
    for (let i = 1; i < dates.length; i++) {
      const prev = new Date(dates[i-1] + 'T00:00:00');
      const curr = new Date(dates[i]   + 'T00:00:00');
      const diff = Math.round((curr - prev) / 86400000);
      if (diff === 1) { cur++; best = Math.max(best, cur); }
      else cur = 1;
    }
    return best;
  }

  // Partidos este mes
  function matchesThisMonth() {
    const now = new Date();
    return matches.filter(m => {
      if (!m.date) return false;
      const d = new Date(m.date + 'T00:00:00');
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }).length;
  }

  // Entrenos esta semana
  function trainingsThisWeek() {
    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay());
    weekStart.setHours(0,0,0,0);
    return trainings.filter(t => {
      if (!t.date) return false;
      const d = new Date(t.date + 'T00:00:00');
      return d >= weekStart;
    }).length;
  }

  // Promedio mental
  function mentalAvg() {
    if (!mentalLog.length) return { energia: 0, motivacion: 0, enfoque: 0, disciplina: 0 };
    const last7 = mentalLog.slice(-7);
    const sum = last7.reduce((a, m) => ({
      energia: a.energia + (m.energia || 0),
      motivacion: a.motivacion + (m.motivacion || 0),
      enfoque: a.enfoque + (m.enfoque || 0),
      disciplina: a.disciplina + (m.disciplina || 0)
    }), { energia: 0, motivacion: 0, enfoque: 0, disciplina: 0 });
    const n = last7.length;
    return {
      energia:    +(sum.energia / n).toFixed(1),
      motivacion: +(sum.motivacion / n).toFixed(1),
      enfoque:    +(sum.enfoque / n).toFixed(1),
      disciplina: +(sum.disciplina / n).toFixed(1)
    };
  }

  // Estilo de juego
  function playerStyle() {
    const goals = totalGoals();
    const assists = totalAssists();
    const wins = matches.filter(m => m.result === 'win').length;
    if (!matches.length) return 'Sin datos todavía';
    if (goals > assists * 2) return 'Goleador Puro ⚽';
    if (assists > goals * 1.5) return 'Creador de Juego 🎨';
    if (wins / matches.length > 0.6) return 'Mentalidad Ganadora 🏆';
    if (matches.filter(m => m.participation === 'alta').length > matches.length * 0.6) return 'Motor del Equipo 🔥';
    return 'Jugador Completo ⭐';
  }

  return { winrate, totalGoals, totalAssists, avgRating, avgGoals, xp, level, xpPct, bestMatchType, currentStreak, bestStreak, matchesThisMonth, trainingsThisWeek, mentalAvg, playerStyle };
})();

/* ═══════════════════════════════════════════════════════
   UI RENDER FUNCTIONS
   Cada función re-renderiza una sección específica.
   ═══════════════════════════════════════════════════════ */

// Emojis emociones
const emotionEmojis = { cansado:'😓', fuerte:'💪', rápido:'⚡', lento:'🐢', enfocado:'🎯', desconectado:'😶', excelente:'🌟', bien:'😊', regular:'😐', agotado:'😮‍💨' };

// ─ Hero KPIs ─
function renderHeroKPIs() {
  el('kpiPartidos',    matches.length);
  el('kpiWinrate',     Calc.winrate() + '%');
  el('kpiGoles',       Calc.totalGoals());
  el('kpiAsistencias', Calc.totalAssists());
  el('kpiEntrenos',    trainings.length);
}

// ─ Perfil del jugador ─
function renderProfile() {
  const level  = Calc.level();
  const xpPct  = Calc.xpPct();
  const xpTotal = Calc.xp();
  el('playerLevelLabel', `Nivel ${level}`);
  el('playerStyle',      Calc.playerStyle());

  const xpFill = document.getElementById('xpFill');
  if (xpFill) xpFill.style.width = xpPct + '%';
  el('xpLabel', `${xpTotal % 100} / 100 XP`);

  // Tags automáticos
  const tags = [];
  if (Calc.totalGoals() >= 10) tags.push('Goleador');
  if (Calc.winrate() >= 60)     tags.push(`${Calc.winrate()}% Winrate`);
  if (Calc.currentStreak() >= 5) tags.push(`${Calc.currentStreak()}d seguidos`);
  if (trainings.length >= 10)   tags.push('Dedicado');
  if (matches.length >= 20)     tags.push('Experimentado');

  const tagsEl = document.getElementById('profileTags');
  if (tagsEl) tagsEl.innerHTML = tags.map(t => `<span class="profile-tag">${t}</span>`).join('') || '<span class="profile-tag" style="color:var(--gris)">Jugá más para obtener tags</span>';

  // Fortalezas
  const strengths = [
    { label: 'Goles', val: Math.min(100, Calc.totalGoals() * 5) },
    { label: 'Asistencias', val: Math.min(100, Calc.totalAssists() * 7) },
    { label: 'Winrate', val: Calc.winrate() },
    { label: 'Constancia', val: Math.min(100, Calc.currentStreak() * 10) }
  ].sort((a, b) => b.val - a.val);

  const sc = document.getElementById('strengthsContainer');
  if (sc) sc.innerHTML = strengths.slice(0, 3).map(s => `
    <div class="fd-item">
      <span class="fd-item-label">${s.label}</span>
      <div class="fd-bar"><div class="fd-bar-fill green" style="width:${s.val}%"></div></div>
      <span class="fd-pct" style="color:var(--verde)">${s.val}%</span>
    </div>`).join('');

  const weaknesses = [...strengths].sort((a, b) => a.val - b.val);
  const wc = document.getElementById('weaknessesContainer');
  if (wc) wc.innerHTML = weaknesses.slice(0, 3).map(s => `
    <div class="fd-item">
      <span class="fd-item-label">${s.label}</span>
      <div class="fd-bar"><div class="fd-bar-fill orange" style="width:${s.val}%"></div></div>
      <span class="fd-pct" style="color:var(--naranja)">${s.val}%</span>
    </div>`).join('');
}

// ─ Alertas inteligentes ─
function renderAlerts() {
  const alerts = [];
  const today = new Date().toISOString().slice(0, 10);
  const todayTraining = trainings.find(t => t.date === today);
  const streak = Calc.currentStreak();

  if (!todayTraining && trainings.length > 0) {
    const last = trainings.slice(-1)[0];
    const diff = Math.round((new Date() - new Date(last.date + 'T00:00:00')) / 86400000);
    if (diff >= 3) alerts.push({ type: 'warn', icon: 'fa-exclamation-triangle', title: '¡Atención!', body: `Hace ${diff} día${diff>1?'s':''} que no entrenás. ¡Tu cuerpo necesita movimiento!` });
    else alerts.push({ type: 'info', icon: 'fa-clock', title: 'Sin entreno hoy', body: 'Hoy no entrenaste todavía. Tenés tiempo de hacerlo.' });
  }
  if (streak >= 7) alerts.push({ type: 'fire', icon: 'fa-fire', title: `🔥 ¡${streak} días de racha!`, body: 'Estás en tu mejor racha. La constancia es lo que distingue a los campeones.' });
  if (Calc.winrate() >= 70 && matches.length >= 5) alerts.push({ type: '', icon: 'fa-trophy', title: 'Racha ganadora', body: `Con ${Calc.winrate()}% de victorias, estás dominando la competencia.` });
  if (matches.length > 5 && Calc.winrate() < 30) alerts.push({ type: 'warn', icon: 'fa-chart-line', title: 'Rendimiento bajo', body: 'Tu winrate es bajo. Analizá los partidos perdidos y trabajá los puntos débiles.' });
  const best = Calc.bestMatchType();
  if (best) alerts.push({ type: 'info', icon: 'fa-star', title: 'Tu mejor formato', body: `Rendís mejor en partidos ${best}. Buscá más oportunidades de ese tipo.` });
  if (!alerts.length) alerts.push({ type: '', icon: 'fa-cross', title: 'Seguí entrenando', body: 'Con fe y trabajo constante, tu camino al profesionalismo está en construcción.' });

  const grid = document.getElementById('alertsGrid');
  if (grid) grid.innerHTML = alerts.map(a => `
    <div class="alert-card ${a.type}">
      <i class="fas ${a.icon} alert-icon"></i>
      <div><div class="alert-title">${a.title}</div><div class="alert-body">${a.body}</div></div>
    </div>`).join('');
}

// ─ Objetivos ─
function renderGoals() {
  const grid = document.getElementById('goalsGrid');
  const empty = document.getElementById('goalsEmpty');
  if (!grid) return;
  grid.querySelectorAll('.goal-card').forEach(e => e.remove());
  if (!goals.length) { if (empty) empty.style.display = 'block'; return; }
  if (empty) empty.style.display = 'none';
  goals.forEach((g, i) => {
    const pct = Math.min(100, Math.round((g.current / g.target) * 100));
    const card = document.createElement('div');
    card.className = 'goal-card';
    card.innerHTML = `
      <span class="goal-emoji">${g.emoji}</span>
      <div class="goal-name">${g.name}</div>
      <div class="goal-progress-wrap">
        <div class="goal-pct-row"><span>Progreso</span><span>${pct}%</span></div>
        <div class="goal-bar"><div class="goal-bar-fill" style="width:${pct}%"></div></div>
      </div>
      <div class="goal-vals"><span class="goal-current">${g.current} / ${g.target}</span></div>
      <div class="goal-actions">
        <button class="btn-goal-inc" data-i="${i}"><i class="fas fa-plus"></i> +1 Progreso</button>
        <button class="btn-goal-del" data-i="${i}"><i class="fas fa-trash"></i></button>
      </div>
    `;
    grid.appendChild(card);
    card.querySelector('.btn-goal-inc').addEventListener('click', () => {
      goals[i].current = Math.min(goals[i].target, (goals[i].current || 0) + 1);
      Storage.setGoals(goals);
      if (goals[i].current >= goals[i].target) Toast.show('🎉 ¡Meta cumplida!', goals[i].name, 'success');
      else Toast.show('+1 progreso', goals[i].name, 'info');
      renderGoals();
    });
    card.querySelector('.btn-goal-del').addEventListener('click', () => {
      if (!confirm('¿Eliminar esta meta?')) return;
      goals.splice(i, 1);
      Storage.setGoals(goals);
      renderGoals();
      Toast.show('Meta eliminada', '', 'warning');
    });
  });
}

// ─ Partidos ─
let matchFilter = 'all';
function renderMatches() {
  const list  = document.getElementById('matchesList');
  const empty = document.getElementById('matchesEmpty');
  if (!list) return;
  list.querySelectorAll('.match-item').forEach(e => e.remove());

  let filtered = matchFilter === 'all' ? matches : matches.filter(m => m.result === matchFilter);
  filtered = [...filtered].reverse();

  if (!filtered.length) { if (empty) empty.style.display = 'block'; return; }
  if (empty) empty.style.display = 'none';

  filtered.forEach((m, ri) => {
    const i = matches.length - 1 - ri; // índice real
    const resultLabel = { win: 'G', loss: 'D', draw: 'E' }[m.result] || '?';
    const resultClass = { win: 'win', loss: 'loss', draw: 'draw' }[m.result] || '';
    const item = document.createElement('div');
    item.className = 'match-item';
    item.style.animationDelay = ri * 0.04 + 's';
    item.innerHTML = `
      <div class="match-result-pill ${resultClass}">${resultLabel}</div>
      <div class="match-info">
        <div class="match-type">${m.type} · ${m.participation ? m.participation.toUpperCase() : ''}</div>
        <div class="match-pos">${m.position || ''}</div>
      </div>
      <div class="match-stats">
        <div class="match-stat-pill"><span class="match-stat-val">${m.goals || 0}</span><span class="match-stat-lbl">Goles</span></div>
        <div class="match-stat-pill"><span class="match-stat-val">${m.assists || 0}</span><span class="match-stat-lbl">Asist.</span></div>
      </div>
      <div class="match-rating">${m.rating || 5}<small>/10</small></div>
      <div class="match-emotion">${emotionEmojis[m.emotion] || '⚽'}</div>
      <div class="match-date">${formatDate(m.date)}</div>
      <button class="btn-del-match" data-i="${ri}"><i class="fas fa-trash"></i></button>
    `;
    // delete btn
    item.querySelector('.btn-del-match').addEventListener('click', (e) => {
      e.stopPropagation();
      const realIdx = matches.length - 1 - parseInt(item.querySelector('.btn-del-match').dataset.i);
      if (!confirm('¿Eliminar este partido?')) return;
      matches.splice(realIdx, 1);
      Storage.setMatches(matches);
      renderAll();
      Toast.show('Partido eliminado', '', 'warning');
    });
    list.appendChild(item);
  });
}

// ─ Entrenamientos ─
function renderTrainings() {
  const grid  = document.getElementById('trainingGrid');
  const empty = document.getElementById('trainingEmpty');
  if (!grid) return;
  grid.querySelectorAll('.training-card').forEach(e => e.remove());

  if (!trainings.length) { if (empty) empty.style.display = 'block'; return; }
  if (empty) empty.style.display = 'none';

  const typeIcons = { fisico: 'fa-running', tecnico: 'fa-futbol', tactico: 'fa-chess', mental: 'fa-brain' };
  const typeCls   = { fisico: 'ti-fisico', tecnico: 'ti-tecnico', tactico: 'ti-tactico', mental: 'ti-mental' };

  [...trainings].reverse().forEach((t, ri) => {
    const card = document.createElement('div');
    card.className = 'training-card';
    card.style.animationDelay = ri * 0.05 + 's';
    const dots = Array.from({length:10}, (_, j) => `<div class="energy-dot${j < (t.energy||5) ? ' lit' : ''}"></div>`).join('');
    card.innerHTML = `
      <div class="training-type-icon ${typeCls[t.type] || 'ti-tecnico'}">
        <i class="fas ${typeIcons[t.type] || 'fa-futbol'}"></i>
      </div>
      <div class="training-card-name">${t.type ? t.type.charAt(0).toUpperCase() + t.type.slice(1) : 'Entrenamiento'}</div>
      <div class="training-card-meta">
        <span class="tc-pill">${t.duration || 60} min</span>
        <span class="tc-pill">${t.intensity || 'media'}</span>
        ${t.emotion ? `<span class="tc-pill">${emotionEmojis[t.emotion] || ''} ${t.emotion}</span>` : ''}
      </div>
      ${t.exercises ? `<div class="training-card-notes">${t.exercises}</div>` : ''}
      <div class="training-card-footer">
        <span class="tc-date">${formatDate(t.date)}</span>
        <div class="energy-dots">${dots}</div>
      </div>
    `;
    grid.appendChild(card);
  });
}

// ─ Rachas ─
function renderStreaks() {
  el('streakCurrent', Calc.currentStreak());
  el('streakBest',    Calc.bestStreak());
  el('streakMatches', Calc.matchesThisMonth());
  el('streakTraining',Calc.trainingsThisWeek());
}

// ─ Insights ─
function renderInsights() {
  const grid = document.getElementById('insightsGrid');
  if (!grid) return;

  const insights = [
    {
      cls: '', icon: '⚽', title: 'Promedio de Goles',
      body: 'Tu rendimiento goleador por partido.',
      num: Calc.avgGoals()
    },
    {
      cls: 'orange', icon: '🏆', title: 'Calificación Promedio',
      body: 'Qué tan bien te evaluás en cada partido.',
      num: Calc.avgRating() + '/10'
    },
    {
      cls: 'gold', icon: '📊', title: 'Winrate Global',
      body: 'Porcentaje de partidos ganados sobre el total.',
      num: Calc.winrate() + '%'
    },
    {
      cls: 'blue', icon: '🧠', title: 'Minutos Entrenados',
      body: 'Total de minutos dedicados al entrenamiento.',
      num: trainings.reduce((a, t) => a + (parseInt(t.duration) || 0), 0)
    }
  ];

  grid.innerHTML = insights.map(ins => `
    <div class="insight-card ${ins.cls}">
      <div class="insight-icon">${ins.icon}</div>
      <div class="insight-title">${ins.title}</div>
      <div class="insight-body">${ins.body}</div>
      <span class="insight-num">${ins.num}</span>
    </div>`).join('');
}

// ─ Mental averages ─
function renderMentalAverages() {
  const avg = Calc.mentalAvg();
  const cont = document.getElementById('mentalAverages');
  if (!cont) return;
  const rows = [
    { label: 'Energía',    val: avg.energia },
    { label: 'Motivación', val: avg.motivacion },
    { label: 'Enfoque',    val: avg.enfoque },
    { label: 'Disciplina', val: avg.disciplina }
  ];
  cont.innerHTML = rows.map(r => `
    <div class="metric-row">
      <div class="metric-row-top">
        <span class="metric-name">${r.label}</span>
        <span class="metric-val">${r.val}/10</span>
      </div>
      <div class="metric-bar"><div class="metric-bar-fill" style="width:${r.val * 10}%"></div></div>
    </div>`).join('');
}

/* ═══════════════════════════════════════════════════════
   CHARTS con Chart.js
   ═══════════════════════════════════════════════════════ */
let charts = {};

function initCharts() {
  const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
  const gridColor = isDark ? 'rgba(0,200,83,.06)' : 'rgba(0,100,40,.08)';
  const tickColor = isDark ? '#8a9e8a' : '#4a6a4a';
  const bgCard    = isDark ? 'rgba(13,21,13,.7)' : 'rgba(255,255,255,.7)';

  Chart.defaults.color = tickColor;
  Chart.defaults.borderColor = gridColor;

  destroyCharts();

  // Goles por semana
  const golesCanvas = document.getElementById('chartGoles');
  if (golesCanvas) {
    const weekData = getLast7Days();
    charts.goles = new Chart(golesCanvas, {
      type: 'bar',
      data: {
        labels: weekData.labels,
        datasets: [{
          label: 'Goles',
          data: weekData.goals,
          backgroundColor: 'rgba(0,200,83,.2)',
          borderColor: '#00c853',
          borderWidth: 2,
          borderRadius: 6
        }]
      },
      options: chartOptions('Goles')
    });
  }

  // Tipo de partidos
  const tiposCanvas = document.getElementById('chartTipos');
  if (tiposCanvas) {
    const byType = {};
    matches.forEach(m => { byType[m.type] = (byType[m.type] || 0) + 1; });
    charts.tipos = new Chart(tiposCanvas, {
      type: 'doughnut',
      data: {
        labels: Object.keys(byType).length ? Object.keys(byType) : ['Sin datos'],
        datasets: [{
          data: Object.keys(byType).length ? Object.values(byType) : [1],
          backgroundColor: ['#00c853','#ff6d00','#f5c518','#2979ff','#e53935','#9c27b0','#00bcd4'],
          borderWidth: 0
        }]
      },
      options: { ...chartOptions(), plugins: { legend: { display: true, position: 'bottom', labels: { color: tickColor, font: { family: 'DM Sans', size: 11 } } } } }
    });
  }

  // Rating por partido
  const ratingCanvas = document.getElementById('chartRating');
  if (ratingCanvas) {
    const last10 = matches.slice(-10);
    charts.rating = new Chart(ratingCanvas, {
      type: 'line',
      data: {
        labels: last10.map((m, i) => `#${i + 1}`),
        datasets: [{
          label: 'Calificación',
          data: last10.map(m => m.rating || 5),
          borderColor: '#f5c518',
          backgroundColor: 'rgba(245,197,24,.1)',
          borderWidth: 2,
          pointBackgroundColor: '#f5c518',
          pointRadius: 5,
          fill: true,
          tension: 0.4
        }]
      },
      options: { ...chartOptions('Rating'), scales: { y: { min: 0, max: 10, grid: { color: gridColor }, ticks: { color: tickColor } }, x: { grid: { color: gridColor }, ticks: { color: tickColor } } } }
    });
  }

  // Entrenos por tipo
  const entrenosCanvas = document.getElementById('chartEntrenos');
  if (entrenosCanvas) {
    const byType = { fisico: 0, tecnico: 0, tactico: 0, mental: 0 };
    trainings.forEach(t => { if (byType[t.type] !== undefined) byType[t.type]++; });
    charts.entrenos = new Chart(entrenosCanvas, {
      type: 'bar',
      data: {
        labels: ['Físico', 'Técnico', 'Táctico', 'Mental'],
        datasets: [{
          data: Object.values(byType),
          backgroundColor: ['rgba(255,109,0,.3)','rgba(0,200,83,.3)','rgba(41,121,255,.3)','rgba(156,39,176,.3)'],
          borderColor: ['#ff6d00','#00c853','#2979ff','#9c27b0'],
          borderWidth: 2,
          borderRadius: 6
        }]
      },
      options: chartOptions('Entrenos')
    });
  }
}

function chartOptions(label = '') {
  const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
  const gc = isDark ? 'rgba(0,200,83,.06)' : 'rgba(0,100,40,.08)';
  const tc = isDark ? '#8a9e8a' : '#4a6a4a';
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: {
      backgroundColor: isDark ? 'rgba(13,21,13,.9)' : 'rgba(255,255,255,.95)',
      borderColor: '#00c853', borderWidth: 1,
      titleColor: isDark ? '#f0f7f0' : '#0d1a0d',
      bodyColor: tc, padding: 10
    }},
    scales: { x: { grid: { color: gc }, ticks: { color: tc, font: { family: 'DM Sans', size: 11 } } }, y: { grid: { color: gc }, ticks: { color: tc, font: { family: 'DM Sans', size: 11 } }, beginAtZero: true } }
  };
}

function destroyCharts() {
  Object.values(charts).forEach(c => { try { c.destroy(); } catch {} });
  charts = {};
}

function getLast7Days() {
  const labels = [], goals = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const str = d.toISOString().slice(0, 10);
    labels.push(d.toLocaleDateString('es-AR', { weekday: 'short', day: 'numeric' }));
    goals.push(matches.filter(m => m.date === str).reduce((a, m) => a + (m.goals || 0), 0));
  }
  return { labels, goals };
}

/* ═══════════════════════════════════════════════════════
   RENDER ALL — llama a todos los renders en orden.
   Esta es la función principal que reconstruye toda la UI.
   ═══════════════════════════════════════════════════════ */
function renderAll() {
  renderHeroKPIs();
  renderProfile();
  renderAlerts();
  renderGoals();
  renderMatches();
  renderTrainings();
  renderStreaks();
  renderInsights();
  renderMentalAverages();
  setTimeout(initCharts, 50);
}

/* ═══════════════════════════════════════════════════════
   STAR RATING WIDGETS
   ═══════════════════════════════════════════════════════ */
function buildStarRating(containerId, defaultVal = 7) {
  const cont = document.getElementById(containerId);
  if (!cont) return;
  cont.innerHTML = '';
  let selected = defaultVal;
  for (let i = 1; i <= 10; i++) {
    const btn = document.createElement('button');
    btn.className = `star-btn ${i <= selected ? 'lit' : ''}`;
    btn.textContent = '★';
    btn.dataset.v = i;
    btn.addEventListener('click', () => {
      selected = i;
      cont.querySelectorAll('.star-btn').forEach((b, j) => b.classList.toggle('lit', j < i));
    });
    cont.appendChild(btn);
  }
  cont.getRating = () => selected;
}

/* ═══════════════════════════════════════════════════════
   MODAL HELPERS
   ═══════════════════════════════════════════════════════ */
function openModal(id) {
  const m = document.getElementById(id);
  if (m) { m.classList.add('open'); document.body.style.overflow = 'hidden'; }
}
function closeModal(id) {
  const m = document.getElementById(id);
  if (m) { m.classList.remove('open'); document.body.style.overflow = ''; }
}

/* ═══════════════════════════════════════════════════════
   EMOTION BUTTON GROUP
   ═══════════════════════════════════════════════════════ */
function setupEmotionBtns(containerId) {
  const cont = document.getElementById(containerId);
  if (!cont) return;
  cont.querySelectorAll('.emotion-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      cont.querySelectorAll('.emotion-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });
  cont.getSelected = () => cont.querySelector('.emotion-btn.active')?.dataset.em || '';
}

/* ═══════════════════════════════════════════════════════
   UTILIDADES
   ═══════════════════════════════════════════════════════ */
function el(id, val) { const e = document.getElementById(id); if (e) e.textContent = val; }
function today() { return new Date().toISOString().slice(0, 10); }
function formatDate(str) {
  if (!str) return '';
  try { return new Date(str + 'T00:00:00').toLocaleDateString('es-AR', { day: 'numeric', month: 'short', year: 'numeric' }); }
  catch { return str; }
}

/* ═══════════════════════════════════════════════════════
   EVENT BINDINGS — Modales, formularios, filtros
   ═══════════════════════════════════════════════════════ */

// ─ Navbar ─
window.addEventListener('scroll', () => {
  document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 50);
}, { passive: true });

document.getElementById('hamburger').addEventListener('click', function() {
  this.classList.toggle('open');
  document.getElementById('mobileNav').classList.toggle('open');
  document.body.style.overflow = document.getElementById('mobileNav').classList.contains('open') ? 'hidden' : '';
});
document.getElementById('mobileClose').addEventListener('click', () => {
  document.getElementById('hamburger').classList.remove('open');
  document.getElementById('mobileNav').classList.remove('open');
  document.body.style.overflow = '';
});

// ─ Hero scroll ─
document.getElementById('heroScroll').addEventListener('click', () => {
  document.querySelector('.profile-section').scrollIntoView({ behavior: 'smooth' });
});

// ─ Theme ─
(function initTheme() {
  const saved = Storage.getTheme();
  document.documentElement.setAttribute('data-theme', saved);
  const icon = document.getElementById('themeIcon');
  if (icon) icon.className = saved === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
})();
document.getElementById('themeToggle').addEventListener('click', () => {
  const cur  = document.documentElement.getAttribute('data-theme');
  const next = cur === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  Storage.setTheme(next);
  const icon = document.getElementById('themeIcon');
  if (icon) icon.className = next === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
  setTimeout(initCharts, 50);
  Toast.show(next === 'light' ? '☀️ Modo claro' : '🌙 Modo oscuro', '', 'info', 1800);
});

// ─ Modal: Partidos ─
document.getElementById('btnAddMatch').addEventListener('click', () => {
  document.getElementById('mDate').value = today();
  buildStarRating('matchStars', 7);
  setupEmotionBtns('emotionBtns');
  openModal('modalMatch');
});
document.getElementById('closeModalMatch').addEventListener('click', () => closeModal('modalMatch'));
document.getElementById('modalMatch').addEventListener('click', e => { if (e.target === document.getElementById('modalMatch')) closeModal('modalMatch'); });

document.getElementById('btnSaveMatch').addEventListener('click', () => {
  const date   = document.getElementById('mDate').value;
  const type   = document.getElementById('mType').value;
  const pos    = document.getElementById('mPos').value;
  const result = document.getElementById('mResult').value;
  const goals  = parseInt(document.getElementById('mGoals').value) || 0;
  const assists= parseInt(document.getElementById('mAssists').value) || 0;
  const part   = document.getElementById('mParticipacion').value;
  const rating = document.getElementById('matchStars').getRating ? document.getElementById('matchStars').getRating() : 7;
  const emotion= document.getElementById('emotionBtns').getSelected ? document.getElementById('emotionBtns').getSelected() : '';
  const notes  = document.getElementById('mNotes').value.trim();

  if (!date) { Toast.show('Ingresá la fecha', '', 'error'); return; }

  const match = { id: Date.now(), date, type, position: pos, result, goals, assists, participation: part, rating, emotion, notes };
  matches.push(match);
  Storage.setMatches(matches);
  closeModal('modalMatch');
  renderAll();
  Toast.show('⚽ Partido registrado', `${type} · ${goals} goles`, 'success');
  document.getElementById('mNotes').value = '';
});

// ─ Modal: Entrenamientos ─
document.getElementById('btnAddTraining').addEventListener('click', () => {
  document.getElementById('tDate').value = today();
  buildStarRating('trainingEnergy', 6);
  setupEmotionBtns('trainingEmotionBtns');
  openModal('modalTraining');
});
document.getElementById('closeModalTraining').addEventListener('click', () => closeModal('modalTraining'));
document.getElementById('modalTraining').addEventListener('click', e => { if (e.target === document.getElementById('modalTraining')) closeModal('modalTraining'); });

document.getElementById('btnSaveTraining').addEventListener('click', () => {
  const date     = document.getElementById('tDate').value;
  const type     = document.getElementById('tType').value;
  const duration = parseInt(document.getElementById('tDuration').value) || 60;
  const intensity= document.getElementById('tIntensity').value;
  const exercises= document.getElementById('tExercises').value.trim();
  const emotion  = document.getElementById('trainingEmotionBtns').getSelected ? document.getElementById('trainingEmotionBtns').getSelected() : '';
  const energy   = document.getElementById('trainingEnergy').getRating ? document.getElementById('trainingEnergy').getRating() : 6;

  if (!date) { Toast.show('Ingresá la fecha', '', 'error'); return; }

  const training = { id: Date.now(), date, type, duration, intensity, exercises, emotion, energy };
  trainings.push(training);
  Storage.setTraining(trainings);
  closeModal('modalTraining');
  renderAll();
  Toast.show('💪 Entreno registrado', `${type} · ${duration} min`, 'success');
  document.getElementById('tExercises').value = '';
});

// ─ Modal: Objetivos ─
document.getElementById('btnAddGoal').addEventListener('click', () => openModal('modalGoal'));
document.getElementById('closeModalGoal').addEventListener('click', () => closeModal('modalGoal'));
document.getElementById('modalGoal').addEventListener('click', e => { if (e.target === document.getElementById('modalGoal')) closeModal('modalGoal'); });

document.getElementById('btnSaveGoal').addEventListener('click', () => {
  const name   = document.getElementById('gName').value.trim();
  const emoji  = document.getElementById('gEmoji').value || '🎯';
  const target = parseInt(document.getElementById('gTarget').value) || 10;
  if (!name) { Toast.show('Escribí un nombre para la meta', '', 'error'); return; }
  goals.push({ id: Date.now(), name, emoji, target, current: 0 });
  Storage.setGoals(goals);
  closeModal('modalGoal');
  renderGoals();
  Toast.show('🎯 Meta creada', name, 'success');
  document.getElementById('gName').value = '';
});

// ─ Filtros de partidos ─
document.querySelectorAll('.filter-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    matchFilter = tab.dataset.f;
    renderMatches();
  });
});

// ─ Mental sliders ─
['Energia', 'Motivacion', 'Enfoque', 'Disciplina'].forEach(name => {
  const slider = document.getElementById(`slider${name}`);
  const label  = document.getElementById(`s${name}`);
  if (slider && label) {
    slider.addEventListener('input', () => { label.textContent = slider.value; });
  }
});

document.getElementById('btnSaveMental').addEventListener('click', () => {
  const entry = {
    date:       today(),
    energia:    parseInt(document.getElementById('sliderEnergia').value) || 5,
    motivacion: parseInt(document.getElementById('sliderMotivacion').value) || 5,
    enfoque:    parseInt(document.getElementById('sliderEnfoque').value) || 5,
    disciplina: parseInt(document.getElementById('sliderDisciplina').value) || 5
  };
  // Reemplazar si ya hay registro de hoy
  const idx = mentalLog.findIndex(m => m.date === today());
  if (idx >= 0) mentalLog[idx] = entry;
  else mentalLog.push(entry);
  Storage.setMental(mentalLog);
  renderMentalAverages();
  Toast.show('🧠 Estado guardado', 'Registro mental de hoy actualizado', 'success');
});

// ─ Keyboard ESC cierra modales ─
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    ['modalMatch', 'modalTraining', 'modalGoal'].forEach(id => closeModal(id));
  }
});

// ─ Cursor ─
(function initCursor() {
  const cur  = document.getElementById('cursor');
  const ring = document.getElementById('cursorRing');
  if (!cur || !ring) return;
  let cx = 0, cy = 0, rx = 0, ry = 0;
  document.addEventListener('mousemove', e => {
    cx = e.clientX; cy = e.clientY;
    cur.style.transform = `translate(${cx}px, ${cy}px) translate(-50%,-50%)`;
  });
  const animate = () => {
    rx += (cx - rx) * 0.1; ry += (cy - ry) * 0.1;
    ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%,-50%)`;
    requestAnimationFrame(animate);
  };
  animate();
  document.querySelectorAll('a, button').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cur.style.background = 'var(--dorado)';
      ring.style.width = '52px'; ring.style.height = '52px';
    });
    el.addEventListener('mouseleave', () => {
      cur.style.background = 'var(--verde)';
      ring.style.width = '36px'; ring.style.height = '36px';
    });
  });
})();

// ─ Intersection Observer para .reveal ─
const revealObs = new IntersectionObserver(entries => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('visible'), i * 80);
      revealObs.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

/* ═══════════════════════════════════════════════════════
   INIT — Punto de entrada.
   Lee todos los datos de localStorage y renderiza toda la UI.
   ═══════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  console.log('%c⚽ El Camino — Estadísticas', 'color:#00c853;font-size:1.1rem;font-weight:bold;');
  console.log('%c"Todo lo puedo en Cristo que me fortalece." — Fil 4:13', 'color:#f5c518;');

  // ── Cargar datos desde localStorage (CRÍTICO: siempre primero)
  matches   = Storage.getMatches();
  trainings = Storage.getTraining();
  goals     = Storage.getGoals();
  mentalLog = Storage.getMental();

  // ── Valores por defecto en inputs de fecha
  const today = new Date().toISOString().slice(0, 10);
  const mDate = document.getElementById('mDate');
  const tDate = document.getElementById('tDate');
  if (mDate) mDate.value = today;
  if (tDate) tDate.value = today;

  // ── Renderizar toda la UI con datos persistidos
  renderAll();

  // Re-observar reveals dinámicos
  setTimeout(() => {
    document.querySelectorAll('.reveal:not(.visible)').forEach(el => revealObs.observe(el));
  }, 300);

  console.log(`%c✓ ${matches.length} partidos, ${trainings.length} entrenos cargados desde localStorage`, 'color:#8a9e8a;');
});
