# Lume Studio

Página de apresentação em React, TypeScript e Vite. Composição editorial em grafite, serviços em branco suave e contato em lavanda. Títulos em Geist e destaques em Instrument Serif itálica seguem as referências fornecidas. Os cinco projetos são apresentados em galerias de capturas reais, sem links para abrir os sites.

## Executar e publicar

Requer Node.js 22.13 ou superior e npm.

```sh
npm ci
npm run dev
```

A Lume inicia em `http://127.0.0.1:5173/`. Sirva por HTTP, sem abrir o HTML diretamente.

```sh
npm run typecheck
npm run build
npm run preview
```

A saída estática fica em `dist-pages/`. O workflow do GitHub Pages publica a branch `main`. Os caminhos relativos funcionam na subpasta `/lume-studio/`.

- Site: https://sammuelldev.github.io/lume-studio/
- Repositório: https://github.com/sammuelldev/lume-studio
- Sites/Vinext: `npm run build:sites`, com a mesma página e configuração em `.openai/hosting.json`.

## Conteúdo e identidade

- `lib/portfolio.ts`: projetos, descrições, categorias e contatos.
- `lib/gallery-images.json`: fotos de cada projeto, legendas, textos alternativos e dimensões.
- `components/project-gallery.tsx`: versões para abertura, cards, destaque horizontal e projetos secundários. Ampliação em tela cheia com nome, categoria, classificação, setas, indicadores e contador. Arraste, toque, teclado, Escape e retorno de foco preservados, sem reprodução automática.
- `components/brand.tsx`: apresentação da marca e contorno do símbolo derivado do alfa do PNG oficial, sem alterar o arquivo original.
- `components/icons.ts`: ícones Phosphor com imports individuais, evitando carregar todo o catálogo.
- `hooks/use-page-motion.ts`: entradas discretas e indicação da seção ativa via IntersectionObserver. Conteúdo visível mesmo sem animação; preferência por movimento reduzido respeitada.
- `app/page.tsx`: abertura em duas colunas, NVRMIND em destaque, portfólio, serviços em linhas amplas, contato e rodapé.
- `app/globals.css`: cores, tipografia, composição editorial, foco visível e adaptação responsiva.
- `public/brand/logo-transparente.png`: PNG oficial transparente preservado. Duas camadas CSS conservam o símbolo roxo e exibem as letras em branco sobre o grafite.
- `public/fonts`: Geist, Geist Mono e Instrument Serif, servidas localmente. Fontes obtidas do repositório oficial `google/fonts`, acompanhadas das licenças SIL OFL. Os arquivos Inter existentes foram preservados.
- `public/projects`: capturas das interfaces reais. O componente limita cada galeria a seis fotos.

**Pendência de contato:** os materiais não contêm e-mail, WhatsApp ou Instagram da Lume. Preencha os campos do objeto `studio` em `lib/portfolio.ts`. Os links aparecem automaticamente quando configurados. Enquanto faltam, o botão de contato fica desabilitado com uma explicação visível. Os demais convites levam à seção de contato. Não há formulário que simule envio nem contato de outra marca reutilizado.

Para adicionar um trabalho, inclua as imagens em `public/projects`, os dados no manifesto e a entrada em `projects`. Os campos `source` documentam a origem e não geram links na página.

## Projetos incorporados

| Projeto            | Galeria                                                           | Origem                                                                |
| ------------------ | ----------------------------------------------------------------- | --------------------------------------------------------------------- |
| MyPace             | 3 fotos: acesso, cadastro e acesso no celular                     | Repositório `sammuelldev/my-pace`; telas públicas, sem dados pessoais |
| Arquibancada Store | 5 fotos: início, identidade, catálogo, busca e celular            | Repositório `sammuelldev/loja-de-camisas`                             |
| NVRMIND            | 6 fotos: início, coleção, manifesto, editorial, produto e celular | Pasta `nvrmind-site`, React/Vinext; projeto demonstrativo             |
| Burguês            | 6 fotos: início, cardápio, detalhes, história, ambiente e celular | Pasta `burgues-hamburgueria-main`, React/Vite; projeto conceitual     |
| Yuugan Sushi       | 6 fotos: início, pratos, cardápio, essência, galeria e celular    | Pasta `yuugan-sushi-main`, React/Vite; prévia demonstrativa           |

MyPace e Arquibancada foram identificados pelo conteúdo dos repositórios do mesmo proprietário e pelos registros de publicação. As URLs públicas registradas são utilizadas somente pelo script de captura.

## Capturas e validação

```sh
node scripts/check-galleries.mjs
```

Requer a Lume em execução e Playwright com Edge instalado. Verifica seis larguras entre 320 e 1920 px, as 26 imagens preservadas, paleta, fontes, navegação, carrosséis, diálogo, foco, arraste, toque e movimento reduzido. A prévia do NVRMIND na abertura também é validada. Salva capturas e relatório em `validation/`, ignorada pelo Git. `LUME_TEST_URL` permite validar outra origem ou subpasta.

Para atualizar as imagens, inicie a prévia local de captura em outro terminal:

```sh
npm run dev:demo
node scripts/capture-galleries.mjs
```

O script captura os quatro sites públicos e a cópia local NVRMIND em `http://127.0.0.1:5174/index.html`. `LUME_NVRMIND_URL` permite configurar outra origem. O script substitui as capturas e o manifesto; revise o resultado antes de publicar.

`demos/nvrmind` é uma cópia independente dos materiais fornecidos, mantida apenas para capturas. Imports, caminhos e links de produto foram adaptados para execução local em Vite. `npm run build:demo` gera uma prévia em `.gallery-previews/nvrmind`, ignorada pelo Git. O site demonstrativo não integra o build nem a publicação da Lume.

## Preservação dos materiais

Não havia site principal da Lume nem `AGENTS.md` na pasta fornecida; este projeto foi criado isoladamente. As pastas originais Burguês, Yuugan, NVRMIND e identidade visual permanecem intactas. Nenhum repositório dos trabalhos foi alterado. Não foram inventados equipe, depoimentos, resultados ou contatos.
