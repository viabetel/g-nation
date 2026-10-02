import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import "./CardJoia.css";

// CARD DE JOIA da home: um só para Lançamentos e "Confira também".
//
// Cada peça tem um card gerado da foto original (public/assets/lancamentos/
// cards): célula na régua da OUD (398x361) e a joia sempre do mesmo tamanho.
// Só entram peças que têm foto própria. O catálogo do banco tem 5 peças
// apontando para a mesma foto do Trevo Royal; elas ficam fora até ganharem
// foto de verdade.
export const COM_CARD = [
  "trevo-royal",
  "trevo-gold",
  "trevo-rose",
  "anel-cruz-royal",
  "pingente-cruz-cravejada",
  "corrente-sob-medida",
];
// Recortes: peça inteira sobre transparente, mesma escala. Só eles entram
// na grade dos Lançamentos (foto de ambiente no meio quebrava a imersão).
export const RECORTES = ["trevo-royal", "trevo-gold", "trevo-rose", "anel-cruz-royal"];
export const fotoCard = (slug) => `/assets/lancamentos/cards/${slug}.webp`;

// Mola de card do template Framer (lida no código publicado): 150/30.
const molaCard = (delay) => ({ type: "spring", stiffness: 150, damping: 30, mass: 1, delay });

// `entrada={false}` em faixa horizontal: o card que espia na borda nunca
// chega a 30% visível e ficaria transparente.
export default function CardJoia({ p, i = 0, className = "", entrada = true }) {
  const anim = entrada
    ? {
        initial: { opacity: 0, y: 30 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, amount: 0.3 },
        transition: molaCard((i % 2) * 0.1),
      }
    : {};
  return (
    <motion.article className={`joia ${className}`.trim()} {...anim}>
      <Link className="joia__link" to={`/produto/${p.slug}`}>
        <img className="joia__foto" src={fotoCard(p.slug)} alt={p.title} loading="lazy" decoding="async" />
        <span className="joia__etiqueta">
          <span className="joia__nome">{p.title}</span>
          <span className="joia__preco">
            {p.price}
            {p.priceFull && <s>{p.priceFull}</s>}
          </span>
        </span>
      </Link>
    </motion.article>
  );
}
