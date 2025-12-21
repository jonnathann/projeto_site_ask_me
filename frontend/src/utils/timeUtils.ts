// ✅ FUNÇÃO REUTILIZÁVEL PARA TODO O APP
export const getTimeAgo = (dateString: string): { text: string; fullDate: string } => {
  try {
    const postDate = new Date(dateString);
    const now = new Date();
    
    // ⭐ CORREÇÃO: Ajusta diferença de fuso horário
    let diffMs = now.getTime() - postDate.getTime();
    
    // Se a data estiver no futuro (problema de fuso horário), ajusta
    if (diffMs < 0) {
      // Ajusta 3 horas (10800000 ms) - timezone do Brasil
      diffMs = now.getTime() - (postDate.getTime() - 10800000);
    }
    
    const diffSec = Math.floor(diffMs / 1000);
    
    // Data formatada completa
    const fullDate = postDate.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    
    // Cálculo do tempo relativo
    if (diffSec < 60) {
      return { text: 'Agora mesmo', fullDate };
    } else if (diffSec < 3600) {
      const minutes = Math.floor(diffSec / 60);
      return { 
        text: `Há ${minutes} minuto${minutes > 1 ? 's' : ''}`, 
        fullDate 
      };
    } else if (diffSec < 86400) {
      const hours = Math.floor(diffSec / 3600);
      return { 
        text: `Há ${hours} hora${hours > 1 ? 's' : ''}`, 
        fullDate 
      };
    } else if (diffSec < 2592000) {
      const days = Math.floor(diffSec / 86400);
      return { 
        text: `Há ${days} dia${days > 1 ? 's' : ''}`, 
        fullDate 
      };
    } else if (diffSec < 31536000) {
      const months = Math.floor(diffSec / 2592000);
      return { 
        text: `Há ${months} mês${months > 1 ? 'es' : ''}`, 
        fullDate 
      };
    } else {
      const years = Math.floor(diffSec / 31536000);
      return { 
        text: `Há ${years} ano${years > 1 ? 's' : ''}`, 
        fullDate 
      };
    }
  } catch {
    return { text: '', fullDate: '' };
  }
};

// ✅ FUNÇÃO PARA FORMATAR DATA COMPLETA
export const formatFullDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return dateString;
  }
};

// ✅ FUNÇÃO SIMPLES (apenas texto)
export const getSimpleTimeAgo = (dateString: string): string => {
  const result = getTimeAgo(dateString);
  return result.text;
};