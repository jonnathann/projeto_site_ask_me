// src/pages/Registro.tsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '../contexts/AuthContext';
import './style_css/Auth.css';

interface RegisterData {
  nome: string;
  email: string;
  senha: string;
  confirmarSenha: string;
  nickname: string;
  gender: 'masculino' | 'feminino' | 'outro' | 'prefiro_nao_dizer';
  bio?: string;
}

const registerSchema: yup.ObjectSchema<RegisterData> = yup.object({
  nome: yup.string().min(3, 'Nome deve ter pelo menos 3 caracteres').required('Nome é obrigatório'),
  email: yup.string().email('Digite um email válido').required('Email é obrigatório'),
  senha: yup.string().min(6, 'Senha deve ter pelo menos 6 caracteres').required('Senha é obrigatória'),
  confirmarSenha: yup.string().oneOf([yup.ref('senha')], 'As senhas devem ser iguais').required('Confirme sua senha'),
  nickname: yup.string().min(2, 'Nickname deve ter pelo menos 2 caracteres').max(30, 'Nickname muito longo').required('Nickname é obrigatório'),
  gender: yup.mixed<'masculino' | 'feminino' | 'outro' | 'prefiro_nao_dizer'>()
    .oneOf(['masculino', 'feminino', 'outro', 'prefiro_nao_dizer'])
    .required('Selecione um gênero'),
  bio: yup.string().max(200, 'Bio muito longa (máx. 200 caracteres)').optional(),
}).required();

function Registro() {
  const navigate = useNavigate();
  const { register: registerUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterData>({
    resolver: yupResolver(registerSchema),
    defaultValues: {
      nickname: '',
      bio: '',
      gender: 'prefiro_nao_dizer',
    },
  });

  const handleRegister: SubmitHandler<RegisterData> = async (data) => {
    setIsLoading(true);
    setError('');

    const userData = {
      name: data.nome,
      email: data.email,
      password: data.senha,
      nickname: data.nickname,
      gender: data.gender || 'prefiro_nao_dizer',
      avatar_url: '',
      bio: data.bio || '',
    };

    try {
      const result = await registerUser(userData);
      if (result.success) {
        alert('✅ Conta criada com sucesso!');
        navigate('/login');
      } else {
        setError(result.error || 'Erro ao criar conta');
      }
    } catch {
      setError('Erro interno ao processar registro');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo"><span className="logo-ask">ASK</span><span className="logo-me">ME</span></div>
          <h1>Crie sua conta</h1>
          <p className="auth-subtitle">Junte-se à comunidade e descubra respostas para suas dúvidas</p>
        </div>

        <form onSubmit={handleSubmit(handleRegister)} className="auth-form">
          {error && <div className="auth-error">⚠️ {error}</div>}

          {/* Nome */}
          <div className="form-group">
            <label htmlFor="nome">Nome Completo <span className="required">*</span></label>
            <input id="nome" type="text" placeholder="Seu nome completo" {...register('nome')} className={errors.nome ? 'input-error' : ''} disabled={isLoading} />
            {errors.nome && <span className="error-message">{errors.nome.message}</span>}
          </div>

          {/* Email */}
          <div className="form-group">
            <label htmlFor="email">Email <span className="required">*</span></label>
            <input id="email" type="email" placeholder="seu@email.com" {...register('email')} className={errors.email ? 'input-error' : ''} disabled={isLoading} />
            {errors.email && <span className="error-message">{errors.email.message}</span>}
          </div>

          {/* Nickname */}
          <div className="form-group">
            <label htmlFor="nickname">Nickname <span className="required">*</span></label>
            <input id="nickname" type="text" placeholder="Escolha seu nickname" {...register('nickname')} className={errors.nickname ? 'input-error' : ''} disabled={isLoading} />
            {errors.nickname && <span className="error-message">{errors.nickname.message}</span>}
          </div>

          {/* Gênero */}
          <div className="form-group">
            <label htmlFor="gender">Gênero <span className="required">*</span></label>
            <select id="gender" {...register('gender')} className={errors.gender ? 'input-error' : ''} disabled={isLoading}>
              <option value="masculino">Masculino</option>
              <option value="feminino">Feminino</option>
              <option value="outro">Outro</option>
              <option value="prefiro_nao_dizer">Prefiro não dizer</option>
            </select>
            {errors.gender && <span className="error-message">{errors.gender.message}</span>}
          </div>

          {/* Senha */}
          <div className="form-group">
            <label htmlFor="senha">Senha <span className="required">*</span></label>
            <div className="password-input">
              <input id="senha" type={showPassword ? 'text' : 'password'} placeholder="••••••••" {...register('senha')} className={errors.senha ? 'input-error' : ''} disabled={isLoading} />
              <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)} disabled={isLoading}>{showPassword ? '👁️' : '👁️‍🗨️'}</button>
            </div>
            {errors.senha && <span className="error-message">{errors.senha.message}</span>}
          </div>

          {/* Confirmar senha */}
          <div className="form-group">
            <label htmlFor="confirmarSenha">Confirmar Senha <span className="required">*</span></label>
            <div className="password-input">
              <input id="confirmarSenha" type={showConfirmPassword ? 'text' : 'password'} placeholder="••••••••" {...register('confirmarSenha')} className={errors.confirmarSenha ? 'input-error' : ''} disabled={isLoading} />
              <button type="button" className="password-toggle" onClick={() => setShowConfirmPassword(!showConfirmPassword)} disabled={isLoading}>{showConfirmPassword ? '👁️' : '👁️‍🗨️'}</button>
            </div>
            {errors.confirmarSenha && <span className="error-message">{errors.confirmarSenha.message}</span>}
          </div>

          {/* Bio */}
          <div className="form-group">
            <label htmlFor="bio">Bio (Opcional)</label>
            <textarea id="bio" placeholder="Conte um pouco sobre você..." {...register('bio')} className={`bio-textarea ${errors.bio ? 'input-error' : ''}`} disabled={isLoading} rows={3} maxLength={200}></textarea>
          </div>

          {/* Termos */}
          <div className="form-terms">
            <label className="checkbox-label">
              <input type="checkbox" required disabled={isLoading} />
              <span>Concordo com os <Link to="/politicas" className="terms-link">Termos de Serviço</Link> e <Link to="/politicas" className="terms-link">Política de Privacidade</Link></span>
            </label>
          </div>

          {/* Botão */}
          <button type="submit" className="auth-button" disabled={isLoading}>
            {isLoading ? <>Criando conta...</> : '📝 Criar Conta'}
          </button>
        </form>

        <div className="auth-footer">
          <p>Já tem uma conta? <Link to="/login" className="auth-link">Faça login aqui</Link></p>
          <p className="auth-terms">Sua privacidade é importante. Nunca compartilharemos seus dados.</p>
        </div>

        <Link to="/" className="back-home">← Voltar para página inicial</Link>
      </div>

      <div className="auth-sidebar">
        <div className="sidebar-content">
          <h2>Por que se cadastrar?</h2>
          <ul className="sidebar-features">
            <li>💬 Faça perguntas anonimamente ou como membro</li>
            <li>⭐ Salve suas perguntas e respostas favoritas</li>
            <li>🏆 Ganhe reputação ajudando outros</li>
            <li>🔔 Receba notificações de respostas</li>
            <li>👥 Conecte-se com pessoas com interesses similares</li>
            <li>📊 Acompanhe seu progresso na comunidade</li>
          </ul>
          <div className="sidebar-testimonial">
            <p>"O ASK ME transformou minha maneira de buscar conhecimento. A comunidade é incrível!"</p>
            <span>- Carlos M., membro há 1 ano</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Registro;
