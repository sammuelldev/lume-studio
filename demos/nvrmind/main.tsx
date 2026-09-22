import { createRoot } from 'react-dom/client';
import Home from './app/page';
import { StoreProvider } from './components/shop/store';
import { ProductDetail } from './components/shop/product-detail';
import { products } from './lib/products';
import './app/globals.css';
const slug = new URLSearchParams(window.location.search).get('produto');
const product = products.find((item) => item.id === slug);
document.title = product
  ? `${product.name} — NVRMIND`
  : 'NVRMIND — Prévia demonstrativa';
createRoot(document.getElementById('root')!).render(
  <StoreProvider>
    {product ? (
      <ProductDetail key={product.id} product={product} />
    ) : slug ? (
      <main id="conteudo" style={{ padding: '100px 24px' }}>
        <h1>Peça não encontrada</h1>
        <a href="./index.html">Voltar à coleção</a>
      </main>
    ) : (
      <Home />
    )}
  </StoreProvider>,
);
