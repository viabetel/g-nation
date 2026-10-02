import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { useCatalog } from "../CatalogContext";
import CardJoia, { RECORTES } from "./CardJoia";

// GRADE: 4 fileiras de 2. Obedece o "destaque" do painel: as peças
// marcadas entram primeiro, DESDE QUE tenham foto recortada (as fotos de
// ambiente quebravam a imersão no meio da grade). O resto completa com os
// recortes, alternando para a mesma peça nunca ficar lado a lado nem uma
// embaixo da outra.
const CELULAS = 8;import "./Lancamentos.css";

// LANÇAMENTOS + BANNER, uma cena só.
//
// 1. A seção nasce embaixo das portas da Categoria (margem negativa no CSS).
// 2. O palco fica preso: à esquerda, uma JANELA sobre a foto do Copan; à
//    direita, só a grade de peças rola.
// 3. Quando a grade termina, a janela se abre até a largura toda (o mesmo
//    recorte animado pela rolagem das portas) e a câmera se aproxima: a
//    foto sai do enquadramento da coluna para o do banner. É UMA foto, sem
//    esticar e sem repetir.
//
// Câmera, em números (foto 2268x4032, palco 1440x720 sem a navbar):
//   coluna  escala 0,4417 (636/1440), topo da foto em y=1250 -> -13,7%
//   banner  escala 1,     topo da foto em y=2200 -> -54,6%
// (porcentagem da altura da própria foto; a origem do transform é o canto
//  superior esquerdo). O enquadramento da coluna é idêntico ao aprovado.

const COLUNA = 636 / 1440; // largura da janela no começo

function usePecas() {
  const { produtos, destaques } = useCatalog();
  const vistos = new Set();
  const base = [...destaques.map((p) => p.slug), ...RECORTES]
    .filter((s) => RECORTES.includes(s) && (vistos.has(s) ? false : vistos.add(s)))
    .map((s) => produtos.find((p) => p.slug === s))
    .filter(Boolean);
  if (!base.length) return [];
  // repete deslocando uma casa por volta: com 4 peças as fileiras saem
  // [1,2] [3,4] [2,3] [4,1], sem a mesma peça lado a lado nem uma embaixo
  // da outra
  const grade = [];
  for (let i = 0; grade.length < CELULAS; i++) {
    const volta = Math.floor(i / base.length);
    grade.push(base[(i + volta) % base.length]);
  }
  return grade;
}

function useEhMobile() {
  const [m, setM] = useState(() => typeof window !== "undefined" && window.matchMedia("(max-width: 900px)").matches);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 900px)");
    const ouvir = (e) => setM(e.matches);
    mq.addEventListener("change", ouvir);
    return () => mq.removeEventListener("change", ouvir);
  }, []);
  return m;
}

// rampa 0..1 entre a e b (forma de função: keyframes de opacidade já
// travaram neste projeto com framer-motion 12)
const rampa = (p, a, b) => Math.min(1, Math.max(0, (p - a) / (b - a)));
const suave = (t) => t * t * (3 - 2 * t);
// desacelera no fim: a janela anda rápido assim que a grade começa a sair,
// para não sobrar vão preto embaixo dela
const saida = (t) => 1 - Math.pow(1 - t, 3);

