/*
 * Dusk TV: the home screen. Three tabs (Início, Apps, Ajustes), a clock, the network and Samsung's notifications,
 * moved with the remote's arrows. Plain ES5, like tv.js.
 */
(function () {
  'use strict';

  var CONF = window.DUSK || {};
  var ACCENT = CONF.accent || '#FF8A3D';
  var KEY_FAVS = 'dusk.favs', KEY_WALL = 'dusk.wall';
  var LONG_PRESS = 600;

  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

  function load(key, fallback) {
    try { var v = localStorage.getItem(key); return v === null ? fallback : JSON.parse(v); } catch (e) { return fallback; }
  }
  function save(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) {}
  }

  // MARK: - Icons (inline SVG, white; the focus styles repaint them)

  var SVG = {
    wifi: function (bars) {
      var arcs = [
        'M24 38a3.2 3.2 0 1 0 0.01 0z',
        'M15.5 31.5a12 12 0 0 1 17 0l-2.8 2.8a8 8 0 0 0-11.4 0z',
        'M9.8 25.8a20 20 0 0 1 28.4 0l-2.8 2.8a16 16 0 0 0-22.8 0z',
        'M4.1 20.1a28 28 0 0 1 39.8 0l-2.8 2.8a24 24 0 0 0-34.2 0z'
      ];
      var out = '<svg viewBox="0 0 48 48" width="34" height="34">';
      for (var i = 0; i < arcs.length; i++) {
        out += '<path d="' + arcs[i] + '" fill="#fff" fill-opacity="' + (i < bars ? 1 : 0.28) + '"/>';
      }
      return out + '</svg>';
    },
    nowifi: '<svg viewBox="0 0 48 48" width="34" height="34"><path d="M24 38a3.2 3.2 0 1 0 0.01 0zM4.1 20.1a28 28 0 0 1 39.8 0l-2.8 2.8a24 24 0 0 0-34.2 0z" fill="#fff" fill-opacity="0.35"/><path d="M8 6l34 34-2.8 2.8L5.2 8.8z" fill="#fff"/></svg>',
    ethernet: '<svg viewBox="0 0 48 48" width="34" height="34"><path d="M10 10h28v20h-8v6h-12v-6h-8zM15 15v10h3v-5h3v5h6v-5h3v5h3V15z" fill="#fff"/></svg>',
    // An outlined bell (after Lucide's, ISC), lighter than a filled one.
    bell: '<svg viewBox="0 0 24 24" width="32" height="32"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" fill="none" stroke="#fff" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/>' +
      '<path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" fill="none" stroke="#fff" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    live: '<svg class="glyph" viewBox="0 0 48 48"><path d="M8 14h32a3 3 0 0 1 3 3v20a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3V17a3 3 0 0 1 3-3zm9-9l7 7 7-7 2 2-6 6h-6l-6-6z" fill="#fff"/></svg>',
    hdmi: '<svg class="glyph" viewBox="0 0 48 48"><path d="M6 16h36v10l-4 6H10l-4-6zm6 4v4h24v-4z" fill="#fff"/></svg>',
    picture: '<svg viewBox="0 0 48 48"><path d="M6 8h36a2 2 0 0 1 2 2v28a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2zm2 4v20l9-10 7 8 5-5 11 11V12zm26 2a4 4 0 1 1 0 8 4 4 0 0 1 0-8z" fill="#fff"/></svg>',
    reset: '<svg viewBox="0 0 48 48"><path d="M24 6a18 18 0 1 1-17.3 23h4.2A14 14 0 1 0 24 10v6l-9-8 9-8z" fill="#fff"/></svg>',
    network: '<svg viewBox="0 0 48 48"><path d="M24 38a3.2 3.2 0 1 0 0.01 0zM15.5 31.5a12 12 0 0 1 17 0l-2.8 2.8a8 8 0 0 0-11.4 0zM9.8 25.8a20 20 0 0 1 28.4 0l-2.8 2.8a16 16 0 0 0-22.8 0zM4.1 20.1a28 28 0 0 1 39.8 0l-2.8 2.8a24 24 0 0 0-34.2 0z" fill="#fff"/></svg>',
    account: '<svg viewBox="0 0 48 48"><path d="M24 6a9 9 0 1 1 0 18 9 9 0 0 1 0-18zm0 22c9 0 17 4.4 17 10v4H7v-4c0-5.6 8-10 17-10z" fill="#fff"/></svg>',
    privacy: '<svg viewBox="0 0 48 48"><path d="M24 4l16 6v11c0 10.3-6.8 19.6-16 22-9.2-2.4-16-11.7-16-22V10zm-3 26l12-12-2.8-2.8L21 24.4l-4.2-4.2L14 23z" fill="#fff"/></svg>',
    gear: '<svg viewBox="0 0 48 48"><path d="M27.6 4l1.2 5.2a15 15 0 0 1 3.9 2.3l5.1-1.6 3.6 6.2-3.9 3.6a15 15 0 0 1 0 4.6l3.9 3.6-3.6 6.2-5.1-1.6a15 15 0 0 1-3.9 2.3L27.6 44h-7.2l-1.2-5.2a15 15 0 0 1-3.9-2.3l-5.1 1.6-3.6-6.2 3.9-3.6a15 15 0 0 1 0-4.6l-3.9-3.6 3.6-6.2 5.1 1.6a15 15 0 0 1 3.9-2.3L20.4 4zM24 17a7 7 0 1 0 0 14 7 7 0 0 0 0-14z" fill="#fff"/></svg>',
    bellcard: '<svg viewBox="0 0 24 24"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" fill="none" stroke="#fff" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/>' +
      '<path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" fill="none" stroke="#fff" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    next: '<svg viewBox="0 0 48 48"><path d="M8 10l18 14L8 38zm20 0l18 14-18 14z" fill="#fff"/></svg>'
  };

  // The apps' own logos (web/logos), by the app's name: [name, file, tile color, shape]. These win over the TV's
  // icons, which are small tiles with their own frames. Shape: '' a symbol, 'wide' a wordmark drawn at its own
  // proportions, 'mark' a wordmark centered in a square box (Simple Icons'), drawn larger.
  var LOGOS = [
    [/netflix/i, 'netflix', '#000000'], [/youtube kids/i, 'youtubekids', '#FF0000'], [/youtube music/i, 'youtubemusic', '#0F0F0F'],
    [/youtube/i, 'youtube', '#FFFFFF'], [/prime/i, 'primevideo', '#00A8E1', 'mark'], [/globo/i, 'globoplay', '#FFFFFF', 'wide'],
    [/disney/i, 'disneyplus', '#0B1E5B', 'wide'], [/^(hbo )?max$/i, 'max', '#002BE7', 'wide'], [/hbo/i, 'hbo', '#000000', 'mark'],
    [/apple ?tv/i, 'appletv', '#000000', 'mark'], [/spotify/i, 'spotify', '#121212'], [/twitch/i, 'twitch', '#9146FF'],
    [/crunchyroll/i, 'crunchyroll', '#F47521'], [/plex/i, 'plex', '#1F1F1F', 'mark'], [/paramount/i, 'paramountplus', '#0064FF'],
    [/smartthings/i, 'smartthings', '#15BEF0'], [/tubi/i, 'tubi', '#7408FF', 'mark'], [/mubi/i, 'mubi', '#000000', 'mark'],
    [/dazn/i, 'dazn', '#0C161C'], [/jellyfin/i, 'jellyfin', '#000B25'], [/steam/i, 'steam', '#171A21'],
    [/playstation|ps5|ps4/i, 'playstation', '#0070D1'], [/xbox/i, 'xbox', '#107C10'], [/geforce|nvidia/i, 'nvidia', '#000000'],
    [/discord/i, 'discord', '#5865F2'], [/tiktok/i, 'tiktok', '#000000'], [/kick/i, 'kick', '#000000'],
    [/pinterest/i, 'pinterest', '#E60023'], [/starz/i, 'starz', '#000000', 'mark']
  ];

  function logoFor(title) {
    for (var i = 0; i < LOGOS.length; i++) {
      if (LOGOS[i][0].test(title)) return {src: 'logos/' + LOGOS[i][1] + '.svg', bg: LOGOS[i][2], shape: LOGOS[i][3] || ''};
    }
    return null;
  }

  // Brand colors for the tiles, by the app's name (the TV's icons sit on them).
  var COLORS = [
    [/netflix/i, '#0B0B0B'], [/youtube/i, '#FFFFFF'], [/prime/i, '#1A98FF'], [/globo/i, '#FF5A1F'],
    [/disney/i, '#0E2B7A'], [/^max$|hbo/i, '#2B1C8F'], [/apple/i, '#1C1C1E'], [/spotify/i, '#1DB954'],
    [/twitch/i, '#9146FF'], [/crunchy/i, '#F47521'], [/plex/i, '#1F1F1F'], [/paramount/i, '#0064FF'],
    [/smartthings/i, '#15BEF0'], [/browser|internet|navegador/i, '#3A7BD5'], [/tv plus/i, '#2E2E3A'],
    [/game|xbox/i, '#2FA82F'], [/ps5|playstation/i, '#2453E8']
  ];
  var FALLBACK = ['#3B3F63', '#5B3A6B', '#2F5A6B', '#6B4A2F', '#2F6B4A', '#6B2F3F'];

  function colorFor(item, i) {
    if (item.color) return item.color;
    for (var k = 0; k < COLORS.length; k++) if (COLORS[k][0].test(item.title)) return COLORS[k][1];
    return FALLBACK[i % FALLBACK.length];
  }

  // MARK: - State

  var apps = [], inputs = [], favs = load(KEY_FAVS, null);
  var view = 'home';
  var focused = null;
  var moving = null;      // the favorite being reordered
  var okDown = 0, okLong = false;

  // MARK: - Layout: scale the 1920×1080 stage to the screen

  function fit() {
    var s = Math.min(window.innerWidth / 1920, window.innerHeight / 1080);
    $('#stage').style.transform = 'scale(' + s + ')';
  }

  function applyAccent() {
    var css = '.tab.focus,#bell.focus,.cards .item.focus{box-shadow:0 0 0 3px ' + ACCENT + '}' +
      '.tile.lifted .card{box-shadow:0 0 0 4px ' + ACCENT + ',0 26px 50px rgba(0,0,0,.6)}';
    var tag = document.createElement('style');
    tag.textContent = css;
    document.head.appendChild(tag);
  }

  // MARK: - Clock and greeting

  var DAYS = ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'];
  var MONTHS = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];

  function pad(n) { return n < 10 ? '0' + n : '' + n; }

  function tick() {
    var d = new Date(), h = d.getHours();
    $('#clock').textContent = pad(h) + ':' + pad(d.getMinutes());
    $('#hello .greet').textContent = h >= 5 && h < 12 ? 'Bom dia' : h >= 12 && h < 18 ? 'Boa tarde' : 'Boa noite';
    var date = DAYS[d.getDay()] + ', ' + d.getDate() + ' de ' + MONTHS[d.getMonth()];
    $('#hello .date').textContent = date.charAt(0).toUpperCase() + date.slice(1);
  }

  // MARK: - Wallpaper: Bing's photos of the day online, five saved ones offline

  var SAVED = [
    {src: 'wallpapers/paisagem-1.jpg', credit: 'Pôr do sol nas montanhas'},
    {src: 'wallpapers/paisagem-2.jpg', credit: 'Noite de lua cheia'},
    {src: 'wallpapers/paisagem-3.jpg', credit: 'Manhã com neblina'},
    {src: 'wallpapers/paisagem-4.jpg', credit: 'Entardecer no lago'},
    {src: 'wallpapers/paisagem-5.jpg', credit: 'Tarde fria'}
  ];
  // Bing's archive serves the last 16 days of photos, no key needed. Most are landscapes; captions naming animals,
  // buildings' insides or artworks are left out.
  var FEED = 'https://www.bing.com/HPImageArchive.aspx?format=js&mkt=pt-BR&n=8&idx=';
  var NOT_LANDSCAPE = /lobo|preguiça|urso|raposa|leão|leoa|tigre|baleia|golfinho|pinguim|coruja|pássaro|ave[s ]|águia|beija-flor|macaco|elefante|girafa|zebra|tartaruga|foca|lontra|esquilo|cervo|alce|borboleta|abelha|inseto|peixe|polvo|fóssil|réplica|pintura|rupestre|biblioteca|gabinete|leitura|museu|interior|estátua|escultura|mosaico/i;
  var KEY_FEED = 'dusk.feed', FEED_HOURS = 6;

  var feed = load(KEY_FEED, null);
  var wallIndex = Math.floor(Math.random() * 100);

  function wallChoice() { return load(KEY_WALL, CONF.wallpaper || 'online'); }

  function get(url, done) {
    var x = new XMLHttpRequest(), finished = false;
    function finish(v) { if (!finished) { finished = true; done(v); } }
    x.onreadystatechange = function () {
      if (x.readyState !== 4) return;
      var v = null;
      try { if (x.status === 200) v = JSON.parse(x.responseText); } catch (e) {}
      finish(v);
    };
    x.timeout = 8000;
    x.ontimeout = function () { finish(null); };
    try { x.open('GET', url, true); x.send(); } catch (e) { finish(null); }
  }

  /** The online photos, fetched again every few hours; done(list), empty without internet. */
  function loadFeed(done) {
    if (feed && Date.now() - feed.at < FEED_HOURS * 3600000 && feed.list.length) { done(feed.list); return; }
    var pages = [null, null], left = 2;
    [0, 8].forEach(function (idx, p) {
      get(FEED + idx, function (res) {
        pages[p] = res && res.images ? res.images : [];
        if (--left > 0) return;
        var seen = {}, list = [];
        pages[0].concat(pages[1]).forEach(function (im) {
          if (!im.urlbase || seen[im.urlbase] || NOT_LANDSCAPE.test(im.copyright || '')) return;
          seen[im.urlbase] = true;
          list.push({src: 'https://www.bing.com' + im.urlbase + '_1920x1080.jpg', credit: im.copyright || ''});
        });
        if (list.length) {
          feed = {at: Date.now(), list: list};
          save(KEY_FEED, feed);
        }
        done(feed ? feed.list : []);
      });
    });
  }

  var shownWall = '', wallToken = 0;
  /** Fades to a photo once it has loaded (only the latest asked for); an online one that fails gives way to a saved one. */
  function showWall(entry) {
    if (entry.src === shownWall) return;
    var token = ++wallToken, probe = new Image();
    probe.onload = function () {
      if (token !== wallToken) return;
      shownWall = entry.src;
      var a = $('#wallA'), b = $('#wallB');
      var next = a.className === 'on' ? b : a, prev = next === a ? b : a;
      next.onload = function () { next.className = 'on'; prev.className = ''; };
      next.src = entry.src;
      $('#credit').textContent = entry.credit || '';
    };
    probe.onerror = function () {
      if (token === wallToken && entry.src.indexOf('wallpapers/') !== 0) showWall(SAVED[wallIndex % SAVED.length]);
    };
    probe.src = entry.src;
  }

  function rotate() {
    wallIndex++;
    if (wallChoice() === 'salvas') { showWall(SAVED[wallIndex % SAVED.length]); return; }
    loadFeed(function (list) {
      var pool = list.length ? list : SAVED;
      showWall(pool[wallIndex % pool.length]);
    });
  }

  var WALL_NAMES = {online: 'Paisagens da internet', salvas: 'Fotos salvas'};

  function toggleWallMode() {
    var pick = wallChoice() === 'online' ? 'salvas' : 'online';
    save(KEY_WALL, pick);
    rotate();
    return pick;
  }

  // MARK: - Network and notifications

  function refreshNet() {
    TV.network(function (n) {
      var el = $('#net');
      el.innerHTML = n.type === 'ethernet' ? SVG.ethernet : n.type === 'wifi' ? SVG.wifi(n.bars) : SVG.nowifi;
      el.title = n.type === 'wifi' ? 'Wi-Fi' + (n.ssid ? ': ' + n.ssid : '') : n.type === 'ethernet' ? 'Cabo de rede' : 'Sem conexão';
    });
  }

  function openNotifications() {
    toast('Abrindo notificações…');
    TV.notifications(function (ok, how) {
      if (how === 'settings') toast('Painel de notificações não encontrado nesta TV: abrindo os Ajustes');
      else if (!ok) toast('Não deu para abrir as notificações');
    });
  }

  // MARK: - Tiles

  function tile(item, i, opts) {
    var el = document.createElement('div');
    el.className = 'tile';
    el.setAttribute('data-f', '');
    el.setAttribute('data-id', item.id);
    var card = document.createElement('div');
    card.className = 'card';
    card.style.background = colorFor(item, i);
    if (item.input) {
      card.innerHTML = item.live ? SVG.live : SVG.hdmi;
      var dot = document.createElement('span');
      dot.className = 'dot' + (item.connected ? ' on' : '');
      card.appendChild(dot);
    } else if (logoFor(item.title)) {
      var logo = logoFor(item.title), mark = new Image();
      card.style.background = logo.bg;
      mark.className = 'logo' + (logo.shape ? ' ' + logo.shape : '');
      mark.onerror = function () { card.innerHTML = ''; card.appendChild(word(item.title, logo.bg)); };
      mark.src = logo.src;
      card.appendChild(mark);
    } else if (item.icon) {
      var img = new Image();
      img.onerror = function () { card.innerHTML = ''; card.appendChild(word(item.title, card.style.background)); };
      img.src = item.icon;
      card.appendChild(img);
    } else {
      card.appendChild(word(item.title, card.style.background));
    }
    if (opts && opts.star && favs.indexOf(item.id) >= 0) {
      var star = document.createElement('span');
      star.className = 'star';
      star.textContent = '★';
      card.appendChild(star);
    }
    var name = document.createElement('div');
    name.className = 'name';
    name.textContent = item.title;
    el.appendChild(card);
    el.appendChild(name);
    return el;
  }

  function word(text, bg) {
    var w = document.createElement('div');
    w.className = 'word';
    w.textContent = text;
    if (/^#F/i.test(bg)) w.style.color = '#111';   // light brand colors (YouTube) get dark text
    return w;
  }

  function byId(id) {
    for (var i = 0; i < apps.length; i++) if (apps[i].id === id) return apps[i];
    for (var j = 0; j < inputs.length; j++) if (inputs[j].id === id) return inputs[j];
    return null;
  }

  // MARK: - Drawing the views

  function drawFavs() {
    var row = $('#favs .row');
    row.innerHTML = '';
    favs.forEach(function (id, i) {
      var item = byId(id);
      if (item) row.appendChild(tile(item, i));
    });
    if (!row.children.length) {
      var empty = document.createElement('div');
      empty.className = 'name';
      empty.style.fontSize = '22px';
      empty.style.opacity = '0.8';
      empty.textContent = 'Vá em Apps e segure OK num app para colocá-lo aqui.';
      row.appendChild(empty);
    }
  }

  function drawApps() {
    var grid = $('#apps .grid.apps');
    grid.innerHTML = '';
    apps.forEach(function (a, i) { grid.appendChild(tile(a, i, {star: true})); });
    var ins = $('#apps .grid.inputs');
    ins.innerHTML = '';
    inputs.forEach(function (x, i) { ins.appendChild(tile(x, i, {star: true})); });
  }

  function card(icon, title, sub, action) {
    var el = document.createElement('button');
    el.className = 'item';
    el.setAttribute('data-f', '');
    el.innerHTML = '<span class="icon">' + icon + '</span><span><div class="t"></div><div class="s"></div></span>';
    $('.t', el).textContent = title;
    $('.s', el).textContent = sub;
    el.onAction = action;
    return el;
  }

  function openTvSettings(where) {
    toast(where ? 'Abrindo Ajustes da TV → ' + where : 'Abrindo Ajustes da TV');
    TV.settings(function (ok) { if (!ok) toast('Não deu para abrir os Ajustes da TV'); });
  }

  function drawSettings() {
    var ins = $('#settings .grid.inputs');
    ins.innerHTML = '';
    inputs.forEach(function (x, i) { ins.appendChild(tile(x, i)); });

    var personal = $('#settings .personal');
    personal.innerHTML = '';
    var wall = card(SVG.picture, 'Plano de fundo', WALL_NAMES[wallChoice()] + ' · OK para trocar', null);
    wall.onAction = function () {
      var pick = toggleWallMode();
      $('.s', wall).textContent = WALL_NAMES[pick] + ' · OK para trocar';
      toast(pick === 'online' ? 'Paisagens novas da internet' : 'Usando as 5 fotos salvas');
    };
    personal.appendChild(wall);
    personal.appendChild(card(SVG.next, 'Próxima paisagem', 'Troca o fundo agora', function () {
      rotate();
      toast('Trocando a paisagem…');
    }));
    personal.appendChild(card(SVG.reset, 'Restaurar favoritos', 'Volta à lista inicial', function () {
      favs = defaultFavs();
      save(KEY_FAVS, favs);
      drawFavs();
      drawApps();
      toast('Favoritos restaurados');
    }));

    // Samsung lets apps open its settings, but not a given page: the subtitle says where to go from there.
    var system = $('#settings .system');
    system.innerHTML = '';
    system.appendChild(card(SVG.network, 'Rede e Wi-Fi', 'Geral → Rede', function () { openTvSettings('Geral → Rede'); }));
    system.appendChild(card(SVG.account, 'Conta Samsung', 'Geral → Gerenciador do sistema → Conta Samsung',
        function () { openTvSettings('Geral → Gerenciador do sistema → Conta Samsung'); }));
    system.appendChild(card(SVG.privacy, 'Privacidade', 'Geral → Termos e Privacidade',
        function () { openTvSettings('Geral → Termos e Privacidade'); }));
    system.appendChild(card(SVG.bellcard, 'Notificações', 'Painel de notificações da Samsung', openNotifications));
    system.appendChild(card(SVG.gear, 'Todos os ajustes da TV', 'Imagem, som, suporte e mais', function () { openTvSettings(''); }));

    TV.about(function (a) {
      var parts = [a.model, a.system, a.firmware, a.ip ? 'IP ' + a.ip : '', a.version ? 'Dusk TV ' + a.version : ''];
      $('#settings .about').textContent = parts.filter(function (p) { return p; }).join('  ·  ');
    });
  }

  function drawAll() {
    drawFavs();
    drawApps();
    drawSettings();
  }

  // MARK: - Data

  function defaultFavs() {
    var wanted = (CONF.favorites || []).map(function (n) { return n.toLowerCase(); }), out = [];
    wanted.forEach(function (n) {
      for (var i = 0; i < apps.length; i++) {
        if (apps[i].title.toLowerCase() === n && out.indexOf(apps[i].id) < 0) { out.push(apps[i].id); return; }
      }
    });
    for (var i = 0; out.length < 5 && i < apps.length; i++) if (out.indexOf(apps[i].id) < 0) out.push(apps[i].id);
    return out;
  }

  function refresh(done) {
    var left = 2;
    function finish() {
      if (--left > 0) return;
      if (!favs) { favs = defaultFavs(); save(KEY_FAVS, favs); }
      var keep = focused && focused.getAttribute('data-id');
      drawAll();
      if (keep) {
        var again = $('#' + view + ' [data-id="' + keep + '"]');
        if (again) focus(again);
      }
      if (done) done();
    }
    TV.apps(function (list) { apps = list || []; finish(); });
    TV.inputs(function (list) {
      inputs = (list || []).map(function (x) {
        return {id: x.id, title: x.label || 'TV ao vivo', icon: '', color: x.key === 'live' ? '#2E3150' : '#3A3550',
          connected: x.connected, input: true, live: x.key === 'live'};
      });
      finish();
    });
  }

  // MARK: - Views and focus

  function show(name) {
    view = name;
    $$('.view').forEach(function (v) { v.classList.toggle('on', v.id === name); });
    $$('.tab').forEach(function (t) { t.classList.toggle('current', t.getAttribute('data-view') === name); });
    document.body.className = 'view-' + name;
  }

  function focusables() {
    return $$('#top [data-f], #' + view + ' [data-f]');
  }

  function focus(el) {
    if (!el) return;
    if (focused) focused.classList.remove('focus');
    focused = el;
    el.classList.add('focus');
    if (el.classList.contains('tab')) show(el.getAttribute('data-view'));
    scrollTo(el);
  }

  // The Apps and Settings views move up so the focused row stays on screen.
  function scrollTo(el) {
    // The favorites row slides sideways when it holds more than fits.
    if (el.parentNode && el.parentNode.classList.contains('row')) {
      var row = el.parentNode, width = 1920 - 2 * 112;
      var shiftX = Math.max(0, Math.min(el.offsetLeft + el.offsetWidth - width + 40, row.scrollWidth - width));
      row.style.transform = shiftX ? 'translateX(' + -shiftX + 'px)' : '';
      return;
    }
    var section = $('#' + view);
    var box = $('.scroller', section);
    if (!box) return;
    if (el.closest('#top')) { box.style.transform = ''; return; }
    var top = el.offsetTop, h = el.offsetHeight, limit = 1080 - 150 - 80;
    var shift = Math.max(0, top + h - limit);
    box.style.transform = shift ? 'translateY(' + -shift + 'px)' : '';
  }

  function center(el) {
    var r = el.getBoundingClientRect();
    return {x: r.left + r.width / 2, y: r.top + r.height / 2, r: r};
  }

  /** The nearest focusable in a direction: along the arrow first, then how far off to the side. */
  function move(dx, dy) {
    var list = focusables();
    if (!focused || list.indexOf(focused) < 0) { focus(list[0]); return; }
    // From a tab, down goes to the view's first item.
    if (dy > 0 && focused.closest('#top')) {
      var first = $('#' + view + ' [data-f]');
      if (first) { focus(first); return; }
    }
    var from = center(focused), found = [];
    list.forEach(function (el) {
      if (el === focused) return;
      var to = center(el);
      var along = dx ? (to.x - from.x) * dx : (to.y - from.y) * dy;
      var side = dx ? Math.abs(to.y - from.y) : Math.abs(to.x - from.x);
      if (along <= 4) return;
      if (dx && side > Math.max(from.r.height, 120)) return;   // left/right stays on its row
      found.push({el: el, along: along, side: side});
    });
    if (!found.length) return;
    // The nearest row (or column) first, then the closest item in it.
    var near = Math.min.apply(null, found.map(function (c) { return c.along; }));
    var best = null;
    found.forEach(function (c) {
      if (c.along <= near + 60 && (!best || c.side < best.side)) best = c;
    });
    focus(best.el);
  }

  // MARK: - Actions

  function activate(el) {
    if (!el) return;
    if (el.classList.contains('tab')) { show(el.getAttribute('data-view')); move(0, 1); return; }
    if (el.id === 'bell') { openNotifications(); return; }
    if (el.onAction) { el.onAction(); return; }
    var id = el.getAttribute('data-id');
    if (!id) return;
    var item = byId(id);
    TV.launch(id, null, function (ok) { if (!ok) toast('Não deu para abrir ' + (item ? item.title : 'o app')); });
  }

  function longPress(el) {
    if (!el || !el.getAttribute('data-id')) return;
    var id = el.getAttribute('data-id');
    if (view === 'home') {
      moving = el;
      el.classList.add('lifted');
      $('#favs').classList.add('moving');
      $('#favs .hint').textContent = '◀ ▶ para mover · OK para soltar';
    } else if (view === 'apps') {
      var i = favs.indexOf(id), item = byId(id);
      if (i >= 0) { favs.splice(i, 1); toast((item ? item.title : 'App') + ' saiu dos favoritos'); }
      else { favs.push(id); toast((item ? item.title : 'App') + ' entrou nos favoritos'); }
      save(KEY_FAVS, favs);
      drawFavs();
      drawApps();
      var again = $('#apps [data-id="' + id + '"]');
      if (again) focus(again);
    }
  }

  function dropMoving() {
    if (!moving) return;
    moving.classList.remove('lifted');
    $('#favs').classList.remove('moving');
    $('#favs .hint').textContent = 'Segure OK para reorganizar';
    favs = $$('#favs .row .tile').map(function (t) { return t.getAttribute('data-id'); });
    save(KEY_FAVS, favs);
    moving = null;
  }

  function shiftMoving(dir) {
    var row = moving.parentNode;
    if (dir < 0 && moving.previousElementSibling) row.insertBefore(moving, moving.previousElementSibling);
    else if (dir > 0 && moving.nextElementSibling) row.insertBefore(moving.nextElementSibling, moving);
  }

  var toastTimer = null;
  function toast(text) {
    var t = $('#toast');
    t.textContent = text;
    t.classList.add('on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.classList.remove('on'); }, 2600);
  }

  // MARK: - Remote

  function onKey(e) {
    var k = e.keyCode, keys = TV.keys;
    if (k === keys.ok) {
      e.preventDefault();
      if (!okDown) { okDown = Date.now(); okLong = false; }
      else if (!okLong && Date.now() - okDown > LONG_PRESS) { okLong = true; if (!moving) longPress(focused); }
      return;
    }
    if (moving) {
      if (k === keys.left) shiftMoving(-1);
      else if (k === keys.right) shiftMoving(1);
      else if (k === keys.back || k === 27 || k === keys.up || k === keys.down) dropMoving();
      e.preventDefault();
      return;
    }
    if (k === keys.left) move(-1, 0);
    else if (k === keys.right) move(1, 0);
    else if (k === keys.up) move(0, -1);
    else if (k === keys.down) move(0, 1);
    else if (k === keys.back || k === 27 || k === 8) {
      e.preventDefault();
      if (view !== 'home') { show('home'); focus($('#favs .tile') || $('.tab')); }
      else if (focused && focused.closest('#top')) TV.back();
      else focus($('.tab.current'));
      return;
    } else return;
    e.preventDefault();
  }

  function onKeyUp(e) {
    if (e.keyCode !== TV.keys.ok) return;
    e.preventDefault();
    var wasLong = okLong;
    okDown = 0;
    okLong = false;
    if (wasLong) return;
    if (moving) { dropMoving(); return; }
    activate(focused);
  }

  // MARK: - Start

  function wrapScrollers() {
    ['apps', 'settings'].forEach(function (id) {
      var section = $('#' + id), box = document.createElement('div');
      box.className = 'scroller';
      while (section.firstChild) box.appendChild(section.firstChild);
      section.appendChild(box);
    });
  }

  function start() {
    fit();
    window.addEventListener('resize', fit);
    applyAccent();
    var brand = $('#brand');
    if (CONF.logo) {
      var logo = new Image();
      logo.alt = CONF.brand || '';
      logo.onerror = function () { brand.textContent = CONF.brand || ''; };
      logo.src = CONF.logo;
      brand.appendChild(logo);
    } else {
      brand.textContent = CONF.brand || '';
    }
    $('#bell').innerHTML = SVG.bell;
    wrapScrollers();
    // A saved photo shows at once; an online one replaces it as soon as the list arrives.
    showWall(SAVED[wallIndex % SAVED.length]);
    rotate();
    setInterval(rotate, Math.max(1, CONF.rotateMinutes || 20) * 60000);
    tick();
    setInterval(tick, 10000);
    refreshNet();
    setInterval(refreshNet, 15000);
    show('home');
    document.addEventListener('keydown', onKey);
    document.addEventListener('keyup', onKeyUp);
    // Mouse in a desktop browser (the preview): click opens, hover moves the focus.
    document.addEventListener('click', function (e) {
      var el = e.target.closest('[data-f]');
      if (el) { focus(el); activate(el); }
    });
    // index.html#apps or #settings opens on that tab (handy for previews and screenshots).
    var first = (location.hash || '').slice(1);
    refresh(function () {
      if (first === 'apps' || first === 'settings') { show(first); focus($('#' + first + ' [data-f]')); }
      else focus($('#favs .tile') || $('.tab'));
    });
    // Back from an app: the TV's apps and inputs may have changed.
    document.addEventListener('visibilitychange', function () {
      if (!document.hidden) { tick(); refreshNet(); refresh(); }
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
