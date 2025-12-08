// src/pages/Sobre.jsx
import './style_css/Paginas.css';

function Sobre() {
  return (
    <div className="pagina-container">
      <header className="pagina-header">
        <h1>Sobre o ASK ME</h1>
        <p>Conheça nossa missão, visão e valores</p>
      </header>

      <main className="pagina-conteudo">
        <section className="secao">
          <h2>🎯 Nossa Missão</h2>
          <p>
            Criar um espaço seguro e acolhedor onde pessoas possam compartilhar 
            dúvidas, angústias e curiosidades sobre qualquer assunto, recebendo 
            apoio e orientação de uma comunidade solidária.
          </p>
        </section>

        <section className="secao">
          <h2>👁️ Nossa Visão</h2>
          <p>
            Ser a principal plataforma brasileira de compartilhamento de 
            conhecimento experiencial, onde ninguém precise enfrentar suas 
            dúvidas sozinho.
          </p>
        </section>

        <section className="secao">
          <h2>💖 Nossos Valores</h2>
          <div className="valores-grid">
            <div className="valor-card">
              <h3>Empatia</h3>
              <p>Respostas com compreensão e respeito pela situação do outro.</p>
            </div>
            <div className="valor-card">
              <h3>Anonimato</h3>
              <p>Proteção da identidade para perguntas sensíveis.</p>
            </div>
            <div className="valor-card">
              <h3>Qualidade</h3>
              <p>Respostas relevantes e construtivas.</p>
            </div>
            <div className="valor-card">
              <h3>Diversidade</h3>
              <p>Acolhimento de todas as perspectivas e experiências.</p>
            </div>
          </div>
        </section>
        
        <section className="secao">
          <h2>🤝 Junte-se a Nós</h2>
          <p>
            Seja parte desta comunidade que cresce a cada dia. Sua experiência 
            pode ajudar alguém que está passando por situações similares.
          </p>
          <button 
            className="cta-button"
            onClick={() => window.location.href = '/'}
          >
            Voltar para Home
          </button>
        </section>
      </main>
    </div>
  );
}

export default Sobre;