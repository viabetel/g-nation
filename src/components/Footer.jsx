import { Link } from "react-router-dom";
import Wordmark from "./Wordmark";
import { INSTAGRAM_URL, linkWhatsapp, useLoja } from "../lib/loja";
import "./Footer.css";

const PAGAMENTOS = [
  ["pix", "Pix"],
  ["visa", "Visa"],
  ["mastercard", "Mastercard"],
  ["elo", "Elo"],
  ["amex", "American Express"],
  ["hipercard", "Hipercard"],
  ["boleto", "Boleto"],
];

// Porte fiel do node 27:196 "footer-g-nation" da HOME do Figma
// (TXte9vygIeSP76UVjnbwLT), via get_design_context + download_assets:
// barra de acento vermelha 4px, footer-main (padding 80/150/60) com 3
// colunas — marca+socials / Navegação / Atendimento — linha divisória e
// footer-bottom (padding 32/150) com copyright + links legais. Fonte
// Inter em todo o bloco (é o que o Figma usa aqui, não JetBrains).
// O footer que estava no projeto (About/Works, Juiz de Fora, TikTok,
// "2026 © G-Nation") não existia no arquivo — foi substituído por este.
export default function Footer() {
  const loja = useLoja();
  return (
    <footer className="footer">
      <div className="footer__accent" />

      <div className="footer__main">
        <div className="footer__brand">
          <div className="footer__logo-wrap">
            <p className="footer__wordmark"><Wordmark flat /></p>
            <p className="footer__tagline">
              Marca de joias e acessórios de streetwear premium. Cultura de rua com
              acabamento de luxo. Curadoria fechada, peças com presença, preço que filtra.
            </p>
          </div>
          <div className="footer__socials">
            <p className="footer__col-title">Siga a cultura</p>
            {/* REDES — eram três ícones, e dois deles usavam `x.svg`, que
                NÃO é o logo do X: abrindo o arquivo, o id é "circle-x",
                o placeholder de "ícone não encontrado" do Figma. O
                próprio arquivo de design tem três quadrados brancos
                vazios aqui, então nunca houve ícone pra portar.

                Em vez de repetir o buraco ou desenhar à mão o glifo de
                uma marca registrada (que sai torto e é o tipo de coisa
                que denuncia arte gerada), a rede vira um chip de texto na
                tipografia da casa — mesma linguagem dos filtros da
                vitrine. E são as duas redes que o cliente informou ter:
                Instagram e WhatsApp. */}
            <div className="footer__social-row">
              <a
                className="footer__social"
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener"
              >
                <img src="/assets/footer/instagram.svg" alt="" aria-hidden="true" />
                Instagram
              </a>
              {loja.whatsapp && (
                <a
                  className="footer__social"
                  href={linkWhatsapp(loja.whatsapp)}
                  target="_blank"
                  rel="noopener"
                >
                  WhatsApp
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="footer__col">
          <p className="footer__col-title">Navegação</p>
          <div className="footer__links">
            <Link to="/">Início</Link>
            <Link to="/colecao/g-shop">Produtos</Link>
            <a href="/#lancamentos">Lançamentos</a>
            <a href="/#depoimentos">Depoimentos</a>
            <Link to="/contato">Contato</Link>
          </div>
        </div>

        <div className="footer__col">
          <p className="footer__col-title">Atendimento</p>
          <div className="footer__info">
            <div className="footer__info-block">
              <p className="footer__info-label">Email</p>
              <p className="footer__info-value">{loja.email}</p>
            </div>
            <div className="footer__info-block">
              <p className="footer__info-label">Horário</p>
              <p className="footer__info-value">Seg - Sex: 09h às 18h</p>
            </div>
            <div className="footer__info-block">
              <p className="footer__info-label">Pagamento</p>
              {/* PAGAMENTO — logos oficiais coloridas em formato cartão
                  (780x500, cantos retos). Bandeiras: set flat do
                  aaronfagan/svg-credit-card-payment-icons; Pix: símbolo
                  oficial na cor #32BCAD; Boleto não tem logo oficial,
                  então é o código de barras padrão. */}
              <ul className="footer__pay-row">
                {PAGAMENTOS.map(([arquivo, nome]) => (
                  <li key={arquivo} className="footer__pay">
                    <img
                      src={`/assets/footer/pagamento/${arquivo}.svg`}
                      alt={nome}
                      title={nome}
                      width="39"
                      height="25"
                      loading="lazy"
                    />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="footer__divider" />

      <div className="footer__bottom">
        <p>© {new Date().getFullYear()} <Wordmark flat /> URBAN JEWELRY. TODOS OS DIREITOS RESERVADOS.</p>
        <div className="footer__legal">
          <Link to="/politica-de-privacidade">Política de Privacidade</Link>
          <span>Termos de Uso</span>
          <Link to="/trocas-e-devolucoes">Trocas e Devoluções</Link>
        </div>
      </div>
    </footer>
  );
}
