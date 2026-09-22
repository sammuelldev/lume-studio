# Lume Studio

Página de apresentação do estúdio, com a identidade visual fornecida e cinco trabalhos selecionados. React, TypeScript e Vite, seguindo a tecnologia dos projetos disponíveis. Há também configuração compatível com Sites/Vinext.

## Executar

Requer Node.js 22.13 ou superior e npm.

```sh
npm ci
npm run dev
```

O comando prepara a prévia NVRMIND e inicia a Lume em `http://127.0.0.1:5173/`. Sirva sempre por HTTP: não abra o HTML diretamente.

```sh
npm run typecheck
npm run build
npm run preview
```

A versão estática é gerada em `dist-pages/`. O workflow do GitHub Pages publica a branch `main`. Os caminhos relativos funcionam na subpasta `/lume-studio/` e na raiz de outro domínio.

Repositório: https://github.com/sammuelldev/lume-studio

Site: https://sammuelldev.github.io/lume-studio/

## Conteúdo e contatos

- `lib/portfolio.ts`: lista central de trabalhos, descrições, categorias, fontes, imagens, links e contatos da Lume.
- `app/page.tsx`: página, navegação acessível e menu do celular.
- `app/globals.css`: paleta oficial, composição editorial e adaptação responsiva.
- `public/brand`: arquivos oficiais para fundo escuro. A proporção original da marca é preservada; a aplicação no cabeçalho enquadra somente as margens vazias por CSS.
- `public/projects`: capturas das interfaces reais.
- `public/og.png`: banner oficial fornecido, reutilizado como imagem social.
- `demos/nvrmind`: cópia independente e adaptada da prévia NVRMIND.

**Pendência de contato:** os materiais não contêm e-mail, WhatsApp ou Instagram da Lume. Preencha os campos do objeto `studio` em `lib/portfolio.ts`. Os links aparecem automaticamente quando configurados. Enquanto faltam, a seção informa que o canal será disponibilizado em breve. Não há formulário que simule envio nem contato de outra marca reutilizado.

## Trabalhos incorporados

| Projeto | Origem e execução | Destino |
| --- | --- | --- |
| MyPace | Repositório `sammuelldev/my-pace`, HTML/CSS/JS modular com Firebase; a entrada pública exige autenticação para acessar dados pessoais | Publicação GitHub Pages confirmada no histórico de deploys |
| Arquibancada Store | Repositório `sammuelldev/loja-de-camisas`, catálogo HTML/CSS/JS com atendimento da própria loja | Publicação GitHub Pages confirmada no histórico de deploys |
| NVRMIND | Pasta `nvrmind-site`, React/Vinext; prévia demonstrativa de e-commerce | Cópia estática em `projetos/nvrmind/` |
| Burguês | Pasta `burgues-hamburgueria-main`, React/Vite; site conceitual de hamburgueria | URL pública registrada no README original |
| Yuugan Sushi | Pasta `yuugan-sushi-main`, React/Vite; prévia editorial com cardápio ilustrativo | URL pública registrada no README original |

O MyPace e a Arquibancada não estavam na pasta recebida, mas foram identificados pelo conteúdo dos repositórios do mesmo proprietário e pelos registros de publicação. Nenhum repositório dos projetos foi alterado.

## Integração NVRMIND

A URL Sites registrada no projeto original responde com exigência de autenticação. Para permitir a visita ao trabalho, a Lume inclui uma cópia independente dos componentes, catálogo, estilos, imagens e fontes já fornecidos. A pasta original não participa do build e permanece intacta.

As únicas adaptações são os imports, caminhos relativos de imagens/fontes e links de produto para `?produto=identificador`. A navegação funciona em hospedagem estática, inclusive ao recarregar uma página de produto. Catálogo, filtros, busca, favoritos, seleção de tamanho e sacola permanecem funcionais. A prévia não recebe pedidos nem pagamentos; mantém os avisos originais. Os dados da sacola e favoritos ficam neste navegador.

`npm run build:demo` gera a prévia em `public/projetos/nvrmind/`, que o build principal incorpora. Essa saída é ignorada no Git, pois é reproduzível a partir da cópia versionada.

## Validação e capturas

```sh
node scripts/check-site.mjs
node scripts/capture-projects.mjs
```

Os scripts usam Playwright com Edge instalado. O primeiro requer o site local em execução e testa larguras de 320, 390, 768, 1440 e 1920 px, imagens, âncoras, menu, foco, Escape, movimento reduzido, páginas de produto e sacola da NVRMIND. Gera capturas e relatório em `validation/` e atualiza a captura NVRMIND. `LUME_TEST_URL` permite apontar a validação a outra origem ou à subpasta publicada. O segundo atualiza as quatro capturas de sites públicos, sem acessar dados privados do MyPace.

## Materiais e preservação

Não havia site principal da Lume nem `AGENTS.md` na pasta fornecida; este projeto foi criado isoladamente. O print mencionado não estava acessível como anexo ou arquivo: a implementação segue as logos, o banner, o fundo gráfico, a paleta e o guia oficial em `Lume_Studio_Identidade_Visual`.

As pastas Burguês, Yuugan, NVRMIND e identidade visual não foram modificadas. Não foram inventados equipe, depoimentos, resultados, dados comerciais ou contatos.

Para Sites: `npm run build:sites` usa a configuração original do gerador e a mesma página. A publicação estática no GitHub é independente dessa integração.
