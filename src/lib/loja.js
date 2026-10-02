import { useEffect, useState } from "react";
import { supabase } from "../supabase";

// Dados de contato da loja num lugar só (rodapés, página de produto,
// contato, páginas legais).
//
// Instagram: link informado pelo cliente.
// E-mail, WhatsApp, prazo e frete: vêm das configurações do painel (/admin/configuracoes,
// tabela `configuracoes`), para o dono trocar sem deploy. Os valores abaixo
// só valem até a resposta do banco chegar.
export const INSTAGRAM_URL = "https://www.instagram.com/gnationoficial/";
export const INSTAGRAM_ARROBA = "@gnationoficial";

const PADRAO = { email: "contato@gnation.com.br", whatsapp: "", prazo: "2 a 5 dias úteis", freteGratisAcima: 0, fretePadrao: 0 };

// Número de exemplo que ficou semeado no banco (não é da loja). Enquanto
// for ele, o site age como se não houvesse WhatsApp: melhor sem botão do
// que um telefone falso.
const WHATSAPP_EXEMPLO = "5532988887777";

let cache = null;

export function useLoja() {
  const [loja, setLoja] = useState(cache || PADRAO);
  useEffect(() => {
    if (cache) return;
    let vivo = true;
    supabase
      .from("configuracoes")
      .select("loja_email, loja_whatsapp, prazo_entrega_dias, frete_padrao_centavos, frete_gratis_acima_centavos")
      .eq("id", 1)
      .maybeSingle()
      .then(({ data }) => {
        if (!vivo || !data) return;
        const wa = (data.loja_whatsapp || "").replace(/\D/g, "");
        cache = {
          email: data.loja_email || PADRAO.email,
          whatsapp: wa === WHATSAPP_EXEMPLO ? "" : wa,
          prazo: data.prazo_entrega_dias || PADRAO.prazo,
          fretePadrao: Number(data.frete_padrao_centavos) || 0,
          freteGratisAcima: Number(data.frete_gratis_acima_centavos) || 0,
        };
        setLoja(cache);
      });
    return () => {
      vivo = false;
    };
  }, []);
  return loja;
}

// "5532988887777" -> "(32) 98888-7777"
export function formatarWhatsapp(numero) {
  const d = String(numero || "").replace(/\D/g, "").replace(/^55/, "");
  if (d.length < 10) return d;
  const ddd = d.slice(0, 2);
  const resto = d.slice(2);
  return `(${ddd}) ${resto.slice(0, resto.length - 4)}-${resto.slice(-4)}`;
}

export const linkWhatsapp = (numero) => `https://wa.me/${String(numero || "").replace(/\D/g, "")}`;

// Frase de frete a partir das configurações (centavos):
// frete padrão 0 = grátis; com mínimo = grátis acima do valor.
export function fraseFrete(loja) {
  const reais = (c) => (c / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  if (!loja.fretePadrao) return "FRETE GRÁTIS PARA TODO BRASIL";
  if (loja.freteGratisAcima) return `FRETE GRÁTIS ACIMA DE ${reais(loja.freteGratisAcima)}`;
  return `FRETE ${reais(loja.fretePadrao)} PARA TODO BRASIL`;
}
