'use client';
import { useState } from 'react';
import Link from '@nvr/link';
import { ArrowUpRight, Plus, Heart, SlidersHorizontal } from 'lucide-react';
import { Button } from '@nvr/components/ui/button';
import {
  NativeSelect,
  NativeSelectOption,
} from '@nvr/components/ui/native-select';
import { products, categories, money, productImage } from '@nvr/lib/products';
import { FavoriteButton, useStore } from './store';

export function Catalog() {
  const [category, setCategory] = useState('Todas as peças'),
    [order, setOrder] = useState('collection'),
    [onlyFavorites, setOnlyFavorites] = useState(false);
  const { favorites } = useStore();
  const visible = products
    .filter(
      (p) =>
        (category === 'Todas as peças' || p.category === category) &&
        (!onlyFavorites || favorites.includes(p.id)),
    )
    .sort((a, b) =>
      order === 'low'
        ? a.price - b.price
        : order === 'high'
          ? b.price - a.price
          : 0,
    );
  return (
    <section className="collection" id="colecao">
      <div className="section-heading">
        <div>
          <p className="eyebrow">[ 01 / O PRIMEIRO CAPÍTULO ]</p>
          <h2>SEM PEDIR LICENÇA.</h2>
        </div>
        <span className="collection-note">
          SETE PEÇAS. UMA MESMA FREQUÊNCIA.
          <br />
          CONCRETE AFTER DARK / 001
        </span>
      </div>
      <div className="catalog-toolbar">
        <div
          className="category-tabs"
          role="group"
          aria-label="Filtrar por categoria"
        >
          {categories.map((c) => (
            <Button
              variant="ghost"
              key={c}
              className={category === c ? 'selected' : ''}
              aria-pressed={category === c}
              onClick={() => setCategory(c)}
            >
              {c}
            </Button>
          ))}
        </div>
        <div className="catalog-controls">
          <Button
            variant="ghost"
            className={`saved-filter ${onlyFavorites ? 'selected' : ''}`}
            aria-pressed={onlyFavorites}
            aria-label="Mostrar apenas favoritos"
            onClick={() => setOnlyFavorites((v) => !v)}
          >
            <Heart size={15} />
            <span>Salvos ({favorites.length})</span>
          </Button>
          <label className="sort-label">
            <SlidersHorizontal size={14} />
            <span className="sr-only">Ordenar produtos</span>
            <NativeSelect
              value={order}
              onChange={(e) => setOrder(e.target.value)}
            >
              <NativeSelectOption value="collection">
                Ordem da coleção
              </NativeSelectOption>
              <NativeSelectOption value="low">Menor preço</NativeSelectOption>
              <NativeSelectOption value="high">Maior preço</NativeSelectOption>
            </NativeSelect>
          </label>
        </div>
      </div>
      <p className="result-count" aria-live="polite">
        {visible.length} {visible.length === 1 ? 'peça' : 'peças'}{' '}
        {onlyFavorites ? 'salvas' : ''}
      </p>
      <div className="product-grid">
        {visible.map((p) => (
          <article className="product-card" key={p.id}>
            <div className="product-visual">
              <span className="product-number">
                {String(products.indexOf(p) + 1).padStart(3, '0')} / NVR
              </span>
              <FavoriteButton product={p} />
              <Link href={`/produto/${p.id}`} aria-label={`Ver ${p.name}`}>
                <img
                  src={productImage(p)}
                  alt={`${p.name}, ${p.color.toLowerCase()}`}
                  loading="lazy"
                  width={300}
                  height={340}
                />
                <span className="quick-add">
                  ESCOLHER TAMANHO <Plus size={16} />
                </span>
              </Link>
            </div>
            <div className="product-info">
              <Link href={`/produto/${p.id}`}>
                <h3>{p.name}</h3>
              </Link>
              <Link
                href={`/produto/${p.id}`}
                aria-label={`Ver detalhes de ${p.name}`}
              >
                <ArrowUpRight size={18} />
              </Link>
              <p>{money(p.price)}</p>
              <span className="product-color">
                <i
                  style={{
                    background: p.color === 'Cru' ? '#d5d0c5' : '#242522',
                  }}
                />
                {p.color}
              </span>
            </div>
          </article>
        ))}
        {!onlyFavorites && category === 'Todas as peças' && (
          <a href="#manifesto" className="manifesto-card">
            <span className="eyebrow">NVRMIND® / EM MOVIMENTO</span>
            <h3>
              MAIS QUE
              <br />
              ROUPAS.
              <br />
              <em>
                UM
                <br />
                MOVIMENTO.
              </em>
            </h3>
            <span>
              CONHEÇA O QUE NOS MOVE <ArrowUpRight size={21} />
            </span>
          </a>
        )}
      </div>
      {!visible.length && (
        <div className="empty-results">
          <Heart size={30} strokeWidth={1} />
          <h3>NENHUMA PEÇA POR AQUI. AINDA.</h3>
          <p>Use o coração para guardar o que combina com você.</p>
          <Button
            className="cta"
            onClick={() => {
              setCategory('Todas as peças');
              setOnlyFavorites(false);
            }}
          >
            EXPLORAR TODAS AS PEÇAS <ArrowUpRight />
          </Button>
        </div>
      )}
    </section>
  );
}
