import { useState } from 'react';
import { ApiResponse, UserLoginRequest } from '@repo/shared';
import { apiClient } from '../api/client';

interface LoginFormProps {
  onLogin: (token: string) => void;
}

export function LoginForm({ onLogin }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const body: UserLoginRequest = { email, password };
      const data = await apiClient<ApiResponse<{ access_token: string }>>(
        'auth/login',
        {
          method: 'POST',
          body: JSON.stringify(body),
        },
      );

      if (data.success && data.data) {
        localStorage.setItem('token', data.data.access_token);
        onLogin(data.data.access_token);
      } else {
        setError(data.error || 'Invalid credentials');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-form">
      <h2>Login</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="login-email">Email:</label>
          <input
            id="login-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <div>
          <label htmlFor="login-password">Password:</label>
          <input
            id="login-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      {error && <div className="error">{error}</div>}
    </div>
  );
}
