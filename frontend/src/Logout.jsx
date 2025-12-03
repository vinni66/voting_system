import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem('token');
    // You might want to add logic here to inform other parts of the app that the user has logged out.
    navigate('/login');
  }, [navigate]);

  return null; // This component doesn't render anything.
};

export default Logout;