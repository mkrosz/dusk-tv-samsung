# Changelog

## [1.5.1] - 2026-10-28

### Corrigido (documentação)
- **O README não promete mais que a TV liga direto no Dusk TV.** Na UN60AU8000, o "Executar automaticamente último
  app" não abre o Dusk ao ligar, e a TV vai para a TV ao vivo. Foram quatro testes, desligando e ligando a TV:
  - com o app aberto pela barra da Samsung e pelo computador;
  - com o aviso `appbootingsupport`, que Netflix, YouTube e Prime Video têm;
  - com a ordem de retomada `eden_resume`, como declara o TizenBrew;
  - com `prelaunch.support`.
- Também foi testado deixar o Dusk rodando em segundo plano para ele se abrir ao ligar, mas a TV fecha o app quando
  desliga. Nenhuma dessas mudanças ficou no app.
- O passo 5 da instalação agora ensina a pôr o Dusk TV no começo da barra da Samsung (Home → Dusk TV), e a seção
  "Limites do Tizen" explica o que a TV não deixa fazer. A dica no fim do `install.py` também mudou.

## [1.5.0] - 2026-10-28

### Novo
- **Cartão "Botão Home"** em Ajustes → Personalizar. Cada OK alterna entre:
  - **"Abre a barra da Samsung"**: o padrão, que é o comportamento normal da TV.
  - **"Volta para o Dusk TV"**: o Home, apertado com o Dusk aberto, traz o Dusk de volta.
- Como funciona: a Samsung não entrega a tecla Home a nenhum app. Quando a barra dela abre por cima do Dusk, a página
  perde o foco do controle. O Dusk percebe isso e se abre de novo, o que fecha a barra e recarrega o Início em cerca de
  2 s. Nos 3 segundos depois de o próprio Dusk abrir um app ou uma tela, isso é ignorado, para não atrapalhar.
- Limite: dentro de outro app (YouTube, TV ao vivo), a TV não avisa o Dusk, e o Home continua abrindo a barra da
  Samsung. Testado numa UN60AU8000.

## [1.4.1] - 2026-10-28

### Corrigido
- **O contorno do item em foco aparece também nos apps de fundo branco** (YouTube, Globoplay). Ele agora fica do lado
  de fora do card, sobre o fundo escuro, com uma pequena folga, em vez de ser desenhado por dentro do card. A
  navegação continua a 60 quadros por segundo na UN60AU8000.

### Mudou
- O cartão "Ajustes rápidos" virou **"Ajustes de jogo"**, com um ícone de controle de videogame. Na TV, o painel que
  ele abre mostra controladores, saída de som e imagem de jogo.

## [1.4.0] - 2026-10-28

### Novo
- **Cartão "Ajustes rápidos"** em Ajustes → Sistema da TV. Ele abre o painel lateral da Samsung
  (`com.samsung.tv.quickpanel`) com os controles, a saída de som e o modo de jogo, a mesma tela que apareceu num dos
  testes de notificações. Em TVs sem esse painel, abre os Ajustes da TV.

## [1.3.3] - 2026-10-28

### Mudou
- **O sino e o cartão "Notificações" abrem os Ajustes da TV.** Numa terceira rodada de testes na UN60AU8000, com
  alguém olhando a tela, nenhum dos cinco novos jeitos mostrou o painel de notificações da Samsung. Foram o serviço
  de notificações, o serviço seguido do app, o componente da tela inicial por *app control*, o painel rápido e a
  tela inicial. Ao todo, 10 tentativas nas três rodadas.
- O README ganhou a seção "Notificações: em investigação", que explica o que foi testado e convida quem souber o
  caminho a contribuir.

## [1.3.2] - 2026-10-28

### Corrigido
- **Rede e Wi-Fi, Conta Samsung, Privacidade e Ajustes da TV agora abrem de verdade.** Na 1.3.1 a TV respondia que
  tinha aberto os apps `com.samsung.tv.coba.*`, mas nada aparecia na tela. Testei tela por tela numa UN60AU8000, com
  alguém olhando, e estes são os que aparecem:
  - Rede e Wi-Fi: `org.tizen.NetworkSetting-Tizen`
  - Conta Samsung: `com.samsung.tv.CSAccount`
  - Privacidade: `tv6pbVMQFF.PrivacyChoices`
  - Ajustes da TV: `org.tizen.menu`, que abre as Configurações em Imagem
  - Os apps `coba` ficam como segunda opção, para outros modelos.

### Problema conhecido
- **Notificações:** nenhum app testado mostra o painel de notificações na UN60AU8000. O app
  `com.samsung.tv.notification-app` responde que abriu, mas não aparece nada.

## [1.3.1] - 2026-10-28

### Corrigido
- **As opções de "Sistema da TV" em Ajustes abrem direto, rápido e no lugar certo.** Antes, todas passavam pelo
  pedido genérico de "abrir ajustes", que demorava, às vezes falhava e às vezes caía no menu errado
  (`org.tizen.menu`). Agora cada cartão abre o app da própria tela (tempos medidos na UN60AU8000):
  - Rede e Wi-Fi: `com.samsung.tv.coba.setting.networksettings`, em cerca de 0,9 s.
  - Conta Samsung: `com.samsung.tv.coba.samsungaccount`, em cerca de 1,5 s.
  - Privacidade: `com.samsung.tv.coba.privacychoice`, em cerca de 2,2 s.
  - Ajustes da TV: `com.samsung.tv.coba.setting`, em cerca de 1,3 s.
  - Em TVs sem algum desses apps, abre os Ajustes e mostra o caminho a seguir.
