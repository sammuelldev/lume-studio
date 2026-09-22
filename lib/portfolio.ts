import galleryImages from './gallery-images.json';

export type GalleryImage = {
  src: string;
  alt: string;
  label: string;
  width: number;
  height: number;
};
export type Project = {
  id: string;
  name: string;
  description: string;
  category: string;
  gallery: GalleryImage[];
  status?: string;
  featured?: boolean;
  source: string;
};

// As galerias exibem somente capturas, sem links para abrir os sites.
// Máximo de seis imagens por trabalho. Fontes mantidas apenas para documentação.
export const projects: Project[] = [
  {
    id: 'mypace',
    name: 'MyPace',
    category: 'Aplicação web',
    description:
      'Uma experiência para organizar a rotina de corrida, acompanhar treinos e enxergar a própria evolução.',
    gallery: galleryImages.mypace,
    source:
      'https://github.com/sammuelldev/my-pace — capturas apenas das telas públicas, sem dados pessoais.',
  },
  {
    id: 'arquibancada',
    name: 'Arquibancada Store',
    category: 'Catálogo digital',
    description:
      'A paixão pelo futebol em um catálogo de camisas, com busca por time e filtros para encontrar a próxima escolha.',
    gallery: galleryImages.arquibancada,
    source: 'https://github.com/sammuelldev/loja-de-camisas',
  },
  {
    id: 'nvrmind',
    name: 'NVRMIND',
    category: 'Interface de e-commerce',
    description:
      'Moda independente em uma experiência editorial. Coleção, páginas de produto e o universo visual da marca.',
    gallery: galleryImages.nvrmind,
    status: 'Projeto demonstrativo',
    featured: true,
    source:
      'Cópia local em demos/nvrmind. O site demonstrativo não é incluído na publicação.',
  },
  {
    id: 'burgues',
    name: 'Burguês',
    category: 'Site gastronômico',
    description:
      'Uma hamburgueria artesanal apresentada com personalidade, cardápio por categorias e atenção aos detalhes.',
    gallery: galleryImages.burgues,
    status: 'Projeto conceitual',
    source: 'sites para portfolio/burgues-hamburgueria-main/README.md',
  },
  {
    id: 'yuugan',
    name: 'Yuugan Sushi',
    category: 'Site gastronômico',
    description:
      'Uma composição delicada para a gastronomia japonesa, com cardápio, galeria e seleção de pratos favoritos.',
    gallery: galleryImages.yuugan,
    status: 'Prévia demonstrativa',
    source: 'sites para portfolio/yuugan-sushi-main/README.md',
  },
];

// PENDÊNCIA: preencha somente contatos confirmados da LUME STUDIO.
export const studio = { email: '', whatsapp: '', instagram: '' };
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
