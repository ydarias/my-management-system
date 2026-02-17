import { Link } from 'react-router-dom';
import { LoginForm } from '../components/LoginForm';

interface LoginPageProps {
  onLogin: (token: string) => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  return (
    <div className="page">
      <h1>Login</h1>
      <LoginForm onLogin={onLogin} />
      <p className="page-link">
        Don't have an account? <Link to="/register">Register</Link>
      </p>
    </div>
  );
}
