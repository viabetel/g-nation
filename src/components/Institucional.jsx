import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import {
  INSTAGRAM_ARROBA,
  INSTAGRAM_URL,
  PRAZO_PERSONALIZADA,
  PRAZO_TRADICIONAL,
  formatarWhatsapp,
  linkWhatsapp,
  useLoja,
} from "../lib/loja";
import "./Institucional.css";

// Páginas institucionais: contato, trocas e devoluções, privacidade.
// Mesma casca: navbar, título na dupla cheia/vazada da marca, texto na
// largura de leitura, rodapé. Os dados de contato vêm de lib/loja.js.

const ATUALIZADO_EM = "2 de outubro de 2026";

function Casca({ cheio, vazado, children, estreito = true }) {
  return (
    <>
      <Navbar variant="inline" />
      <main className="inst">
        {/* a foto do banner (Copan) parada à direita; o preto com o
            conteúdo rola por cima dela */}
        <div className="inst__foto" aria-hidden="true">
          <i className="inst__grao" />
        </div>
        <div className="inst__painel">
        <header className="inst__cabeca">
          <h1 className="inst__titulo">
            <span className="tw-solid">{cheio}</span>
            <span className="tw-outline">{vazado}</span>
          </h1>
        </header>
        <div className={`inst__corpo${estreito ? " inst__corpo--leitura" : ""}`}>{children}</div>
        </div>
      </main>
      <Footer />
    </>
  );
}

/* ------------------------------------------------------------------ */
/* CONTATO                                                              */
/* ------------------------------------------------------------------ */
export function ContatoPage() {
  const loja = useLoja();
  return (
    <Casca cheio="Contato" vazado="Atendimento" estreito={false}>
      <div className="contato">
        <section className="contato__bloco">
          <span className="contato__rotulo">E-mail</span>
          <a className="contato__valor" href={`mailto:${loja.email}`}>
            {loja.email}
          </a>
          <a className="btn btn--g btn--claro" href={`mailto:${loja.email}`}>
            Enviar e-mail
          </a>
        </section>

        {loja.whatsapp && (
          <section className="contato__bloco">
            <span className="contato__rotulo">WhatsApp</span>
            <a className="contato__valor" href={linkWhatsapp(loja.whatsapp)} target="_blank" rel="noopener">
              {formatarWhatsapp(loja.whatsapp)}
            </a>
            <a className="btn btn--g btn--principal" href={linkWhatsapp(loja.whatsapp)} target="_blank" rel="noopener">
              Chamar no WhatsApp
            </a>
          </section>
        )}

        <section className="contato__bloco contato__bloco--fino">
          <span className="contato__rotulo">Instagram</span>
          <a className="contato__valor contato__valor--menor" href={INSTAGRAM_URL} target="_blank" rel="noopener">
            {INSTAGRAM_ARROBA}
          </a>
          <span className="contato__rotulo">Horário</span>
          <span className="contato__valor contato__valor--menor">Seg a Sex, 09h às 18h</span>
        </section>
      </div>
    </Casca>
  );
}

/* ------------------------------------------------------------------ */
/* TROCAS E DEVOLUÇÕES                                                  */
/* ------------------------------------------------------------------ */
export function TrocasPage() {
  const loja = useLoja();
  return (
    <Casca cheio="Trocas e" vazado="Devoluções">
      <p className="inst__atualizado">Atualizado em {ATUALIZADO_EM}</p>

      <h2>Direito de arrependimento</h2>
      <p>
        Comprou pelo site e mudou de ideia? Você pode desistir da compra em até 7 (sete) dias corridos a contar do
        recebimento, como garante o artigo 49 do Código de Defesa do Consumidor. A peça deve voltar sem sinais de uso,
        com a embalagem e tudo o que veio junto.
      </p>
      <p>
        Na desistência dentro desse prazo, devolvemos o valor integral pago, incluindo o frete, pela mesma forma de
        pagamento: Pix é devolvido por Pix e cartão é estornado na fatura, no prazo da operadora.
      </p>

      <h2>Peças customizadas</h2>
      <p>
        As peças da linha G-Customizadas são feitas sob encomenda, a partir das especificações que você aprova antes da
        produção. Elas são trocadas em caso de defeito de fabricação ou quando a peça entregue não corresponde ao que foi
        combinado.
      </p>

      <h2>Defeito de fabricação</h2>
      <p>
        Toda peça tem garantia legal de 90 (noventa) dias contra defeito de fabricação, contados a partir do
        recebimento, conforme o artigo 26 do Código de Defesa do Consumidor. Constatado o defeito, a peça é reparada,
        trocada por outra igual ou o valor é devolvido.
      </p>
      <p>
        Não são considerados defeito o desgaste natural do banho pelo uso, nem danos causados por queda, pancada, contato
        com produtos químicos (perfume, cloro, produtos de limpeza) ou ajustes feitos por terceiros.
      </p>

      <h2>Como solicitar</h2>
      <ol>
        <li>
          Escreva para <a href={`mailto:${loja.email}`}>{loja.email}</a> com o número do pedido e o motivo da troca ou
          devolução. Em caso de defeito, envie fotos da peça.
        </li>
        <li>Nossa equipe responde com as instruções de envio.</li>
        <li>Recebida a peça, conferimos o estado e seguimos com a troca, o reparo ou a devolução do valor.</li>
      </ol>

      <p className="inst__nota">
        Dúvidas? Fale com a gente na página de <Link to="/contato">contato</Link>.
      </p>
    </Casca>
  );
}

