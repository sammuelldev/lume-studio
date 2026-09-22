export type Project = {
  id: string;
  name: string;
  description: string;
  category: string;
  image: string;
  imageAlt: string;
  url: string;
  status?: string;
  featured?: boolean;
  source: string;
};

// Para incluir um trabalho: adicione um registro e a captura em public/projects.
export const projects: Project[] = [
  {
    id: 'mypace',
    name: 'MyPace',
    category: 'Aplicação web',
    description:
      'Uma experiência para organizar a rotina de corrida, acompanhar treinos e enxergar a própria evolução.',
    image: 'projects/mypace.png',
    imageAlt:
      'Interface de acesso do MyPace, aplicativo de planejamento de corrida',
    url: 'https://sammuelldev.github.io/my-pace/',
    source:
      'https://github.com/sammuelldev/my-pace — README e publicação GitHub Pages',
  },
  {
    id: 'arquibancada',
    name: 'Arquibancada Store',
    category: 'Catálogo digital',
    description:
      'A paixão pelo futebol em um catálogo de camisas, com busca por time, filtros e atendimento pelo WhatsApp.',
    image: 'projects/arquibancada.png',
    imageAlt:
      'Página da Arquibancada Store com identidade de futebol e catálogo de camisas',
    url: 'https://sammuelldev.github.io/loja-de-camisas/',
    source:
      'https://github.com/sammuelldev/loja-de-camisas — index.html e publicação GitHub Pages',
  },
  {
    id: 'nvrmind',
    name: 'NVRMIND',
    category: 'Interface de e-commerce',
    description:
      'Moda independente em uma experiência editorial. Coleção, páginas de produto, favoritos e sacola em uma prévia navegável.',
    image: 'projects/nvrmind.png',
    imageAlt:
      'Interface da NVRMIND com fotografia urbana e o título A cidade é nossa',
    url: 'projetos/nvrmind/index.html',
    status: 'Projeto demonstrativo',
    featured: true,
    source:
      'sites para portfolio/nvrmind-site/README.md; cópia independente em demos/nvrmind',
  },
  {
    id: 'burgues',
    name: 'Burguês',
    category: 'Site gastronômico',
    description:
      'Uma hamburgueria artesanal apresentada com personalidade, cardápio por categorias e uma sacola demonstrativa.',
    image: 'projects/burgues.png',
    imageAlt:
      'Interface do Burguês em preto e amarelo com fotografia de hambúrguer artesanal',
    url: 'https://sammuelldev.github.io/burgues-hamburgueria/',
    status: 'Projeto conceitual',
    source: 'sites para portfolio/burgues-hamburgueria-main/README.md',
  },
  {
    id: 'yuugan',
    name: 'Yuugan Sushi',
    category: 'Site gastronômico',
    description:
      'Uma composição delicada para a gastronomia japonesa, com cardápio, galeria e seleção de pratos favoritos.',
    image: 'projects/yuugan.png',
    imageAlt:
      'Interface do Yuugan Sushi com fotografia gastronômica e composição editorial escura',
    url: 'https://sammuelldev.github.io/yuugan-sushi/',
    status: 'Prévia demonstrativa',
    source: 'sites para portfolio/yuugan-sushi-main/README.md',
  },
];

// PENDÊNCIA: preencha somente contatos confirmados da LUME STUDIO.
// Os contatos dos projetos apresentados pertencem às respectivas marcas.
export const studio = {
  email: '', // E-mail oficial do estúdio.
  whatsapp: '', // DDI + DDD + número, somente dígitos.
  instagram: '', // URL completa do perfil oficial.
};
export const contactLinks = [
  ...(studio.whatsapp
    ? [
        {
          label: 'Conversar pelo WhatsApp',
          url: `https://wa.me/${studio.whatsapp}?text=${encodeURIComponent('Olá! Quero conversar sobre um projeto com a Lume Studio.')}`,
        },
      ]
    : []),
  ...(studio.email
    ? [{ label: studio.email, url: `mailto:${studio.email}` }]
    : []),
  ...(studio.instagram ? [{ label: 'Instagram', url: studio.instagram }] : []),
];
