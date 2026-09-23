/* oxlint-disable nextjs/no-img-element -- A identidade oficial é um PNG local, também utilizado pelo build estático. */
import { useId } from 'react';

export function Brand() {
  return (
    <span className="brand-image">
      <img
        className="brand-symbol"
        src="brand/logo-transparente.png"
        alt="Lume Studio"
        width="2172"
        height="724"
      />
      <img
        className="brand-letters"
        src="brand/logo-transparente.png"
        alt=""
        aria-hidden="true"
        width="2172"
        height="724"
      />
    </span>
  );
}

// O contorno é renderizado a partir do alfa da marca oficial. Não redesenha o símbolo.
export function BrandSymbol({
  outline = false,
  className = '',
}: {
  outline?: boolean;
  className?: string;
}) {
  const filterId = useId().replaceAll(':', '');
  return (
    <svg
      className={className}
      viewBox="360 110 450 480"
      aria-hidden="true"
      focusable="false"
    >
      {outline && (
        <defs>
          <filter
            id={filterId}
            x="0"
            y="0"
            width="100%"
            height="100%"
            colorInterpolationFilters="sRGB"
          >
            <feComponentTransfer in="SourceAlpha" result="alpha">
              <feFuncA type="discrete" tableValues="0 0 1 1" />
            </feComponentTransfer>
            <feMorphology
              in="alpha"
              operator="dilate"
              radius="0.7"
              result="outer"
            />
            <feMorphology
              in="alpha"
              operator="erode"
              radius="0.7"
              result="inner"
            />
            <feComposite in="outer" in2="inner" operator="out" result="edge" />
            <feGaussianBlur in="edge" stdDeviation="0.25" result="soft-edge" />
            <feFlood floodColor="currentColor" />
            <feComposite in2="soft-edge" operator="in" />
          </filter>
        </defs>
      )}
      <image
        href="brand/logo-transparente.png"
        width="2172"
        height="724"
        filter={outline ? `url(#${filterId})` : undefined}
      />
    </svg>
  );
}
