// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Sobre from './pages/Sobre';
import ComoFunciona from './pages/ComoFunciona';
import Politicas from './pages/Politicas';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sobre" element={<Sobre />} />
        <Route path="/como-funciona" element={<ComoFunciona />} />
        <Route path="/politicas" element={<Politicas />} />
        {/* Adicione outras rotas conforme criar */}
      </Routes>
    </Router>
  );
}

export default App;