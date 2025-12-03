import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Box } from '@mui/material';

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    try {
      localStorage.removeItem('token');
    } catch {
      // ignore
    }
    // small delay so user sees the message briefly
    const t = setTimeout(() => navigate('/login', { replace: true }), 300);
    return () => clearTimeout(t);
  }, [navigate]);

  return (
    <Container maxWidth="sm" sx={{ textAlign: 'center', mt: 8 }}>
      <Box>
        <Typography variant="h5">Logging out…</Typography>
        <Typography variant="body2" sx={{ mt: 2 }}>You will be redirected to the login page.</Typography>
      </Box>
    </Container>
  );
};

export default Logout;
