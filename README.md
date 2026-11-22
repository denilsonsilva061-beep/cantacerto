# CantaCerto — protótipo simplificado

## Publicação no GitHub Pages
1. Extraia o ZIP.
2. Envie `index.html`, `style.css`, `script.js` e `README.md` para a raiz do repositório.
3. Abra Settings → Pages.
4. Selecione Deploy from a branch, `main`, `/ (root)` e salve.

## O que esta versão demonstra
- Catálogo dentro do próprio site, sem colar links.
- Filtros por idioma e pesquisa.
- Seletor entre modo karaokê (instrumental) e voz original.
- Estrutura preparada para receber arquivos de áudio autorizados em cada modo (campos `instrumentalAudioUrl` e `originalAudioUrl` no cadastro das músicas).
- Ao tocar em “Começar a cantar”, solicita/ativa o microfone.
- Letra na tela, cores de acerto/erro e resultado demonstrativo.

## Limitações
O catálogo contém três exercícios com letras originais, não músicas comerciais. No modo instrumental, toca uma pequena melodia eletrônica original de demonstração. O modo voz original já aparece na interface, mas precisa de um arquivo de áudio autorizado cadastrado para cada música. O reconhecimento de fala pode não reconhecer canto com precisão e depende do navegador (Chrome costuma oferecer melhor suporte), de HTTPS e da permissão do microfone. A pontuação atual é experimental. A afinação ainda não é avaliada.

Para uma experiência completa semelhante ao StarMaker, será necessário integrar um catálogo de gravações com direitos de reprodução, letras licenciadas sincronizadas por palavra e um serviço especializado de análise vocal. O YouTube não entrega automaticamente esse catálogo, letras e dados de afinação.
