// src/test-backend.js
import api from './services/api';

async function testBackend() {
  console.log('🔍 Testando conexão com backend...');
  console.log('URL base:', api.defaults.baseURL);
  
  try {
    // Tente acessar a raiz do backend ou um endpoint de health
    const response = await api.get('/');
    console.log('✅ Conexão bem-sucedida!');
    console.log('Status:', response.status);
    console.log('Dados:', response.data);
    return true;
  } catch (error) {
    console.log('❌ Falha na conexão:');
    console.log('Erro:', error.message);
    
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Data:', error.response.data);
    } else if (error.request) {
      console.log('Servidor não respondeu');
    }
    
    return false;
  }
}

// Para testar no console do navegador
// window.testBackend = testBackend;
export default testBackend;