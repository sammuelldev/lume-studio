export type Product = {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  color: string;
  description: string;
  sizes: string[];
};
export const products: Product[] = [
  {
    id: 'camiseta-no-signal',
    name: 'Camiseta No Signal',
    price: 8990,
    category: 'Camisetas',
    image: '05_product_no_signal_tee',
    color: 'Preto',
    description:
      'O ruído vira imagem. Camiseta preta com estampa frontal de alto contraste e assinatura NVRMIND. Presença que dispensa explicação.',
    sizes: ['P', 'M', 'G', 'GG'],
  },
  {
    id: 'camiseta-static',
    name: 'Camiseta Static',
    price: 8990,
    category: 'Camisetas',
    image: '06_product_static_tee',
    color: 'Cru',
    description:
      'Uma interferência no óbvio. Fundo cru, estampa gráfica difusa e assinatura NVRMIND. A expressão da rua em uma peça.',
    sizes: ['P', 'M', 'G', 'GG'],
  },
  {
    id: 'moletom-after-hours',
    name: 'Moletom After Hours',
    price: 29990,
    category: 'Moletons e jaquetas',
    image: '07_product_after_hours_hoodie',
    color: 'Preto',
    description:
      'Quando a cidade muda de ritmo. Moletom preto com capuz, bolso frontal e assinatura central. Parte do primeiro capítulo NVRMIND.',
    sizes: ['P', 'M', 'G', 'GG'],
  },
  {
    id: 'calca-system-01',
    name: 'Calça System 01',
    price: 34990,
    category: 'Calças e bermudas',
    image: '08_product_system01_pants',
    color: 'Preto',
    description:
      'Linhas amplas, bolsos laterais e preto do início ao fim. A System 01 traz a linguagem utilitária para o concreto.',
    sizes: ['36', '38', '40', '42', '44'],
  },
  {
    id: 'jorts-void',
    name: 'Jorts Void',
    price: 19990,
    category: 'Calças e bermudas',
    image: '09_product_void_jorts',
    color: 'Preto estonado',
    description:
      'O asfalto em outra textura. Bermuda com aparência estonada, comprimento alongado e assinatura discreta. Feita para compor o seu caminho.',
    sizes: ['36', '38', '40', '42', '44'],
  },
  {
    id: 'jaqueta-concrete-shell',
    name: 'Jaqueta Concrete Shell',
    price: 39990,
    category: 'Moletons e jaquetas',
    image: '10_product_concrete_shell',
    color: 'Preto',
    description:
      'A cidade como segunda pele. Jaqueta preta com gola, fechamento frontal e assinatura no peito. Uma camada a mais de expressão.',
    sizes: ['P', 'M', 'G', 'GG'],
  },
  {
    id: 'bone-nvr-01',
    name: 'Boné NVR/01',
    price: 12990,
    category: 'Acessórios',
    image: '11_product_nvr01_cap',
    color: 'Preto',
    description:
      'O ponto final da composição. Boné preto de aba curva com a assinatura NVRMIND em contraste na frente.',
    sizes: ['Único'],
  },
];
export const categories = [
  'Todas as peças',
  'Camisetas',
  'Moletons e jaquetas',
  'Calças e bermudas',
  'Acessórios',
];
export const money = (cents: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
    cents / 100,
  );
export const normalize = (text: string) =>
  text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
export const productImage = (p: Product) => `./images/${p.image}-clean.webp`;
export type CartItem = { id: string; size: string; quantity: number };
export function sanitizeCart(value: unknown): CartItem[] {
  if (!Array.isArray(value)) return [];
  const result: CartItem[] = [];
  for (const row of value) {
    if (!row || typeof row !== 'object') continue;
    const p = products.find((p) => p.id === row.id);
    if (
      !p ||
      !p.sizes.includes(row.size) ||
      !Number.isInteger(row.quantity) ||
      row.quantity < 1
    )
      continue;
    const existing = result.find((i) => i.id === row.id && i.size === row.size);
    if (existing)
      existing.quantity = Math.min(10, existing.quantity + row.quantity);
    else
      result.push({
        id: row.id,
        size: row.size,
        quantity: Math.min(10, row.quantity),
      });
  }
  return result;
}
export const cartTotal = (items: CartItem[]) =>
  items.reduce(
    (sum, item) =>
      sum +
      (products.find((p) => p.id === item.id)?.price ?? 0) * item.quantity,
    0,
  );
