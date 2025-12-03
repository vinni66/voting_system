import { Navigate, Outlet } from 'react-router-dom';

const decodeToken = (token) => {
  try {
    // Decode the payload part of the JWT
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    // If decoding fails, the token is invalid
    localStorage.removeItem('token');
    return null;
  }
};

const AdminRoute = () => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    return <Navigate to="/login" />;
  }

  const decoded = decodeToken(token);
  
  // Check if token is expired
  if (decoded && decoded.exp * 1000 < Date.now()) {
    localStorage.removeItem('token');
    return <Navigate to="/login" />;
  }
  
  const isAdmin = decoded?.user?.isAdmin;

  // If user is an admin, render the child routes.
  // Otherwise, redirect them to the home page.
  return isAdmin ? <Outlet /> : <Navigate to="/" />;
};

export default AdminRoute;