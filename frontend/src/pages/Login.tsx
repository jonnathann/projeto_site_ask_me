// src/pages/Login.tsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '../contexts/AuthContext';
import './style_css/Auth.css';

// Tipagem do formulário
interface LoginData {
  email: string;
  senha: string;
}

// Schema de validação
const loginSchema = yup.object({
  email: yup
    .string()
    .email('Digite um email válido')
    .required('Email é obrigatório'),
  senha: yup
    .string()
    .min(6, 'Senha deve ter pelo menos 6 caracteres')
    .required('Senha é obrigatória'),
});

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginData>({
    resolver: yupResolver(loginSchema),
  });

  // FUNÇÃO DE LOGIN REAL
  const handleLogin = async (data: LoginData) => {
    setIsLoading(true);
    setError('');

    try {
      const result = await login(data.email, data.senha);

      if (result.success) {
        navigate('/');
      } else {
        setError(result.error || 'Email ou senha incorretos');
      }
    } catch (err) {
      console.error('Erro no login:', err);
      setError('Erro interno ao processar login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">
            <span className="logo-ask">ASK</span>
            <span className="logo-me">ME</span>
          </div>
          <h1>Bem-vindo de volta</h1>
          <p className="auth-subtitle">
            Faça login para continuar sua jornada de descobertas
          </p>
        </div>

        <form onSubmit={handleSubmit(handleLogin)} className="auth-form">
          {error && <div className="auth-error">⚠️ {error}</div>}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="seu@email.com"
              {...register('email')}
              className={errors.email ? 'input-error' : ''}
              disabled={isLoading}
            />
            {errors.email && (
              <span className="error-message">{errors.email.message}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="senha">Senha</label>
            <div className="password-input">
              <input
                id="senha"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                {...register('senha')}
                className={errors.senha ? 'input-error' : ''}
                disabled={isLoading}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
            {errors.senha && (
              <span className="error-message">{errors.senha.message}</span>
            )}
          </div>

          <div className="form-options">
            <label className="checkbox-label">
              <input type="checkbox" disabled={isLoading} />
              <span>Lembrar de mim</span>
            </label>
            <Link to="/esqueci-senha" className="forgot-password">
              Esqueceu a senha?
            </Link>
          </div>

          <button 
            type="submit" 
            className="auth-button"
            disabled={isLoading}
          >
            {isLoading ? 'Entrando...' : '🔐 Entrar'}
          </button>
        </form>

        <div className="auth-divider"><span>ou</span></div>

        <div className="auth-footer">
          <p>
            Não tem uma conta?{' '}
            <Link to="/registro" className="auth-link">
              Cadastre-se aqui
            </Link>
          </p>
          <p className="auth-terms">
            Ao continuar, você concorda com nossos{' '}
            <Link to="/politicas">Termos de Serviço</Link> e{' '}
            <Link to="/politicas">Política de Privacidade</Link>
          </p>
        </div>

        <Link to="/" className="back-home">
          ← Voltar para página inicial
        </Link>
      </div>

      <div className="auth-sidebar">
        <div className="sidebar-content">
          <h2>Descubra respostas para suas dúvidas</h2>
          <ul className="sidebar-features">
            <li>💬 Faça perguntas anonimamente</li>
            <li>🤝 Receba conselhos da comunidade</li>
            <li>🔒 Privacidade garantida</li>
            <li>🌟 Ajude outras pessoas</li>
          </ul>
          <div className="sidebar-testimonial">
            <p>"O ASK ME me ajudou em momentos difíceis com respostas genuínas"</p>
            <span>- Maria S., usuária há 6 meses</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
