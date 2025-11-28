import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from './components/Layout/Header';
import { QuestionFeed } from './components/Question/QuestionFeed';
import { QuestionPage } from './pages/QuestionPage/QuestionPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
        <Header />
        <Routes>
          <Route path="/" element={<QuestionFeed />} />
          <Route path="/question/:id" element={<QuestionPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;