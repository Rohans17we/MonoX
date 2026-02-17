import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { Toaster } from './components/ui/toaster';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import Dashboard from './pages/Dashboard';
import GameRoom from './pages/GameRoom';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <div className="App min-h-screen">
            <Header />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/room/:roomId" element={<GameRoom />} />
            </Routes>
            <Toaster />
          </div>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;