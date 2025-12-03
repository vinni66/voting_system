import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Box, Button } from '@mui/material';
import { decodeToken } from '../utils/jwt';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  let user = null;
  if (token) {
    try {
      const decoded = decodeToken(token);
      if (decoded.exp * 1000 > Date.now()) {
        user = decoded.user;
      } else {
        localStorage.removeItem('token');
      }
    } catch(e) {
      localStorage.removeItem('token');
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <AppBar position="static" color="transparent" elevation={0} sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
      <Toolbar>
        <Typography variant="h6" component={RouterLink} to="/" sx={{ flexGrow: 1, color: 'inherit', textDecoration: 'none' }}>
          Voting App
        </Typography>
        <Box>
          <Button component={RouterLink} to="/results" color="inherit">
            Results
          </Button>
          {user ? (
            <>
              {user.isAdmin && (
                <Button component={RouterLink} to="/admin" color="inherit">
                  Admin
                </Button>
              )}
              <Button onClick={handleLogout} color="inherit">
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button component={RouterLink} to="/login" color="inherit">
                Login
              </Button>
              <Button component={RouterLink} to="/register" color="inherit">
                Register
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;