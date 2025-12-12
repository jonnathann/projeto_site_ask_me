// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Home from './pages/Home';
import Sobre from './pages/Sobre';
import ComoFunciona from './pages/ComoFunciona';
import Politicas from './pages/Politicas';
import Login from './pages/Login';
import Registro from './pages/Registro'; // ✅ Importar a nova página

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
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;