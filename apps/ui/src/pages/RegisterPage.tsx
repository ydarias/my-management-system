import { useNavigate, Link } from 'react-router-dom';
import { CreateUserForm } from '../components/CreateUserForm';

export function RegisterPage() {
  const navigate = useNavigate();

  return (
    <div className="page">
      <h1>Register</h1>
      <CreateUserForm onSuccess={() => navigate('/login')} />
      <p className="page-link">
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
}
