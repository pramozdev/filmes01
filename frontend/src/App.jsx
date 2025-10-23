import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Favoritos from './pages/Favoritos/Favoritos';
import SharedList from './pages/SharedList';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/favoritos" element={<Favoritos />} />
            <Route path="/shared/:listId" element={<SharedList />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
