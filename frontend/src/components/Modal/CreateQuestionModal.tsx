import { useState, useRef } from 'react';

interface CreateQuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (question: { title: string; content: string; tags: string[] }) => void;
}

// Emojis para o formulário de pergunta (mesmo das respostas)
const emojiCategories = {
  "Carinhas": ["😀", "😃", "😄", "😁", "😆", "😅", "😂", "🤣", "😊", "😇", "🙂", "🙃", "😉", "😌", "😍", "🥰", "😘", "😗", "😙", "😚", "😋", "😛", "😝", "😜", "🤪", "🤨", "🧐", "🤓", "😎", "🤩", "🥳", "😏", "😒", "😞", "😔", "😟", "😕", "🙁", "☹️", "😣", "😖", "😫", "😩", "🥺", "😢", "😭", "😤", "😠", "😡", "🤬", "🤯", "😳", "🥵", "🥶", "😱", "😨", "😰", "😥", "😓", "🤗", "🤔", "🤭", "🤫", "🤥", "😶", "😐", "😑", "😬", "🙄", "😯", "😦", "😧", "😮", "😲", "🥱", "😴", "🤤", "😪", "😵", "🤐", "🥴", "🤢", "🤮", "🤧", "😷", "🤒", "🤕", "🤑", "🤠"],
  "Gestos": ["👋", "🤚", "🖐️", "✋", "🖖", "👌", "🤌", "🤏", "✌️", "🤞", "🤟", "🤘", "🤙", "👈", "👉", "👆", "🖕", "👇", "☝️", "👍", "👎", "✊", "👊", "🤛", "🤜", "👏", "🙌", "👐", "🤲", "🤝", "🙏"],
  "Objetos": ["💯", "💢", "💬", "💭", "💤", "💮", "💥", "💫", "💦", "💨", "🕳️", "💣", "💬", "👁️‍🗨️", "🗨️", "🗯️", "💭", "💤"],
  "Símbolos": ["❤️", "🧡", "💛", "💚", "💙", "💜", "🖤", "🤍", "🤎", "💔", "❣️", "💕", "💞", "💓", "💗", "💖", "💘", "💝", "💟", "☮️", "✝️", "☪️", "🕉️", "☸️", "✡️", "🔯", "🕎", "☯️", "☦️", "🛐", "⛎", "♈", "♉", "♊", "♋", "♌", "♍", "♎", "♏", "♐", "♑", "♒", "♓", "🆔", "⚛️", "🉑", "☢️", "☣️", "📴", "📳", "🈶", "🈚", "🈸", "🈺", "🈷️", "✴️", "🆚", "💮", "🉐", "㊙️", "㊗️", "🈴", "🈵", "🈹", "🈲", "🅰️", "🅱️", "🆎", "🆑", "🅾️", "🆘", "❌", "⭕", "🛑", "⛔", "📛", "🚫", "💯", "💢", "♨️", "🚷", "🚯", "🚳", "🚱", "🔞", "📵", "🚭"]
};

