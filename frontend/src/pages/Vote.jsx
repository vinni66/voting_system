import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCandidates, vote } from '../services/api';
import { Box, Button, Typography, Container, Grid, Card, CardContent, CardActions, CircularProgress, Alert } from '@mui/material';

const Vote = () => {
  const [candidates, setCandidates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [hasVoted, setHasVoted] = useState(false);
  const [isVoting, setIsVoting] = useState(false); // New state to prevent double-clicking
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCandidates = async () => {
      setIsLoading(true);
      try {
        const { data } = await getCandidates();
        setCandidates(data);
      } catch (err) {
        setError('Failed to load candidates. You may need to log in.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchCandidates();
  }, []);

  const handleVote = async (candidateId) => {
    setIsVoting(true); // Disable button immediately
    try {
      await vote(candidateId);
      setHasVoted(true);
      alert('Your vote has been cast successfully!');
      navigate('/results');
    } catch (err) {
      const errorMsg = err.response?.data?.msg || 'Voting failed.';
      setError(errorMsg);
      alert(errorMsg);
    } finally {
      setIsVoting(false); // Re-enable button after API call (if not already navigated)
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ my: 4 }}>
        Cast Your Vote
      </Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {hasVoted ? (
        <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h6">Thank you for voting!</Typography>
            <Button variant="contained" sx={{mt: 2}} onClick={() => navigate('/results')}>View Live Results</Button>
        </Box>
      ) : (
        <Grid container spacing={4}>
          {candidates.map((candidate) => (
            <Grid item key={candidate._id} xs={12} sm={6} md={4}>
              <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  {candidate.photo && (
                    <Box sx={{ mb: 1, textAlign: 'center' }}>
                      <img src={candidate.photo} alt={candidate.name} style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: '50%' }} />
                    </Box>
                  )}
                  <Typography gutterBottom variant="h5" component="h2">
                    {candidate.name}
                  </Typography>
                  <Typography>
                    {candidate.party || 'Independent'}
                  </Typography>
                  <Typography color="text.secondary" sx={{mt: 1}}>
                    {candidate.description || 'No description available.'}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={() => handleVote(candidate._id)}
                    disabled={isVoting} // Disable button when voting is in progress
                  >
                    {isVoting ? <CircularProgress size={24} /> : `Vote for ${candidate.name}`}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
       {candidates.length === 0 && !isLoading && <Typography align="center">No candidates have been added yet.</Typography>}
    </Container>
  );
};

export default Vote;
