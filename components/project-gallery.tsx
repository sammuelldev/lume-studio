'use client';

/* oxlint-disable nextjs/no-img-element -- Capturas locais com dimensões explícitas; o mesmo componente atende ao build estático sem servidor de imagens. */
/* oxlint-disable jsx-a11y/prefer-tag-over-role -- Grupos nomeados representam os slides e controles do carrossel, sem semântica de formulário. */
/* oxlint-disable jsx-a11y/no-noninteractive-tabindex -- A área rolável recebe foco para oferecer navegação por setas, Home e End. */
/* oxlint-disable jsx-a11y/no-noninteractive-element-interactions -- O grupo rolável suporta arraste e teclado; as ações continuam em botões nativos. */

import { useEffect, useRef, useState, type PointerEvent } from 'react';
import { Dialog } from '@base-ui/react/dialog';
import { ArrowLeft, ArrowRight, Maximize2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Project } from '@/lib/portfolio';

export function ProjectGallery({ project }: { project: Project }) {
  const photos = project.gallery.slice(0, 6);
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(false);
  const activeRef = useRef(active);
  const track = useRef<HTMLDivElement>(null);
  const drag = useRef({ x: 0, scroll: 0, down: false, moved: false });
  const zoomStart = useRef<number | null>(null);
  const scrollingTo = useRef<number | null>(null);

  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  function goTo(index: number) {
    const next = Math.max(0, Math.min(photos.length - 1, index));
    setActive(next);
    scrollingTo.current = next;
    const rail = track.current;
    rail?.scrollTo({
      left: rail.clientWidth * next,
      behavior:
        open || window.matchMedia('(prefers-reduced-motion: reduce)').matches
          ? 'instant'
          : 'smooth',
    });
  }

  useEffect(() => {
    const rail = track.current;
    if (!rail) return;
    let width = rail.clientWidth;
    const observer = new ResizeObserver(() => {
      if (rail.clientWidth === width) return;
      width = rail.clientWidth;
      rail.scrollTo({ left: width * activeRef.current, behavior: 'instant' });
    });
    observer.observe(rail);
    return () => observer.disconnect();
  }, []);

  function finishDrag(event: PointerEvent<HTMLDivElement>) {
    if (!drag.current.down) return;
    drag.current.down = false;
    event.currentTarget.classList.remove('is-dragging');
    if (event.currentTarget.hasPointerCapture(event.pointerId))
      event.currentTarget.releasePointerCapture(event.pointerId);
    const nearest = Math.round(
      event.currentTarget.scrollLeft / event.currentTarget.clientWidth,
    );
    goTo(nearest);
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <section
        className={`gallery gallery-${project.id}`}
        aria-label={`Galeria de ${project.name}`}
        aria-roledescription="carrossel"
      >
        <div className="gallery-surface">
          <div
            ref={track}
            className="gallery-track"
            role="group"
            tabIndex={0}
            aria-label={`Imagens de ${project.name}. Use as setas do teclado para navegar.`}
            onScroll={(event) => {
              const rail = event.currentTarget;
              if (scrollingTo.current !== null) {
                if (
                  Math.abs(
                    rail.scrollLeft - rail.clientWidth * scrollingTo.current,
                  ) > 2
                )
                  return;
                scrollingTo.current = null;
              }
              setActive(
                Math.max(
                  0,
                  Math.min(
                    photos.length - 1,
                    Math.round(rail.scrollLeft / rail.clientWidth),
                  ),
                ),
              );
            }}
            onKeyDown={(event) => {
              if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
                event.preventDefault();
                goTo(active + (event.key === 'ArrowRight' ? 1 : -1));
              }
              if (event.key === 'Home' || event.key === 'End') {
                event.preventDefault();
                goTo(event.key === 'Home' ? 0 : photos.length - 1);
              }
            }}
            onPointerDown={(event) => {
              drag.current.moved = false;
              scrollingTo.current = null;
              if (event.pointerType !== 'mouse' || event.button !== 0) return;
              drag.current = {
                x: event.clientX,
                scroll: event.currentTarget.scrollLeft,
                down: true,
                moved: false,
              };
            }}
            onPointerMove={(event) => {
              if (!drag.current.down) return;
              const distance = event.clientX - drag.current.x;
              if (Math.abs(distance) > 8) {
                drag.current.moved = true;
                event.currentTarget.setPointerCapture(event.pointerId);
                event.currentTarget.classList.add('is-dragging');
                event.currentTarget.scrollLeft = drag.current.scroll - distance;
              }
            }}
            onPointerUp={finishDrag}
            onPointerCancel={finishDrag}
            onClickCapture={(event) => {
              if (drag.current.moved) {
                event.preventDefault();
                event.stopPropagation();
              }
            }}
          >
            {photos.map((photo, index) => (
              <div
                key={photo.src}
                className="gallery-slide"
                role="group"
                aria-roledescription="slide"
                aria-label={`${index + 1} de ${photos.length}: ${photo.label}`}
              >
                <Dialog.Trigger
                  className="gallery-image-button"
                  tabIndex={active === index ? 0 : -1}
                  aria-label={`Ampliar ${photo.label} de ${project.name}`}
                >
                  <img
                    src={photo.src}
                    alt={photo.alt}
                    width={photo.width}
                    height={photo.height}
                    loading="lazy"
                    draggable={false}
                  />
                  <span className="gallery-image-hint">
                    <Maximize2 size={17} aria-hidden="true" /> Ampliar
                  </span>
                </Dialog.Trigger>
              </div>
            ))}
          </div>
          {project.status && (
            <span className="project-status">{project.status}</span>
          )}
        </div>
        <div className="gallery-caption">
          <span aria-live="polite" aria-atomic="true">
            {photos[active]?.label}
          </span>
          <span className="gallery-count">
            {String(active + 1).padStart(2, '0')}{' '}
            <span>/ {String(photos.length).padStart(2, '0')}</span>
          </span>
        </div>
        <div className="gallery-controls">
          <div
            className="gallery-dots"
            role="group"
            aria-label={`Escolher imagem de ${project.name}`}
          >
            {photos.map((photo, index) => (
              <button
                type="button"
                key={photo.src}
                className="gallery-dot"
                aria-label={`Imagem ${index + 1}: ${photo.label}`}
                aria-current={active === index ? 'true' : undefined}
                onClick={() => goTo(index)}
              >
                <span />
              </button>
            ))}
          </div>
          <div className="gallery-arrows">
            <Button
              variant="ghost"
              className="gallery-arrow"
              disabled={active === 0}
              onClick={() => goTo(active - 1)}
              aria-label={`Imagem anterior de ${project.name}`}
            >
              <ArrowLeft size={19} aria-hidden="true" />
            </Button>
            <Button
              variant="ghost"
              className="gallery-arrow"
              disabled={active === photos.length - 1}
              onClick={() => goTo(active + 1)}
              aria-label={`Próxima imagem de ${project.name}`}
            >
              <ArrowRight size={19} aria-hidden="true" />
            </Button>
          </div>
        </div>
      </section>
      <Dialog.Portal>
        <Dialog.Backdrop className="gallery-backdrop" />
        <Dialog.Popup
          className="gallery-dialog"
          onKeyDown={(event) => {
            if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
              event.preventDefault();
              goTo(active + (event.key === 'ArrowRight' ? 1 : -1));
            }
          }}
        >
          <div className="gallery-dialog-heading">
            <div>
              <Dialog.Title>{project.name}</Dialog.Title>
              <Dialog.Description>
                {photos[active]?.label} · {active + 1} de {photos.length}
              </Dialog.Description>
            </div>
            <Dialog.Close
              render={
                <Button
                  variant="ghost"
                  className="gallery-close"
                  aria-label="Fechar galeria"
                />
              }
            >
              <X size={23} aria-hidden="true" />
            </Dialog.Close>
          </div>
          <div
            className="gallery-dialog-image"
            onPointerDown={(event) => {
              zoomStart.current = event.clientX;
            }}
            onPointerUp={(event) => {
              if (zoomStart.current === null) return;
              const delta = event.clientX - zoomStart.current;
              if (Math.abs(delta) > 50) goTo(active + (delta < 0 ? 1 : -1));
              zoomStart.current = null;
            }}
            onPointerCancel={() => {
              zoomStart.current = null;
            }}
          >
            <img
              key={photos[active]?.src}
              src={photos[active]?.src}
              alt={photos[active]?.alt}
              draggable={false}
            />
          </div>
          <div className="gallery-dialog-controls">
            <Button
              variant="ghost"
              className="gallery-arrow"
              disabled={active === 0}
              onClick={() => goTo(active - 1)}
              aria-label="Imagem anterior"
            >
              <ArrowLeft size={22} aria-hidden="true" />
            </Button>
            <span aria-live="polite" aria-atomic="true">
              {photos[active]?.label}
            </span>
            <Button
              variant="ghost"
              className="gallery-arrow"
              disabled={active === photos.length - 1}
              onClick={() => goTo(active + 1)}
              aria-label="Próxima imagem"
            >
              <ArrowRight size={22} aria-hidden="true" />
            </Button>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
