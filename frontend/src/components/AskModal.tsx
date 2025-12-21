// src/components/AskModal.tsx - MODAL COM EMOJI PICKER MELHORADO
import { useState, useRef, useEffect } from 'react';
import { questionService } from '../services/questionService';

interface Category {
  id: string;
  name: string;
  emoji: string;
  color: string;
  description: string;
}

interface AskModalProps {
  darkMode: boolean;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    title: string;
    description: string;
    category: string;
    anonymous: boolean;
    media_url?: string;
  }) => void;
  loading?: boolean;
}

function AskModal({ darkMode, isOpen, onClose, onSubmit, loading = false }: AskModalProps) {
  const [questionTitle, setQuestionTitle] = useState('');
  const [questionDescription, setQuestionDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [error, setError] = useState<string>('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedEmojiCategory, setSelectedEmojiCategory] = useState('expressoes');
  
  const questionTitleRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);

  const categories: Category[] = [
    { id: 'relacionamentos', name: 'Relacionamentos', emoji: '💖', color: '#ff6b8b', description: 'Amor, namoro, casamento, família' },
    { id: 'paquera', name: 'Paquera', emoji: '💘', color: '#ff4081', description: 'Flerte, conquista, encontros' },
    { id: 'sexo', name: 'Sexo', emoji: '🔞', color: '#e91e63', description: 'Sexualidade, intimidade, dúvidas íntimas' },
    { id: 'entretenimento', name: 'Entretenimento', emoji: '🎬', color: '#3f51b5', description: 'TV, séries, shows, celebridades' },
    { id: 'filmes', name: 'Filmes', emoji: '🎞️', color: '#2196f3', description: 'Cinema, crítica, recomendações' },
    { id: 'games', name: 'Games', emoji: '🎮', color: '#4caf50', description: 'Video games, jogos, e-sports' },
    { id: 'livros', name: 'Livros', emoji: '📚', color: '#795548', description: 'Literatura, autores, leitura' },
    { id: 'saude', name: 'Saúde', emoji: '⚕️', color: '#00bcd4', description: 'Bem-estar, doenças, cuidados' },
    { id: 'vida-cotidiana', name: 'Vida Cotidiana', emoji: '🍔', color: '#ff9800', description: 'Rotina, problemas do dia a dia' },
    { id: 'carreira', name: 'Carreira', emoji: '💼', color: '#607d8b', description: 'Trabalho, profissão, negócios' },
    { id: 'educacao', name: 'Educação', emoji: '🎓', color: '#9c27b0', description: 'Estudos, escolas, faculdades' },
    { id: 'comidas', name: 'Comidas', emoji: '🍕', color: '#f44336', description: 'Receitas, restaurantes, culinária' },
    { id: 'tecnologia', name: 'Tecnologia', emoji: '💻', color: '#009688', description: 'Apps, gadgets, programação' },
    { id: 'viagens', name: 'Viagens', emoji: '✈️', color: '#8bc34a', description: 'Turismo, destinos, hospedagem' },
    { id: 'esportes', name: 'Esportes', emoji: '⚽', color: '#ff5722', description: 'Futebol, basquete, atividades' },
    { id: 'musica', name: 'Música', emoji: '🎵', color: '#673ab7', description: 'Artistas, bandas, instrumentos' },
  ];

  // ✅ EMOJI CATEGORIES COM SELEÇÃO
  const emojiCategories = [
    {
      id: 'expressoes',
      name: 'Expressões',
      icon: '😀',
      emojis: ['😀', '😂', '🥰', '😎', '🤔', '😭', '😡', '😴', '🤯', '🥳', '😇', '🤠', '🤗', '😱', '😏', '😈', '👻', '💀', '🤖', '👽', '😊', '😍', '😘', '😋', '😜']
    },
    {
      id: 'maos',
      name: 'Mãos',
      icon: '👋',
      emojis: ['👋', '🤝', '👍', '👎', '👏', '🙌', '🤲', '👐', '🤞', '✌️', '🤟', '🤘', '👌', '🤏', '✊', '👊', '🤛', '🤜', '👈', '👉', '👆', '👇', '☝️', '✍️', '🙏']
    },
    {
      id: 'objetos',
      name: 'Objetos',
      icon: '💻',
      emojis: ['💻', '📱', '📷', '🎮', '📺', '🎧', '🎤', '📖', '✏️', '📝', '📎', '📌', '✂️', '🔑', '💡', '🔦', '📡', '💿', '📀', '📼', '🎥', '🎬', '📞', '📠', '🔋']
    },
    {
      id: 'simbolos',
      name: 'Símbolos',
      icon: '❤️',
      emojis: ['❤️', '💔', '💕', '💖', '💗', '💘', '💙', '💚', '💛', '💜', '🧡', '🖤', '🤍', '🤎', '💯', '🔥', '✨', '🌟', '⭐', '💫', '☀️', '🌈', '☁️', '❄️', '💧']
    },
    {
      id: 'atividades',
      name: 'Atividades',
      icon: '⚽',
      emojis: ['⚽', '🏀', '🏈', '⚾', '🎾', '🏐', '🏉', '🎱', '🏓', '🏸', '🏒', '🥊', '🎿', '🛷', '🥌', '🎯', '🎳', '🎮', '🎲', '🧩', '♟️', '🎭', '🎨', '🎪', '🎤']
    },
    {
      id: 'comida',
      name: 'Comida',
      icon: '🍎',
      emojis: ['🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🫐', '🍈', '🍒', '🍑', '🥭', '🍍', '🥥', '🥝', '🍅', '🥑', '🍆', '🥔', '🥕', '🌽', '🌶️', '🥒', '🥬']
    },
    {
      id: 'animais',
      name: 'Animais',
      icon: '🐶',
      emojis: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🐔', '🐧', '🐦', '🐤', '🦆', '🦅', '🦉', '🦇', '🐺', '🐗']
    },
    {
      id: 'viagem',
      name: 'Viagem',
      icon: '✈️',
      emojis: ['✈️', '🚗', '🚕', '🚙', '🚌', '🚎', '🏎️', '🚓', '🚑', '🚒', '🚐', '🚚', '🚛', '🚜', '🛴', '🚲', '🛵', '🏍️', '🚨', '🚔', '🚍', '🚘', '🚖', '🚡', '🚠']
    },
    {
      id: 'bandeiras',
      name: 'Bandeiras',
      icon: '🏳️',
      emojis: ['🏳️', '🏴', '🏁', '🚩', '🏳️‍🌈', '🏳️‍⚧️', '🏴‍☠️', '🇧🇷', '🇺🇸', '🇪🇺', '🇬🇧', '🇩🇪', '🇫🇷', '🇮🇹', '🇪🇸', '🇵🇹', '🇨🇳', '🇯🇵', '🇰🇷', '🇮🇳', '🇷🇺', '🇨🇦', '🇦🇺', '🇦🇷', '🇲🇽']
    },
    {
      id: 'diversos',
      name: 'Diversos',
      icon: '🎉',
      emojis: ['🎉', '🎊', '🎂', '🎁', '🎈', '🎀', '🎗️', '🏆', '🥇', '🥈', '🥉', '🏅', '🎖️', '🎫', '🎟️', '🎪', '🎭', '🩰', '🎨', '🎬', '🎤', '🎧', '🎼', '🎹', '🥁']
    }
  ];

  // ✅ CLICK OUTSIDE PARA FECHAR EMOJI PICKER
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
        setShowEmojiPicker(false);
      }
    };

    if (showEmojiPicker) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showEmojiPicker]);

  // Resetar o modal quando abrir/fechar
  useEffect(() => {
    if (isOpen) {
      setQuestionTitle('');
      setQuestionDescription('');
      setSelectedCategory('');
      setIsAnonymous(false);
      setError('');
      setMediaUrl('');
      setShowEmojiPicker(false);
      setSelectedEmojiCategory('expressoes');
      
      setTimeout(() => {
        questionTitleRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId === selectedCategory ? '' : categoryId);
  };

  // ✅ INSERIR EMOJI NA DESCRIÇÃO
  const insertEmoji = (emoji: string) => {
    const textarea = descriptionRef.current;
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = questionDescription;
    
    const newText = text.substring(0, start) + emoji + text.substring(end);
    setQuestionDescription(newText);
    
    // Foca de volta no textarea e posiciona o cursor após o emoji
    setTimeout(() => {
      textarea.focus();
      textarea.selectionStart = textarea.selectionEnd = start + emoji.length;
    }, 10);
  };

  const handleSubmit = async () => {
    if (!questionTitle.trim()) {
      setError('Por favor, escreva o título da pergunta.');
      questionTitleRef.current?.focus();
      return;
    }

    if (questionTitle.length < 5) {
      setError('O título deve ter pelo menos 5 caracteres.');
      questionTitleRef.current?.focus();
      return;
    }

    if (questionTitle.length > 150) {
      setError('O título deve ter no máximo 150 caracteres.');
      return;
    }

    if (questionDescription && questionDescription.length > 2000) {
      setError('A descrição deve ter no máximo 2000 caracteres.');
      return;
    }

    if (!selectedCategory) {
      setError('Por favor, selecione uma categoria.');
      return;
    }

    if (mediaUrl.trim() && !questionService.isValidMediaUrl(mediaUrl.trim())) {
      setError('Por favor, insira uma URL válida para a mídia (ex: https://...)');
      return;
    }

    setError('');
    
    onSubmit({
      title: questionTitle,
      description: questionDescription,
      category: selectedCategory,
      anonymous: isAnonymous,
      media_url: mediaUrl.trim() || undefined
    });
  };

  const selectedCategoryObj = categories.find(cat => cat.id === selectedCategory);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className={`ask-modal ${darkMode ? 'dark' : ''}`}>
        <div className="modal-header">
          <h2>Faça sua Pergunta</h2>
          <button 
            className="modal-close" 
            onClick={onClose}
            disabled={loading}
          >
            ×
          </button>
        </div>
        
        <div className="modal-content">
          {error && (
            <div className="modal-error">
              ⚠️ {error}
            </div>
          )}
          
          {/* Título da Pergunta */}
          <div className="question-title-section">
            <label htmlFor="questionTitle">
              <span className="label-icon">❓</span>
              Título da Pergunta
              <span className="required"> *</span>
            </label>
            <input
              ref={questionTitleRef}
              type="text"
              id="questionTitle"
              value={questionTitle}
              onChange={(e) => {
                setQuestionTitle(e.target.value);
                if (error) setError('');
              }}
              placeholder="Ex: Como melhorar meu relacionamento?"
              maxLength={150}
              className="question-title-input"
              disabled={loading}
            />
            <div className="input-counter">
              <span className={questionTitle.length > 120 ? 'warning' : ''}>
                {questionTitle.length}/150 caracteres
              </span>
              <span className="min-chars">(Mínimo: 5 caracteres)</span>
            </div>
          </div>
          
          {/* ✅ Descrição da Pergunta COM BOTÃO DE EMOJI DENTRO DA TEXTAREA */}
          <div className="question-description-section">
            <label htmlFor="questionDescription">
              <span className="label-icon">📝</span>
              Descrição (Opcional)
            </label>
            
            <div className="description-textarea-wrapper">
              <textarea
                ref={descriptionRef}
                id="questionDescription"
                value={questionDescription}
                onChange={(e) => setQuestionDescription(e.target.value)}
                placeholder="Forneça mais detalhes sobre sua pergunta... Use emojis para expressar melhor! 😊"
                rows={4}
                maxLength={2000}
                className="question-description-textarea"
                disabled={loading}
              />
              
              {/* ✅ BOTÃO DE EMOJI DENTRO DA TEXTAREA */}
              <button
                type="button"
                className="inline-emoji-button"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                disabled={loading}
                title="Abrir seletor de emojis"
              >
                <span className="emoji-smiley">😊</span>
              </button>
            </div>
            
            <div className="input-counter">
              <span className={questionDescription.length > 1800 ? 'warning' : ''}>
                {questionDescription.length}/2000 caracteres
              </span>
            </div>
            
            {/* ✅ EMOJI PICKER COM CATEGORIAS */}
            {showEmojiPicker && (
              <div ref={emojiPickerRef} className="emoji-picker-container">
                <div className="emoji-picker-header">
                  <h4>Selecione um emoji</h4>
                  <button
                    type="button"
                    className="emoji-picker-close"
                    onClick={() => setShowEmojiPicker(false)}
                  >
                    ✕
                  </button>
                </div>
                
                {/* ✅ CATEGORIAS DE EMOJIS */}
                <div className="emoji-categories-tabs">
                  {emojiCategories.map((category) => (
                    <button
                      key={category.id}
                      type="button"
                      className={`emoji-category-tab ${selectedEmojiCategory === category.id ? 'active' : ''}`}
                      onClick={() => setSelectedEmojiCategory(category.id)}
                      title={category.name}
                    >
                      <span className="emoji-tab-icon">{category.icon}</span>
                      <span className="emoji-tab-name">{category.name}</span>
                    </button>
                  ))}
                </div>
                
                {/* ✅ EMOJIS DA CATEGORIA SELECIONADA */}
                <div className="emoji-picker-content">
                  <div className="emoji-category-section">
                    <div className="emoji-category-title">
                      {emojiCategories.find(c => c.id === selectedEmojiCategory)?.name}
                    </div>
                    <div className="emoji-grid">
                      {emojiCategories
                        .find(c => c.id === selectedEmojiCategory)
                        ?.emojis.map((emoji, index) => (
                          <button
                            key={`${selectedEmojiCategory}-${index}`}
                            type="button"
                            className="emoji-button"
                            onClick={() => insertEmoji(emoji)}
                            title={`Inserir ${emoji}`}
                          >
                            {emoji}
                          </button>
                        ))}
                    </div>
                  </div>
                </div>
                
                <div className="emoji-picker-footer">
                  <p className="emoji-tip">Clique em um emoji para inserir na descrição</p>
                </div>
              </div>
            )}
          </div>
          
          {/* ✅ SEÇÃO DE LINK DE MÍDIA */}
          <div className="media-link-section">
            <label htmlFor="mediaUrl">
              <span className="label-icon">🔗</span>
              Link da Mídia (Opcional)
            </label>
            <p className="media-description">
              Cole o link de uma imagem, GIF ou vídeo (YouTube, Vimeo, MP4, etc.)
            </p>
            
            <div className="media-url-container">
              <input
                type="url"
                id="mediaUrl"
                value={mediaUrl}
                onChange={(e) => setMediaUrl(e.target.value)}
                placeholder="Ex: https://i.imgur.com/exemplo.jpg ou https://youtube.com/watch?v=..."
                className="media-url-input"
                disabled={loading}
              />
              
              {mediaUrl && (
                <div className="media-link-preview">
                  <span className="link-preview-icon">🔗</span>
                  <span className="link-preview-text" title={mediaUrl}>
                    {mediaUrl.length > 50 ? mediaUrl.substring(0, 50) + '...' : mediaUrl}
                  </span>
                  <button 
                    type="button" 
                    className="clear-link-button"
                    onClick={() => setMediaUrl('')}
                    disabled={loading}
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>
            
            <div className="media-examples">
              <p><strong>Exemplos suportados:</strong></p>
              <ul>
                <li>Imagens: .jpg, .png, .gif, .webp</li>
                <li>Vídeos: YouTube, Vimeo, .mp4, .webm</li>
                <li>Seu backend detectará automaticamente o tipo!</li>
              </ul>
            </div>
          </div>
          
          {/* Selecione Categoria */}
          <div className="category-section">
            <h3 className="section-subtitle">
              <span className="section-icon">🏷️</span>
              Selecione uma categoria
              <span className="required"> *</span>
            </h3>
            <p className="section-description">
              Escolha a categoria que melhor se encaixa com sua pergunta
            </p>
            <div className="categories-grid">
              {categories.map((category) => (
                <button
                  key={category.id}
                  className={`category-button ${selectedCategory === category.id ? 'selected' : ''}`}
                  onClick={() => handleCategorySelect(category.id)}
                  style={{
                    backgroundColor: selectedCategory === category.id ? category.color + '20' : 'transparent',
                    borderColor: selectedCategory === category.id ? category.color : (darkMode ? '#444' : '#ddd'),
                    color: selectedCategory === category.id ? category.color : (darkMode ? '#ccc' : '#333')
                  }}
                  disabled={loading}
                >
                  <div className="category-header">
                    <span className="category-emoji">{category.emoji}</span>
                    <span className="category-name">{category.name}</span>
                  </div>
                  <p className="category-description">{category.description}</p>
                </button>
              ))}
            </div>
          </div>
          
          {/* Opções Adicionais */}
          <div className="options-section">
            <div className="option-item">
              <input
                type="checkbox"
                id="anonymous"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                disabled={loading}
                className="option-checkbox"
              />
              <label htmlFor="anonymous" className="option-label">
                <div className="option-label-content">
                  <span className="option-icon">🕵️</span>
                  <div>
                    <div className="option-title">Perguntar anonimamente</div>
                    <div className="option-description">Sua identidade não será revelada</div>
                  </div>
                </div>
              </label>
            </div>
          </div>
          
          {/* Dica */}
          <div className="tip-box">
            <div className="tip-icon">💡</div>
            <div className="tip-content">
              <strong>Dicas para uma boa pergunta:</strong>
              <ul>
                <li>Seja claro e específico</li>
                <li>Use emojis para expressar melhor seus sentimentos 😊</li>
                <li>Inclua links de imagens ou vídeos para ilustrar</li>
                <li>Escolha a categoria correta para respostas mais precisas</li>
                <li>Revise antes de publicar</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="modal-actions">
          <button 
            className="modal-cancel" 
            onClick={onClose}
            disabled={loading}
          >
            Cancelar
          </button>
          <button 
            className="modal-post"
            onClick={handleSubmit}
            disabled={loading || !questionTitle.trim() || questionTitle.length < 5 || !selectedCategory}
            style={{
              backgroundColor: selectedCategoryObj?.color || '#007bff',
              opacity: (!questionTitle.trim() || questionTitle.length < 5 || !selectedCategory) ? 0.6 : 1
            }}
          >
            {loading ? (
              <>
                <span className="spinner-small"></span>
                Publicando...
              </>
            ) : (
              <>
                <span className="post-icon">🚀</span>
                Publicar Pergunta
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AskModal;