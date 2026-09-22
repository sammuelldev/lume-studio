'use client';
import { useState } from 'react';
import Link from '@nvr/link';
import {
  ArrowUpRight,
  ArrowLeft,
  ArrowRight,
  Plus,
  Ruler,
  ZoomIn,
  Check,
  Heart,
} from 'lucide-react';
import { Button } from '@nvr/components/ui/button';
import { Input } from '@nvr/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@nvr/components/ui/dialog';
import { products, money, productImage, type Product } from '@nvr/lib/products';
import { FavoriteButton, useStore } from './store';

export function ProductDetail({ product: p }: { product: Product }) {
  const [size, setSize] = useState(''),
    [error, setError] = useState(''),
    [zoom, setZoom] = useState(false),
    [cep, setCep] = useState(''),
    [shipping, setShipping] = useState('');
  const { add, showInfo } = useStore();
  const submit = () => {
    if (!size) {
      setError('Escolha um tamanho para adicionar à sacola.');
      document.getElementById('size-options')?.focus();
      return;
    }
    setError('');
    add(p, size);
  };
  return (
    <main id="conteudo" className="product-page">
      <nav className="breadcrumbs" aria-label="Caminho de navegação">
        <Link href="/">Início</Link>
        <span>/</span>
        <Link href="/#colecao">Coleção 001</Link>
        <span>/</span>
        <span aria-current="page">{p.name}</span>
      </nav>
      <div className="product-layout">
        <div className="product-gallery">
          <div className="main-product-image">
            <span className="eyebrow">
              COLEÇÃO 001 / {String(products.indexOf(p) + 1).padStart(3, '0')}
            </span>
            <img
              src={productImage(p)}
              alt={`${p.name} na cor ${p.color.toLowerCase()}, vista frontal`}
              width={560}
              height={620}
              fetchPriority="high"
            />
            <Button
              variant="ghost"
              className="zoom-trigger"
              onClick={() => setZoom(true)}
              aria-label={`Ampliar imagem de ${p.name}`}
            >
              <ZoomIn size={19} />
              <span>AMPLIAR</span>
            </Button>
          </div>
          <p className="image-caption">01 / A PEÇA — VISTA FRONTAL</p>
          <div className="product-campaign">
            <img
              src="./images/13_lookbook_group.webp"
              alt="Referência editorial da coleção: grupo em um estacionamento"
              loading="lazy"
              width={550}
              height={379}
            />
            <span>02 / O UNIVERSO DA COLEÇÃO</span>
          </div>
        </div>
        <div className="purchase-panel">
          <p className="eyebrow">NVRMIND® / CONCRETE AFTER DARK</p>
          <div className="product-title-row">
            <h1>{p.name}</h1>
            <FavoriteButton product={p} />
          </div>
          <p className="detail-price">{money(p.price)}</p>
          <p className="detail-description">{p.description}</p>
          <div className="color-selection">
            <span>
              COR: <strong>{p.color.toUpperCase()}</strong>
            </span>
            <span
              className={`color-swatch ${p.color === 'Cru' ? 'ecru' : ''}`}
              aria-label={`Cor: ${p.color}`}
            >
              <Check size={14} />
            </span>
          </div>
          <div className="size-heading">
            <span>ESCOLHA SEU TAMANHO</span>
            <Button variant="link" onClick={() => showInfo('Guia de medidas')}>
              <Ruler size={14} /> Guia de medidas
            </Button>
          </div>
          <div
            id="size-options"
            className="size-options"
            role="group"
            aria-label="Tamanho"
            tabIndex={-1}
            aria-describedby="size-note"
          >
            {p.sizes.map((s) => (
              <Button
                key={s}
                variant="outline"
                className={size === s ? 'selected' : ''}
                aria-pressed={size === s}
                onClick={() => {
                  setSize(s);
                  setError('');
                }}
              >
                {s}
              </Button>
            ))}
          </div>
          <p className="size-note" id="size-note">
            Tamanhos demonstrativos. Estoque a confirmar na abertura.
          </p>
          <p className="form-feedback error" role="alert">
            {error}
          </p>
          <div className="purchase-action">
            <Button className="cta purchase-button" onClick={submit}>
              ADICIONAR À SACOLA <Plus size={20} />
            </Button>
            <span className="purchase-note">
              Monte sua seleção. As vendas abrem em breve.
            </span>
          </div>
          <div className="shipping-box">
            <h3>ENTREGA NO SEU ENDEREÇO</h3>
            <form
              noValidate
              onSubmit={(e) => {
                e.preventDefault();
                setShipping(
                  /^\d{5}-?\d{3}$/.test(cep)
                    ? 'CEP válido. Frete e prazo serão disponibilizados na abertura das vendas.'
                    : 'Digite um CEP válido com 8 números.',
                );
              }}
            >
              <Input
                aria-label="CEP para consulta de entrega"
                inputMode="numeric"
                autoComplete="postal-code"
                placeholder="00000-000"
                value={cep}
                maxLength={9}
                onChange={(e) => {
                  const digits = e.target.value.replace(/\D/g, '').slice(0, 8);
                  setCep(
                    digits.length > 5
                      ? `${digits.slice(0, 5)}-${digits.slice(5)}`
                      : digits,
                  );
                  setShipping('');
                }}
              />
              <Button type="submit" variant="outline">
                CONSULTAR <ArrowRight size={14} />
              </Button>
            </form>
            <p className="form-feedback" role="status">
              {shipping}
            </p>
          </div>
          <div className="product-accordions">
            <details>
              <summary>
                A peça em detalhe <Plus size={16} />
              </summary>
              <p>{p.description}</p>
              <p>
                Composição, gramatura e orientações de cuidado serão confirmadas
                na ficha técnica oficial.
              </p>
            </details>
            <details>
              <summary>
                Trocas e devoluções <Plus size={16} />
              </summary>
              <p>
                A política oficial será publicada antes da abertura das vendas.
                Nenhuma condição comercial é aplicada nesta prévia.
              </p>
            </details>
            <details>
              <summary>
                Sobre a coleção 001 <Plus size={16} />
              </summary>
              <p>
                Concrete After Dark. Sete peças conectadas pelo concreto, pela
                fotografia e pelo movimento de quem vive a cidade.
              </p>
            </details>
          </div>
        </div>
      </div>
      <section className="related-products">
        <div className="section-heading">
          <div>
            <p className="eyebrow">NA MESMA FREQUÊNCIA</p>
            <h2>COMPLETE SUA EXPRESSÃO.</h2>
          </div>
          <Link href="/#colecao" className="text-link">
            VER A COLEÇÃO <ArrowUpRight size={17} />
          </Link>
        </div>
        <div className="product-grid">
          {products
            .filter((x) => x.id !== p.id)
            .slice(0, 4)
            .map((x) => (
              <article className="product-card" key={x.id}>
                <div className="product-visual">
                  <FavoriteButton product={x} />
                  <Link href={`/produto/${x.id}`}>
                    <img
                      src={productImage(x)}
                      alt={x.name}
                      width={300}
                      height={340}
                      loading="lazy"
                    />
                  </Link>
                </div>
                <div className="product-info">
                  <Link href={`/produto/${x.id}`}>
                    <h3>{x.name}</h3>
                  </Link>
                  <ArrowUpRight size={17} />
                  <p>{money(x.price)}</p>
                </div>
              </article>
            ))}
        </div>
      </section>
      <Dialog open={zoom} onOpenChange={setZoom}>
        <DialogContent className="zoom-dialog">
          <DialogTitle>{p.name}</DialogTitle>
          <DialogDescription>Vista frontal · {p.color}</DialogDescription>
          <img
            src={productImage(p)}
            alt={`${p.name}, imagem ampliada`}
            width={560}
            height={620}
          />
        </DialogContent>
      </Dialog>
    </main>
  );
}
