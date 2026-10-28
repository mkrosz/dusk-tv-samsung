/*
 * Dusk TV: the home screen. Three tabs (Início, Apps, Ajustes), a clock, the network and Samsung's notifications,
 * moved with the remote's arrows. Plain ES5, like tv.js.
 */
(function () {
  'use strict';

  var CONF = window.DUSK || {};
  var ACCENT = CONF.accent || '#8CB2F3';
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
    // An outlined gear (after Lucide's "settings", ISC), drawn like the bell.
    gear: '<svg viewBox="0 0 24 24"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" fill="none" stroke="#fff" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/>' +
      '<circle cx="12" cy="12" r="3" fill="none" stroke="#fff" stroke-width="1.9"/></svg>',
    bellcard: '<svg viewBox="0 0 24 24"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" fill="none" stroke="#fff" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/>' +
      '<path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" fill="none" stroke="#fff" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    // A game controller (after Lucide's "gamepad-2", ISC), for Samsung's game panel.
    gamepad: '<svg viewBox="0 0 24 24"><path d="M6 11h4M8 9v4M15 12h.01M18 10h.01" fill="none" stroke="#fff" stroke-width="1.9" stroke-linecap="round"/>' +
      '<path d="M17.32 5H6.68a4 4 0 0 0-3.978 3.59c-.006.052-.01.101-.017.152C2.604 9.416 2 14.456 2 16a3 3 0 0 0 3 3c1 0 1.5-.5 2-1l1.414-1.414A2 2 0 0 1 9.828 16h4.344a2 2 0 0 1 1.414.586L17 18c.5.5 1 1 2 1a3 3 0 0 0 3-3c0-1.545-.604-6.584-.685-7.258-.007-.05-.011-.1-.017-.151A4 4 0 0 0 17.32 5z" fill="none" stroke="#fff" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    // The favorite badge's star (after Lucide's "star", ISC).
    star: '<svg viewBox="0 0 24 24"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" fill="#FFD27A"/></svg>',
    next: '<svg viewBox="0 0 48 48"><path d="M8 10l18 14L8 38zm20 0l18 14-18 14z" fill="#fff"/></svg>',
    store: '<svg class="glyph" viewBox="0 0 48 48"><path d="M10 16h28l-2.2 24.3A4 4 0 0 1 31.8 44H16.2a4 4 0 0 1-4-3.7z" fill="none" stroke="#fff" stroke-width="3.2" stroke-linejoin="round"/>' +
      '<path d="M17 20v-6a7 7 0 0 1 14 0v6M24 25v11M18.5 30.5h11" fill="none" stroke="#fff" stroke-width="3.2" stroke-linecap="round"/></svg>'
  };

  // Samsung's app store ("Apps" in Smart Hub): its own tile in the Apps tab, not one of the apps.
  var STORE_ID = 'com.samsung.tv.store', STORE_TILE = 'dusk:store';

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

  var stageScale = 1;

  function fit() {
    var s = Math.min(window.innerWidth / 1920, window.innerHeight / 1080);
    stageScale = s;
    $('#stage').style.transform = 'scale(' + s + ')';
  }

  function applyAccent() {
    var css = '.tab.focus,#bell.focus,.cards .item.focus{border-color:' + ACCENT + '}' +
      '.tile.lifted:before{border-color:' + ACCENT + '}#favs.moving .hint{color:' + ACCENT + '}' +
      '.menu .opt.focus,.cards .item.asking{border-color:' + ACCENT + '}' +
      '.menu .opt.check.on:before{background:' + ACCENT + ';border-color:' + ACCENT + '}';
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

  // MARK: - Wallpaper: photos of the kinds you pick online (Unsplash with a key, else Bing), five saved ones offline

  var SAVED = [
    {src: 'wallpapers/paisagem-1.jpg', credit: 'Pôr do sol nas montanhas'},
    {src: 'wallpapers/paisagem-2.jpg', credit: 'Noite de lua cheia'},
    {src: 'wallpapers/paisagem-3.jpg', credit: 'Manhã com neblina'},
    {src: 'wallpapers/paisagem-4.jpg', credit: 'Entardecer no lago'},
    {src: 'wallpapers/paisagem-5.jpg', credit: 'Tarde fria'}
  ];
  // The kinds of photo, with the Unsplash topics behind each.
  var TYPES = [
    {key: 'paisagens', name: 'Paisagens', topics: ['nature']},
    {key: 'animais', name: 'Animais', topics: ['animals']},
    {key: 'arquitetura', name: 'Arquitetura', topics: ['architecture-interior']},
    {key: 'abstratos', name: 'Abstratos', topics: ['3d-renders', 'textures-patterns']}
  ];
  var KEY_TYPES = 'dusk.wallTypes', KEY_FEED = 'dusk.feed2', KEY_TOPICS = 'dusk.topics';

  // Unsplash sorts its photos by topic but needs a free key (web/config.local.js). 30 random photos last 10 hours at
  // one every 20 minutes, so it's a request or two a day, far under the 50 an hour a new key allows.
  var UNSPLASH = 'https://api.unsplash.com', UNSPLASH_KEY = CONF.unsplashKey || '', UNSPLASH_HOURS = 10;

  // Without a key: Bing's archive, the last 16 days of photos, sorted by words in their captions. Paintings, statues
  // and fossils only show with every kind picked.
  var BING = 'https://www.bing.com/HPImageArchive.aspx?format=js&mkt=pt-BR&n=8&idx=', BING_HOURS = 6;
  var ANIMAL = /lobo|preguiça|urso|raposa|leão|leoa|tigre|baleia|golfinho|pinguim|coruja|pássaro|ave[s ]|águia|beija-flor|macaco|elefante|girafa|zebra|tartaruga|foca|lontra|esquilo|cervo|alce|borboleta|abelha|inseto|peixe|polvo|animal|filhote/i;
  var BUILT = /igreja|catedral|basílica|mesquita|templo|mosteiro|castelo|palácio|fortaleza|ponte|farol|torre|edifício|prédio|arquitetura|biblioteca|gabinete|leitura|museu|interior|cidade|aldeia|vila |bairro|rua |praça|ruínas/i;
  var ART = /fóssi|réplica|pintura|rupestre|estátua|escultura|mosaico/i;

  var feed = load(KEY_FEED, null);
  var wallIndex = Math.floor(Math.random() * 100);

  function wallChoice() { return load(KEY_WALL, CONF.wallpaper || 'online'); }

  /** The kinds picked (keys of TYPES); at least one. */
  function wallTypes() {
    var known = TYPES.map(function (t) { return t.key; });
    var picked = (load(KEY_TYPES, null) || CONF.wallTypes || ['paisagens']).filter(function (k) { return known.indexOf(k) >= 0; });
    return picked.length ? picked : ['paisagens'];
  }

  function allTypes() { return wallTypes().length === TYPES.length; }

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

  function bingType(caption) {
    if (ART.test(caption)) return 'arte';
    if (ANIMAL.test(caption)) return 'animais';
    if (BUILT.test(caption)) return 'arquitetura';
    return 'paisagens';
  }

  function fetchBing(done) {
    var pages = [null, null], left = 2;
    [0, 8].forEach(function (idx, p) {
      get(BING + idx, function (res) {
        pages[p] = res && res.images ? res.images : [];
        if (--left > 0) return;
        var seen = {}, list = [];
        pages[0].concat(pages[1]).forEach(function (im) {
          if (!im.urlbase || seen[im.urlbase]) return;
          seen[im.urlbase] = true;
          list.push({src: 'https://www.bing.com' + im.urlbase + '_1920x1080.jpg', credit: im.copyright || '', type: bingType(im.copyright || '')});
        });
        done(list);
      });
    });
  }

  /** Unsplash wants topic ids, not names: each is asked once and kept. */
  function topicIds(slugs, done) {
    var known = load(KEY_TOPICS, {}), missing = slugs.filter(function (s) { return !known[s]; }), left = missing.length;
    function finish() { done(slugs.map(function (s) { return known[s]; }).filter(function (id) { return id; })); }
    if (!left) { finish(); return; }
    missing.forEach(function (slug) {
      get(UNSPLASH + '/topics/' + slug + '?client_id=' + UNSPLASH_KEY, function (t) {
        if (t && t.id) known[slug] = t.id;
        if (--left > 0) return;
        save(KEY_TOPICS, known);
        finish();
      });
    });
  }

  function fetchUnsplash(done) {
    var slugs = [];
    TYPES.forEach(function (t) { if (wallTypes().indexOf(t.key) >= 0) slugs = slugs.concat(t.topics); });
    topicIds(slugs, function (ids) {
      if (!ids.length) { done([]); return; }
      get(UNSPLASH + '/photos/random?count=30&orientation=landscape&content_filter=high&topics=' + ids.join(',') +
          '&client_id=' + UNSPLASH_KEY, function (res) {
        done((res && res.length ? res : []).map(function (p) {
          var place = p.location && p.location.name;
          // The 2021 TVs don't trust images.unsplash.com's certificate (GlobalSign's R46 chain) and every photo fails;
          // the same address over plain http loads. The list itself still comes over https.
          return {src: p.urls.raw.replace(/^https:/, 'http:') + '&w=1920&h=1080&fit=crop&q=80&fm=jpg',
                  credit: (place ? place + ' · ' : '') + 'Foto de ' + p.user.name + ' no Unsplash'};
        }));
      });
    });
  }

  /** The online photos of the kinds picked, fetched again after a while; done(list), empty without internet. */
  function loadFeed(done) {
    var key = UNSPLASH_KEY ? 'unsplash:' + wallTypes().join(',') : 'bing';
    var hours = UNSPLASH_KEY ? UNSPLASH_HOURS : BING_HOURS;
    function pick() {
      if (!feed || feed.key.indexOf('unsplash:') === 0) return feed ? feed.list : [];
      var types = wallTypes();
      return allTypes() ? feed.list : feed.list.filter(function (e) { return types.indexOf(e.type) >= 0; });
    }
    if (feed && feed.key === key && Date.now() - feed.at < hours * 3600000 && feed.list.length) { done(pick()); return; }
    function keep(k, list) {
      if (list.length) { feed = {at: Date.now(), key: k, list: list}; save(KEY_FEED, feed); }
    }
    if (!UNSPLASH_KEY) { fetchBing(function (list) { keep('bing', list); done(pick()); }); return; }
    // A wrong key or Unsplash down: Bing's photos instead.
    fetchUnsplash(function (list) {
      if (list.length) { keep(key, list); done(pick()); return; }
      fetchBing(function (list2) { keep('bing', list2); done(pick()); });
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

  /** The next photo; done(found) says whether the kinds picked had any online. */
  function rotate(done) {
    wallIndex++;
    if (wallChoice() === 'salvas') { showWall(SAVED[wallIndex % SAVED.length]); return; }
    loadFeed(function (list) {
      var pool = list.length ? list : SAVED;
      showWall(pool[wallIndex % pool.length]);
      if (done) done(list.length > 0);
    });
  }

  /** "Paisagens e Animais", "Todas as fotos" or "Só as fotos salvas", for the Background card. */
  function wallSummary() {
    if (wallChoice() === 'salvas') return 'Só as fotos salvas';
    if (allTypes()) return 'Todas as fotos';
    var names = TYPES.filter(function (t) { return wallTypes().indexOf(t.key) >= 0; }).map(function (t) { return t.name; });
    return names.length > 1 ? names.slice(0, -1).join(', ') + ' e ' + names[names.length - 1] : names[0];
  }

  /** The Background card's checklist: any mix of kinds, all of them, or only the saved photos. */
  function wallItems() {
    var online = function () { return wallChoice() !== 'salvas'; };
    var items = [{
      label: 'Todas', on: function () { return online() && allTypes(); },
      pick: function () {
        save(KEY_WALL, 'online');
        save(KEY_TYPES, TYPES.map(function (t) { return t.key; }));
        return true;
      }
    }];
    TYPES.forEach(function (t) {
      items.push({
        label: t.name, on: function () { return online() && wallTypes().indexOf(t.key) >= 0; },
        pick: function () {
          var types = wallTypes(), at = types.indexOf(t.key);
          if (!online()) types = [t.key];
          else if (at < 0) types.push(t.key);
          else if (types.length > 1) types.splice(at, 1);
          else { toast('Deixe pelo menos um tipo marcado'); return true; }
          save(KEY_WALL, 'online');
          save(KEY_TYPES, types);
          return true;
        }
      });
    });
    items.push({
      label: 'Só as salvas (sem internet)', on: function () { return !online(); },
      pick: function () { save(KEY_WALL, 'salvas'); return true; }
    });
    return items;
  }

  // MARK: - Network and notifications

  function refreshNet() {
    TV.network(function (n) {
      var el = $('#net');
      el.innerHTML = n.type === 'ethernet' ? SVG.ethernet : n.type === 'wifi' ? SVG.wifi(n.bars) : SVG.nowifi;
      el.title = n.type === 'wifi' ? 'Wi-Fi' + (n.ssid ? ': ' + n.ssid : '') : n.type === 'ethernet' ? 'Cabo de rede' : 'Sem conexão';
    });
  }

  // No app found yet shows Samsung's notification panel on the AU8000: three rounds of tests by eye, every
  // candidate answered "launched" and showed nothing (see CHANGELOG 1.3.3). Until one does, the bell opens Settings.
  // TV.notifications keeps the search for when a working id turns up.
  function openNotifications() {
    openTvSettings('', 'os Ajustes da TV', '');
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
      star.innerHTML = SVG.star;
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

  // Apps: the favorites first, in their order, then the store and every other app.
  function drawApps() {
    var top = $('#apps .grid.favapps');
    top.innerHTML = '';
    favs.forEach(function (id, i) {
      var item = byId(id);
      if (item) top.appendChild(tile(item, i, {star: true}));
    });
    if (!top.children.length) {
      var empty = document.createElement('div');
      empty.className = 'empty';
      empty.textContent = 'Nenhum favorito ainda. Segure OK num app abaixo para fixá-lo aqui e no Início.';
      top.appendChild(empty);
    }
    var grid = $('#apps .grid.apps');
    grid.innerHTML = '';
    grid.appendChild(storeTile());
    apps.forEach(function (a, i) {
      if (favs.indexOf(a.id) < 0 && a.id !== STORE_ID) grid.appendChild(tile(a, i));
    });
  }

  function storeTile() {
    var el = tile({id: STORE_TILE, title: 'Loja de apps', icon: '', color: '#1428A0'}, 0);
    var face = $('.card', el);
    face.innerHTML = SVG.store;
    el.onAction = function () {
      toast('Abrindo a loja de apps…');
      TV.launch(STORE_ID, null, function (ok) { if (!ok) toast('Não deu para abrir a loja de apps'); });
    };
    return el;
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

  // A second OK while the TV is still opening a screen would open it twice (or the wrong one): one at a time.
  var opening = 0;

  function openTvSettings(kind, name, where) {
    if (Date.now() - opening < 3000) return;
    opening = Date.now();
    toast('Abrindo ' + name + '…');
    var finish = function (ok, direct) {
      opening = 0;
      if (!ok) toast('Não deu para abrir ' + name);
      else if (!direct && where) toast('Nos Ajustes, vá em ' + where);
    };
    if (kind) TV.system(kind, finish); else TV.settings(function (ok) { finish(ok, true); });
  }

  function drawSettings() {
    var ins = $('#settings .grid.inputs');
    ins.innerHTML = '';
    inputs.forEach(function (x, i) { ins.appendChild(tile(x, i)); });

    var personal = $('#settings .personal');
    personal.innerHTML = '';
    var wall = card(SVG.picture, 'Plano de fundo', wallSummary() + ' · OK para escolher', null);
    wall.onAction = function () {
      var before = wallSummary();
      openMenu(wall, wallItems(), $('#settings'), function () {
        $('.s', wall).textContent = wallSummary() + ' · OK para escolher';
        if (wallSummary() === before) return;
        rotate(function (found) {
          toast(found ? 'Trocando o fundo…' : 'Sem fotos desse tipo agora: usando as salvas');
        });
      });
    };
    personal.appendChild(wall);
    personal.appendChild(card(SVG.next, 'Próxima foto', 'Troca o fundo agora', function () {
      rotate();
      toast('Trocando o fundo…');
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
    system.appendChild(card(SVG.network, 'Rede e Wi-Fi', 'Conexão, Wi-Fi e status da rede',
        function () { openTvSettings('network', 'Rede e Wi-Fi', 'Geral → Rede'); }));
    system.appendChild(card(SVG.account, 'Conta Samsung', 'Entrar, sair e dados da conta',
        function () { openTvSettings('account', 'Conta Samsung', 'Geral → Gerenciador do sistema → Conta Samsung'); }));
    system.appendChild(card(SVG.privacy, 'Privacidade', 'Termos, privacidade e anúncios',
        function () { openTvSettings('privacy', 'Privacidade', 'Geral → Termos e Privacidade'); }));
    system.appendChild(card(SVG.gamepad, 'Ajustes de jogo', 'Controladores, saída de som e imagem de jogo',
        function () { openTvSettings('quick', 'os Ajustes de jogo', ''); }));
    system.appendChild(card(SVG.bellcard, 'Notificações', 'Em teste: por enquanto abre os Ajustes da TV', openNotifications));
    system.appendChild(card(SVG.gear, 'Ajustes da TV', 'Imagem, som, suporte e tudo mais',
        function () { openTvSettings('', 'os Ajustes da TV', ''); }));

    if (aboutText) { $('#settings .about').textContent = aboutText; return; }
    TV.about(function (a) {
      var parts = [a.model, a.system, a.firmware, a.ip ? 'IP ' + a.ip : '', a.version ? 'Dusk TV ' + a.version : ''];
      aboutText = parts.filter(function (p) { return p; }).join('  ·  ');
      $('#settings .about').textContent = aboutText;
    });
  }
  var aboutText = '';

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

  // The TV takes a while to list its apps and sources (seconds on a 2021 AU8000), so the last lists are kept and
  // drawn at once; the TV's answers redraw them when they arrive, and a slow source list never holds the apps.
  var KEY_APPS = 'dusk.apps', KEY_INPUTS = 'dusk.inputs';

  // On the AU8000 building every tab took ~0.4 s before anything showed: the favorites are drawn first, and the Apps
  // and Settings tabs a moment later (at once when one of them is on screen).
  var restTimer = null;

  function redraw(done) {
    if (!favs && apps.length) { favs = defaultFavs(); save(KEY_FAVS, favs); }
    if (!favs) favs = [];
    var keep = focused && focused.getAttribute('data-id');
    if (moving) return;   // never pull the row from under a favorite being moved
    drawFavs();
    mark('dusk-drawn');
    clearTimeout(restTimer);
    if (view === 'home') {
      restTimer = setTimeout(function () { drawApps(); drawSettings(); }, 600);
    } else {
      drawApps();
      drawSettings();
    }
    var again = keep && $('#' + view + ' [data-id="' + keep + '"]');
    if (again) focus(again);
    if (done) done();
  }

  function refresh(done) {
    var cachedApps = load(KEY_APPS, null), cachedInputs = load(KEY_INPUTS, null), sent = false;
    if (cachedApps) {
      apps = cachedApps;
      inputs = cachedInputs || [];
      redraw(done);
      sent = true;
    }
    function once() { if (!sent) { sent = true; redraw(done); } else redraw(); }
    TV.apps(function (list) {
      list = list || [];
      if (JSON.stringify(list) === JSON.stringify(apps) && sent) return;
      apps = list;
      save(KEY_APPS, apps);
      once();
    });
    TV.inputs(function (list) {
      list = (list || []).map(function (x) {
        return {id: x.id, title: x.label || 'TV ao vivo', icon: '', color: x.key === 'live' ? '#2E3150' : '#3A3550',
          connected: x.connected, input: true, live: x.key === 'live'};
      });
      if (JSON.stringify(list) === JSON.stringify(inputs)) return;
      inputs = list;
      save(KEY_INPUTS, inputs);
      if (sent) redraw();
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

  // The Apps and Settings views move only as much as it takes to keep the focused item on screen, and never past
  // the end of their content. Positions come from the screen (getBoundingClientRect), since offsetTop's reference
  // changes once the scroller is transformed, which made the page jump up and down between cards of one row.
  var VISIBLE = 1080 - 150 - 40;   // the views' content starts 150 px down; 40 px of air at the bottom

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
    if (el.closest('#top')) return;   // the tabs leave the page where it is
    var scale = stageScale || 1, shift = box.shift || 0;
    var top = (el.getBoundingClientRect().top - box.getBoundingClientRect().top) / scale;
    var bottom = top + el.offsetHeight + 40;   // the name under a tile
    var max = Math.max(0, box.scrollHeight - VISIBLE);
    if (bottom - shift > VISIBLE) shift = bottom - VISIBLE;
    else if (top - shift < 60) shift = top - 60;   // keep the section title above in view
    // The last row also brings up what's under it (the TV's model and version in Settings).
    if (bottom + 120 >= box.scrollHeight) shift = max;
    shift = Math.max(0, Math.min(shift, max));
    if (shift === (box.shift || 0)) return;
    box.shift = shift;
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
    // Up into the top bar lands on the tab of the page you're on: the nearest tab could be another one, and
    // focusing a tab opens its page.
    if (dy < 0 && !focused.closest('#top')) {
      var from0 = center(focused), above = list.filter(function (el) { return el.closest('#top') || center(el).y < from0.y - 4; });
      var inView = above.filter(function (el) { return !el.closest('#top'); });
      if (!inView.length) { focus($('.tab.current') || $('.tab')); return; }
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
    openApp(id);
  }

  function openApp(id) {
    var item = byId(id);
    TV.launch(id, null, function (ok) { if (!ok) toast('Não deu para abrir ' + (item ? item.title : 'o app')); });
  }

  function longPress(el) {
    if (!el || !el.getAttribute('data-id')) return;
    var id = el.getAttribute('data-id');
    if (id.indexOf('dusk:') === 0) return;   // the store tile isn't an app to pin
    if (view === 'home') {
      moving = el;
      el.classList.add('lifted');
      $('#favs').classList.add('moving');
      $('#favs .hint').textContent = '◀ ▶ para mover · OK para soltar';
    } else if (view === 'apps') {
      appMenu(el);
    }
  }

  // MARK: - Menus

  // Holding OK on an app in the Apps tab asks first: the options open just below its card, so a held OK never pins (or
  // unpins) an app by itself, and the release that follows never opens it. Samsung lets no app uninstall another,
  // so there's no Uninstall here. The Background card uses the same menu as a checklist.
  var menu = null;   // {anchor, scope, el, closed}

  /**
   * A menu below `anchor`, dimming the rest of `scope`. Each item is {label, pick, on}: a pick that returns true keeps
   * the menu open (a checklist, whose marks come from on()); closed() runs when it closes.
   */
  function openMenu(anchor, items, scope, closed) {
    var el = document.createElement('div');
    el.className = 'menu';
    items.forEach(function (it) {
      var b = document.createElement('button');
      b.className = 'opt' + (it.on ? ' check' : '');
      b.setAttribute('data-f', '');
      b.textContent = it.label;
      b.onAction = function () {
        if (it.pick() === true && menu) paintMenu(); else closeMenu();
      };
      b.item = it;
      el.appendChild(b);
    });
    anchor.appendChild(el);
    anchor.classList.add('asking');
    scope.classList.add('asking');
    menu = {anchor: anchor, scope: scope, el: el, closed: closed};
    paintMenu();
    focus(el.firstChild);
  }

  function paintMenu() {
    $$('.opt', menu.el).forEach(function (b) {
      if (b.item.on) b.classList.toggle('on', !!b.item.on());
    });
  }

  function closeMenu() {
    if (!menu) return;
    var m = menu;
    menu = null;
    m.anchor.classList.remove('asking');
    m.scope.classList.remove('asking');
    if (m.el.parentNode) m.el.parentNode.removeChild(m.el);
    focus(document.body.contains(m.anchor) ? m.anchor : $('[data-f]', m.scope));
    if (m.closed) m.closed();
  }

  function appMenu(tileEl) {
    var id = tileEl.getAttribute('data-id'), pinned = favs.indexOf(id) >= 0;
    openMenu(tileEl, [
      {label: pinned ? 'Tirar dos favoritos' : 'Favoritar', pick: function () { closeMenu(); toggleFav(id); }},
      {label: 'Abrir', pick: function () { closeMenu(); openApp(id); }}
    ], $('#apps'));
  }

  function toggleFav(id) {
    var i = favs.indexOf(id), item = byId(id);
    if (i >= 0) { favs.splice(i, 1); toast((item ? item.title : 'App') + ' saiu dos favoritos'); }
    else { favs.push(id); toast((item ? item.title : 'App') + ' entrou nos favoritos'); }
    save(KEY_FAVS, favs);
    drawFavs();
    drawApps();
    var again = $('#apps [data-id="' + id + '"]');
    if (again) focus(again);
  }

  function dropMoving() {
    if (!moving) return;
    moving.classList.remove('lifted');
    $('#favs').classList.remove('moving');
    $('#favs .hint').textContent = 'Segure OK ou aperte ▼ para reorganizar';
    favs = $$('#favs .row .tile').map(function (t) { return t.getAttribute('data-id'); });
    save(KEY_FAVS, favs);
    moving = null;
  }

  function shiftMoving(dir) {
    var row = moving.parentNode;
    if (dir < 0 && moving.previousElementSibling) row.insertBefore(moving, moving.previousElementSibling);
    else if (dir > 0 && moving.nextElementSibling) row.insertBefore(moving.nextElementSibling, moving);
    scrollTo(moving);   // the row follows the favorite in your hands
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

  // A held OK is timed from its first keydown: Samsung's remotes don't repeat OK while it's held, so waiting for a
  // second keydown never fires. If OK is still down when the timer ends, it's a long press, and its keyup is ignored.
  var okTimer = null;

  function onKey(e) {
    var k = e.keyCode, keys = TV.keys;
    if (k === keys.ok) {
      e.preventDefault();
      if (okDown) return;   // a repeat of the same press
      okDown = Date.now();
      okLong = false;
      clearTimeout(okTimer);
      okTimer = setTimeout(function () {
        if (!okDown) return;
        okLong = true;
        if (!moving) longPress(focused);
      }, LONG_PRESS);
      return;
    }
    // The app menu: ▲ ▼ between its two options, Back (or ◀ ▶) closes it. A redraw of the Apps tab may have taken it.
    if (menu && !document.body.contains(menu.el)) { menu.scope.classList.remove('asking'); menu = null; }
    if (menu) {
      var opts = $$('.opt', menu.el), at = opts.indexOf(focused);
      if (k === keys.up && at > 0) focus(opts[at - 1]);
      else if (k === keys.down && at < opts.length - 1) focus(opts[at + 1]);
      else if (k === keys.back || k === 27 || k === 8 || k === keys.left || k === keys.right) closeMenu();
      e.preventDefault();
      return;
    }
    if (moving) {
      if (k === keys.left) shiftMoving(-1);
      else if (k === keys.right) shiftMoving(1);
      else if (k === keys.back || k === 27 || k === keys.up || k === keys.down) dropMoving();
      e.preventDefault();
      return;
    }
    // Down on a favorite (there's nothing below the row) also starts moving it.
    if (k === keys.down && view === 'home' && focused && focused.parentNode && focused.parentNode.classList.contains('row')) {
      e.preventDefault();
      longPress(focused);
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
    clearTimeout(okTimer);
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

  // Startup timings, read on the TV through its inspector (performance.getEntriesByType('mark')).
  function mark(name) {
    try { if (!performance.getEntriesByName(name).length) performance.mark(name); } catch (e) {}
  }

  function start() {
    mark('dusk-start');
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
    tick();
    show('home');
    // A saved photo shows at once; an online one replaces it as soon as the list arrives.
    showWall(SAVED[wallIndex % SAVED.length]);
    setInterval(tick, 10000);
    // What isn't on the first screen waits until the favorites are up.
    setTimeout(function () {
      refreshNet();
      setInterval(refreshNet, 15000);
    }, 400);
    setTimeout(function () {
      rotate();
      setInterval(rotate, Math.max(1, CONF.rotateMinutes || 20) * 60000);
    }, 1500);
    document.addEventListener('keydown', onKey);
    document.addEventListener('keyup', onKeyUp);
    // Mouse in a desktop browser (the preview): click opens, hover moves the focus.
    document.addEventListener('click', function (e) {
      var el = e.target.closest('[data-f]');
      if (el) { focus(el); activate(el); }
    });
    // index.html#apps or #settings opens on that tab (handy for previews and screenshots).
    var first = (location.hash || '').slice(1);
    if (first === 'apps' || first === 'settings') view = first;
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
