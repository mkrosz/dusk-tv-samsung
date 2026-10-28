# Changelog

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
