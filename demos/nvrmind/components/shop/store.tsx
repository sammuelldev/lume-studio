'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import Link from '@nvr/link';
import {
  ArrowUpRight,
  ArrowRight,
  Search,
  ShoppingBag,
  Heart,
  Menu,
  Minus,
  Plus,
  Trash2,
  X,
  Check,
  Globe2,
  Package,
  Ruler,
  CreditCard,
} from 'lucide-react';
import { Button } from '@nvr/components/ui/button';
import { Input } from '@nvr/components/ui/input';
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetDescription,
  SheetClose,
} from '@nvr/components/ui/sheet';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@nvr/components/ui/dialog';
import {
  products,
  money,
  normalize,
  productImage,
  sanitizeCart,
  cartTotal,
  type CartItem,
  type Product,
} from '@nvr/lib/products';

type Store = {
  cart: CartItem[];
  favorites: string[];
  add: (p: Product, size: string) => void;
  toggleFavorite: (id: string) => void;
  openCart: () => void;
  showInfo: (title: string) => void;
};
const Context = createContext<Store | null>(null);
export function useStore() {
  const value = useContext(Context);
  if (!value) throw new Error('Loja indisponível');
  return value;
}
const help: Record<string, string> = {
  'Entrega e frete':
    'Os valores de frete e os prazos de entrega serão informados quando as vendas forem abertas. Esta prévia não calcula entregas nem recebe pedidos.',
  'Trocas e devoluções':
    'A política oficial de trocas e devoluções ainda será disponibilizada pela NVRMIND antes da abertura das vendas.',
  'Formas de pagamento':
    'As formas de pagamento e as condições de parcelamento serão confirmadas na abertura das vendas. Nenhuma cobrança é realizada nesta prévia.',
  'Guia de medidas':
    'A tabela oficial de medidas ainda não foi fornecida. Os tamanhos exibidos são demonstrativos. Antes de comprar, confira as medidas que serão publicadas para cada peça.',
  'Fale com a NVRMIND':
    'O canal oficial de atendimento será divulgado em breve. Por enquanto, você pode explorar a coleção e salvar suas peças favoritas neste navegador.',
  Privacidade:
    'Esta prévia guarda apenas sua sacola e seus favoritos neste navegador. Não solicitamos dados de pagamento nem enviamos e-mails. A política completa será publicada antes da abertura das vendas.',
  'Novidades da NVRMIND':
    'A lista de novidades abre em breve. Enquanto isso, salve suas peças favoritas no coração para encontrá-las novamente neste navegador.',
};
export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]),
    [favorites, setFavorites] = useState<string[]>([]),
    [ready, setReady] = useState(false);
  const [cartOpen, setCartOpen] = useState(false),
    [searchOpen, setSearchOpen] = useState(false),
    [menuOpen, setMenuOpen] = useState(false),
    [query, setQuery] = useState(''),
    [info, setInfo] = useState(''),
    [review, setReview] = useState(false),
    [notice, setNotice] = useState('');
  useEffect(() => {
    try {
      setCart(
        sanitizeCart(JSON.parse(localStorage.getItem('nvrmind-cart') || '[]')),
      );
      const f = JSON.parse(localStorage.getItem('nvrmind-favorites') || '[]');
      setFavorites(
        Array.isArray(f)
          ? f.filter(
              (id: unknown) =>
                typeof id === 'string' && products.some((p) => p.id === id),
            )
          : [],
      );
    } catch {}
    setReady(true);
  }, []);
  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem('nvrmind-cart', JSON.stringify(cart));
      localStorage.setItem('nvrmind-favorites', JSON.stringify(favorites));
    } catch {}
  }, [cart, favorites, ready]);
  useEffect(() => {
    if (!notice) return;
    const t = setTimeout(() => setNotice(''), 3500);
    return () => clearTimeout(t);
  }, [notice]);
  const count = cart.reduce((sum, i) => sum + i.quantity, 0);
  const add = (p: Product, size: string) => {
    if (!p.sizes.includes(size)) return;
    setCart((current) =>
      sanitizeCart([...current, { id: p.id, size, quantity: 1 }]),
    );
    setReview(false);
    setCartOpen(true);
    setNotice(`${p.name} adicionada à sacola.`);
  };
  const toggleFavorite = (id: string) => {
    setFavorites((f) =>
      f.includes(id) ? f.filter((x) => x !== id) : [...f, id],
    );
  };
  const updateQuantity = (item: CartItem, change: number) =>
    setCart((c) =>
      c
        .map((i) =>
          i.id === item.id && i.size === item.size
            ? { ...i, quantity: Math.min(10, i.quantity + change) }
            : i,
        )
        .filter((i) => i.quantity > 0),
    );
  const searchResults = products.filter((p) =>
    normalize(`${p.name} ${p.category} ${p.color}`).includes(normalize(query)),
  );
  return (
    <Context.Provider
      value={{
        cart,
        favorites,
        add,
        toggleFavorite,
        openCart: () => {
          setReview(false);
          setCartOpen(true);
        },
        showInfo: setInfo,
      }}
    >
      <a className="skip-link" href="#conteudo">
        Pular para o conteúdo
      </a>
      <div className="announcement">
        INDEPENDENTE POR NATUREZA. <span>RECIFE PARA O MUNDO. ↗</span>
      </div>
      <header className="site-header">
        <Link
          href="/"
          className="wordmark"
          aria-label="NVRMIND — página inicial"
        >
          NVRMIND<sup>®</sup>
        </Link>
        <nav aria-label="Navegação principal">
          <Link href="/#colecao">
            Coleção 001 <span className="nav-dot" />
          </Link>
          <Link href="/#colecao">Todas as peças</Link>
          <Link href="/#manifesto">O movimento</Link>
        </nav>
        <div className="header-actions">
          <Button
            className="icon-button"
            variant="ghost"
            onClick={() => setSearchOpen(true)}
            aria-label="Buscar peças"
          >
            <Search size={20} />
          </Button>
          <Button
            className="icon-button cart-trigger"
            variant="ghost"
            onClick={() => {
              setReview(false);
              setCartOpen(true);
            }}
            aria-label={`Abrir sacola com ${count} ${count === 1 ? 'peça' : 'peças'}`}
          >
            <ShoppingBag size={20} />
            <span>Sacola ({count})</span>
            <b className="mobile-count">{count}</b>
          </Button>
          <Button
            className="icon-button mobile-menu"
            variant="ghost"
            onClick={() => setMenuOpen(true)}
            aria-label="Abrir menu"
          >
            <Menu size={21} />
          </Button>
        </div>
      </header>
      {children}
      <section
        className="service-strip"
        aria-label="Informações para sua compra"
      >
        {[
          [Package, 'Entrega e frete', 'Consulte as informações'],
          [Ruler, 'Guia de medidas', 'Encontre seu tamanho'],
          [CreditCard, 'Formas de pagamento', 'Condições na abertura'],
        ].map(([Icon, title, subtitle]) => {
          const I = Icon as typeof Package;
          return (
            <Button
              key={String(title)}
              variant="ghost"
              className="service-item"
              onClick={() => setInfo(String(title))}
            >
              <I size={26} strokeWidth={1} />
              <span>
                <strong>{String(title)}</strong>
                <small>{String(subtitle)}</small>
              </span>
              <ArrowUpRight size={17} />
            </Button>
          );
        })}
      </section>
      <footer className="footer">
        <div className="footer-top">
          <div className="footer-intro">
            <p className="eyebrow">NÃO PERCA O PRÓXIMO CAPÍTULO.</p>
            <h2>
              FIQUE NA
              <br />
              FREQUÊNCIA.
            </h2>
            <p>Lançamentos, ideias e o que vem da rua.</p>
            <Button
              className="newsletter-link"
              onClick={() => setInfo('Novidades da NVRMIND')}
            >
              LISTA DE NOVIDADES EM BREVE <ArrowUpRight size={22} />
            </Button>
          </div>
          <div className="footer-links">
            <div>
              <h3>EXPLORE</h3>
              <Link href="/#colecao">Coleção 001</Link>
              <Link href="/#colecao">Todas as peças</Link>
              <Link href="/#editorial">Editorial</Link>
              <Link href="/#manifesto">O movimento</Link>
            </div>
            <div>
              <h3>PRECISA DE AJUDA?</h3>
              {[
                'Entrega e frete',
                'Trocas e devoluções',
                'Guia de medidas',
                'Fale com a NVRMIND',
              ].map((title) => (
                <Button
                  variant="link"
                  key={title}
                  onClick={() => setInfo(title)}
                >
                  {title}
                </Button>
              ))}
            </div>
          </div>
        </div>
        <div className="footer-brand" aria-hidden="true">
          NVRMIND<sup>®</sup>
        </div>
        <div className="footer-bottom">
          <span>© 2026 NVRMIND® · RECIFE, BR</span>
          <span>
            <Globe2 size={15} /> INDEPENDENTE POR NATUREZA.
          </span>
          <Button variant="link" onClick={() => setInfo('Privacidade')}>
            Privacidade
          </Button>
        </div>
        <p className="preview-disclosure">
          Prévia de coleção. Produtos e tamanhos demonstrativos. Vendas ainda
          não disponíveis.
        </p>
      </footer>
      <Sheet open={cartOpen} onOpenChange={setCartOpen}>
        <SheetContent className="cart-drawer" showCloseButton={false}>
          <div className="drawer-header">
            <div>
              <p className="eyebrow">SUA SELEÇÃO / NVRMIND®</p>
              <SheetTitle>
                {review ? 'REVISAR SELEÇÃO' : 'SUA SACOLA'} <sup>({count})</sup>
              </SheetTitle>
            </div>
            <SheetClose
              render={
                <Button
                  className="icon-button"
                  variant="ghost"
                  aria-label="Fechar sacola"
                />
              }
            >
              <X />
            </SheetClose>
          </div>
          <SheetDescription className="drawer-description">
            Suas peças ficam salvas neste navegador.
          </SheetDescription>
          {cart.length === 0 ? (
            <div className="empty-cart">
              <ShoppingBag size={42} strokeWidth={1} />
              <h3>O PRÓXIMO PASSO É SEU.</h3>
              <p>
                Sua sacola está vazia.
                <br />
                Encontre as peças que fazem parte de você.
              </p>
              <Button
                className="cta"
                onClick={() => {
                  setCartOpen(false);
                  window.location.assign('./index.html#colecao');
                }}
              >
                EXPLORAR A COLEÇÃO <ArrowUpRight />
              </Button>
            </div>
          ) : (
            <>
              <div className="cart-items">
                {cart.map((item) => {
                  const p = products.find((p) => p.id === item.id)!;
                  return (
                    <article
                      className="cart-item"
                      key={`${item.id}-${item.size}`}
                    >
                      <Link
                        href={`/produto/${p.id}`}
                        onClick={() => setCartOpen(false)}
                      >
                        <img
                          src={productImage(p)}
                          alt={p.name}
                          width={90}
                          height={115}
                        />
                      </Link>
                      <div>
                        <Link
                          href={`/produto/${p.id}`}
                          onClick={() => setCartOpen(false)}
                        >
                          <h3>{p.name}</h3>
                        </Link>
                        <p>
                          {p.color} / Tam. {item.size}
                        </p>
                        <strong>{money(p.price * item.quantity)}</strong>
                        <div className="quantity-row">
                          <div className="quantity-control">
                            <Button
                              variant="ghost"
                              aria-label={`Diminuir quantidade de ${p.name}, tamanho ${item.size}`}
                              onClick={() => updateQuantity(item, -1)}
                            >
                              <Minus size={13} />
                            </Button>
                            <span aria-label="Quantidade">{item.quantity}</span>
                            <Button
                              variant="ghost"
                              disabled={item.quantity >= 10}
                              aria-label={`Aumentar quantidade de ${p.name}, tamanho ${item.size}`}
                              onClick={() => updateQuantity(item, 1)}
                            >
                              <Plus size={13} />
                            </Button>
                          </div>
                          <Button
                            variant="ghost"
                            aria-label={`Remover ${p.name}, tamanho ${item.size}`}
                            onClick={() =>
                              setCart((c) =>
                                c.filter(
                                  (i) =>
                                    !(i.id === item.id && i.size === item.size),
                                ),
                              )
                            }
                          >
                            <Trash2 size={15} />
                          </Button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
              <div className="cart-summary">
                <div>
                  <span>
                    Subtotal · {count} {count === 1 ? 'peça' : 'peças'}
                  </span>
                  <strong>{money(cartTotal(cart))}</strong>
                </div>
                <p>Frete e pagamento disponíveis na abertura das vendas.</p>
                {review ? (
                  <div className="review-note" role="status">
                    <Check size={21} />
                    <h3>SUA SELEÇÃO ESTÁ SALVA.</h3>
                    <p>
                      As vendas ainda não estão abertas. Você pode continuar
                      montando sua sacola. Nenhum pedido foi enviado e nenhuma
                      cobrança foi realizada.
                    </p>
                    <Button variant="link" onClick={() => setReview(false)}>
                      Voltar à sacola <ArrowRight size={14} />
                    </Button>
                  </div>
                ) : (
                  <Button className="cta" onClick={() => setReview(true)}>
                    REVISAR MINHA SELEÇÃO <ArrowRight />
                  </Button>
                )}
                <Button
                  variant="link"
                  className="continue-shopping"
                  onClick={() => setCartOpen(false)}
                >
                  Continuar explorando
                </Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
      <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
        <DialogContent className="search-dialog">
          <DialogTitle>ENCONTRE SUA PRÓXIMA PEÇA.</DialogTitle>
          <DialogDescription>
            Busque por nome, categoria ou cor.
          </DialogDescription>
          <div className="search-field">
            <Search size={20} />
            <Input
              aria-label="Buscar no catálogo"
              placeholder="O que você está procurando?"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <p className="eyebrow" aria-live="polite">
            {searchResults.length}{' '}
            {searchResults.length === 1
              ? 'PEÇA ENCONTRADA'
              : 'PEÇAS ENCONTRADAS'}
          </p>
          <div className="search-results">
            {searchResults.map((p) => (
              <Link
                href={`/produto/${p.id}`}
                key={p.id}
                onClick={() => setSearchOpen(false)}
              >
                <img src={productImage(p)} width={56} height={70} alt="" />
                <span>
                  {p.name}
                  <small>{money(p.price)}</small>
                </span>
                <ArrowUpRight size={18} />
              </Link>
            ))}
            {!searchResults.length && (
              <p>Nenhuma peça por aqui. Tente “camiseta”, “preto” ou “boné”.</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
      <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
        <SheetContent className="menu-drawer">
          <SheetTitle>NVRMIND®</SheetTitle>
          <SheetDescription>
            Moda independente. Recife, Brasil.
          </SheetDescription>
          {[
            ['Coleção 001', 'colecao'],
            ['Todas as peças', 'colecao'],
            ['O movimento', 'manifesto'],
            ['Editorial', 'editorial'],
          ].map(([label, id]) => (
            <Link
              key={label}
              href={`/#${id}`}
              onClick={() => setMenuOpen(false)}
            >
              {label}
              <ArrowUpRight />
            </Link>
          ))}
        </SheetContent>
      </Sheet>
      <Dialog
        open={!!info}
        onOpenChange={(open) => {
          if (!open) setInfo('');
        }}
      >
        <DialogContent className="info-dialog">
          <p className="eyebrow">NVRMIND® / INFORMAÇÕES</p>
          <DialogTitle>{info}</DialogTitle>
          <DialogDescription>{help[info]}</DialogDescription>
          <Button className="cta" onClick={() => setInfo('')}>
            ENTENDI <Check size={17} />
          </Button>
        </DialogContent>
      </Dialog>
      <div
        className={`toast-message ${notice ? 'visible' : ''}`}
        role="status"
        aria-live="polite"
      >
        {notice && (
          <>
            <Check size={17} />
            {notice}
          </>
        )}
      </div>
    </Context.Provider>
  );
}
export function FavoriteButton({
  product,
  className = '',
}: {
  product: Product;
  className?: string;
}) {
  const { favorites, toggleFavorite } = useStore();
  const active = favorites.includes(product.id);
  return (
    <Button
      variant="ghost"
      className={`favorite-button ${active ? 'active' : ''} ${className}`}
      aria-label={`${active ? 'Remover' : 'Salvar'} ${product.name} ${active ? 'dos' : 'nos'} favoritos`}
      aria-pressed={active}
      onClick={() => toggleFavorite(product.id)}
    >
      <Heart
        size={18}
        fill={active ? 'currentColor' : 'none'}
        strokeWidth={1.4}
      />
    </Button>
  );
}
