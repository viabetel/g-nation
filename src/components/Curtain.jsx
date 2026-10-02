import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import "./Curtain.css";
import ImageCrossfade from "./ImageCrossfade";
import LogoG from "./LogoG";

const LEFT_IMAGES = [
  "/assets/hero/slice-left-1.png",
  "/assets/hero/slice-left-2.webp",
  "/assets/hero/slice-left-3.jpg",
];

const RIGHT_IMAGES = [
  "/assets/hero/slice-right-1.webp",
  "/assets/hero/slice-right-2.webp",
  "/assets/hero/slice-right-3.jpg",
];

// Grid de lançamentos — título/preço/foto/link vêm da fonte única de
// produtos (src/data/products.js). Agora 6 peças (3x2): os 4 originais
// + as duas pulseiras novas com foto REAL baixada do Figma (nodes
// 27:11/27:10 — Trevo Rosé e Trevo Gold).
// Ordem preferida da faixa de lançamentos. Quem marcar "mostrar em
// destaque" no painel entra na frente — é assim que o dono promove uma
// coleção nova sem pedir deploy.
function useEhMobile() {
  const [ehMobile, setEhMobile] = useState(
    typeof window !== "undefined" && window.matchMedia("(max-width: 900px)").matches
  );
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 900px)");
    const ouvir = (e) => setEhMobile(e.matches);
    mq.addEventListener("change", ouvir);
    return () => mq.removeEventListener("change", ouvir);
  }, []);
  return ehMobile;
}

// Faithful port of the real Hero Section scroll effect (augiA20Il.js):
// __framer__transformTrigger:"onScrollTarget", threshold 0.5, x target ±1000px.
// As you scroll through the pin, the two photo halves split apart like
// doors. Fiel ao Figma: o que fica revelado por trás NÃO é vazio — é a
// seção "DESTAQUE DE LANÇAMENTO" (node 27:77), que entra em cena (fade +
// leve subida) na segunda metade do scroll do pin, depois que as fotos já
// se abriram.
export default function Curtain() {
  const curtainRef = useRef(null);
  // Progresso = o curso da trava (topo da seção no topo da tela até o fim
  // dela no fim da tela): 700px, o mesmo --porta-curso que a grade dos
  // Lançamentos usa para chegar ao lugar quando as portas terminam de abrir.
  const { scrollYProgress } = useScroll({
    target: curtainRef,
    offset: ["start start", "end end"],
  });

  // Timing auditado com puppeteer (amostrando pinTop/opacity a cada 2% do
  // scroll): com altura 3400px e slice-open em [0.16,0.36], o pin soltava
  // em v≈0.71 (release = curtainHeight-pinHeight) mas tudo já estava
  // parado/estático desde v=0.36 — 1190px de scroll morto (nada mudando
  // na tela) só nesse trecho, mais 544px de preâmbulo parado no início.
  // Mais da metade do scroll da seção era tempo morto. Reduzida a altura
  // total (3400→2000) e redistribuído o timing pra sobrar só um respiro
  // curto antes de abrir e um "dwell" curto depois de revelado, em vez de
  // uma trava longa parada no meio do scroll.
  // AS PORTAS ABREM NO EIXO EM QUE ELAS ESTÃO.
  //
  // O efeito é o do template: dois painéis de foto que se afastam como
  // portas. No desktop eles ficam LADO A LADO e por isso saem em x, ±1000.
  // No celular o CSS empilha os dois (flex-direction: column, ver o bloco
  // de 900px), e o x continuava valendo: os painéis, agora deitados um
  // sobre o outro, escorregavam para os lados e saíam de cena deixando a
  // tela preta com duas tiras de foto grudadas nas bordas — medido em
  // 390x844, uma tela inteira quase vazia no meio da transição, antes de
  // os Lançamentos entrarem.
  //
  // Empilhado, a porta abre para CIMA e para BAIXO. É o mesmo gesto, no
  // eixo em que as peças realmente estão, e não um efeito substituto.
  const ehMobileCena = useEhMobile();
  const saiA = useTransform(scrollYProgress, [0.06, 0.94], ["0%", "-101%"]);
  const saiB = useTransform(scrollYProgress, [0.06, 0.94], ["0%", "101%"]);
  const abreA = ehMobileCena ? { y: saiA } : { x: saiA };
  const abreB = ehMobileCena ? { y: saiB } : { x: saiB };

  return (
    <section className="curtain" id="categorias" ref={curtainRef}>
      <div className="curtain__pin">
        <div className="curtain__slices">
          <motion.div className="curtain__slice" style={abreA}>
            <ImageCrossfade images={LEFT_IMAGES} className="curtain__slice-inner" />
            <motion.div
              className="curtain__tag curtain__tag--left"
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="curtain__tag-label"><LogoG />-Shop</span>
              <motion.a
                className="curtain__tag-cta"
                href="/colecao/g-shop"
              >
                <span>Ver peças</span>
              </motion.a>
            </motion.div>
          </motion.div>

          <motion.div className="curtain__slice" style={abreB}>
            <ImageCrossfade images={RIGHT_IMAGES} className="curtain__slice-inner" />
            <motion.div
              className="curtain__tag curtain__tag--right"
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            >
              <span className="curtain__tag-label"><LogoG />-Customizadas</span>
              <motion.a
                className="curtain__tag-cta"
                href="/colecao/g-customizadas"
              >
                <span>Ver customizadas</span>
              </motion.a>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
