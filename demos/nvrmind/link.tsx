import type { AnchorHTMLAttributes } from 'react';
// Adapta somente a navegação da cópia para hospedagem estática em subpastas.
export default function Link({
  href = '',
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement>) {
  const destination = href.startsWith('/produto/')
    ? `./index.html?produto=${encodeURIComponent(href.slice('/produto/'.length))}`
    : href.startsWith('/')
      ? `./index.html${href.slice(1)}`
      : href;
  return <a href={destination} {...props} />;
}
