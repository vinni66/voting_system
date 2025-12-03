import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Typography, Container, Grid, Paper } from '@mui/material';
import HowToVoteIcon from '@mui/icons-material/HowToVote';
import AssessmentIcon from '@mui/icons-material/Assessment';
import { getVoteStatus } from '../services/api';

const Dashboard = () => {
  const navigate = useNavigate();
  const [userStatus, setUserStatus] = useState({ fullName: 'Voter', hasVoted: false });
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    const fetchUserStatus = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      try {
        const { data } = await getVoteStatus();
        setUserStatus(data);
      } catch (error) {
        console.error("Failed to fetch user status:", error);
        setFetchError("Failed to load user status. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserStatus();
  }, [navigate]);

  if (isLoading) {
    return (
      <Container maxWidth="md" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography variant="h5">Loading dashboard...</Typography>
      </Container>
    );
  }

  if (fetchError) {
    return (
      <Container maxWidth="md" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: 'error.main' }}>
        <Typography variant="h5">{fetchError}</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Hello, {userStatus.fullName}!
        </Typography>
        <Paper elevation={3} sx={{ p: 3, mb: 4, backgroundColor: 'background.paper' }}>
            <Typography variant="h6" gutterBottom>
                {userStatus.hasVoted ? "Thank you for participating!" : "You have one vote. Make it count."}
            </Typography>
            <Typography color="text.secondary">
                {userStatus.hasVoted ? "You have already cast your vote in this election." : "Choose your preferred candidate from the list and cast your vote."}
            </Typography>
        </Paper>

        <Grid container spacing={4}>
            <Grid item xs={12} sm={6}>
                <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    startIcon={<HowToVoteIcon />}
                    onClick={() => navigate('/vote')}
                    sx={{ py: 3 }}
                    disabled={userStatus.hasVoted || isLoading}
                >
                    Vote Now
                </Button>
            </Grid>
            <Grid item xs={12} sm={6}>
                <Button
                    fullWidth
                    variant="outlined"
                    size="large"
                    startIcon={<AssessmentIcon />}
                    onClick={() => navigate('/results')}
                    sx={{ py: 3 }}
                >
                    View Results
                </Button>
            </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Dashboard;
