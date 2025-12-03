import { useNavigate } from 'react-router-dom';

const decodeToken = (token) => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
};

// This is a simple component shown after a user logs in.
const Home = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  
  let isAdmin = false;
  if (token) {
    const decoded = decodeToken(token);
    if (decoded && decoded.exp * 1000 > Date.now()) {
      isAdmin = decoded.user?.isAdmin;
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <h1>Welcome</h1>
      <p>You are logged in.</p>
      {isAdmin && (
        <div style={{ marginTop: '1.5rem', padding: '1rem', backgroundColor: '#1a1a1a', border: '1px solid #555', borderRadius: '8px' }}>
          <p style={{ margin: 0, fontWeight: 'bold', color: '#8aff8a' }}>You are an Administrator.</p>
        </div>
      )}
      <button onClick={handleLogout} style={{ marginTop: '2rem' }}>
        Logout
      </button>
    </div>
  );
};

export default Home;
