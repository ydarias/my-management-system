import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { RegisterPage } from './pages/RegisterPage';
import { LoginPage } from './pages/LoginPage';
import { HelloPage } from './pages/HelloPage';
import './App.css';

function App() {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem('token'),
  );

  const handleLogin = (newToken: string) => {
    setToken(newToken);
  };

  const handleLogout = () => {
    setToken(null);
  };

  return (
    <BrowserRouter>
      <div className="app">
        <Routes>
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/login"
            element={
              token ? (
                <Navigate to="/hello" replace />
              ) : (
                <LoginPage onLogin={handleLogin} />
              )
            }
          />
          <Route
            path="/hello"
            element={
              token ? (
                <HelloPage onLogout={handleLogout} />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="*"
            element={
              <Navigate to={token ? '/hello' : '/login'} replace />
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
