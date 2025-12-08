// src/pages/ComoFunciona.jsx
import './style_css/Paginas.css';

function ComoFunciona() {
  const passos = [
    {
      numero: 1,
      titulo: "Crie sua conta (opcional)",
      descricao: "Cadastre-se para salvar suas perguntas e respostas, ou pergunte anonimamente.",
      icon: "👤"
    },
    {
      numero: 2,
      titulo: "Faça sua pergunta",
      descricao: "Escreva sobre qualquer dúvida - relacionamentos, carreira, saúde, etc.",
      icon: "❓"
    },
    {
      numero: 3,
      titulo: "Escolha a categoria",
      descricao: "Selecione a categoria mais adequada para sua pergunta.",
      icon: "🏷️"
    },
    {
      numero: 4,
      titulo: "Receba respostas",
      descricao: "Nossa comunidade responderá com experiências e conselhos.",
      icon: "💬"
    },
    {
      numero: 5,
      titulo: "Interaja",
      descricao: "Comente, agradeça ou peça mais informações.",
      icon: "🔄"
    },
    {
      numero: 6,
      titulo: "Ajude outros",
      descricao: "Responda perguntas baseado na sua experiência.",
      icon: "🤝"
    }
  ];

  return (
    <div className="pagina-container">
      <header className="pagina-header">
        <h1>Como Funciona</h1>
        <p>Guia passo a passo para usar o ASK ME</p>
      </header>

      <main className="pagina-conteudo">
        <section className="secao introducao">
          <h2>📝 Passo a Passo Simples</h2>
          <p>
            O ASK ME foi criado para ser intuitivo e fácil. Siga estes passos 
            para tirar o máximo proveito da plataforma.
          </p>
        </section>

        <div className="passos-container">
          {passos.map((passo) => (
            <div key={passo.numero} className="passo-card">
              <div className="passo-numero">{passo.icon}</div>
              <div className="passo-conteudo">
                <h3>Passo {passo.numero}: {passo.titulo}</h3>
                <p>{passo.descricao}</p>
              </div>
            </div>
          ))}
        </div>

        <section className="secao dicas">
          <h2>💡 Dicas para Melhores Respostas</h2>
          <ul className="lista-dicas">
            <li>Seja específico na sua pergunta</li>
            <li>Forneça contexto quando necessário</li>
            <li>Respeite as regras da comunidade</li>
            <li>Agredeça quem responder</li>
            <li>Considere marcar a melhor resposta</li>
          </ul>
        </section>

        <section className="secao cta">
          <h2>Pronto para começar?</h2>
          <div className="botoes-acao">
            <button 
              className="cta-button primario"
              onClick={() => window.location.href = '/perguntar'}
            >
              Fazer minha primeira pergunta
            </button>
            <button 
              className="cta-button secundario"
              onClick={() => window.location.href = '/'}
            >
              Voltar para Home
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}

export default ComoFunciona;