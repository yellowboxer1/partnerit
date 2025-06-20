import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Companies from './pages/Companies';
import Financial from './pages/Financial';
import Projects from './pages/Projects';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Companies />} />
        <Route path="/financial/:id" element={<Financial />} />
        <Route path="/projects/:companyId" element={<Projects />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
