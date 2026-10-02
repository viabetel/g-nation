import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Wordmark from "./Wordmark";
import Ticker from "./Ticker";
import "./Hero.css";

// Hero de uma tela: o filme da peça em tela cheia, tocando sozinho em laço.
// Nada no centro (texto no meio quebrava a imersão): as ações ficam no canto
// inferior esquerdo, acima da faixa da marca. A Categoria sobe por cima
// dele como cortina (o hero fica preso: ver .hero-cortina no Hero.css).
//
// O filme vai no arquivo ORIGINAL, sem recompressão: o hero é onde a
// qualidade chama atenção. Celular recebe a cópia já cortada em retrato
// (406x720), que gasta cada pixel no que aparece na tela.

const FAIXA = [
  "Joias de streetwear",
  "Prata 925",
  "Banho ouro 18k",
  "Peças customizadas",
  "Pix, cartão ou boleto",
];

// Mola de bloco do template Framer (lida no código publicado): 200/50.
const molaBloco = (delay) => ({ type: "spring", stiffness: 200, damping: 50, mass: 1, delay });

function useTelaEstreita() {
  const [estreita, setEstreita] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(max-width: 860px)").matches
  );
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 860px)");
    const onChange = (e) => setEstreita(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return estreita;
}

export default function Hero() {
  const telaEstreita = useTelaEstreita();
  const src = telaEstreita ? "/assets/hero/hero-video-mobile.mp4" : "/assets/hero/hero-video.mp4";

  return (
    <section className="hero">
      <div className="hero__palco">
        {/* key no src: trocar o arquivo ao girar/redimensionar recarrega o vídeo */}
        <motion.video
          key={src}
          className="hero__video"
          src={src}
          poster="/assets/hero/hero-video-poster-new.webp"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        />
        <div className="hero__veu" />

        {/* o h1 continua existindo para leitor de tela e busca, sem aparecer */}
        <h1 className="hero__h1">G-Nation, joias e acessórios de streetwear premium</h1>

        <div className="hero__base">
          {/* CTA do Figma (27:57): retângulo vermelho sem raio, "VER PEÇAS"
              sublinhado. Ao lado, a outra porta da loja. */}
          <motion.div
            className="hero__acoes"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={molaBloco(0.5)}
          >
            <Link className="btn btn--g btn--principal hero__cta" to="/colecao/g-shop">
              Ver peças
            </Link>
            <Link className="btn btn--g btn--contorno" to="/colecao/g-customizadas">
              Peça customizada
            </Link>
          </motion.div>
        </div>

        <motion.div
          className="hero__marquee-wrap"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          {/* Faixa de informação: só fatos reais do catálogo e do rodapé,
              em português, separados pelo quadrado vermelho. A marca entra
              uma vez por volta. */}
          <div className="hero__marquee">
            <Ticker speed={40} direction="left" gap={0} hoverFactor={1} fadeWidth={0}>
              <span className="hero__marquee-text">
                <span className="hero__marquee-marca"><Wordmark flat /></span>
                {FAIXA.map((t) => (
                  <span className="hero__marquee-item" key={t}>{t}</span>
                ))}
              </span>
            </Ticker>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
