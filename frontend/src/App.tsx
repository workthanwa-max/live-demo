import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Live from './pages/Live';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/live" element={<Live />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