- **Notificações (cartão e sino) abrem em cerca de 1 s.** Antes levavam 11 s, porque o app listava todos os apps da
  TV antes. Agora ele tenta direto o `com.samsung.tv.notification-app` e só procura na lista se esse não existir.
- **Um segundo OK enquanto uma tela está abrindo é ignorado.** Antes, ele podia abrir a tela duas vezes ou a tela
  errada.

### Visual
- Novo ícone de engrenagem, em contorno, no mesmo estilo do sino.
- "Todos os ajustes da TV" virou "Ajustes da TV", que cabe numa linha só.

## [1.3.0] - 2026-10-28

### Novo
- **Favoritos separados na aba Apps:** os apps marcados com ⭐ ficam numa seção "Favoritos" no topo, na mesma ordem
  do Início. Os demais ficam em "Todos os apps".
- **Bloco "Loja de apps":** primeiro bloco de "Todos os apps", abre a loja da Samsung (`com.samsung.tv.store`). O
  app "Apps" da Samsung sai da lista, para não aparecer repetido.

## [1.2.1] - 2026-10-28

### Corrigido
- **Rolagem em Apps e Ajustes:** a página só desce o necessário para mostrar o item em foco e nunca passa do fim do
  conteúdo. Na última fileira de Ajustes, ela desce o suficiente para mostrar o modelo da TV e a versão.
- **Ajustes não sobe e desce mais** ao andar entre os cartões de uma mesma fileira (como os de "Sistema da TV"). A
  posição agora é medida na tela, e não mais pelo `offsetTop`, que mudava de referência depois da primeira rolagem.
- **Subir para a barra não troca mais de aba:** o foco vai para a aba da página onde você está. Antes ia para a aba
  mais próxima, que podia ser "Início".

## [1.2.0] - 2026-10-28

### Navegação fluida
- A navegação entre favoritos, Apps e Ajustes roda a **60 quadros por segundo**. Antes rodava a 8 na UN60AU8000.
  A medição foi feita na TV.
  - Sem sombras: o contorno do item em foco agora é uma borda.
  - O foco e a troca de aba são instantâneos, sem animação de zoom, fade ou deslize. Só o papel de parede e os
    avisos continuam com transição suave.

### Visual
- Cor de destaque **azul pastel `#8CB2F3`**, no lugar do laranja: abas, sino, cartões dos Ajustes e o favorito sendo
  movido.

### Mudou
- As **Entradas** (TV ao vivo e HDMI) saíram da aba Apps e ficam só em Ajustes.

## [1.1.0] - 2026-10-28

### Mais rápido
- Os favoritos aparecem em cerca de 0,5 s depois de abrir o app. Antes levavam 1,7 s numa UN60AU8000.
  - A última lista de apps e entradas fica guardada e é mostrada na hora, enquanto a TV responde.
  - Os favoritos são desenhados primeiro, e as abas Apps e Ajustes logo depois.
  - O pacote leva uma página só, com o CSS e os scripts dentro dela (`tizen/build.py`).
  - A fonte Inter foi reduzida aos caracteres usados: de 860 KB para 120 KB (`tools/subset_font.py`).

### Corrigido
- Segurar OK num favorito agora entra no modo de reorganizar. Antes, soltar o botão abria o app, porque o controle
  da Samsung não repete o OK enquanto ele está apertado.
- ▼ num favorito também entra no modo de reorganizar.

### Instalação
- Link do Tizen SDK 10. O link antigo do Tizen Studio leva para a página inicial do samsungtizenos.com.
- Script `tools/criar-certificado.ps1`, que cria o certificado e o perfil `dusk` sem abrir o Certificate Manager.
- README explica:
  - que o `1 2 3 4 5` precisa ser digitado em até 2 segundos;
  - qual IP usar (Wi-Fi ou Ethernet, nunca VPN ou `169.254.x.x`);
  - onde entra o IP da TV;
  - que o "Executar automaticamente último app" é configurado na TV.
- `build.py` também procura o SDK em `C:\tizen-sdk`.

## [1.0.0] - 2026-10-28

Primeira versão pública.

- Tela inicial com saudação, data, favoritos e paisagem de fundo.
- Abas Início, Apps e Ajustes, navegadas pelo controle remoto.
- Barra superior com logo da Samsung, relógio, sinal do Wi-Fi ou do cabo e sino de notificações.
- Logos oficiais para cerca de 30 apps.
- Paisagens online (imagens do dia do Bing) e 5 paisagens offline desenhadas por código.
- Favoritos editáveis: adicionar, tirar e reorganizar segurando OK.
- Entradas HDMI com status de conexão.
- Identidade visual configurável em `web/config.js`.
- Scripts em Python para gerar, assinar e instalar o app na TV pela rede.
