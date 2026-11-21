# CantaCerto — versão inicial

Site estático responsivo para GitHub Pages.

## Arquivos
- `index.html`: estrutura do site
- `style.css`: identidade visual clara, roxo e azul
- `script.js`: catálogo demonstrativo, player do YouTube e reconhecimento de voz experimental

## Publicar no GitHub Pages
1. Crie um repositório no GitHub, por exemplo `cantacerto`.
2. Envie os arquivos `index.html`, `style.css`, `script.js` e a pasta `assets` para a raiz do repositório.
3. Abra **Settings > Pages**.
4. Em **Build and deployment**, escolha **Deploy from a branch**.
5. Selecione a branch `main` e a pasta `/ (root)`, depois salve.
6. Aguarde o GitHub publicar o endereço do site.

## Importante sobre esta versão
- Os três itens iniciais são exercícios com letras originais de demonstração, não músicas comerciais.
- É possível colar um link de vídeo do YouTube no campo da página. A reprodução depende das permissões e configurações do vídeo.
- O microfone usa a API de reconhecimento de fala do navegador. Em geral, é necessário abrir o site por HTTPS e autorizar o microfone. O suporte varia entre navegadores e aparelhos.
- A pontuação atual é uma demonstração baseada na correspondência sequencial de palavras reconhecidas. Ela não é uma avaliação musical certificada.
- A afinação aparece como “Não avaliada”. Para avaliar afinação de verdade, será necessário implementar análise de áudio e comparar a frequência da voz com uma referência melódica sincronizada.
- O modo instrumental orienta a escolher um vídeo instrumental; o site não consegue remover a voz do áudio do YouTube.
- O YouTube não fornece automaticamente letras sincronizadas. Use letras próprias ou conteúdo para o qual você tenha autorização.
- Não use músicas, gravações ou letras protegidas sem as permissões necessárias.

## Próximas etapas recomendadas
1. Criar cadastro de músicas com metadados e letras autorizadas.
2. Integrar serviço de reconhecimento de fala mais robusto para canto.
3. Implementar análise de pitch e comparação com uma melodia de referência.
4. Salvar histórico e evolução das pontuações em um backend seguro (GitHub Pages sozinho não armazena dados privados).
