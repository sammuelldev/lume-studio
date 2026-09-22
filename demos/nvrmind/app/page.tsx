import { ArrowUpRight, ArrowDown, Globe2 } from 'lucide-react';
import { Catalog } from '@nvr/components/shop/catalog';
export default function Home() {
  return (
    <main id="conteudo">
      <section className="hero">
        <img
          className="hero-photo"
          src="./images/13_lookbook_group.webp"
          alt="Quatro pessoas vestindo NVRMIND em um estacionamento de concreto"
          width={1100}
          height={758}
          fetchPriority="high"
        />
        <div className="hero-shade" />
        <div className="hero-top">
          <span>
            <i /> COLEÇÃO 001 — CONCRETE AFTER DARK
          </span>
          <span>08°03′ S / 34°52′ O</span>
        </div>
        <div className="hero-copy">
          <p className="eyebrow">ROUPAS PARA QUEM VÊ ALÉM.</p>
          <h1>
            A CIDADE
            <br />É <em>NOSSA.</em>
          </h1>
          <p>
            Pra quem encontra beleza no caos.
            <br />E faz da rua o próprio caminho.
          </p>
          <a className="cta light" href="#colecao">
            EXPLORAR A COLEÇÃO <ArrowUpRight size={20} />
          </a>
        </div>
        <div className="hero-bottom">
          <span>
            NVRMIND® — EST. 2024
            <br />
            MODA INDEPENDENTE / RECIFE, BR
          </span>
          <span className="hero-index">[ 001 — 007 ]</span>
          <a href="#colecao" aria-label="Ir para os produtos">
            <ArrowDown size={23} />
          </a>
        </div>
      </section>
      <div className="ticker">
        <span>DO CONCRETO. DO CAOS. DA RUA.</span>
        <span aria-hidden="true">✳</span>
        <span>MAIS QUE ROUPAS. UM MOVIMENTO.</span>
        <span aria-hidden="true">✳</span>
        <span>FEITO DO RUÍDO.</span>
        <span aria-hidden="true">✳</span>
      </div>
      <Catalog />
      <section className="manifesto" id="manifesto">
        <div className="manifesto-image">
          <img
            src="./images/03_campaign_portrait.webp"
            alt="Retrato urbano NVRMIND: mesma cidade, diferente mentalidade"
            width={494}
            height={744}
            loading="lazy"
          />
          <span className="photo-label">
            RECIFE, BR / A RUA É O PONTO DE PARTIDA.
          </span>
        </div>
        <div className="manifesto-copy">
          <div className="manifesto-top">
            <p className="eyebrow">[ 02 / DE ONDE VEM O RUÍDO ]</p>
            <Globe2 size={34} strokeWidth={0.8} />
          </div>
          <h2>
            NÃO É SOBRE
            <br />
            SE ENCAIXAR.
            <br />
            <em>
              É SOBRE
              <br />
              SE EXPRESSAR.
            </em>
          </h2>
          <p>
            A gente vem do concreto. Da música que atravessa a madrugada. Do
            skate riscando o chão. De quem enxerga arte onde todo mundo só vê
            parede.
          </p>
          <p>
            A NVRMIND existe pra vestir esse olhar.
            <br />
            Independente. Inquieta. Em movimento.
          </p>
          <a className="text-link" href="#editorial">
            ENTRE NO NOSSO UNIVERSO <ArrowUpRight size={18} />
          </a>
          <div className="manifesto-signature">
            <span>
              NVRMIND®
              <br />
              EST. 2024
            </span>
            <span>SONHE. CRIE. VISTA. REPITA.</span>
          </div>
        </div>
      </section>
      <section className="editorial" id="editorial">
        <div className="section-heading">
          <div>
            <p className="eyebrow">[ 03 / REGISTROS DO NOSSO MUNDO ]</p>
            <h2>A RUA NÃO PARA.</h2>
          </div>
          <span className="collection-note">
            SEM ROTEIRO.
            <br />
            SEM FILTRO.
          </span>
        </div>
        <div className="editorial-grid">
          <figure className="editorial-wide">
            <img
              src="./images/13_lookbook_group.webp"
              alt="O coletivo NVRMIND ocupa a arquitetura de concreto da cidade"
              width={550}
              height={379}
              loading="lazy"
            />
            <figcaption>
              <span>001 — QUEM FAZ O MOVIMENTO</span>
              <span>RECIFE / BR</span>
            </figcaption>
          </figure>
          <figure>
            <img
              src="./images/15_packaging_tag.webp"
              alt="Etiqueta NVRMIND presa a uma grade, parte da identidade da coleção"
              width={243}
              height={379}
              loading="lazy"
            />
            <figcaption>002 — DO RUÍDO À FORMA</figcaption>
          </figure>
          <figure>
            <img
              src="./images/16_packaging_box.webp"
              alt="Conceito de embalagem NVRMIND com cartão de agradecimento"
              width={377}
              height={379}
              loading="lazy"
            />
            <figcaption>003 — CADA DETALHE IMPORTA</figcaption>
          </figure>
        </div>
      </section>
      <section className="closing-statement">
        <p className="eyebrow">A PRÓXIMA COMPOSIÇÃO É SUA.</p>
        <h2>
          SONHE. CRIE.
          <br />
          <span>VISTA. REPITA.</span>
        </h2>
        <a className="cta light" href="#colecao">
          ENCONTRE SUA PEÇA <ArrowUpRight size={20} />
        </a>
        <span className="closing-coordinate">
          NVRMIND® / 08°03′ S — 34°52′ O
        </span>
      </section>
    </main>
  );
}
