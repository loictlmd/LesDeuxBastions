import { t, tr, getLanguage, setLanguage, localizeState, registerStaticTranslations, updateStaticTranslations } from './i18n.js';
const $ = selector => document.querySelector(selector);
const app = $('#app');
const homeUrl = () => `${baseUrl()}/`;
const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const icons = {
 arrows: '<path d="m6 25 20-20m-9 0h9v9M5 17v9h9M10 29 29 10m-6 0h6v6"/>',
 catapult: '<circle cx="9" cy="27" r="3"/><circle cx="25" cy="27" r="3"/><path d="M6 24h22M11 24l7-14 8 14M14 6l10 16M10 4l7 1-3 6Z"/><circle cx="27" cy="5" r="3"/>',
 lightning: '<path d="m19 2-13 17h9l-2 12 14-19h-10l2-10Z"/>',
 sabotage: '<path d="M9 30h18V16H9ZM9 20h18M15 20v10M20 16v4M18 16V8m0 0 6-5M18 8l-5-4M26 8h5M6 10l-4-2"/>',
 shield: '<path d="m16 3 12 5v8c0 7-12 14-12 14S4 23 4 16V8l12-5Z"/><path d="m10 16 4 4 8-9"/>',
 repair: '<path d="M20 4a8 8 0 0 0-10 10L3 24a3 3 0 0 0 5 5l10-8A8 8 0 0 0 28 10l-6 6-5-5 3-7Z"/>',
 mirror: '<path d="m16 2 10 7v14l-10 8-10-8V9l10-7Z"/><path d="m12 10 8 13M20 9l-8 14M3 4l3 1M28 27l3 2"/>',
 coin: '<circle cx="16" cy="16" r="12"/><path d="M16 8v16M21 10h-7a3 3 0 0 0 0 6h4a3 3 0 0 1 0 6h-7"/>',
 flag: '<path d="M8 30V3m0 2 19 3-6 6 6 6-19-3"/>',
 people: '<circle cx="12" cy="10" r="5"/><path d="M2 28v-4a10 10 0 0 1 20 0v4m1-23a5 5 0 0 1 0 10m2 3a9 9 0 0 1 5 8"/>',
 clock: '<circle cx="16" cy="17" r="12"/><path d="M16 9v8l5 3M12 2h8"/>',
 crown: '<path d="m3 9 7 6 6-11 6 11 7-6-3 17H6L3 9ZM7 30h18"/>',
 check: '<path d="m5 17 7 7L28 7"/>',
 book: '<path d="M16 8c-5-4-10-4-13-3v22c5-2 9-1 13 2 4-3 8-4 13-2V5c-3-1-8-1-13 3Zm0 0v21"/>',
 heart: '<path d="M16 28S2 20 2 11C2 2 13 1 16 9 19 1 30 2 30 11c0 9-14 17-14 17Z"/>'
};
function icon(name, cls = '') { return `<svg class="icon ${cls}" viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[name] || icons.flag}</svg>`; }
let session = null;
try { session = JSON.parse(sessionStorage.getItem('bastions-session')); } catch { /* Private browsing can disable storage. */ }
const invited = new URL(location.href).searchParams.get('code')?.toUpperCase().replace(/[^A-Z2-9]/g, '').slice(0, 6) || '';
const watched = new URL(location.href).searchParams.get('watch')?.toUpperCase().replace(/[^A-Z2-9]/g, '').slice(0, 6) || '';
if (watched) session = { code: watched, spectator: true };
if (session && !watched && invited && session.code !== invited) session = null;
let rawState = null, state = null, view = '', offset = 0, busy = false, pollBusy = false, toastTimeout, networkAddresses = [], networkPublicUrl = null, sound = false, audioContext, previousRound = 0, previousEvent = 0, questionKey = '';
let rewardKey = '', rewardTimeout;
try { rewardKey = sessionStorage.getItem('bastions-last-reward') || ''; } catch { /* Storage is optional. */ }
const now = () => state?.paused ? state.gameNow : Date.now() + offset;
const myself = () => state?.teams.find(t => t.id === state.me);
const opponent = () => state?.teams.find(t => t.id !== state.me);
function html(id, value) { const node = document.getElementById(id); if (node && node.innerHTML !== value) node.innerHTML = value; }
function text(id, value) { const node = document.getElementById(id); if (node && node.textContent !== String(value)) node.textContent = value; }
function toast(message) { $('#toast').textContent = message; $('#toast').classList.add('visible'); clearTimeout(toastTimeout); toastTimeout = setTimeout(() => $('#toast').classList.remove('visible'), 4200); }
function saveSession(value) { session = value; try { if (value) sessionStorage.setItem('bastions-session', JSON.stringify(value)); else sessionStorage.removeItem('bastions-session'); } catch { /* The current page still works without persistence. */ } }
function beep(kind = 'answer') {
  if (!sound) return;
  try { audioContext ||= new (window.AudioContext || window.webkitAudioContext)(); audioContext.resume(); const oscillator = audioContext.createOscillator(), gain = audioContext.createGain(); oscillator.connect(gain); gain.connect(audioContext.destination); oscillator.type = 'sine'; oscillator.frequency.setValueAtTime(kind === 'impact' ? 150 : 590, audioContext.currentTime); oscillator.frequency.exponentialRampToValueAtTime(kind === 'impact' ? 65 : 880, audioContext.currentTime + .15); gain.gain.setValueAtTime(.07, audioContext.currentTime); gain.gain.exponentialRampToValueAtTime(.001, audioContext.currentTime + .25); oscillator.start(); oscillator.stop(audioContext.currentTime + .25); } catch { /* Sound is optional. */ }
}
async function api(path, data) {
  const response = await fetch(path, { method: data ? 'POST' : 'GET', headers: { ...(data ? { 'Content-Type': 'application/json' } : {}), ...(session?.token ? { Authorization: `Bearer ${session.token}` } : {}) }, body: data ? JSON.stringify(data) : undefined, signal: AbortSignal.timeout(6500) });
  const result = await response.json();
  if (!response.ok) { const error = new Error(t(result.error) || t('Une erreur est survenue.')); error.status = response.status; throw error; }
  return result;
}
function accept(next) {
  if (state && next.serverNow < state.serverNow) return;
  offset = next.gameNow - Date.now(); rawState = next; state = localizeState(next);
  if (previousRound && next.round !== previousRound && next.status === 'playing') beep();
  if (previousEvent && next.events[0]?.id > previousEvent && next.events[0]?.kind === 'impact') beep('impact');
  previousRound = next.round; previousEvent = next.events[0]?.id || 0;
  $('#connection').hidden = true;
  render();
  showReward();
}
async function poll() {
  if (!session || pollBusy) return;
  pollBusy = true;
  const active = session;
  try { const result = await api(`/api/${session.spectator ? 'watch' : 'state'}?code=${session.code}`); if (session === active) accept(result); }
  catch (error) {
    if (session !== active) return;
    if ([401, 404].includes(error.status)) { reset(); toast(error.message); }
    else { $('#connection').textContent = state?.paused ? t('Connexion interrompue… Nous essayons de vous reconnecter. La partie était en pause ; son état sera resynchronisé.') : t('Connexion interrompue… Gardez cette page ouverte, nous essayons de vous reconnecter. Le chronomètre continue.'); $('#connection').hidden = false; }
  } finally { pollBusy = false; }
}
async function action(type, details = {}) {
  if (busy || !session || session.spectator) return;
  busy = true; updateClock();
  try {
    const result = await api('/api/action', { code: session.code, type, ...details });
    if (result.left) reset(); else accept(result);
    if (type === 'answer') beep();
  } catch (error) { toast(error.message || t('La connexion a été interrompue. Réessayez.')); await poll(); }
  finally { busy = false; render(); }
}
function reset() { rewardKey = ''; clearTimeout(rewardTimeout); $('#reward-burst').hidden = true; saveSession(null); rawState = null; state = null; view = ''; questionKey = ''; previousRound = 0; previousEvent = 0; history.replaceState({}, '', '/'); $('#connection').hidden = true; render(); }
function baseUrl() { return ['localhost', '127.0.0.1', '[::1]'].includes(location.hostname) ? (networkPublicUrl || networkAddresses[0] || location.origin) : location.origin; }
async function copy(value) {
  try { if (navigator.clipboard && window.isSecureContext) await navigator.clipboard.writeText(value); else { const input = document.createElement('textarea'); input.value = value; input.style.position = 'fixed'; input.style.opacity = '0'; document.body.append(input); input.select(); const ok = document.execCommand('copy'); input.remove(); if (!ok) throw new Error(); } toast(t('Lien copié. Envoyez-le à l’autre équipe !')); }
  catch { toast(t('Copie indisponible : sélectionnez et copiez le lien affiché.')); }
}
function qrInvite(code = '') {
  return tr`<section class="qr-invite" aria-label="QR code vers l’accueil du jeu"><a href="${homeUrl()}" target="_blank" rel="noopener"><img src="/api/home-qr" width="180" height="180" alt="QR code : ouvrir l’accueil des Deux Bastions"></a><div><strong>Scannez pour ouvrir le jeu</strong><p>${code ? tr`Puis saisissez le code <b>${escapeHtml(code)}</b> pour rejoindre ou regarder la partie.` : t('Créez votre équipe, rejoignez vos adversaires ou regardez une partie.')}</p><a class="qr-home-link" href="${homeUrl()}" target="_blank" rel="noopener">Ouvrir l’accueil ↗</a></div></section>`;
}
function watchUrl() { return `${baseUrl()}/?watch=${state.code}`; }
function landing() {
  app.innerHTML = tr`<div class="landing"><section class="hero-copy"><p class="eyebrow"><span class="live-dot"></span> LE QUIZ QUI FAIT ÉQUIPE</p><h1>Des idées.<br>Des alliés.<br><em>Un bastion.</em></h1><p class="hero-description">Votre meilleure arme ? <strong>La matière grise.</strong><br>Réunissez votre équipe, défendez votre village<br class="desktop-break"> et faites tomber le bastion adverse.</p><div class="hero-meta"><span>${icon('people')} 2 équipes</span><span>${icon('clock')} 15 min max.</span><span>${icon('flag')} 1 téléphone / équipe</span></div><div class="hero-scene"><img src="/assets/arena.svg" alt="Deux villages fortifiés, l’un aux toits de sauge, l’autre aux toits corail, se font face sur deux îles."><div class="scene-caption"><span><i class="dot sage"></i> L’UNION FAIT LA FORCE</span><span>LA STRATÉGIE FAIT LE RESTE <i class="dot coral"></i></span></div></div></section>
  <aside class="join-card"><div class="card-kicker">LE RENDEZ-VOUS DES ÉQUIPES</div><h2>Entrez dans <br>la bataille.</h2><p>Un code, deux équipes. À vous de jouer.</p><div class="mode-tabs" role="group" aria-label="Mode de connexion"><button id="create-tab" class="selected" aria-pressed="true">Créer une partie</button><button id="join-tab" aria-pressed="false">Rejoindre</button><button id="watch-tab" aria-pressed="false">Regarder</button></div><form id="entry-form"><label for="team-name">Le nom de votre équipe</label><input id="team-name" name="name" minlength="2" maxlength="24" placeholder="Les Incollables" required autocomplete="off"><div id="code-field" hidden><label for="room-code">Le code de la partie</label><input id="room-code" name="code" maxlength="6" pattern="[A-Za-z2-9]{6}" placeholder="Ex. BAST23" autocapitalize="characters" autocomplete="off" spellcheck="false" value="${escapeHtml(watched || invited)}"></div><p class="form-hint" id="entry-hint">Créez votre camp, puis partagez son code à l’autre équipe.</p><p id="entry-error" class="form-error" role="alert"></p><button type="submit" class="button primary wide" id="enter-button">Créer notre camp <span>→</span></button></form><div class="card-divider"><span>OU</span></div><button class="button secondary wide ai-button" id="practice-button">Jouer contre l’IA <span>↗</span></button></aside></div>
  <section class="how-it-works" aria-label="Comment jouer"><article><span class="step-num">01</span><div><h3>Cogitez ensemble.</h3><p>25 secondes maximum pour répondre.<br>De 3 à 6 pièces : la rapidité compte.</p></div>${icon('book')}</article><article><span class="step-num">02</span><div><h3>Jouez collectif.</h3><p>Attaquer, protéger ou réparer ?<br>Votre équipe, votre stratégie.</p></div>${icon('shield')}</article><article><span class="step-num">03</span><div><h3>Visez la victoire.</h3><p>Faites tomber le village adverse.<br>Puis prenez le temps de débriefer.</p></div>${icon('crown')}</article></section>`;
  let mode = watched ? 'watch' : invited ? 'join' : 'create';
  const setMode = value => {
    mode = value;
    for (const name of ['create', 'join', 'watch']) { $(`#${name}-tab`).classList.toggle('selected', value === name); $(`#${name}-tab`).setAttribute('aria-pressed', String(value === name)); }
    const watching = value === 'watch';
    $('#team-name').hidden = watching; $('#team-name').required = !watching; $('label[for="team-name"]').hidden = watching;
    $('#code-field').hidden = value === 'create'; $('#room-code').required = value !== 'create';
    $('#entry-hint').textContent = watching ? t('Entrez le code d’une partie pour la regarder, sans prendre la place d’une équipe.') : value === 'join' ? t('Demandez le code à l’équipe qui a créé le camp.') : t('Créez votre camp, puis partagez son code à l’autre équipe.');
    $('#enter-button').innerHTML = `${watching ? t('Regarder la partie') : value === 'join' ? t('Rejoindre la partie') : t('Créer notre camp')} <span>→</span>`;
    $('#entry-error').textContent = '';
  };
  $('#create-tab').onclick = () => setMode('create'); $('#join-tab').onclick = () => setMode('join'); $('#watch-tab').onclick = () => setMode('watch'); setMode(mode);
  const enter = async (practice = false) => {
    if (busy) return;
    busy = true; $('#enter-button').disabled = true; $('#practice-button').disabled = true; $('#entry-error').textContent = '';
    try {
      if (mode === 'watch' && !practice) {
        const code = $('#room-code').value.toUpperCase().trim();
        const result = await api(`/api/watch?code=${encodeURIComponent(code)}`);
        saveSession({ code, spectator: true }); history.replaceState({}, '', `/?watch=${code}`); state = null; view = ''; accept(result); return;
      }
      const result = await api(mode === 'join' && !practice ? '/api/join' : '/api/rooms', { name: $('#team-name').value.trim() || (practice ? 'Les Explorateurs' : ''), code: $('#room-code').value.toUpperCase().trim(), practice }); saveSession(result); history.replaceState({}, '', `/?code=${result.code}`); state = null; view = ''; await poll(); }
    catch (error) { if ($('#entry-error')) $('#entry-error').textContent = error.message || t('Impossible de joindre le serveur.'); }
    finally { busy = false; if ($('#enter-button')) $('#enter-button').disabled = false; if ($('#practice-button')) $('#practice-button').disabled = false; }
  };
  $('#entry-form').onsubmit = event => { event.preventDefault(); enter(); };
  $('#practice-button').onclick = () => enter(true);
}
function waiting() {
  app.innerHTML = tr`<section class="lobby"><div class="lobby-heading"><p class="eyebrow">${state.practice ? t('MODE DÉCOUVERTE') : t('LE CAMP DE BASE')}</p><h1>Rassemblons<br><em>les bonnes idées.</em></h1><p>Préparez vos équipes. La bataille commence quand tout le monde est prêt.</p></div><div class="lobby-grid"><div class="lobby-world"><img class="team-arena" src="/assets/arena.svg" alt="Les deux bastions attendent leurs équipes."><div class="lobby-teams" id="lobby-teams"></div><div class="note dark-note"><strong>Un rôle pour chacun</strong><p>Un porte-parole tient le téléphone. Les autres débattent et conseillent. Changez de porte-parole toutes les deux questions !</p></div></div><aside class="join-card lobby-card"><p class="eyebrow">${state.practice ? t('VOTRE PARTIE DE DÉCOUVERTE') : t('INVITEZ L’AUTRE ÉQUIPE')}</p><label class="code-label">Code de la partie</label><div class="room-code">${state.code}</div><button class="button secondary wide" id="copy-link">Copier le lien d’invitation ${icon('flag')}</button>${qrInvite(state.code)}<div class="lobby-divider"></div><label>Les couleurs de votre château</label><div id="lobby-colors" class="color-picker"></div><p class="tiny">La couleur adverse est réservée à son équipe.</p><button class="button primary wide" id="ready-button"></button><button class="button launch wide" id="start-button">Lancer la bataille →</button><p id="waiting-hint" class="form-hint center" aria-live="polite"></p><button class="text-button leave-link" id="leave-button">Quitter le camp</button></aside></div></section>`;
  $('#copy-link').onclick = () => copy(`${baseUrl()}/?code=${state.code}`);
  $('#ready-button').onclick = () => action('ready'); $('#start-button').onclick = () => action('start'); $('#leave-button').onclick = showLeave;
}
function updateWaiting() {
  const me = myself();
  html('lobby-teams', [0, 1].map(id => { const p = state.teams.find(t => t.id === id); return `<div class="team-slot ${id ? 'coral-team' : ''}"><span class="team-medallion" ${p ? `style="color:${colorOf(p).flag};border-color:${colorOf(p).roof}"` : ''}>${icon('flag')}</span><div><span class="eyebrow">BASTION ${p ? colorOf(p).name.toUpperCase() : id + 1}</span><h3>${p ? escapeHtml(p.name) : t('Une équipe vous attend…')}</h3><span class="team-ready ${p?.ready ? 'is-ready' : ''}">${p ? p.ready ? t('✓ Prête pour la bataille') : t('En préparation') : t('Partagez le code du camp')}</span>${p && !p.online ? '<span class="offline-text">Connexion interrompue</span>' : ''}</div></div>`; }).join(''));
  updateColors();
  text('ready-button', me.ready ? t('✓ Notre équipe est prête') : t('Nous sommes prêts'));
  $('#ready-button').classList.toggle('ready-active', me.ready); $('#ready-button').disabled = busy;
  const start = $('#start-button'); start.hidden = state.host !== state.me; start.disabled = busy || state.teams.length !== 2 || !state.teams.every(p => p.ready && p.online);
  text('waiting-hint', state.teams.length < 2 ? t('En attente de la deuxième équipe…') : !state.teams.every(p => p.ready) ? t('Chaque équipe doit confirmer qu’elle est prête.') : state.host === state.me ? t('Tout le monde est prêt. À vous de lancer !') : t('L’autre équipe peut maintenant lancer la partie.'));
}
function colorOf(team) { return state.colors.find(c => c.id === team.color); }
function updateColors() {
  const me = myself(), enemy = opponent();
  for (const id of ['lobby-colors', 'dialog-colors']) {
    if (!me || !document.getElementById(id)) continue;
    html(id, state.colors.map(c => `<button type="button" class="color-swatch ${me.color === c.id ? 'selected' : ''}" data-color="${c.id}" style="--swatch:${c.roof}" aria-label="${c.name}${enemy?.color === c.id ? t(', couleur adverse') : ''}" aria-pressed="${me.color === c.id}" ${busy || enemy?.color === c.id ? 'disabled' : ''}><span aria-hidden="true">${me.color === c.id ? '✓' : enemy?.color === c.id ? '×' : ''}</span><small>${c.name}</small></button>`).join(''));
  }
  document.querySelectorAll('[data-color]').forEach(button => { button.onclick = () => action('color', { color: button.dataset.color }); });
  for (const p of state.teams) {
    document.body.style.setProperty(`--team-${p.id}`, colorOf(p).roof);
    const fill = document.getElementById(`hpfill-${p.id}`); if (fill) fill.style.backgroundColor = colorOf(p).roof;
    const dot = document.getElementById(`team-dot-${p.id}`); if (dot) dot.style.backgroundColor = colorOf(p).roof;
    const hp = document.getElementById(`hp-${p.id}`); if (hp) hp.style.color = colorOf(p).flag;
  }
  const left = state.teams.find(p => p.id === 0)?.color || 'sage';
  const right = state.teams.find(p => p.id === 1)?.color || 'coral';
  const src = `/assets/arena.svg?left=${left}&right=${right}`;
  document.querySelectorAll('.team-arena').forEach(img => { if (img.getAttribute('src') !== src) img.src = src; });
}
function briefing() {
  waiting();
  updateColors();
  const dialog = $('#briefing-dialog');
  if (!dialog.open) dialog.showModal();
  $('#briefing-confirm').onclick = () => action('briefed');
  $('#briefing-leave').onclick = () => action('leave');
}
function updateBriefing() {
  const me = myself(), enemy = opponent();
  updateColors();
  $('#briefing-confirm').disabled = busy || me.briefed;
  text('briefing-confirm', me.briefed ? t('✓ Règles comprises') : t('Compris, notre équipe est prête !'));
  text('briefing-status', !enemy.online ? t('L’autre équipe se reconnecte… Le chronomètre est en pause.') : me.briefed ? t('En attente de l’accord de l’autre équipe…') : t('Le chronomètre démarre après l’accord des deux équipes.'));
}
function showReward() {
  const result = state?.lastResult;
  if (!result || state.spectator || state.status !== 'playing') return;
  const key = `${state.code}:${state.startedAt}:${result.round}`;
  if (rewardKey === key) return;
  rewardKey = key;
  try { sessionStorage.setItem('bastions-last-reward', key); } catch { /* Storage is optional. */ }
  const node = $('#reward-burst');
  node.hidden = false;
  node.classList.toggle('zero-reward', result.reward === 0);
  node.innerHTML = tr`${icon('coin')}<strong>+${result.reward} pièces</strong><span>${result.correct ? tr`Bonne réponse en ${(result.elapsedMs / 1000).toFixed(1).replace('.', getLanguage() === 'fr' ? ',' : '.')} s` : result.answered ? t('Mauvaise réponse · aucune pénalité') : t('Temps écoulé · aucune pénalité')}</span>`;
  node.getAnimations().forEach(animation => animation.cancel());
  if (!matchMedia('(prefers-reduced-motion: reduce)').matches) node.animate([{ opacity: 0, transform: 'translate(-50%, 16px) scale(.85)' }, { opacity: 1, transform: 'translate(-50%, 0) scale(1)' }], { duration: 450, easing: 'ease-out' });
  clearTimeout(rewardTimeout);
  rewardTimeout = setTimeout(() => { node.hidden = true; }, state.rules.resultMs);
}
function teamHealth(p, side) {
  return tr`<div class="village-status ${side}"><div class="village-heading"><span><i id="team-dot-${p.id}" class="dot"></i><b>${escapeHtml(p.name)}</b><small>${state.spectator ? tr`ÉQUIPE ${p.id === 0 ? 'A' : 'B'}` : p.id === state.me ? t('VOTRE VILLAGE') : t('ADVERSAIRE')}</small></span><strong id="hp-${p.id}">${state.rules.hp}<small>/${state.rules.hp}</small></strong></div><div class="hp-track" role="progressbar" aria-label="Points de vie de ${escapeHtml(p.name)}" aria-valuemin="0" aria-valuemax="${state.rules.hp}" id="hpbar-${p.id}"><span id="hpfill-${p.id}"></span></div><div class="village-effects" id="effects-${p.id}"></div><div class="bastion-buildings" id="buildings-${p.id}" aria-label="Attaques de ${escapeHtml(p.name)}"></div></div>`;
}
function battleContent(teams) {
  return tr`<section id="battlefield" class="battlefield" aria-label="Le champ de bataille"><div class="health-row">${teams.map((p, i) => teamHealth(p, i ? 'right' : 'left')).join('')}</div><div class="battle-art"><img class="team-arena" src="/assets/arena.svg" alt="Les deux châteaux aux couleurs de leurs équipes se font face."><div class="dome left-dome" id="dome-0"></div><div class="dome right-dome" id="dome-1"></div><div id="projectiles" class="projectiles"></div><div class="vs-medallion">VS</div><div id="battle-phase" class="battle-phase">DÉBATTEZ. DÉCIDEZ. DÉFENDEZ.</div></div></section><section class="question-card" id="question-card" aria-labelledby="question-text"><div class="question-top"><span class="category-pill" id="question-category"></span><span class="answer-clock" id="answer-timer"></span></div><h2 id="question-text"></h2><p class="question-helper">${state.spectator ? t('Observez les équipes. La solution sera révélée à la fin de la question.') : t('Un avis, une idée ? Consultez votre équipe avant de choisir.')}</p><div class="answers" id="answers"></div><div class="answer-feedback" id="answer-feedback" role="status"></div><div class="question-bottom"><span id="opponent-answer"></span><span>Bonne réponse <b id="reward-preview">+3–6 ${icon('coin')}</b></span></div><div class="question-progress"><span id="question-progress"></span></div></section>`;
}
function playing() {
  questionKey = '';
  const teams = [...state.teams].sort((a, b) => a.id - b.id);
  app.innerHTML = tr`<section class="game"><div class="game-hud"><div class="round-info"><span class="eyebrow" id="phase-title">LA BATAILLE DES IDÉES</span><h2>Manche <span id="round-number">1</span><span class="game-code">${state.practice ? t('DÉMO') : state.code}</span></h2></div><div class="hud-right"><div class="round-countdown">${icon('clock')}<strong id="hud-timer">0:30</strong><span>prochaine<br>question</span></div><div class="wallet">${icon('coin')}<strong id="coin-count">12</strong><span>pièces</span></div><button class="icon-button" id="leave-button" aria-label="Quitter la partie" title="Quitter la partie">↗</button></div></div><div class="battle-controls"><span class="match-time">Fin dans <strong id="match-timer">15:00</strong></span><button id="colors-button" class="control-button">Couleurs du château</button><button id="pause-button" class="control-button">Pause</button><button id="share-watch-button" class="control-button">Lien spectateur</button></div><section id="pause-panel" class="pause-panel" role="status" hidden><div><strong id="pause-title">Partie en pause</strong><p id="pause-status"></p></div><button id="resume-button" class="button primary">Notre équipe est prête à reprendre</button></section><nav class="mobile-shortcuts" aria-label="Navigation de partie"><button data-jump="question-card">${icon('book')} Le quiz</button><button data-jump="arsenal">${icon('shield')} L’arsenal</button><button id="mobile-pause">Pause</button></nav><div id="incoming-notice" class="incoming-notice" role="status" hidden></div><div id="opponent-status" class="opponent-status" role="status" hidden></div><div class="game-grid">${battleContent(teams)}<aside class="arsenal" id="arsenal"><div class="section-heading"><div><p class="eyebrow">VOTRE STRATÉGIE COMMENCE ICI</p><h2>L’arsenal</h2></div><span class="arsenal-tip">À vous de choisir.</span></div><div class="arsenal-group-title"><span>PASSER À L’OFFENSIVE</span><i></i><span>04</span></div><div class="shop-grid">${state.items.filter(i => i.kind === 'attack').map(itemCard).join('')}</div><div class="arsenal-group-title defense-title"><span>PROTÉGER LE VILLAGE</span><i></i><span>03</span></div><div class="shop-grid defense-grid">${state.items.filter(i => i.kind === 'defense').map(itemCard).join('')}</div><p class="shop-help">Cadre rouge : verrouillée · orange : construction · vert : débloquée. Le prix affiché est celui de votre prochaine action.</p></aside></div><section class="battle-journal"><div class="section-heading"><h3>Le journal de bataille</h3><span>Les dernières nouvelles du front</span></div><ol id="events"></ol></section></section>`;
  $('#leave-button').onclick = showLeave;
  $('#share-watch-button').onclick = () => copy(watchUrl());
  $('#pause-button').onclick = () => action('pause');
  $('#mobile-pause').onclick = () => action(state.paused ? 'resume' : 'pause');
  $('#resume-button').onclick = () => action('resume');
  $('#colors-button').onclick = () => { updateColors(); $('#colors-dialog').showModal(); };
  app.querySelectorAll('[data-jump]').forEach(button => { button.onclick = () => document.getElementById(button.dataset.jump).scrollIntoView({ behavior: 'instant', block: 'start' }); });
  app.querySelectorAll('[data-item]').forEach(button => { button.onclick = () => { const item = state.items.find(i => i.id === button.dataset.item); action(item.kind === 'attack' && !myself().unlocks[item.id] ? 'unlock' : 'buy', { item: item.id }); }; });
}
function watchingLobby() {
  app.innerHTML = tr`<section class="lobby spectator-lobby"><p class="eyebrow">DANS LES TRIBUNES · ${state.code}</p><h1>La bataille<br><em>se prépare.</em></h1><p id="watching-status" role="status"></p><img class="team-arena spectator-scene" src="/assets/arena.svg" alt="Les deux bastions de la partie"><div id="watching-teams" class="scoreboards"></div><p>Vous regardez cette partie sans occuper de place dans une équipe.</p><button class="button secondary light" id="watch-exit">Retour à l’accueil</button></section>`;
  $('#watch-exit').onclick = reset;
}
function updateWatchingLobby() {
  updateColors();
  text('watching-status', state.status === 'briefing' ? t('Les équipes lisent les règles. Le jeu démarrera après leurs confirmations.') : state.teams.length < 2 ? t('Une équipe attend son adversaire. Vous assisterez au lancement en direct.') : t('Les équipes se préparent à lancer la bataille.'));
  html('watching-teams', state.teams.map(p => `<article class="scoreboard"><span class="eyebrow">BASTION ${colorOf(p).name.toUpperCase()}</span><h2>${escapeHtml(p.name)}</h2><p>${state.status === 'briefing' ? p.briefed ? t('✓ Règles comprises') : t('Lecture des règles…') : p.ready ? t('✓ Équipe prête') : t('En préparation…')}</p></article>`).join(''));
}
function watching() {
  questionKey = '';
  const teams = [...state.teams].sort((a, b) => a.id - b.id);
  app.innerHTML = tr`<section class="game spectator-game"><div class="game-hud"><div class="round-info"><span class="eyebrow">VUE SPECTATEUR · ${state.code}</span><h2>Manche <span id="round-number">1</span></h2></div><div class="hud-right"><div class="round-countdown">${icon('clock')}<strong id="hud-timer">0:30</strong></div><button class="control-button" id="watch-exit">Quitter les tribunes</button></div></div><div class="battle-controls"><span class="match-time">Fin dans <strong id="match-timer">15:00</strong></span><span class="spectator-badge">En direct · lecture seule</span></div><section id="pause-panel" class="pause-panel" role="status" hidden><div><strong id="pause-title"></strong><p id="pause-status"></p></div></section><nav class="mobile-shortcuts" aria-label="Navigation spectateur"><button data-jump="battlefield">${icon('shield')} Bataille</button><button data-jump="question-card">${icon('book')} Quiz</button></nav><div id="incoming-notice" hidden></div><div id="opponent-status" class="opponent-status" role="status" hidden></div><div class="game-grid">${battleContent(teams)}<aside class="spectator-summary"><p class="eyebrow">LES DEUX CAMPS</p><h2>Le suivi de la bataille</h2><div id="watch-scores"></div><p class="spectator-note">Les pièces et les commandes restent privées aux équipes. La solution du quiz apparaît après leurs deux réponses ou à la fin du temps.</p></aside></div><section class="battle-journal"><div class="section-heading"><h3>Le journal de bataille</h3><span>Les dernières nouvelles du front</span></div><ol id="events"></ol></section></section>`;
  $('#watch-exit').onclick = reset;
  app.querySelectorAll('[data-jump]').forEach(button => { button.onclick = () => document.getElementById(button.dataset.jump).scrollIntoView({ behavior: 'instant', block: 'start' }); });
}
function updateWatchScores() {
  html('watch-scores', state.teams.map(p => tr`<article class="scoreboard"><span class="eyebrow">BASTION ${colorOf(p).name.toUpperCase()}</span><h3>${escapeHtml(p.name)}</h3><div class="score-row"><span>Points de vie</span><b>${p.hp} / ${state.rules.hp}</b></div><div class="score-row"><span>Bonnes réponses</span><b>${p.stats.correct}</b></div><div class="score-row"><span>Dégâts infligés</span><b>${p.stats.damage}</b></div><p>${p.answered ? t('✓ Réponse enregistrée') : t('Réflexion en cours…')}</p></article>`).join(''));
}
function itemCard(item) {
  return tr`<button class="item-card ${item.kind}" data-item="${item.id}" aria-label="${escapeHtml(item.name)}, ${item.cost} pièces. ${escapeHtml(item.description)}"><div class="item-top"><span class="item-art ${item.id}">${icon(item.icon)}</span><span class="item-cost">${item.cost} ${icon('coin')}</span></div><h3>${item.name}</h3><p>${item.description}</p>${item.kind === 'attack' ? '<span class="attack-state"></span>' : ''}<div class="item-buy"><span class="buy-label">${item.kind === 'attack' ? t('Lancer l’attaque') : t('Activer')}</span><span class="buy-arrow">↗</span></div></button>`;
}
function updateGame() {
  const me = myself(), enemy = opponent();
  updateColors();
  document.body.classList.toggle('battle-paused', state.paused);
  $('#pause-panel').hidden = !state.paused;
  if (!state.spectator) {
    $('#pause-button').disabled = busy || state.paused;
    $('#resume-button').disabled = busy || myself().resumeReady;
    $('#mobile-pause').disabled = busy || (state.paused && myself().resumeReady);
    text('mobile-pause', state.paused ? myself().resumeReady ? t('✓ Attente') : t('Reprendre') : 'Pause');
    text('pause-title', tr`Pause demandée par ${state.teams.find(p => p.id === state.pausedBy)?.name || t('une équipe')}`);
    text('pause-status', myself().resumeReady ? t('Votre équipe est prête. En attente de l’autre camp…') : t('Questions, constructions, attaques et recharges sont figées. Les deux équipes doivent confirmer la reprise.'));
    text('resume-button', myself().resumeReady ? t('✓ Prêts à reprendre') : t('Notre équipe est prête à reprendre'));
  } else {
    text('pause-title', t('La partie est en pause'));
    text('pause-status', t('Les deux équipes doivent confirmer la reprise.'));
    updateWatchScores();
  }
  text('round-number', state.round); text('coin-count', me?.coins ?? ''); text('phase-title', state.storm ? t('LA TEMPÊTE · RÉPARATIONS FERMÉES') : state.siege ? t('LE SIÈGE · ATTAQUES +50 %') : t('LA BATAILLE DES IDÉES'));
  text('battle-phase', state.storm ? t('TEMPÊTE : −8 PV / 10 SECONDES') : state.siege ? t('LE SIÈGE : LES ATTAQUES GAGNENT 50 % DE DÉGÂTS') : t('DÉBATTEZ. DÉCIDEZ. DÉFENDEZ.'));
  for (const p of state.teams) {
    html(`hp-${p.id}`, `${p.hp}<small>/${state.rules.hp}</small>`); $(`#hpfill-${p.id}`).style.width = `${p.hp / state.rules.hp * 100}%`; $(`#hpbar-${p.id}`).setAttribute('aria-valuenow', p.hp); $(`#hpbar-${p.id}`).classList.toggle('low', p.hp <= state.rules.hp * .3);
    $(`#dome-${p.id}`).classList.toggle('visible', p.shield > 0 || p.mirrorUntil > now()); $(`#dome-${p.id}`).classList.toggle('mirrored', p.mirrorUntil > now());
  }
  const key = `${state.startedAt}:${state.round}`;
  if (questionKey !== key) {
    questionKey = key; text('question-category', state.question.category); text('question-text', state.question.text);
    html('answers', state.question.options.map((answer, i) => `<button class="answer-option" data-choice="${i}"><span class="answer-letter">${'ABCD'[i]}</span><span>${escapeHtml(answer)}</span><span class="answer-mark"></span></button>`).join(''));
    app.querySelectorAll('[data-choice]').forEach(button => { button.onclick = () => action('answer', { round: state.round, choice: Number(button.dataset.choice) }); });
  }
  text('opponent-answer', state.spectator ? tr`${state.teams.filter(p => p.answered).length} / 2 équipes ont répondu` : enemy.answered ? t('✓ L’autre équipe a répondu') : t('L’autre équipe réfléchit…'));
  html('events', state.events.slice(0, 8).map(event => `<li class="event-${event.kind}"><span class="event-dot"></span><time>${formatTime(Math.max(0, event.at - state.startedAt))}</time><span>${escapeHtml(event.message)}</span></li>`).join(''));
  const projectiles = state.projectiles.map(p => { const item = state.items.find(i => i.id === p.item); return `<div class="projectile ${p.from ? 'from-right' : ''}" id="projectile-${p.id}" title="${escapeHtml(item.name)}">${icon(item.icon)}<small>${Math.max(0, Math.ceil((p.impactAt - now()) / 1000))} s</small></div>`; }).join('');
  html('projectiles', projectiles);
  $('#opponent-status').hidden = state.spectator ? state.teams.every(p => p.online) : enemy.online;
  updateClock();
}
function formatTime(ms) { const secs = Math.max(0, Math.ceil(ms / 1000)); return `${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, '0')}`; }
function updateClock() {
  if (!state || state.status !== 'playing' || !['playing', 'watching'].includes(view)) return;
  const time = now(), me = myself(), enemy = opponent(), expired = state.answersClosed || time >= state.answerUntil;
  text('match-timer', formatTime(state.matchEndsAt - time));
  text('hud-timer', formatTime(state.nextRoundAt - time));
  const potentialReward = Math.max(state.rules.minReward, state.rules.maxReward - Math.floor(Math.max(0, time - state.roundStartedAt) / state.rules.rewardStepMs));
  html('reward-preview', `${state.answer ? `+${state.answer.reward}` : expired ? t('Clôturée') : `+${potentialReward}`} ${icon('coin')}`); text('answer-timer', state.answersClosed && state.teams.every(p => p.answered) ? tr`Prochaine question dans ${Math.max(0, Math.ceil((state.nextRoundAt - time) / 1000))} s` : expired ? t('Réponses closes') : tr`${Math.max(0, Math.ceil((state.answerUntil - time) / 1000))} s pour répondre`);
  $('#answer-timer').classList.toggle('urgent', !expired && state.answerUntil - time < 7000);
  $('#question-progress').style.width = `${Math.max(0, Math.min(100, (state.answerUntil - time) / state.rules.answerMs * 100))}%`;
  for (const button of app.querySelectorAll('[data-choice]')) {
    const choice = Number(button.dataset.choice), reveal = state.question.correct !== undefined;
    button.disabled = state.spectator || busy || state.paused || !!state.answer || expired;
    button.classList.toggle('correct', reveal && choice === state.question.correct);
    button.classList.toggle('incorrect', !!state.answer && !state.answer.correct && choice === state.answer.choice);
    button.classList.toggle('chosen', !!state.answer && choice === state.answer.choice);
    button.querySelector('.answer-mark').textContent = reveal && choice === state.question.correct ? '✓' : state.answer && !state.answer.correct && choice === state.answer.choice ? '×' : '';
  }
  const feedback = $('#answer-feedback');
  feedback.classList.toggle('success', !!state.answer?.correct);
  feedback.classList.toggle('wrong', (!!state.answer && !state.answer.correct) || (expired && !state.answer));
  const feedbackText = state.spectator ? (state.question.explanation || t('La solution apparaît après les deux réponses ou à la fin du temps de réponse.')) : state.answer ? `${state.answer.correct ? tr`Bien joué ! +${state.answer.reward} pièces.` : t('Pas cette fois. Rien n’est perdu !')} ${state.question.explanation || ''}` : expired ? tr`Temps écoulé. ${state.question.explanation || t('La solution arrive…')}` : t('Une seule réponse par équipe. Prenez le temps d’en discuter.');
  text('answer-feedback', feedbackText);
  for (const button of app.querySelectorAll('[data-item]')) {
    const item = state.items.find(i => i.id === button.dataset.item);
    const research = me.unlocks[item.id], locked = item.kind === 'attack' && !research;
    const building = research && research.readyAt > time;
    const price = locked ? item.unlockCost : me.prices[item.id];
    const effect = item.kind === 'attack' && state.siege ? item.description.replace(tr`${item.damage} dégâts`, tr`${Math.round(item.damage * 1.5)} dégâts`) : item.description;
    const description = effect;
    button.querySelector('p').textContent = description;
    button.setAttribute('aria-label', tr`${locked ? t('Débloquer') : t('Utiliser')} ${item.name}, ${price} pièces. ${description}`);
    const cost = button.querySelector('.item-cost');
    const costHtml = `${price} ${icon('coin')}`; if (cost.innerHTML !== costHtml) cost.innerHTML = costHtml;
    const cooldown = Math.max(me.nextAction, locked ? 0 : (me.cooldowns[item.id] || 0)) - time;
    let reason = '';
    if (state.paused) reason = t('Partie en pause');
    else if (building) reason = tr`Construction : ${Math.ceil((research.readyAt - time) / 1000)} s`;
    else if (state.storm && item.heal) reason = t('Atelier fermé');
    else if (item.heal && me.hp >= state.rules.hp) reason = t('Village intact');
    else if (item.shield && me.shield >= 36) reason = t('Bouclier au maximum');
    else if (item.id === 'mirror' && me.mirrorUntil > time) reason = t('Miroir actif');
    else if (cooldown > 0) reason = tr`Prêt dans ${Math.ceil(cooldown / 1000)} s`;
    else if (me.coins < price) reason = tr`Il manque ${price - me.coins} pièce${price - me.coins > 1 ? 's' : ''}`;
    button.disabled = busy || !!reason;
    button.querySelector('.buy-label').textContent = reason || (locked ? t('Débloquer l’attaque') : item.kind === 'attack' ? t('Lancer l’attaque') : t('Activer'));
    button.classList.toggle('affordable', !reason);
    button.classList.toggle('locked', locked);
    button.classList.toggle('building', !!building);
    button.classList.toggle('unlocked', item.kind === 'attack' && !!research && !building);
    if (item.kind === 'attack') {
      button.querySelector('.attack-state').textContent = locked ? t('🔒 Non débloquée') : building ? t('◷ En construction') : t('✓ Débloquée');
    }
  }
  for (const p of state.teams) {
    const buildings = state.items.filter(item => p.unlocks[item.id]).map(item => {
      const research = p.unlocks[item.id], remaining = Math.max(0, Math.ceil((research.readyAt - time) / 1000));
      const progress = Math.min(100, Math.max(0, (time - research.startedAt) / item.unlockMs * 100));
      return `<span class="bastion-building ${remaining ? 'constructing' : 'built'}" title="${escapeHtml(item.name)} : ${remaining ? tr`construction, ${remaining} secondes` : t('débloquée')}">${icon(item.icon)}<span>${escapeHtml(item.name)}<small>${remaining ? tr`Construction · ${remaining} s` : t('✓ Débloquée')}</small></span><i style="width:${progress}%"></i></span>`;
    }).join('');
    html(`buildings-${p.id}`, buildings || t('<span class="empty-buildings">Aucune attaque débloquée</span>'));
  }
  for (const p of state.teams) html(`effects-${p.id}`, `${p.shield > 0 ? `<span class="shield-pill">${icon('shield')} ${p.shield} <small>· ${Math.max(0, Math.ceil((p.shieldUntil - time) / 1000))} s</small></span>` : t('<span class="no-shield">Sans bouclier</span>')}${p.mirrorUntil > time ? `<span class="mirror-pill">${icon('mirror')} ${Math.ceil((p.mirrorUntil - time) / 1000)} s</span>` : ''}`);
  const incoming = state.projectiles.filter(p => p.to === state.me).sort((a, b) => a.impactAt - b.impactAt);
  $('#incoming-notice').hidden = !incoming.length;
  if (incoming.length) { const item = state.items.find(i => i.id === incoming[0].item); html('incoming-notice', tr`${icon(item.icon)} <b>${item.name} en approche</b><span>Impact dans ${Math.max(0, Math.ceil((incoming[0].impactAt - time) / 1000))} s · protégez votre village !</span>`); }
  if (state.spectator && state.teams.some(p => !p.online)) text('opponent-status', tr`${state.teams.filter(p => !p.online).map(p => p.name).join(', ')} : reconnexion en cours.`);
  else if (!enemy.online) text('opponent-status', tr`L’autre équipe se reconnecte… Forfait dans ${Math.max(0, Math.ceil((enemy.disconnectAt - time) / 1000))} s.`);
  for (const p of state.projectiles) {
    const node = document.getElementById(`projectile-${p.id}`); if (!node) continue;
    const progress = Math.max(0, Math.min(1, (time - p.launchAt) / (p.impactAt - p.launchAt)));
    node.style.left = `${p.from === 0 ? 27 + progress * 48 : 75 - progress * 48}%`;
    node.style.top = `${27 - Math.sin(progress * Math.PI) * 17}%`;
    node.querySelector('small').textContent = `${Math.max(0, Math.ceil((p.impactAt - time) / 1000))} s`;
  }
}
function finished() {
  const won = state.winner === state.me, tie = state.winner === null;
  const winningTeam = state.teams.find(p => p.id === state.winner);
  app.innerHTML = tr`<section class="results"><p class="eyebrow">LA BATAILLE EST TERMINÉE</p><div class="victory-icon ${won ? '' : 'coral-victory'}">${icon(tie ? 'shield' : 'crown')}</div><h1>${tie ? t('Deux bastions.<br><em>Une égalité.</em>') : state.spectator ? t('La bataille<br><em>a son verdict.</em>') : won ? t('La victoire<br><em>est collective.</em>') : t('Bien joué.<br><em>La revanche ?</em>')}</h1><p>${tie ? state.endReason === 'time' ? t('Quinze minutes écoulées : les deux bastions ont autant de points de vie.') : t('Les deux villages sont tombés en même temps.') : tr`<strong>${escapeHtml(winningTeam.name)}</strong> remporte la bataille.`} ${state.endReason === 'time' ? (tie ? t('Aucune équipe ne l’emporte.') : t('Victoire au plus grand nombre de points de vie restants après quinze minutes de jeu effectif.')) : state.endReason === 'disconnect' ? t('L’autre équipe est restée déconnectée plus de 90 secondes.') : state.endReason === 'forfeit' ? t('L’adversaire a quitté la partie.') : t('Chaque idée a compté.')}</p><div class="result-meta"><span>${icon('clock')} ${formatTime(state.finishedAt - state.startedAt)}</span><span>${icon('book')} ${state.round} manche${state.round > 1 ? 's' : ''}</span></div><div class="scoreboards">${state.teams.map(p => tr`<article class="scoreboard ${p.id === state.winner ? 'winner' : ''}"><span class="eyebrow">${state.spectator ? tr`ÉQUIPE ${p.id === 0 ? 'A' : 'B'}` : p.id === state.me ? t('VOTRE ÉQUIPE') : t('ÉQUIPE ADVERSE')} ${p.id === state.winner ? t('· VICTOIRE') : ''}</span><h2>${escapeHtml(p.name)}</h2><div class="score-row"><span>Bonnes réponses</span><b>${p.stats.correct} / ${state.round}</b></div><div class="score-row"><span>Dégâts aux villages</span><b>${p.stats.damage}</b></div><div class="score-row"><span>Pièces investies</span><b>${p.stats.spent}</b></div><div class="score-row"><span>PV restants</span><b>${p.hp} / ${state.rules.hp}</b></div></article>`).join('')}</div><div class="debrief"><span>${icon('people')}</span><div><h3>Deux minutes pour faire équipe.</h3><p>Qu’est-ce qui vous a aidés à décider ensemble ?<br>Quelle idée d’un coéquipier a changé votre stratégie ?</p></div></div><div class="result-buttons">${state.spectator ? '' : t('<button class="button primary" id="rematch-button">On prend notre revanche →</button>')}<button class="button secondary light" id="home-button">Retour à l’accueil</button></div><p id="rematch-status" class="muted center" aria-live="polite"></p></section>`;
  if ($('#rematch-button')) $('#rematch-button').onclick = () => action('rematch'); $('#home-button').onclick = reset;
}
function showLeave() { $('#leave-description').textContent = state.status === 'playing' ? t('Quitter une partie en cours donne la victoire à l’autre équipe.') : t('Votre place sera libérée pour une autre équipe.'); $('#leave-dialog').showModal(); }
function render() {
  const nextView = state?.spectator ? (state.status === 'playing' ? 'watching' : state.status === 'finished' ? 'watching-finished' : 'watching-lobby') : state?.status || (session ? 'loading' : 'landing');
  if (view !== nextView) {
    view = nextView; document.body.dataset.view = state?.status === 'playing' ? 'playing' : view; document.body.dataset.role = state?.spectator ? 'spectator' : 'player';
    if (view !== 'briefing' && $('#briefing-dialog').open) $('#briefing-dialog').close();
    if (view !== 'playing') { document.body.classList.remove('battle-paused'); $('#colors-dialog').close(); clearTimeout(rewardTimeout); $('#reward-burst').hidden = true; }
    if (view === 'landing') landing();
    else if (view === 'waiting') waiting();
    else if (view === 'briefing') briefing();
    else if (view === 'playing') playing();
    else if (view === 'finished' || view === 'watching-finished') finished();
    else if (view === 'watching-lobby') watchingLobby();
    else if (view === 'watching') watching();
    else app.innerHTML = t('<section class="loading"><span class="loading-spinner"></span><h2>Retour au camp…</h2><p>Connexion à votre partie en cours.</p><button class="button secondary light" id="cancel-resume">Revenir à l’accueil</button></section>');
    if ($('#cancel-resume')) $('#cancel-resume').onclick = reset;
    window.scrollTo({ top: 0, behavior: 'instant' });
  }
  if (view === 'waiting') updateWaiting();
  if (view === 'briefing') updateBriefing();
  if (view === 'playing' || view === 'watching') updateGame();
  if (view === 'watching-lobby') updateWatchingLobby();
  if (view === 'watching-finished') text('rematch-status', t('Vous restez spectateur si les équipes lancent une revanche.'));
  if (view === 'finished') { $('#rematch-button').disabled = busy || myself().rematch; text('rematch-button', myself().rematch ? t('✓ Prêts pour la revanche') : t('On prend notre revanche →')); text('rematch-status', myself().rematch ? t('En attente de l’autre équipe…') : opponent().rematch ? t('L’autre équipe vous propose une revanche !') : t('La revanche démarre lorsque les deux équipes acceptent.')); }
}
$('#rules-button').onclick = () => $('#rules-dialog').showModal();
$('#project-button').onclick = () => $('#project-dialog').showModal();
document.querySelectorAll('[data-close]').forEach(button => { button.onclick = () => document.getElementById(button.dataset.close).close(); });
$('#briefing-dialog').addEventListener('cancel', event => event.preventDefault());
document.querySelectorAll('dialog:not(#briefing-dialog)').forEach(dialog => { dialog.addEventListener('click', event => { if (event.target === dialog) { const r = dialog.getBoundingClientRect(); if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close(); } }); });
$('#confirm-leave').onclick = () => { $('#leave-dialog').close(); action('leave'); };
$('#sound-button').onclick = () => { sound = !sound; $('#sound-button').innerHTML = `♪ <span>${sound ? 'On' : 'Off'}</span>`; $('#sound-button').setAttribute('aria-label', sound ? t('Désactiver les sons') : t('Activer les sons')); beep(); };
registerStaticTranslations();
updateStaticTranslations();
$('#language-button').onclick = () => {
  if (busy) return;
  const selectedTab = document.querySelector('.mode-tabs .selected')?.id;
  const name = $('#team-name')?.value, code = $('#room-code')?.value;
  const focus = document.activeElement?.id, scroll = window.scrollY;
  setLanguage(getLanguage() === 'fr' ? 'en' : 'fr');
  updateStaticTranslations();
  state = localizeState(rawState); view = ''; questionKey = '';
  render();
  if (selectedTab) document.getElementById(selectedTab)?.click();
  if ($('#team-name') && name !== undefined) $('#team-name').value = name;
  if ($('#room-code') && code !== undefined) $('#room-code').value = code;
  if (focus) document.getElementById(focus)?.focus({ preventScroll: true });
  $('#sound-button').setAttribute('aria-label', sound ? t('Désactiver les sons') : t('Activer les sons'));
  $('#sound-button').title = $('#sound-button').getAttribute('aria-label');
  $('#toast').classList.remove('visible');
  window.scrollTo({ top: scroll, behavior: 'instant' });
};
if (watched) saveSession(session);
render(); if (session) poll();
function refreshNetwork() { api('/api/network').then(result => { networkAddresses = result.addresses; networkPublicUrl = result.publicUrl || null; const link = $('#network-link'); if (link) { link.textContent = baseUrl(); link.href = baseUrl(); } const share = $('#share-address'); if (share && state) { share.textContent = `${baseUrl()}/?code=${state.code}`; share.href = share.textContent; } const watch = $('#spectator-link'); if (watch && state) watch.href = watchUrl(); }).catch(() => {}); }
refreshNetwork();
setInterval(() => { if (['landing', 'waiting', 'briefing'].includes(view)) refreshNetwork(); }, 10000);
setInterval(() => { if (!session?.spectator) poll(); }, 800);
setInterval(() => { if (session?.spectator) poll(); }, 2000); setInterval(updateClock, 200);
document.addEventListener('visibilitychange', () => { if (!document.hidden) poll(); });
window.addEventListener('online', poll);