/* ------------------------------------------------------------------ */
/* PRAZO DE ENTREGA (texto do cliente)                                  */
/* ------------------------------------------------------------------ */
export function PrazoPage() {
  return (
    <Casca cheio="Prazo de" vazado="Entrega">
      <p>
        Todas as nossas joias são produzidas especialmente para cada pedido. O prazo de produção começa a contar
        somente após a confirmação do pagamento.
      </p>

      <h2>Peças tradicionais</h2>
      <p>Prazo de {PRAZO_TRADICIONAL}, contados a partir da confirmação do pagamento.</p>

      <h2>Peças personalizadas</h2>
      <p>
        Prazo de {PRAZO_PERSONALIZADA}, contados a partir da confirmação do pagamento, devido ao desenvolvimento e
        produção personalizada da peça.
      </p>

      <h2>Peças exclusivas</h2>
      <p>
        Para criar uma joia exclusiva, pode ser necessário desenvolver um novo molde 3D especialmente para o projeto.
        Nesse caso, o prazo de produção começa após a confirmação do pagamento e pode variar de acordo com a
        complexidade da criação e do molde.
      </p>

      <p className="inst__nota">
        <strong>Importante:</strong> os prazos informados são referentes ao prazo de produção da joia. O prazo de
        envio/transporte começa após a peça ser finalizada e despachada.
      </p>

      <p className="inst__assinatura">
        GNATION
        <span>Made for those who stand out.</span>
      </p>
    </Casca>
  );
}

/* ------------------------------------------------------------------ */
/* POLÍTICA DE PRIVACIDADE                                              */
/* ------------------------------------------------------------------ */
export function PrivacidadePage() {
  const loja = useLoja();
  return (
    <Casca cheio="Política de" vazado="Privacidade">
      <p className="inst__atualizado">Atualizado em {ATUALIZADO_EM}</p>

      <p>
        Esta política explica quais dados pessoais a G-Nation coleta quando você usa o site, para que eles servem e
        quais são os seus direitos, de acordo com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018, LGPD).
      </p>

      <h2>Quais dados coletamos</h2>
      <ul>
        <li>
          <strong>Ao criar sua conta:</strong> nome, e-mail e senha. A senha é guardada de forma protegida e ninguém da
          loja tem acesso a ela.
        </li>
        <li>
          <strong>Ao finalizar um pedido:</strong> nome completo, CPF, telefone e endereço de entrega. O CEP é consultado
          no serviço público ViaCEP para preencher o endereço.
        </li>
        <li>
          <strong>No seu navegador:</strong> guardamos apenas a sua sessão de login e os itens da sacola, para que eles
          não se percam ao fechar a página.
        </li>
      </ul>
      <p>O site não usa ferramentas de rastreamento de anúncios nem de análise de comportamento.</p>

      <h2>Para que usamos</h2>
      <ul>
        <li>Processar, entregar e acompanhar os seus pedidos.</li>
        <li>Emitir documentos fiscais e cumprir obrigações legais.</li>
        <li>Responder às suas solicitações de atendimento, troca ou devolução.</li>
        <li>Manter a sua conta e a segurança do site.</li>
      </ul>

      <h2>Com quem compartilhamos</h2>
      <p>
        Compartilhamos somente o necessário para o pedido acontecer: com a transportadora (nome, telefone e endereço de
        entrega), com o meio de pagamento (dados da cobrança) e com os serviços que hospedam o site e o banco de dados.
        Não vendemos nem cedemos seus dados para terceiros.
      </p>
      <p>Os dados de cartão são informados diretamente no ambiente do meio de pagamento e não ficam guardados com a G-Nation.</p>

      <h2>Por quanto tempo guardamos</h2>
      <p>
        Mantemos os dados enquanto a sua conta estiver ativa e, depois disso, pelo prazo exigido por lei para registros
        de compra e documentos fiscais.
      </p>

      <h2>Seus direitos</h2>
      <p>
        Você pode, a qualquer momento, pedir para confirmar se tratamos seus dados, acessar, corrigir, atualizar ou
        excluir seus dados, pedir a portabilidade e revogar consentimentos, como prevê o artigo 18 da LGPD. Basta
        escrever para <a href={`mailto:${loja.email}`}>{loja.email}</a>.
      </p>

      <h2>Alterações</h2>
      <p>
        Esta política pode ser atualizada. A data no topo da página mostra a versão em vigor. Mudanças importantes serão
        avisadas no site.
      </p>
    </Casca>
  );
}
