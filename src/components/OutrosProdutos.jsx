import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import "./OutrosProdutos.css";
import { RevealTitle } from "./Reveal";
import { useCatalog } from "../CatalogContext";
import { COM_CARD, fotoCard } from "./CardJoia";

// "CONFIRA TAMBÉM" (Figma 27:176) como VITRINE DE LOJA: um bloco contido,
// num fundo um tom acima do preto, SEM fios (moldura em tudo lia como
// layout genérico). A hierarquia vem de espaço, escala e tipografia: 3
// peças por vez, grandes, nome e preço na mesma linha, material embaixo.
// Cada peça é apresentada como produto: foto, categoria, nome, materiais e
// preço, com a informação EMBAIXO da foto (o card dos Lançamentos põe por
// cima; aqui o papel é comparar e comprar).
//
// Tudo o que aparece vem do catálogo: categoria, materiais, preço, preço
// cheio (só existe em promoção cadastrada) e estoque. Nada inventado.
// Só entram peças com foto própria (COM_CARD); as marcadas como "confira"
// no painel vêm primeiro.
const ORDEM = [
  "pingente-cruz-cravejada",
  "anel-cruz-royal",
  "corrente-sob-medida",
  "trevo-gold",
  "trevo-rose",
  "trevo-royal",
];

const emReais = (txt) => Number(String(txt || "").replace(/[^\d,]/g, "").replace(",", ".")) || 0;

function PecaVitrine({ p }) {
  const cheio = emReais(p.priceFull);
  const vigente = emReais(p.price);
  const desconto = cheio > vigente && vigente > 0 ? Math.round((1 - vigente / cheio) * 100) : 0;
  const ultimas = typeof p.estoque === "number" && p.estoque > 0 && p.estoque <= 5;
  return (
    <article className="vitrine__peca">
      <Link className="vitrine__link" to={`/produto/${p.slug}`}>
        <span className="vitrine__foto">
          <img src={fotoCard(p.slug)} alt={p.title} loading="lazy" decoding="async" />
          {desconto > 0 && <span className="vitrine__selo">-{desconto}%</span>}
        </span>
        <span className="vitrine__linha">
          <span className="vitrine__nome">{p.title}</span>
          <span className="vitrine__preco">{p.price}</span>
        </span>
        <span className="vitrine__linha vitrine__linha--fina">
          <span>{p.materials?.[0] || p.category}</span>
          {p.priceFull ? <s>{p.priceFull}</s> : ultimas ? <em>Últimas unidades</em> : null}
        </span>
      </Link>
    </article>
  );
}

export default function OutrosProdutos() {
  const { produtos, confiras } = useCatalog();
  const trilho = useRef(null);
  const [posicao, setPosicao] = useState(0);
  const [atual, setAtual] = useState(1);

  const vistos = new Set();
  const pecas = [...confiras.map((p) => p.slug), ...ORDEM]
    .filter((s) => COM_CARD.includes(s) && (vistos.has(s) ? false : vistos.add(s)))
    .map((s) => produtos.find((p) => p.slug === s))
    .filter(Boolean);

  if (pecas.length < 2) return null;

  // anda de peça em peça: a vitrine para sempre com peças inteiras
  function rolar(direcao) {
    const el = trilho.current;
    if (!el) return;
    const passo = el.querySelector(".vitrine__peca")?.getBoundingClientRect().width || 300;
    el.scrollBy({ left: passo * direcao, behavior: "smooth" });
  }

  function aoRolar() {
    const el = trilho.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setPosicao(max <= 0 ? 1 : el.scrollLeft / max);
    const passo = el.querySelector(".vitrine__peca")?.getBoundingClientRect().width || 1;
    setAtual(Math.min(Math.round(el.scrollLeft / (passo + 24)) + 1, el.children.length));
  }

  return (
    <section className="confira">
      <div className="vitrine">
        <div className="vitrine__cabeca">
          <RevealTitle as="h2" className="confira__titulo">
            <span className="tw-solid">Confira</span>
            <span className="tw-outline">também</span>
          </RevealTitle>

          <div className="vitrine__controle">
            <span className="vitrine__conta">
              {String(atual).padStart(2, "0")} / {String(pecas.length).padStart(2, "0")}
            </span>
            {/* atalho de mouse; a vitrine rola por arrasto, roda e teclado */}
            <button
              type="button"
              className="vitrine__seta"
              onClick={() => rolar(-1)}
              aria-label="Ver peças anteriores"
              tabIndex={-1}
              disabled={posicao <= 0.01}
            >
              &#8592;
            </button>
            <button
              type="button"
              className="vitrine__seta"
              onClick={() => rolar(1)}
              aria-label="Ver mais peças"
              tabIndex={-1}
              disabled={posicao >= 0.99}
            >
              &#8594;
            </button>
          </div>
        </div>

        <div
          className="vitrine__trilho"
          ref={trilho}
          onScroll={aoRolar}
          tabIndex={0}
          role="region"
          aria-label="Peças da vitrine, role para o lado"
        >
          {pecas.map((p) => (
            <PecaVitrine key={p.slug} p={p} />
          ))}
        </div>

        <Link className="btn-texto vitrine__todas" to="/colecao/g-shop">
          Ver todas as peças
        </Link>
      </div>
    </section>
  );
}
