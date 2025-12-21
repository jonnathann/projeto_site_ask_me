// src/App.jsx - VERSÃO SIMPLES
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Home from './pages/Home';
import Sobre from './pages/Sobre';
import ComoFunciona from './pages/ComoFunciona';
import Politicas from './pages/Politicas';
import Login from './pages/Login';
import Registro from './pages/Registro';
import Feed from './pages/Feed';
import Profile from './pages/Profile';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sobre" element={<Sobre />} />
          <Route path="/como-funciona" element={<ComoFunciona />} />
          <Route path="/politicas" element={<Politicas />} />
          <Route path="/login" element={<Login />} />
          <Route path='/registro' element={<Registro />} />
          <Route path='/feed' element={<Feed />} />
          
          {/* ✅ DUAS ROTAS PARA PERFIL: */}
          
          {/* 1. Rota com userId (para acessar perfil de outro usuário) */}
          <Route path='/profile/:userId' element={<Profile/>} />
          
          {/* 2. Rota sem userId (para "Meu Perfil" no Header) */}
          <Route path='/profile' element={<Profile/>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;