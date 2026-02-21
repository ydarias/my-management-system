import { useState } from 'react';
import { CreateUserRequest, UserResponse } from '@repo/shared';
import { apiClient } from '../api/client';

interface CreateUserFormProps {
  onSuccess?: () => void;
}

export function CreateUserForm({ onSuccess }: CreateUserFormProps) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<UserResponse | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const body: CreateUserRequest = {
        email,
        name,
        password,
      };
      const user = await apiClient<UserResponse>('users', {
        method: 'POST',
        body: JSON.stringify(body),
      });

      setSuccess(user);
      setEmail('');
      setName('');
      setPassword('');
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-user-form">
      <h2>Create New User</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <div>
          <label htmlFor="name">Name:</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <div>
          <label htmlFor="password">Password:</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create User'}
        </button>
      </form>

      {error && <div className="error">{error}</div>}
      {success && (
        <div className="success">
          User created: {success.name} ({success.email})
        </div>
      )}
    </div>
  );
}
