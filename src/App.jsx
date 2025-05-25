import { useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import AuthPage from './pages/AuthPage';
import { useNavigate } from 'react-router-dom';

export default function App() {
  const { session, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (session !== undefined && user) {
      navigate('/dashboard');
    }
  }, [session, user, navigate]);

  if (session === undefined) {
    return <div className="p-6 text-center">Loading...</div>;
  }

  return <AuthPage />;
}
