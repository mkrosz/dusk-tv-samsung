/*
 * A identidade visual do Dusk TV. Mude aqui, gere o app de novo (python tizen/build.py ...) e instale.
 */
window.DUSK = {
  // Logo no canto superior esquerdo (um arquivo em web/). Vazio: mostra o texto de `brand`.
  logo: 'logos/samsung.svg',
  brand: 'Samsung',
  // Cor de destaque: o contorno do item em foco.
  accent: '#8CB2F3',
  // Fundo: 'online' (fotos novas da internet, com as salvas quando estiver sem internet) ou 'salvas'.
  wallpaper: 'online',
  // Tipos de foto da primeira vez: 'paisagens', 'animais', 'arquitetura' e 'abstratos'. Depois, vale o que você
  // escolher na TV, em Ajustes → Plano de fundo.
  wallTypes: ['paisagens'],
  // Chave do Unsplash, para ter fotos de todos os tipos. Não coloque aqui: crie web/config.local.js (veja o
  // config.local.example.js), que fica fora do git. Sem chave, as fotos vêm do Bing.
  unsplashKey: '',
  // De quantos em quantos minutos a foto troca.
  rotateMinutes: 20,
  // Cidade do clima, como 'Sorocaba'. Vazio: o Dusk descobre pela internet da TV (ipinfo.io).
  weatherCity: '',
  // Favoritos da primeira vez (pelo nome do app, sem diferenciar maiúsculas). Depois, o que você arrumar na TV vale.
  favorites: ['Netflix', 'YouTube', 'Prime Video', 'Globoplay', 'Disney+', 'Max', 'Apple TV', 'Spotify']
};
