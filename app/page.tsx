'use client';
import { useEffect, useRef, useState } from 'react';
import { ArrowDown, ArrowUp, ArrowUpRight, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { contactLinks, projects } from '@/lib/portfolio';
const navigation = [
  ['Sobre', '#sobre'],
  ['Serviços', '#servicos'],
  ['Projetos', '#projetos'],
];
function Brand() {
  return (
    <span className="brand-image">
      <img
        src="brand/logo-escuro.png"
        alt="Lume Studio"
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
          <p className="eyebrow">
            <span className="small-line" />
            Design & desenvolvimento web
          </p>
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
          <div className="hero-footnote">
            <span>Da primeira ideia ao último detalhe.</span>
            <span>Design com intenção. Código com cuidado.</span>
          </div>
        </section>
        <section
          className="projects-section wrap section-space"
          id="projetos"
          aria-labelledby="projects-title"
        >
          <div className="section-heading">
            <div>
              <p className="eyebrow">01 / Portfólio</p>
              <h2 id="projects-title">
                Ideias que ganharam <em>forma.</em>
              </h2>
            </div>
            <p>
              Universos diferentes.
              <br />O mesmo cuidado em cada projeto.
            </p>
          </div>
          <div className="project-grid">
            {projects.map((project, index) => (
              <article
                className={`project ${project.featured ? 'project-wide' : ''}`}
                key={project.id}
              >
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`project-image project-${project.id}`}
                  aria-label={`Visualizar ${project.name} — abre em nova aba`}
                >
                  <div className="project-preview">
                    <img
                      src={project.image}
                      alt={project.imageAlt}
                      width="1440"
                      height="960"
                      loading="lazy"
                    />
                  </div>
                  <span className="project-open">
                    <ArrowUpRight size={22} aria-hidden="true" />
                  </span>
                  {project.status && (
                    <span className="project-status">{project.status}</span>
                  )}
                </a>
                <div className="project-meta">
                  <span>{project.category}</span>
                  <span className="project-number">
                    /{String(index + 1).padStart(2, '0')}
                  </span>
                </div>
                <h3>
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {project.name}
                    <ArrowUpRight size={23} aria-hidden="true" />
                    <span className="sr-only"> — abre em nova aba</span>
                  </a>
                </h3>
                <p className="project-description">{project.description}</p>
              </article>
            ))}
          </div>
          <p className="portfolio-note">
            Explore as interfaces. Projetos conceituais e demonstrativos estão
            identificados em cada trabalho.
          </p>
        </section>
        <section
          className="about-section"
          id="sobre"
          aria-labelledby="about-title"
        >
          <div className="wrap about-grid section-space">
            <div>
              <p className="eyebrow">02 / Sobre a Lume</p>
              <h2 id="about-title">
                Um olhar atento.
                <br />
                Do design
                <br />
                ao <em>código.</em>
              </h2>
            </div>
            <div className="about-copy">
              <span className="about-kicker">
                O cuidado aparece nos detalhes.
              </span>
              <p>
                A Lume Studio é um estúdio de desenvolvimento de sites e landing
                pages. Aqui, design e desenvolvimento caminham juntos para
                transformar ideias em experiências claras, bonitas e fáceis de
                usar.
              </p>
              <p>
                Cada projeto começa com escuta: entender o que você quer
                comunicar, organizar o conteúdo e encontrar a melhor forma de
                apresentá-lo. Do primeiro esboço à navegação no celular, cada
                escolha tem um motivo.
              </p>
              <a className="text-link" href="#servicos">
                O que podemos criar juntos{' '}
                <ArrowDown size={18} aria-hidden="true" />
              </a>
            </div>
          </div>
        </section>
        <section
          className="services-section wrap section-space"
          id="servicos"
          aria-labelledby="services-title"
        >
          <div className="section-heading">
            <div>
              <p className="eyebrow">03 / Serviços</p>
              <h2 id="services-title">
                O próximo passo
                <br />
                para a sua <em>ideia.</em>
              </h2>
            </div>
            <p>
              Uma presença digital pensada
              <br />
              para o que você precisa.
            </p>
          </div>
          <div className="service-list">
            {[
              [
                '01',
                'Sites institucionais',
                'Um espaço para apresentar sua marca, contar sua história e ajudar as pessoas a encontrar o que procuram.',
                'Presença & identidade',
              ],
              [
                '02',
                'Landing pages',
                'Páginas com uma mensagem clara, conteúdo bem organizado e um caminho direto para a ação que importa.',
                'Clareza & direção',
              ],
              [
                '03',
                'Interfaces digitais',
                'Telas e experiências para produtos digitais, com atenção à navegação, à hierarquia e ao uso no dia a dia.',
                'Experiência & interação',
              ],
            ].map(([number, title, description, note]) => (
              <article className="service-row" key={number}>
                <span className="service-number">{number}</span>
                <div>
                  <h3>{title}</h3>
                  <span className="service-note">{note}</span>
                </div>
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
          <p className="services-footnote">
            Design e desenvolvimento, com atenção ao desktop e ao celular.
          </p>
        </section>
        <section
          className="contact-section"
          id="contato"
          aria-labelledby="contact-title"
        >
          <div className="wrap section-space contact-inner">
            <p className="eyebrow">04 / Vamos conversar</p>
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
          <p>
            Boas ideias merecem
            <br />
            uma boa presença digital.
          </p>
          <a className="back-top" href="#topo">
            Voltar ao topo <ArrowUp size={17} aria-hidden="true" />
          </a>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Lume Studio</span>
          <span>Design & desenvolvimento web</span>
          <span>Feito com intenção.</span>
        </div>
      </footer>
    </>
  );
}