export default function Lancamentos() {
  const pecas = usePecas();
  const ehMobile = useEhMobile();
  const pista = useRef(null);
  const grade = useRef(null);
  // altura real da grade, para prender a última fileira no pé da tela
  useEffect(() => {
    const el = grade.current;
    if (!el) return;
    const ro = new ResizeObserver(() => el.style.setProperty("--grade-h", `${el.offsetHeight}px`));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  // progresso da abertura: da última fileira inteira na tela até o fim da
  // pista. A grade NÃO sobe por cima do banner: ela fica presa com a última
  // fileira no pé da tela (sticky, topo = 100vh - altura dela) e sai pela
  // DIREITA, com a borda esquerda dela sendo a borda da janela que abre.
  // Grade sai e janela abre em 0 a 0,45; a chamada entra em 0,5 a 0,7.
  const { scrollYProgress: p } = useScroll({ target: pista, offset: ["start end", "end end"] });

  const abre = useTransform(p, (v) => saida(rampa(v, 0, 0.45)));
  const janela = useTransform(abre, (t) => `inset(0 ${((1 - COLUNA) * (1 - t) * 100).toFixed(3)}% 0 0)`);
  const camera = useTransform(abre, (t) => {
    const s = COLUNA + (1 - COLUNA) * t;
    const y = -13.7 + (-54.6 + 13.7) * t;
    return `translateY(${y.toFixed(3)}%) scale(${s.toFixed(4)})`;
  });
  const gradeX = useTransform(abre, (t) => `${(t * 100).toFixed(3)}%`);
  const colunaOp = useTransform(p, (v) => 1 - rampa(v, 0, 0.1));
  const bannerOp = useTransform(p, (v) => rampa(v, 0.5, 0.7));
  const bannerY = useTransform(p, (v) => `${(1 - suave(rampa(v, 0.5, 0.7))) * 24}px`);
  const colunaVis = useTransform(colunaOp, (v) => (v > 0.02 ? "visible" : "hidden"));
  const bannerVis = useTransform(bannerOp, (v) => (v > 0.02 ? "visible" : "hidden"));

  const chamada = (
    <>
      <h2 className="lanc__banner-titulo">
        <span className="tw-solid">Cultura de rua</span>
        <span className="tw-outline">Acabamento de luxo</span>
      </h2>
      <Link className="btn btn--g btn--principal lanc__banner-cta" to="/colecao/g-customizadas">
        Peça customizada
      </Link>
    </>
  );

  return (
    <section className="lanc" id="lancamentos" aria-labelledby="lanc-titulo">
      <div className="lanc__palco">
        {/* janela: abre da coluna para a largura toda */}
        <motion.div className="lanc__janela" style={ehMobile ? undefined : { clipPath: janela }}>
          {/* câmera: a foto inteira, afastada na coluna e aproximada no banner */}
          <motion.div className="lanc__camera" style={ehMobile ? undefined : { transform: camera }}>
            <img src="/assets/lancamentos/copan-inteiro.webp" alt="Edifício Copan, em São Paulo, visto de baixo em preto e branco" decoding="async" />
            {/* selo preso na dobra da curva: viaja junto com a foto */}
            <span className="lanc__selo" aria-hidden="true">
              <img src="/assets/brand/g-mark.webp" alt="" />
            </span>
          </motion.div>
          <i className="lanc__grao" aria-hidden="true" />
        </motion.div>

        {/* textos da coluna: saem quando a janela começa a abrir */}
        <motion.div className="lanc__coluna" style={ehMobile ? undefined : { opacity: colunaOp, visibility: colunaVis }}>
          <i className="lanc__fio" aria-hidden="true" />
          <div className="lanc__foto-texto">
            <h2 id="lanc-titulo" className="lanc__titulo">
              <span className="tw-solid">Lançamentos</span>
              <span className="tw-outline">Peso novo</span>
            </h2>
            <p className="lanc__frase">Cravação densa, banho reforçado, presença de vitrine.</p>
          </div>
          <p className="lanc__legenda" aria-hidden="true">
            Edifício Copan, São Paulo <b /> 23°32′48″S 46°38′41″W
          </p>
          <Link className="btn btn--escuro lanc__todas" to="/colecao/g-shop">
            Ver todas as peças
          </Link>
        </motion.div>

        {/* chamada do banner: entra com a janela já aberta (texto do rodapé da marca) */}
        {!ehMobile && (
          <motion.div className="lanc__banner" style={{ opacity: bannerOp, y: bannerY, visibility: bannerVis }}>
            {chamada}
          </motion.div>
        )}
      </div>

      <motion.div className="lanc__grade" ref={grade} style={ehMobile ? undefined : { x: gradeX }}>
        {pecas.map((p, i) => (
          <CardJoia p={p} i={i} key={`${p.slug}-${i}`} />
        ))}
      </motion.div>

      {/* pista da abertura: o palco segue preso enquanto ela passa */}
      <div className="lanc__pista" ref={pista} aria-hidden="true" />

      {/* celular: a coluna não existe (foto em cima, grade embaixo), então o
          banner é um bloco próprio depois da grade, com a mesma foto */}
      {ehMobile && <div className="lanc__banner-movel">{chamada}</div>}
    </section>
  );
}
