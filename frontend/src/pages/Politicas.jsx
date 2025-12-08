// src/pages/Politicas.jsx
import './style_css/Paginas.css';

function Politicas() {
  const politicas = [
    {
      titulo: "Respeito Mútuo",
      descricao: "Trate todos os membros com respeito, independentemente de opiniões diferentes.",
      itens: [
        "Sem discriminação de qualquer tipo",
        "Sem ataques pessoais",
        "Sem linguagem ofensiva"
      ]
    },
    {
      titulo: "Privacidade",
      descricao: "Proteção dos dados e anonimato dos usuários.",
      itens: [
        "Perguntas anônimas são permitidas",
        "Não compartilhe informações pessoais",
        "Respeite a privacidade alheia"
      ]
    },
    {
      titulo: "Conteúdo Adequado",
      descricao: "Mantenha o ambiente seguro para todos.",
      itens: [
        "Sem conteúdo ilegal",
        "Sem pornografia",
        "Sem discurso de ódio",
        "Sem spam"
      ]
    },
    {
      titulo: "Qualidade das Respostas",
      descricao: "Contribua com respostas construtivas.",
      itens: [
        "Baseie-se em experiências reais",
        "Evite especulações sem fundamento",
        "Seja honesto sobre suas limitações"
      ]
    },
    {
      titulo: "Moderação",
      descricao: "Como mantemos a qualidade da comunidade.",
      itens: [
        "Respostas são revisadas periodicamente",
        "Violações podem resultar em banimento",
        "Denuncie conteúdos inadequados"
      ]
    }
  ];

  return (
    <div className="pagina-container">
      <header className="pagina-header">
        <h1>Políticas da Comunidade</h1>
        <p>Regras para manter nosso ambiente seguro e acolhedor</p>
      </header>

      <main className="pagina-conteudo">
        <section className="secao introducao">
          <h2>📜 Nossas Regras</h2>
          <p>
            Para garantir que o ASK ME continue sendo um espaço seguro e 
            construtivo, pedimos que todos os usuários sigam estas políticas.
          </p>
          <div className="aviso-importante">
            ⚠️ Violações podem resultar em exclusão de conteúdo ou banimento.
          </div>
        </section>

        <div className="politicas-lista">
          {politicas.map((politica, index) => (
            <div key={index} className="politica-card">
              <h3>{politica.titulo}</h3>
              <p className="politica-descricao">{politica.descricao}</p>
              <ul className="politica-itens">
                {politica.itens.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <section className="secao denuncia">
          <h2>🚨 Como Denunciar</h2>
          <p>
            Encontrou algo que viola nossas políticas? Clique no botão de 
            denúncia na publicação ou entre em contato pelo email:
          </p>
          <div className="contato-denuncia">
            <strong>moderacao@askme.com</strong>
          </div>
          <p>
            Analisaremos sua denúncia em até 24 horas.
          </p>
        </section>

        <section className="secao concordancia">
          <div className="termo-aceite">
            <p>
              Ao usar o ASK ME, você concorda em seguir estas políticas e 
              contribuir para uma comunidade positiva.
            </p>
            <button 
              className="cta-button"
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

export default Politicas;