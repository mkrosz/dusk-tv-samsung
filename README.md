<div align="center">

# 🌅 Dusk TV

**Uma tela inicial limpa, rápida e personalizável para Smart TVs Samsung (Tizen).**

Fotos que mudam sozinhas, do tipo que você escolher, seus apps com os logos de verdade, relógio, Wi-Fi e notificações. Sem propaganda,
sem fileiras patrocinadas.

![Versão](https://img.shields.io/badge/versão-1.8.0-8CB2F3?style=for-the-badge)
![Samsung Tizen](https://img.shields.io/badge/Samsung-Tizen%203.0%2B-1428A0?style=for-the-badge&logo=samsung&logoColor=white)
![Testado em](https://img.shields.io/badge/feito%20para-UN60AU8000%20(2021)-0F172A?style=for-the-badge)
![Licença MIT](https://img.shields.io/badge/licença-MIT-2EA44F?style=for-the-badge)

![JavaScript ES5](https://img.shields.io/badge/JavaScript-ES5-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)
![Python 3](https://img.shields.io/badge/Python-3-3776AB?style=flat-square&logo=python&logoColor=white)
![Tizen SDK](https://img.shields.io/badge/Tizen%20SDK-10-6C4AB6?style=flat-square)
![Feito com Claude Code](https://img.shields.io/badge/feito%20com-Claude%20Code-D97757?style=flat-square&logo=claude&logoColor=white)

<img src="docs/screenshots/inicio.png" alt="Tela inicial do Dusk TV" width="100%">

</div>

---

## Sumário

- [Antes e depois](#-antes-e-depois)
- [Telas](#-telas)
- [Funcionalidades](#-funcionalidades)
- [Compatibilidade](#-compatibilidade)
- [Tecnologias](#-tecnologias)
- [Instalação na TV](#-instalação-na-tv)
- [Personalização](#-personalização)
- [Estrutura do projeto](#-estrutura-do-projeto)
- [Limites do Tizen](#-limites-do-tizen)
- [Como desfazer](#-como-desfazer)
- [Contribuindo](#-contribuindo)
- [Créditos](#-créditos)
- [Licença](#-licença)

---

## 🔄 Antes e depois

| Antes (Smart Hub da Samsung) | Depois (Dusk TV) |
| :---: | :---: |
| <img src="docs/antes/antes-inicio.jpg" alt="Tela inicial original da Samsung" width="420"> | <img src="docs/screenshots/inicio.png" alt="Tela inicial do Dusk TV" width="420"> |
| <img src="docs/antes/antes-apps.jpg" alt="Lista de apps original da Samsung" width="420"> | <img src="docs/screenshots/apps.png" alt="Apps no Dusk TV" width="420"> |
| <img src="docs/antes/antes-ajustes.jpg" alt="Menu original da Samsung" width="420"> | <img src="docs/screenshots/ajustes.png" alt="Ajustes no Dusk TV" width="420"> |

> 📸 Para trocar as fotos do "antes", substitua os arquivos de [`docs/antes/`](docs/antes) mantendo os mesmos nomes.

---

## 🖼️ Telas

### Início
Saudação conforme o horário, data, paisagem de fundo com a legenda do lugar e a fileira de **Favoritos**.
Segure **OK** num favorito para arrastá-lo com as setas.

<img src="docs/screenshots/inicio.png" alt="Tela inicial" width="100%">

### Apps
Seus **Favoritos** ficam numa seção própria no topo, e logo abaixo vêm **Todos os apps**, com um bloco para abrir a
**Loja de apps** da Samsung. Cada app aparece com o **logo oficial** sobre a cor da marca. Segure **OK** num app
para abrir um menu com **Favoritar** (ou **Tirar dos favoritos**) e **Abrir**. Os outros apps escurecem enquanto ele
está aberto.

<img src="docs/screenshots/apps.png" alt="Aba de apps" width="100%">

### Ajustes
Entradas (TV ao vivo e HDMI 1 a 4, com um ponto verde quando há um aparelho ligado), plano de fundo, Rede e
Wi-Fi, Conta Samsung, Privacidade, **Ajustes de jogo** (controladores, saída de som e imagem de jogo), Notificações
(em teste) e os Ajustes da TV.

<img src="docs/screenshots/ajustes.png" alt="Aba de ajustes" width="100%">

### Barra superior
Logo da Samsung, abas, relógio, força do sinal do **Wi-Fi** (ou o ícone de cabo de rede) e o **sino** de
notificações. Por enquanto, o sino abre os Ajustes da TV (veja [Notificações: em investigação](#-notificações-em-investigação)).

<img src="docs/screenshots/topo.png" alt="Barra superior com relógio, Wi-Fi e notificações" width="100%">

---

## ✨ Funcionalidades

- 🏞️ **Fundo do seu jeito:** em Ajustes → Plano de fundo, marque **Paisagens**, **Animais**, **Arquitetura**,
  **Abstratos**, qualquer mistura deles ou **Todas**. As fotos trocam a cada 20 minutos e vêm do
  [Unsplash](https://unsplash.com), com uma chave gratuita ([como configurar](#-fotos-do-unsplash)). Sem chave, vêm
  as "imagens do dia" do Bing, separadas pelo título.
- 📴 **Funciona sem internet:** 5 paisagens salvas no próprio app entram quando a rede cai, ou sempre, com
  "Só as salvas".
- 🎨 **Logos de verdade** para cerca de 30 apps: Netflix, YouTube, Prime Video, Globoplay, Disney+, HBO Max,
  Apple TV, Spotify, Twitch, Crunchyroll, Plex, Paramount+, PlayStation, Xbox e outros.
- ⭐ **Favoritos editáveis pelo controle:** adicionar, tirar e reorganizar. Na aba Apps, eles ficam numa seção separada.
- 🛍️ **Loja de apps** da Samsung a um clique, na aba Apps.
- 📶 **Status da rede** em tempo real: força do Wi-Fi ou cabo.
- 🔔 **Sino de notificações:** por enquanto abre os Ajustes da TV. O painel de notificações da Samsung ainda está
  [em investigação](#-notificações-em-investigação).
- 🎮 **Ajustes de jogo:** o painel de jogos da Samsung, com controladores, saída de som e imagem de jogo, a um clique.
- 🔌 **Entradas HDMI** com status de conexão.
- ⚙️ **Identidade visual** num só arquivo: logo, cor de destaque, tipo de fundo e favoritos iniciais.
- 🪶 **Leve e rápido:** JavaScript puro, sem frameworks, sem sombras e sem blur. Os favoritos aparecem em cerca de 0,5 s, e a navegação roda a 60 quadros por segundo, medido numa UN60AU8000.
- ↩️ **Reversível:** não mexe no sistema da TV, no botão Home nem no Smart Hub.

---

## 📺 Compatibilidade

| | |
| --- | --- |
| **Feito para** | Samsung UN60AU8000GXZD (Crystal UHD 2021, Tizen 6.0) |
| **Deve funcionar em** | TVs Samsung com Tizen 3.0 ou mais novo (2017 em diante) |
| **Certificado** | TVs de 2015 a 2022: certificado Tizen comum. TVs de 2023 em diante: certificado Samsung |
| **Resolução da interface** | 1920×1080, ajustada à tela |

> Testou em outro modelo? Abra uma [issue](../../issues) contando como foi, para entrar nesta tabela.

---

## 🧰 Tecnologias

| Parte | O que usa |
| --- | --- |
| Interface | HTML5, CSS3 e JavaScript **ES5** (o navegador das TVs Tizen é antigo), fonte [Inter](https://rsms.me/inter/) |
| Integração com a TV | APIs web do Tizen: `tizen.application` (apps), `tizen.systeminfo` (Wi-Fi e rede), `tizen.tvwindow` (HDMI) |
| Fotos online | [API do Unsplash](https://unsplash.com/developers) (tópicos de fotos, chave gratuita) ou o arquivo de imagens do dia do Bing (`HPImageArchive`), sem chave |
| Empacotamento | Python 3 (`tizen/build.py`) e o `tizen package` do Tizen SDK 10 (antigo Tizen Studio) para assinar |
| Instalação | Python 3 (`tizen/install.py`), que fala o protocolo SDB da TV direto, sem precisar do `sdb` |
| Base | Camada de TV do [Free My TV](https://github.com/simbasjungles/free-my-tv) (MIT) |

---

## 🚀 Instalação na TV

Os passos 1 a 3 são feitos uma vez só.

**1. Na TV, ligue o Modo Desenvolvedor**
1. Abra **Apps** e espere a tela carregar.
2. Digite `1 2 3 4 5` no controle **rápido, em no máximo 2 segundos**. Mais devagar que isso, a TV ignora e a
   janela não abre.
   - No Smart Remote (o controle sem números), aperte o botão **123** para abrir o teclado numérico na tela antes.
3. Ligue o **Developer mode**.
4. Em **Host PC IP**, coloque o IP do seu computador. No Windows, rode `ipconfig` e use o "Endereço IPv4" do
   adaptador **Wi-Fi** ou **Ethernet**, que é o que tem "Gateway Padrão" preenchido (algo como `192.168.0.x`).
   Ignore IPs que começam com `169.254` e adaptadores de VPN (Tailscale, Hamachi etc.): a TV não alcança esses
   endereços.
5. Desligue e ligue a TV: segure o botão de ligar até ela reiniciar.
6. Anote o IP da TV, que aparece em Configurações → Geral → Rede → Status da rede → Configurações de IP. Ele é
   usado no passo 4, no comando `install.py`.

> **Errou o IP do computador?** Repita os passos 1 e 2. A mesma janela abre de novo para você corrigir o
> **Host PC IP**. Depois, reinicie a TV.

**2. No computador, instale o Tizen SDK**

O Tizen Studio agora se chama **Tizen SDK** e fica na página de [Tools do Samsung Tizen OS](https://samsungtizenos.com/tools-download/).
No Windows, baixe a versão com interface gráfica, que já traz o Certificate Manager:

- **Windows (64-bit):** [web-ide_Tizen_SDK_10.0_windows-64.exe](https://download.tizen.org/sdk/Installer/tizen-sdk_10.0/web-ide_Tizen_SDK_10.0_windows-64.exe)
- **Outros sistemas e espelhos:** [download.tizen.org/sdk/Installer/tizen-sdk_10.0](https://download.tizen.org/sdk/Installer/tizen-sdk_10.0/)

Instale na pasta sugerida (`C:\tizen-studio`). Se escolher outra, defina a variável de ambiente `TIZEN_STUDIO`
com o caminho. Também é preciso ter o [Python 3](https://www.python.org/downloads/).

> Se o Windows bloquear o instalador, clique em "Mais informações" e depois em "Executar assim mesmo". O instalador
> precisa do Java, e oferece para instalar se não encontrar.

**3. Crie o certificado**

1. Abra o **Certificate Manager**: no menu Iniciar, ou em `C:\tizen-studio\tools\certificate-manager\`.
2. Clique em **+** e escolha o tipo:
   - **Tizen:** TVs de 2015 a 2022, como a UN60AU8000.
   - **Samsung:** TVs de 2023 em diante. Precisa da extensão *Samsung Certificate Extension*, instalada pelo
     Package Manager do SDK, e de login na conta Samsung.
3. Dê o nome `dusk` ao perfil e crie um certificado de autor novo, com uma senha só sua.

**Atalho para TVs até 2022 (Windows):** em vez do Certificate Manager, rode o script abaixo. Ele pede uma senha e
cria o certificado e o perfil `dusk` sozinho.

```bash
powershell -ExecutionPolicy Bypass -File tools\criar-certificado.ps1
```

**4. Gere e instale o app**

```bash
git clone https://github.com/mkrosz/dusk-tv-samsung.git
cd dusk-tv-samsung
python tizen/build.py --sign dusk
python tizen/install.py IP_DA_TV
```

Troque `IP_DA_TV` pelo IP que você anotou no passo 1 (por exemplo, `python tizen/install.py 192.168.0.20`). O
app abre sozinho na TV no fim do último comando.

**5. Na TV, deixe o Dusk TV a um clique**

Este passo é feito **na TV, com o controle** (não no Tizen Studio):

1. Aperte **Home** e, na barra da Samsung, vá até o **Dusk TV**.
2. Aperte **▼** (ou segure OK) e escolha **Mover**.
3. Leve o Dusk TV para o **começo da barra** e confirme com OK.

Agora, de qualquer lugar, **Home → Dusk TV** abre a tela.

> **E o "Executar automaticamente último app"?** Na UN60AU8000, ele não abre o Dusk TV ao ligar a TV. Testamos com o
> app aberto pela barra e pelo computador, e com os mesmos avisos que Netflix e YouTube usam para isso
> (`appbootingsupport`, `prelaunch.support` e `eden_resume`). Em todas as vezes, a TV ligou na TV ao vivo. Tudo indica
> que a Samsung só aplica essa função a apps da loja dela. Veja [Limites do Tizen](#-limites-do-tizen).

> Mudou alguma coisa? Rode de novo só o passo 4.

---

## 🎨 Personalização

Toda a identidade visual fica em [`web/config.js`](web/config.js):

```js
window.DUSK = {
  logo: 'logos/samsung.svg',   // logo do canto (ou '' para mostrar o texto de `brand`)
  brand: 'Samsung',
  accent: '#8CB2F3',           // cor de destaque (azul pastel)
  wallpaper: 'online',         // 'online' (fotos da internet) ou 'salvas'
  wallTypes: ['paisagens'],    // tipos da primeira vez: 'paisagens', 'animais', 'arquitetura', 'abstratos'
  unsplashKey: '',             // fica vazio aqui: a chave vai no config.local.js (veja abaixo)
  rotateMinutes: 20,           // de quantos em quantos minutos a foto troca
  favorites: ['Netflix', 'YouTube', 'Prime Video', 'Globoplay', 'Disney+', 'Max', 'Apple TV', 'Spotify']
};
```

### 📷 Fotos do Unsplash

Para ter fotos de todos os tipos, o Dusk usa a API do Unsplash, que pede uma chave gratuita:

1. Crie uma conta em [unsplash.com/developers](https://unsplash.com/developers) e clique em **New Application**.
2. Copie a **Access Key** (a Secret Key não é usada).
3. Copie [`web/config.local.example.js`](web/config.local.example.js) para `web/config.local.js` e cole a chave
   no lugar de `COLE_A_ACCESS_KEY_AQUI`.
4. Gere e instale o app de novo (passo 4).

O `config.local.js` fica fora do git, então a chave não vai para o GitHub. O Dusk pede 30 fotos de uma vez e só
volta a pedir umas 10 horas depois, ou quando você muda os tipos: bem abaixo do limite de 50 pedidos por hora de uma
chave nova. Sem chave, ou se o Unsplash não responder, as fotos vêm do Bing.

> As TVs de 2021 não aceitam o certificado do servidor de imagens do Unsplash, então as fotos em si são carregadas
> por HTTP. A lista de fotos e a chave continuam passando por HTTPS.

- **Fotos offline:** troque os arquivos de [`web/wallpapers/`](web/wallpapers) por fotos suas de 1920×1080, com
  os mesmos nomes.
- **Logos:** ficam em [`web/logos/`](web/logos), e a lista que liga cada app ao logo e à cor fica em `LOGOS`, no
  [`web/home.js`](web/home.js).
- **Ver no computador, sem TV:** rode `python -m http.server 8765 -d web` e abra <http://localhost:8765>.
  As setas navegam, Enter abre e Esc volta. Use `#apps` ou `#settings` no endereço para abrir direto numa aba.

---

## 🗂️ Estrutura do projeto

```text
dusk-tv-samsung/
├── web/                  # o app (o que vai para a TV)
│   ├── index.html
│   ├── home.js           # telas, foco, favoritos, fotos de fundo
│   ├── home.css          # visual
│   ├── tv.js             # ponte com a TV: apps, HDMI, Wi-Fi, notificações
│   ├── config.js         # sua identidade visual
│   ├── config.local.example.js  # modelo do config.local.js, com a chave do Unsplash (fora do git)
│   ├── logos/            # logos dos apps (fontes em FONTES.txt)
│   └── wallpapers/       # 5 paisagens para quando estiver sem internet
├── tizen/
│   ├── config.xml        # manifesto do app Tizen (id, versão, permissões)
│   ├── build.py          # gera e assina o DuskTV.wgt
│   └── install.py        # instala na TV pela rede
└── docs/                 # capturas de tela e fotos do "antes"
```

---

## ⚠️ Limites do Tizen

- **Rede, Conta e Privacidade:** a Samsung não documenta os apps dessas telas. O Dusk abre direto os que funcionam
  na UN60AU8000 (Tizen 6). Em outros modelos, se algum não existir, ele abre os Ajustes da TV e mostra o caminho a
  seguir lá dentro.

### 🔔 Notificações: em investigação

**Abrir o painel de notificações da Samsung ainda não funcionou.** Na UN60AU8000 testamos 10 jeitos diferentes, com
alguém olhando a TV: os apps `com.samsung.tv.notification-app`, `com.samsung.tv.notification-serviceapp` e
`com.samsung.tv.coba.home-notification`, chamados direto, por *app control* e em sequência. A TV responde que abriu,
mas nada aparece. É um app interno da Samsung, que não aceita os pedidos padrão de um app de terceiros.

Enquanto isso, o sino e o cartão "Notificações" abrem os **Ajustes da TV**. Seguimos procurando uma solução. Se você
souber como abrir esse painel no Tizen, ou se funcionar no seu modelo, abra uma [issue](../../issues) ou um Pull
Request.
- **Botão Home:** continua abrindo a barra da Samsung. A Samsung não entrega essa tecla a nenhum app.
- **Ligar a TV direto no Dusk TV:** não funciona na UN60AU8000. O "Executar automaticamente último app" ignora apps
  instalados pelo Modo Desenvolvedor, e a TV fecha o Dusk ao desligar, então ele não consegue se abrir sozinho.
- **Voltar para o Dusk ao sair de um app:** a TV vai para a TV ao vivo e não avisa o Dusk quando outro app fecha.
  Use **Home → Dusk TV**.
- **Modo Desenvolvedor:** precisa continuar ligado para o app funcionar.

---

## ↩️ Como desfazer

- **Pelo computador:** `python tizen/install.py IP_DA_TV --uninstall`
- **Pela TV:** Apps → ⚙ → Dusk TV → Excluir.

---

## 🤝 Contribuindo

Sugestões, correções e versões novas são bem-vindas.

1. Faça um **fork** do projeto.
2. Crie um branch: `git checkout -b minha-melhoria`.
3. Faça o commit: `git commit -m "Adiciona minha melhoria"`.
4. Envie: `git push origin minha-melhoria`.
5. Abra um **Pull Request**.

Ideias abertas: novos temas, mais logos, suporte testado em outros modelos e telas em outros idiomas.

---

## 🙏 Créditos

- **Inspiração visual:** o launcher "dusk" que [@lucataco](https://x.com/lucataco) mostrou numa TV LG.
- **Camada de TV, instalador e ícones de apoio:** [Free My TV](https://github.com/simbasjungles/free-my-tv)
  (MIT, veja [`LICENSE-FreeMyTV`](LICENSE-FreeMyTV)).
- **Logos:** [Simple Icons](https://simpleicons.org) (CC0) e Wikimedia Commons. Detalhes em
  [`web/logos/FONTES.txt`](web/logos/FONTES.txt).
- **Fonte:** [Inter](https://rsms.me/inter/) (SIL Open Font License).
- **Fotos online:** [Unsplash](https://unsplash.com), com o nome de cada fotógrafo na legenda, e imagens do dia do
  [Bing](https://www.bing.com). As duas são exibidas direto da fonte e não ficam guardadas neste repositório.

> As marcas e logos pertencem aos seus donos. Este projeto não tem ligação com a Samsung nem com os serviços
> citados.

---

## 📄 Licença

Distribuído sob a licença **MIT**. Veja [`LICENSE`](LICENSE).

<div align="center">

Feito com ☕ e [Claude Code](https://claude.com/claude-code) por [@mkrosz](https://github.com/mkrosz)

</div>
