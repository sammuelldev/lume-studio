'use client';
/* oxlint-disable nextjs/no-img-element -- A logo PNG local preserva o alfa e funciona no build estático, sem serviço de otimização de imagens. */
import { useEffect, useRef, useState } from 'react';
import { ArrowDown, ArrowUp, ArrowUpRight, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProjectGallery } from '@/components/project-gallery';
import { contactLinks, projects } from '@/lib/portfolio';

const navigation = [
  ['Projetos', '#projetos'],
  ['Serviços', '#servicos'],
];
function Brand() {
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

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const close = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && menuOpen) {
        setMenuOpen(false);
        menuButton.current?.focus();
      }
    };
    document.addEventListener('keydown', close);
    return () => document.removeEventListener('keydown', close);
  }, [menuOpen]);

  return (
    <>
      <a className="skip-link" href="#conteudo">
        Pular para o conteúdo
      </a>
      <header className="site-header" id="topo">
        <div className="header-inner wrap">
          <a href="#topo" className="brand" aria-label="Lume Studio — início">
            <Brand />
          </a>
          <nav className="desktop-nav" aria-label="Navegação principal">
            {navigation.map(([label, href]) => (
              <a key={href} href={href}>
                {label}
              </a>
            ))}
          </nav>
          <a className="header-contact" href="#contato">
            Vamos conversar <ArrowUpRight size={17} aria-hidden="true" />
          </a>
          <Button
            ref={menuButton}
            variant="ghost"
            className="menu-toggle"
            aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={menuOpen}
            aria-controls="menu-mobile"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </Button>
        </div>
        <nav
          id="menu-mobile"
          className="mobile-nav wrap"
          aria-label="Navegação no celular"
          hidden={!menuOpen}
        >
          {[...navigation, ['Vamos conversar', '#contato']].map(
            ([label, href]) => (
              <a key={href} href={href} onClick={() => setMenuOpen(false)}>
                {label}
                <ArrowUpRight size={18} aria-hidden="true" />
              </a>
            ),
          )}
        </nav>
      </header>

      <main id="conteudo">
        <section className="hero wrap" aria-labelledby="hero-title">
          <div className="hero-art" aria-hidden="true" />
          <h1 id="hero-title">
            Boas ideias.
            <br />
            Sites <span>à altura.</span>
          </h1>
          <div className="hero-bottom">
            <p>
              Criamos sites com personalidade, organização e cuidado com cada
              detalhe. Para dar forma à sua ideia e fazer sentido para quem
              navega.
            </p>
            <div className="hero-actions">
              <a className="button primary" href="#projetos">
                Conheça os projetos <ArrowDown size={18} aria-hidden="true" />
              </a>
              <a className="text-link" href="#contato">
                Vamos conversar <ArrowUpRight size={18} aria-hidden="true" />
              </a>
            </div>
          </div>
        </section>

        <section
          className="projects-section wrap section-space"
          id="projetos"
          aria-labelledby="projects-title"
        >
          <div className="section-heading">
            <div>
              <p className="eyebrow">Projetos selecionados</p>
              <h2 id="projects-title">
                Ideias que ganharam <em>forma.</em>
              </h2>
            </div>
          </div>
          <div className="project-grid">
            {projects.map((project) => (
              <article
                className={`project ${project.featured ? 'project-wide' : ''}`}
                key={project.id}
              >
                <ProjectGallery project={project} />
                <div className="project-info">
                  <p className="project-category">{project.category}</p>
                  <h3>{project.name}</h3>
                  <p className="project-description">{project.description}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section
          className="services-section wrap section-space"
          id="servicos"
          aria-labelledby="services-title"
        >
          <div className="section-heading">
            <div>
              <p className="eyebrow">Serviços</p>
              <h2 id="services-title">
                O próximo passo
                <br />
                para a sua <em>ideia.</em>
              </h2>
            </div>
          </div>
          <div className="service-list">
            {[
              [
                '01',
                'Sites institucionais',
                'Um espaço para apresentar sua marca, contar sua história e ajudar as pessoas a encontrar o que procuram.',
              ],
              [
                '02',
                'Landing pages',
                'Páginas com uma mensagem clara, conteúdo bem organizado e um caminho direto para a ação que importa.',
              ],
              [
                '03',
                'Interfaces digitais',
                'Telas e experiências para produtos digitais, com atenção à navegação e ao uso no dia a dia.',
              ],
            ].map(([number, title, description]) => (
              <article className="service-row" key={number}>
                <span className="service-number">{number}</span>
                <h3>{title}</h3>
                <p>{description}</p>
                <ArrowUpRight
                  className="service-arrow"
                  size={28}
                  strokeWidth={1}
                  aria-hidden="true"
                />
              </article>
            ))}
          </div>
        </section>

        <section
          className="contact-section"
          id="contato"
          aria-labelledby="contact-title"
        >
          <div className="wrap section-space contact-inner">
            <p className="eyebrow">Vamos conversar</p>
            <div className="contact-heading">
              <h2 id="contact-title">
                Sua próxima ideia
                <br />
                começa <em>por aqui.</em>
              </h2>
              <ArrowUpRight size={100} strokeWidth={0.8} aria-hidden="true" />
            </div>
            <div className="contact-bottom">
              <p>
                Tem um projeto em mente?
                <br />
                Vamos pensar juntos em como colocá-lo no mundo.
              </p>
              <div className="contact-links">
                {contactLinks.length ? (
                  contactLinks.map((link) => (
                    <a
                      className="button primary"
                      key={link.url}
                      href={link.url}
                      {...(link.url.startsWith('https:')
                        ? { target: '_blank', rel: 'noopener noreferrer' }
                        : {})}
                    >
                      {link.label}
                      <ArrowUpRight size={18} aria-hidden="true" />
                    </a>
                  ))
                ) : (
                  <p className="contact-pending">
                    Nosso canal de contato será
                    <br />
                    disponibilizado em breve.
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer wrap">
        <div className="footer-top">
          <a
            href="#topo"
            className="brand"
            aria-label="Lume Studio — voltar ao início"
          >
            <Brand />
          </a>
          <a className="back-top" href="#topo">
            Voltar ao topo <ArrowUp size={17} aria-hidden="true" />
          </a>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Lume Studio</span>
          <span>Sites, landing pages e interfaces digitais.</span>
        </div>
      </footer>
    </>
  );
}
