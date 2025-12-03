import { Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline, Box, Container } from '@mui/material';
import theme from './theme';

// import Navbar from './components/Navbar';
// import PrivateRoute from './components/PrivateRoute';
// import AdminRoute from './components/components/AdminRoute';

import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
// import Dashboard from './pages/Dashboard';
import Admin from './pages/Admin';
import Vote from './pages/Vote';
import Results from './pages/Results';
import ViewUsers from './pages/ViewUsers';


function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        {/* <Navbar /> */}
        <Container component="main" sx={{ flexGrow: 1, py: 4 }}>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/results" element={<Results />} />
            <Route path="/" element={<Dashboard />} />
            {/* <Route path="/" element={<Dashboard />} /> Temporarily made Dashboard public */}
            <Route path="/vote" element={<Vote />} /> {/* Temporarily made Vote public */}

            {/* Admin Routes (Temporarily commented out) */}
            {/* <Route element={<AdminRoute />}> */}
              <Route path="/admin" element={<Admin />} />
              <Route path="/admin/users" element={<ViewUsers />} />
            {/* </Route> */}
          </Routes>
        </Container>
      </Box>
    </ThemeProvider>
  )
}

export default App;