export const CreateQuestionModal = ({ isOpen, onClose, onSubmit }: CreateQuestionModalProps) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Estados para o seletor de emojis
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [activeEmojiCategory, setActiveEmojiCategory] = useState("Carinhas");
  const contentTextareaRef = useRef<HTMLTextAreaElement>(null);

  // Tags populares sugeridas
  const popularTags = [
    'programação', 'react', 'javascript', 'typescript', 'nodejs',
    'web', 'mobile', 'design', 'carreira', 'dúvida', 'ajuda',
    'tecnologia', 'games', 'estudos', 'trabalho'
  ];

  const handleAddTag = (tag: string) => {
    if (tag.trim() && !tags.includes(tag.trim()) && tags.length < 5) {
      setTags([...tags, tag.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  // Função para inserir emoji na descrição
  const insertEmoji = (emoji: string) => {
    const cursorPosition = contentTextareaRef.current?.selectionStart || content.length;
    const newContent = content.slice(0, cursorPosition) + emoji + content.slice(cursorPosition);
    setContent(newContent);
    
    // Focar de volta no textarea e posicionar cursor após o emoji
    setTimeout(() => {
      contentTextareaRef.current?.focus();
      contentTextareaRef.current?.setSelectionRange(cursorPosition + emoji.length, cursorPosition + emoji.length);
    }, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim()) {
      alert('Por favor, preencha título e conteúdo da pergunta');
      return;
    }

    if (tags.length === 0) {
      alert('Adicione pelo menos uma tag para ajudar na organização');
      return;
    }

    setIsSubmitting(true);
    
    try {
      await onSubmit({ title, content, tags });
      // Limpar formulário
      setTitle('');
      setContent('');
      setTags([]);
      setTagInput('');
      onClose();
    } catch (error) {
      console.error('Erro ao criar pergunta:', error);
      alert('Erro ao criar pergunta. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Se o modal não estiver aberto, não renderiza nada
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Overlay escuro */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div 
          className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header do Modal (fixo no topo) */}
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                ✏️ Fazer uma Pergunta
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 text-2xl"
              >
                &times;
              </button>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Compartilhe suas dúvidas com a comunidade
            </p>
          </div>

          {/* Formulário (conteúdo rolável) */}
          <form onSubmit={handleSubmit} className="flex flex-col flex-grow overflow-hidden">
            <div className="px-6 py-4 space-y-4 overflow-y-auto flex-grow">
              {/* Título */}
              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-1">
                  Título da Pergunta *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Como configurar React com TypeScript?"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  maxLength={120}
                  required
                />
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-right">
                  {title.length}/120 caracteres
                </div>
              </div>

              {/* Conteúdo com botão de emoji no canto inferior direito */}
              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-1">
                  Conteúdo Detalhado *
                </label>
                
                <div className="relative">
                  <textarea
                    ref={contentTextareaRef}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Descreva sua pergunta com detalhes... Seja claro e específico para obter melhores respostas! Use emojis para deixar mais expressivo! 😊"
                    className="w-full h-32 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white resize-none"
                    required
                  />
                  
                  {/* Botão de Emoji no canto inferior direito - IGUAL ÀS RESPOSTAS */}
                  <button
                    type="button"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className="absolute bottom-3 right-3 p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                    title="Inserir emoji"
                  >
                    😊
                  </button>
                </div>

                {/* Seletor de Emojis (igual ao das respostas) */}
                {showEmojiPicker && (
                  <div className="mt-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg p-4">
                    {/* Categorias de Emojis */}
                    <div className="flex flex-wrap gap-2 mb-3 border-b border-gray-200 dark:border-gray-600 pb-2">
                      {Object.keys(emojiCategories).map(category => (
                        <button
                          key={category}
                          onClick={() => setActiveEmojiCategory(category)}
                          className={`px-3 py-1 text-xs rounded transition-colors ${
                            activeEmojiCategory === category
                              ? 'bg-blue-500 text-white'
                              : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500'
                          }`}
                        >
                          {category}
                        </button>
                      ))}
                    </div>

                    {/* Grid de Emojis */}
                    <div className="grid grid-cols-8 gap-2 max-h-40 overflow-y-auto">
                      {emojiCategories[activeEmojiCategory as keyof typeof emojiCategories]?.map((emoji, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => insertEmoji(emoji)}
                          className="text-lg hover:bg-gray-100 dark:hover:bg-gray-600 rounded p-1 transition-colors"
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                    
                    <div className="mt-3 pt-2 border-t border-gray-200 dark:border-gray-600 text-xs text-gray-500 dark:text-gray-400">
                      Clique em um emoji para inserir na descrição
                    </div>
                  </div>
                )}
                
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Dica: Inclua exemplos de código ou situações específicas
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                  Tags {tags.length > 0 && `(${tags.length}/5)`}
                </label>
                
                {/* Input para adicionar tags */}
                <div className="flex space-x-2 mb-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTag(tagInput);
                      }
                    }}
                    placeholder="Digite uma tag e pressione Enter"
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddTag(tagInput)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white rounded-lg font-medium transition-colors text-sm"
                  >
                    Adicionar
                  </button>
                </div>

                {/* Tags selecionadas */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {tags.map((tag) => (
                    <div 
                      key={tag}
                      className="inline-flex items-center px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-sm"
                    >
                      <span>#{tag}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-2 text-blue-500 hover:text-blue-700 dark:hover:text-blue-200"
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>

                {/* Tags populares */}
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Tags populares:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {popularTags.map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => handleAddTag(tag)}
                        disabled={tags.includes(tag) || tags.length >= 5}
                        className={`px-3 py-1 text-sm rounded-full transition-colors ${
                          tags.includes(tag)
                            ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                            : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        #{tag}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Dicas */}
              <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-2 flex items-center text-sm">
                  <span className="mr-2">💡</span>
                  Dicas para uma boa pergunta
                </h4>
                <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1">
                  <li>• Seja específico e claro no título</li>
                  <li>• Inclua contexto e o que você já tentou</li>
                  <li>• Use emojis para deixar mais expressivo 😊</li>
                  <li>• Adicione tags relevantes para aumentar visibilidade</li>
                  <li>• Revise antes de publicar</li>
                </ul>
              </div>
            </div>

            {/* Footer do Modal (fixo no final) */}
            <div className="px-6 py-3 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-3 flex-shrink-0">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm"
                disabled={isSubmitting}
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !title.trim() || !content.trim() || tags.length === 0}
                className="px-5 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg font-semibold hover:bg-blue-700 dark:hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm flex items-center"
              >
                {isSubmitting ? (
                  <>
                    <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                    Publicando...
                  </>
                ) : (
                  <>
                    <span className="mr-2">🚀</span>
                    Publicar Pergunta
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};