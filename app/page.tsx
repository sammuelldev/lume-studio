'use client';
import { useEffect, useRef, useState } from 'react';
import {
  ArrowDown,
  ArrowUp,
  ArrowUpRight,
  ArrowRight,
} from '@/components/icons';
import { Button } from '@/components/ui/button';
import { Brand, BrandSymbol } from '@/components/brand';
import { ProjectGallery } from '@/components/project-gallery';
import { usePageMotion } from '@/hooks/use-page-motion';
import { contactLinks, projects } from '@/lib/portfolio';

const navigation = [
  ['Projetos', '#projetos'],
  ['Serviços', '#servicos'],
];
const featured = projects.find((project) => project.featured)!;
const firstProjects = projects.filter((project) =>
  ['mypace', 'arquibancada'].includes(project.id),
);
const remainingProjects = projects.filter(
  (project) => !project.featured && !firstProjects.includes(project),
);
const services = [
  {
    title: 'Sites institucionais',
    description:
      'Um espaço para apresentar sua marca, contar sua história e facilitar o contato.',
    details: ['Apresentação', 'Conteúdo', 'Responsividade'],
  },
  {
    title: 'Landing pages',
    description:
      'Uma mensagem clara, conteúdo bem organizado e um caminho direto para a ação.',
    details: ['Campanhas', 'Lançamentos', 'Captação'],
  },
  {
    title: 'Interfaces digitais',
    description:
      'Telas e experiências que tornam a navegação mais simples no dia a dia.',
    details: ['Produtos digitais', 'Navegação', 'Experiência'],
  },
];

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const activeSection = usePageMotion();
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
              <a
                key={href}
                href={href}
                aria-current={
                  activeSection === href.slice(1) ? 'location' : undefined
                }
              >
                {label}
              </a>
            ))}
          </nav>
          <a className="header-contact" href="#contato">
            Vamos conversar{' '}
            <ArrowUpRight size={20} weight="light" aria-hidden="true" />
          </a>
          <Button
            ref={menuButton}
            variant="ghost"
            className="menu-toggle"
            data-open={menuOpen || undefined}
            aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={menuOpen}
            aria-controls="menu-mobile"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span />
            <span />
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
              <a
                key={href}
                href={href}
                aria-current={
                  activeSection === href.slice(1) ? 'location' : undefined
                }
                onClick={() => setMenuOpen(false)}
              >
                {label}
                <ArrowUpRight size={24} weight="light" aria-hidden="true" />
              </a>
            ),
          )}
        </nav>
      </header>

      <main id="conteudo">
        <section
          className="hero wrap"
          id="apresentacao"
          aria-labelledby="hero-title"
        >
          <div className="hero-copy" data-reveal>
            <h1 id="hero-title">
              Boas ideias.
              <br />
              Sites <br />
              <em>à altura.</em>
            </h1>
            <p className="hero-description">
              Criamos sites com personalidade, organização e cuidado com cada
              detalhe. Para dar forma à sua ideia e fazer sentido para quem
              navega.
            </p>
            <div className="hero-actions">
              <a className="button primary" href="#projetos">
                Conheça os projetos{' '}
                <ArrowDown size={24} weight="light" aria-hidden="true" />
              </a>
              <a className="text-link" href="#contato">
                Vamos conversar{' '}
                <ArrowUpRight size={24} weight="light" aria-hidden="true" />
              </a>
            </div>
          </div>
          <aside
            className="hero-preview"
            aria-label="Projeto em destaque"
            data-reveal
          >
            <ProjectGallery project={featured} variant="hero" />
          </aside>
          <ul className="hero-service-strip" aria-label="O que fazemos">
            {services.map((service) => (
              <li key={service.title}>
                {service.title}
                <ArrowUpRight size={20} weight="light" aria-hidden="true" />
              </li>
            ))}
          </ul>
        </section>

        <section
          className="projects-section wrap"
          id="projetos"
          aria-labelledby="projects-title"
        >
          <div className="projects-heading" data-reveal>
            <div>
              <p className="eyebrow">Projetos selecionados</p>
              <h2 id="projects-title">
                Ideias que ganharam
                <br />
                <em>forma.</em>
              </h2>
            </div>
            <div className="projects-intro">
              <span className="mono">
                01 — {String(projects.length).padStart(2, '0')}
              </span>
              <p>
                Uma seleção de sites e experiências digitais criados pela Lume.
              </p>
            </div>
          </div>
          <div className="project-grid">
            {firstProjects.map((project) => (
              <article
                className="project"
                id={`projeto-${project.id}`}
                key={project.id}
                data-reveal
              >
                <ProjectGallery project={project} />
              </article>
            ))}
          </div>
          <div className="portfolio-continuation">
            <div className="portfolio-divider">
              <span className="eyebrow">Projetos em destaque</span>
              <span aria-hidden="true" />
            </div>
            <article
              className="project project-wide"
              id={`projeto-${featured.id}`}
              data-reveal
            >
              <ProjectGallery project={featured} variant="featured" />
            </article>
            <div className="project-grid secondary-projects">
              {remainingProjects.map((project) => (
                <article
                  className="project"
                  id={`projeto-${project.id}`}
                  key={project.id}
                  data-reveal
                >
                  <ProjectGallery project={project} variant="compact" />
                </article>
              ))}
            </div>
          </div>
        </section>

        <section
          className="services-section"
          id="servicos"
          aria-labelledby="services-title"
        >
          <div className="wrap">
            <div className="services-layout">
              <div className="services-intro" data-reveal>
                <p className="eyebrow">O que a Lume faz</p>
                <h2 id="services-title">
                  O próximo <br />
                  passo
                  <br />
                  para a sua <br />
                  <em>ideia.</em>
                </h2>
                <p className="services-description">
                  Design e desenvolvimento para apresentar sua marca e dar forma
                  ao seu projeto.
                </p>
                <a className="text-link underlined" href="#contato">
                  Vamos conversar{' '}
                  <ArrowUpRight size={24} weight="light" aria-hidden="true" />
                </a>
                <BrandSymbol className="services-symbol" />
              </div>
              <div className="service-list">
                {services.map((service, index) => (
                  <article
                    className="service-row"
                    key={service.title}
                    data-reveal
                  >
                    <span className="service-number mono">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <div>
                      <h3>{service.title}</h3>
                      <p>{service.description}</p>
                      <ul
                        className="service-details"
                        aria-label={`Detalhes de ${service.title}`}
                      >
                        {service.details.map((detail) => (
                          <li key={detail}>{detail}</li>
                        ))}
                      </ul>
                    </div>
                    <a
                      href="#contato"
                      className="service-link"
                      aria-label={`Conversar sobre ${service.title.toLowerCase()}`}
                    >
                      <ArrowRight size={48} weight="light" aria-hidden="true" />
                    </a>
                  </article>
                ))}
              </div>
            </div>
            <ul
              className="service-principles"
              aria-label="Nosso cuidado em cada projeto"
            >
              <li>Clareza no conteúdo.</li>
              <li>Personalidade no design.</li>
              <li>Cuidado no desenvolvimento.</li>
            </ul>
          </div>
        </section>

        <section
          className="contact-section"
          id="contato"
          aria-labelledby="contact-title"
        >
          <div className="wrap contact-inner">
            <BrandSymbol outline className="contact-symbol" />
            <div className="contact-content" data-reveal>
              <p className="eyebrow">Vamos conversar</p>
              <h2 id="contact-title">
                Sua próxima ideia <br />
                começa
                <br />
                <em>por aqui.</em>
              </h2>
              <p className="contact-description">
                Tem um projeto em mente?
                <br />
                Vamos pensar juntos em como colocá-lo no mundo.
              </p>
              <div className="contact-actions">
                {contactLinks.length ? (
                  contactLinks.map((link, index) => (
                    <a
                      className="button dark"
                      key={link.url}
                      href={link.url}
                      {...(link.url.startsWith('https:')
                        ? { target: '_blank', rel: 'noopener noreferrer' }
                        : {})}
                    >
                      {index === 0 ? 'Vamos conversar' : link.label}
                      <ArrowUpRight
                        size={24}
                        weight="light"
                        aria-hidden="true"
                      />
                    </a>
                  ))
                ) : (
                  <>
                    <Button
                      className="button dark contact-unavailable"
                      disabled
                      aria-describedby="contact-pending"
                    >
                      Vamos conversar{' '}
                      <ArrowUpRight
                        size={24}
                        weight="light"
                        aria-hidden="true"
                      />
                    </Button>
                    <p className="contact-pending" id="contact-pending">
                      Nosso canal de contato será disponibilizado em breve.
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="wrap">
          <div className="footer-top">
            <a
              href="#topo"
              className="brand"
              aria-label="Lume Studio — voltar ao início"
            >
              <Brand />
            </a>
            <nav className="footer-nav" aria-label="Navegação no rodapé">
              {navigation.map(([label, href]) => (
                <a key={href} href={href}>
                  {label}
                </a>
              ))}
              <a className="back-top" href="#topo">
                Voltar ao topo{' '}
                <ArrowUp size={24} weight="light" aria-hidden="true" />
              </a>
            </nav>
          </div>
          <div className="footer-bottom">
            <p>Sites, landing pages e interfaces digitais.</p>
            <p>© {new Date().getFullYear()} Lume Studio</p>
          </div>
        </div>
        <div className="footer-signature" aria-hidden="true">
          LUME STUDIO
        </div>
      </footer>
    </>
  );
}
