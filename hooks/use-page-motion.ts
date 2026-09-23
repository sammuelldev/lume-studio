'use client';
import { useEffect, useState } from 'react';

export function usePageMotion() {
  const [activeSection, setActiveSection] = useState('');
  useEffect(() => {
    if (!('IntersectionObserver' in window)) return;
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const reveals = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          // Conteúdo visível por padrão: uma falha na animação nunca o esconde.
          if (!media.matches && 'animate' in entry.target)
            entry.target.animate(
              [
                { opacity: 0.75, transform: 'translateY(16px)' },
                { opacity: 1, transform: 'translateY(0)' },
              ],
              { duration: 800, easing: 'cubic-bezier(.32,.72,0,1)' },
            );
          reveals.unobserve(entry.target);
        }
      },
      { threshold: 0.08 },
    );
    document
      .querySelectorAll('[data-reveal]')
      .forEach((element) => reveals.observe(element));

    const sections = new IntersectionObserver(
      (entries) => {
        for (const entry of entries)
          if (entry.isIntersecting) setActiveSection(entry.target.id);
      },
      { rootMargin: '-10% 0px -60% 0px', threshold: 0 },
    );
    document
      .querySelectorAll('main > section[id], #projetos')
      .forEach((element) => sections.observe(element));
    const stopMotion = () => {
      if (media.matches)
        document.getAnimations().forEach((animation) => animation.finish());
    };
    media.addEventListener('change', stopMotion);
    return () => {
      reveals.disconnect();
      sections.disconnect();
      media.removeEventListener('change', stopMotion);
    };
  }, []);
  return activeSection;
}
