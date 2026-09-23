'use client';

/* oxlint-disable nextjs/no-img-element -- Capturas locais com dimensões explícitas; o mesmo componente atende ao build estático sem servidor de imagens. */
/* oxlint-disable jsx-a11y/prefer-tag-over-role -- Grupos nomeados representam os slides e controles do carrossel, sem semântica de formulário. */
/* oxlint-disable jsx-a11y/no-noninteractive-tabindex -- A área rolável recebe foco para oferecer navegação por setas, Home e End. */
/* oxlint-disable jsx-a11y/no-noninteractive-element-interactions -- O grupo rolável suporta arraste e teclado; as ações continuam em botões nativos. */

import { useEffect, useRef, useState, type PointerEvent } from 'react';
import { Dialog } from '@base-ui/react/dialog';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  ArrowsOut,
  House,
  X,
} from '@/components/icons';
import { Button } from '@/components/ui/button';
import type { Project } from '@/lib/portfolio';

export function ProjectGallery({
  project,
  variant = 'standard',
}: {
  project: Project;
  variant?: 'standard' | 'featured' | 'compact' | 'hero';
}) {
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
        className={`gallery gallery-${project.id} gallery-${variant}`}
        aria-label={`${variant === 'hero' ? 'Prévia' : 'Galeria'} de ${project.name}`}
        aria-roledescription="carrossel"
      >
        <div className="gallery-media">
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
                  event.currentTarget.scrollLeft =
                    drag.current.scroll - distance;
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
                    onClick={() => goTo(index)}
                    tabIndex={active === index ? 0 : -1}
                    aria-label={`Ampliar ${photo.label} de ${project.name}`}
                  >
                    <img
                      src={photo.src}
                      alt={photo.alt}
                      width={photo.width}
                      height={photo.height}
                      loading={
                        variant === 'hero' && index === 0 ? 'eager' : 'lazy'
                      }
                      fetchPriority={
                        variant === 'hero' && index === 0 ? 'high' : undefined
                      }
                      draggable={false}
                    />
                    <span className="gallery-image-hint">
                      <ArrowsOut size={20} weight="light" aria-hidden="true" />{' '}
                      Ampliar
                    </span>
                  </Dialog.Trigger>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="gallery-details">
          <div className="gallery-controls">
            <span
              className="gallery-count mono"
              aria-live="polite"
              aria-atomic="true"
            >
              <span className="sr-only">{photos[active]?.label}. Imagem </span>
              {String(active + 1).padStart(2, '0')}{' '}
              <span>/ {String(photos.length).padStart(2, '0')}</span>
            </span>
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
                <ArrowLeft size={24} weight="light" aria-hidden="true" />
              </Button>
              <Button
                variant="ghost"
                className="gallery-arrow"
                disabled={active === photos.length - 1}
                onClick={() => goTo(active + 1)}
                aria-label={`Próxima imagem de ${project.name}`}
              >
                <ArrowRight size={24} weight="light" aria-hidden="true" />
              </Button>
            </div>
          </div>
          <div className="project-info">
            {project.status && (
              <p className="project-status">{project.status}</p>
            )}
            <h3>
              <Dialog.Trigger
                className="project-title-button"
                aria-label={`Explorar galeria de ${project.name}`}
              >
                <span>{project.name}</span>
                <ArrowUpRight size={36} weight="light" aria-hidden="true" />
              </Dialog.Trigger>
            </h3>
            <p className="project-category">{project.category}</p>
            <p className="project-description">{project.description}</p>
            {variant === 'featured' && (
              <Dialog.Trigger className="text-link underlined project-explore">
                Explorar projeto{' '}
                <ArrowUpRight size={24} weight="light" aria-hidden="true" />
              </Dialog.Trigger>
            )}
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
              {project.status && <p className="eyebrow">{project.status}</p>}
              <Dialog.Title>{project.name}</Dialog.Title>
              <Dialog.Description>{project.category}</Dialog.Description>
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
              <span className="close-circle">
                <X size={28} weight="light" aria-hidden="true" />
              </span>
              <span>Fechar</span>
            </Dialog.Close>
          </div>
          <div className="gallery-dialog-stage">
            <Button
              variant="ghost"
              className="gallery-arrow dialog-prev"
              disabled={active === 0}
              onClick={() => goTo(active - 1)}
              aria-label="Imagem anterior"
            >
              <ArrowLeft size={36} weight="light" aria-hidden="true" />
            </Button>
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
            <Button
              variant="ghost"
              className="gallery-arrow dialog-next"
              disabled={active === photos.length - 1}
              onClick={() => goTo(active + 1)}
              aria-label="Próxima imagem"
            >
              <ArrowRight size={36} weight="light" aria-hidden="true" />
            </Button>
          </div>
          <div className="gallery-dialog-controls">
            <span
              className="dialog-caption"
              aria-live="polite"
              aria-atomic="true"
            >
              <House size={24} weight="light" aria-hidden="true" />
              {photos[active]?.label}
            </span>
            <div
              className="gallery-dots"
              role="group"
              aria-label="Escolher imagem ampliada"
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
            <span className="dialog-count mono">
              <span className="sr-only">
                Imagem {active + 1} de {photos.length}.{' '}
              </span>
              {String(active + 1).padStart(2, '0')} /{' '}
              {String(photos.length).padStart(2, '0')}
            </span>
          </div>
          <p className="gallery-dialog-help">
            Use as setas para navegar <span aria-hidden="true">·</span> Esc para
            fechar
          </p>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
