import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import './style_css/Home.css';

function Home() {
  const navigate = useNavigate();

  // Botão "JUNTE-SE A NÓS" → Página de Registro
  const handleJoinClick = () => {
    navigate('/registro');
  };

  // Botão "Perguntar ❓" → Página de Login
  const handleAskClick = () => {
    navigate('/login');
  };

  return (
    <div className="home-container">
      {/* Header atualizado */}
      <header className="header">
        <div className="logo">
          <span className="logo-ask">ASK</span>
          <span className="logo-me">ME</span>
        </div>

        <nav className="nav-links">
          <Link to="/sobre">Sobre</Link>
          <Link to="/como-funciona">Como Funciona</Link>
          <Link to="/politicas">Políticas</Link>
        </nav>

        <div className="header-actions">
          <button className="ask-button" onClick={handleAskClick}>
            Perguntar ❓
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            <span className="title-ask">ASK</span>
            <span className="title-me">ME</span>
          </h1>

          <h2 className="hero-subtitle">
            O lugar onde <span className="highlight">todas as perguntas</span> têm resposta
          </h2>

          <p className="hero-description">
            Um espaço seguro e acolhedor para explorar suas dúvidas mais profundas. 
            Pergunte sobre <strong>qualquer coisa</strong> - desde relacionamentos e sexualidade 
            até carreira, saúde mental e finanças. Receba respostas genuínas de uma 
            comunidade que entende.
          </p>

          {/* CTA Principal */}
          <div className="cta-wrapper">
            <button className="cta-button" onClick={handleJoinClick}>
              <span className="cta-text">JUNTE-SE A NÓS</span>
              <span className="cta-icon">→</span>
            </button>
            <p className="cta-note">Totalmente gratuito • Anônimo opcional • Sem julgamentos</p>
          </div>

          {/* Destaques */}
          <div className="highlights">
            <div className="highlight-item">
              <div className="highlight-icon">💬</div>
              <div className="highlight-text">Pergunte sobre qualquer assunto</div>
            </div>
            <div className="highlight-item">
              <div className="highlight-icon">🤝</div>
              <div className="highlight-text">Respostas da comunidade</div>
            </div>
            <div className="highlight-item">
              <div className="highlight-icon">🔒</div>
              <div className="highlight-text">Total privacidade</div>
            </div>
          </div>
        </div>
      </main>

      {/* Categorias Populares */}
      <section className="categories-section">
        <h2 className="section-title">Categorias Populares</h2>
        <div className="categories-list">
          <span className="category-tag">💖 Relacionamentos</span>
          <span className="category-tag">💘 Paquera</span>
          <span className="category-tag">🔞 Sexo</span>
          <span className="category-tag">🎬 Entretenimento</span>
          <span className="category-tag">🎞️ Filmes</span>
          <span className="category-tag">🎮 Games</span>
          <span className="category-tag">📚 Livros</span>
          <span className="category-tag">⚕️ Saúde</span>
          <span className="category-tag">🍔 Vida Cotidiana</span>
          <span className="category-tag">💼 Carreira</span>
          <span className="category-tag">🎓 Educação</span>
        </div>
      </section>

      {/* Sobre */}
      <section className="about-section">
        <div className="about-content">
          <h2>Por que escolher o ASK ME?</h2>
          <div className="features">
            <div className="feature">
              <h3>📝 Pergunte Anonimamente</h3>
              <p>Não precisa se identificar para fazer perguntas sensíveis.</p>
            </div>
            <div className="feature">
              <h3>💭 Respostas Reais</h3>
              <p>De pessoas que já passaram por situações similares.</p>
            </div>
            <div className="feature">
              <h3>🛡️ Ambiente Seguro</h3>
              <p>Todas as interações são moderadas para garantir respeito.</p>
            </div>
            <div className="feature">
              <h3>🌐 Acesso Ilimitado</h3>
              <p>Faça quantas perguntas quiser, quando quiser.</p>
            </div>
          </div>

          <div className="saiba-mais">
            <Link to="/sobre" className="saiba-mais-link">
              Saiba mais sobre nossa missão →
            </Link>
          </div>
        </div>
      </section>

      {/* Como Funciona */}
      <section className="how-section">
        <div className="how-content">
          <h2>Como Funciona?</h2>
          <div className="steps-preview">
            <div className="step">
              <div className="step-number">1</div>
              <p>Faça sua pergunta</p>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <p>Receba respostas</p>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <p>Ajude outras pessoas</p>
            </div>
          </div>
          <Link to="/como-funciona" className="how-link">
            Ver guia completo passo a passo →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <p>💭 Não guarde dúvidas. Compartilhe. Aprenda. Cresça.</p>
          <div className="footer-links">
            <Link to="/sobre">Sobre</Link>
            <Link to="/como-funciona">Como Funciona</Link>
            <Link to="/politicas">Políticas</Link>
            <a href="#contact">Contato</a>
          </div>
          <p className="footer-copyright">© 2024 ASK ME. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}

export default Home;
