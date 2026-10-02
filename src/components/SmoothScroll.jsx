import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Lenis from "lenis";

// Rolagem suave com a configuração exata dos templates Framer (lida no
// código publicado): intensity 6 -> duration 0.6 s, curva
// min(1, 1.001 - 2^(-10t)). Toque continua nativo (Framer também não suaviza).
//
// Armadilhas já pagas em outros projetos (ver nota lenis-ancoras-menu):
// - window.scrollTo / scrollIntoView são engolidos pelo Lenis: quem precisar
//   rolar usa window.__lenis (helper rolarAte abaixo).
// - Gaveta que trava o body com overflow hidden: o Lenis continuaria rolando
//   a página por trás, então ele para enquanto o body estiver travado.
// - Listas com rolagem própria (sacola, checkout, filtros, menu do celular)
//   rolam nativas.
const ROLAGEM_PROPRIA = ".cart__list, .ck__itens, .fv__folha-corpo, .navbar__links, [data-lenis-prevent]";

export function rolarAte(alvo, opcoes = {}) {
  const lenis = window.__lenis;
  if (lenis) return lenis.scrollTo(alvo, { force: true, ...opcoes });
  if (typeof alvo === "number") window.scrollTo({ top: alvo, behavior: opcoes.immediate ? "auto" : "smooth" });
  else alvo?.scrollIntoView?.({ behavior: "smooth", block: "center" });
}

export default function SmoothScroll() {
  const { pathname } = useLocation();
  const painel = pathname.startsWith("/admin");

  useEffect(() => {
    if (painel || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({
      duration: 0.6,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      prevent: (no) => !!no.closest?.(ROLAGEM_PROPRIA),
    });
    window.__lenis = lenis;

    let raf = requestAnimationFrame(function quadro(t) {
      lenis.raf(t);
      raf = requestAnimationFrame(quadro);
    });

    const travado = () => getComputedStyle(document.body).overflow === "hidden";
    const vigia = new MutationObserver(() => (travado() ? lenis.stop() : lenis.start()));
    vigia.observe(document.body, { attributes: true, attributeFilter: ["style", "class"] });

    return () => {
      cancelAnimationFrame(raf);
      vigia.disconnect();
      lenis.destroy();
      if (window.__lenis === lenis) delete window.__lenis;
    };
  }, [painel]);

  // Rota nova começa do topo (sem isso o Lenis guardava a posição da página anterior).
  useEffect(() => {
    if (window.location.hash) return;
    rolarAte(0, { immediate: true });
  }, [pathname]);

  return null;
}
