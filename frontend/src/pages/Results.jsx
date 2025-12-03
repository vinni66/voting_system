import { useState, useEffect } from 'react';
import { getResults as apiGetResults } from '../services/api';
import { Box, Typography, Container, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CircularProgress, Alert, IconButton } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Results = () => {
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [winnerDeclared, setWinnerDeclared] = useState(false);

  // use the exported API helper — keeps the component independent of the axios instance
  const getResults = () => apiGetResults();

  const fetchResults = async () => {
    setIsLoading(true);
    setError('');
    try {
      const { data } = await getResults();
      setResults(data);
      setWinnerDeclared(data.some(candidate => candidate.isWinner));
    } catch (err) {
      // include the error in the console so the linter doesn't complain about an unused variable
      console.error('Error fetching results:', err);
      setError('Failed to load results.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchResults(); // Initial fetch

    let intervalId = setInterval(fetchResults, 5000); // Poll every 5 seconds

    const handleVisibilityChange = () => {
      if (document.hidden) {
        clearInterval(intervalId); // Stop polling when tab is not visible
      } else {
        fetchResults(); // Fetch immediately when tab becomes visible again
        clearInterval(intervalId); // Clear old interval just in case
        intervalId = setInterval(fetchResults, 5000); // Restart polling
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup on unmount
    return () => {
      clearInterval(intervalId);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const candidate = payload[0].payload;
      return (
        <Paper sx={{ p: 1 }}>
          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>{label}</Typography>
          <Typography variant="body2">Votes: {payload[0].value}</Typography>
          {candidate.isWinner && (
            <Typography variant="body2" sx={{ color: 'gold', fontWeight: 'bold' }}>&#127881; Winner! &#127881;</Typography>
          )}
        </Paper>
      );
    }
    return null;
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', my: 4 }}>
        <Typography variant="h4" component="h1">
          Live Election Results
        </Typography>
        <IconButton onClick={fetchResults} color="primary" disabled={isLoading} aria-label="refresh results">
          <RefreshIcon />
        </IconButton>
      </Box>

      {winnerDeclared && (
        <>
          <Alert severity="success" sx={{ mb: 2 }}>
            Election winner(s) have been declared!
          </Alert>
          <Paper elevation={3} sx={{ p: 2, mb: 4, backgroundColor: '#e8f5e9' }}>
            {(() => {
              const winningCandidates = results.filter(c => c.isWinner);
              if (winningCandidates.length === 1) {
                return (
                  <Typography variant="h6" align="center" color="primary.main">
                    &#127881;{' '}
                    <Typography component="span" variant="h6" sx={{ fontWeight: 'bold' }}>
                      {winningCandidates[0].name}
                    </Typography>{' '}
                    is the winner with{' '}
                    <Typography component="span" variant="h6" sx={{ fontWeight: 'bold' }}>
                      {winningCandidates[0].votes}
                    </Typography>{' '}
                    votes! &#127881;
                  </Typography>
                );
              } else if (winningCandidates.length > 1) {
                return (
                  <Typography variant="h6" align="center" color="primary.main">
                    &#127881; It's a tie between{' '}
                    <Typography component="span" variant="h6" sx={{ fontWeight: 'bold' }}>
                      {winningCandidates.map(c => c.name).join(' and ')}
                    </Typography>{' '}
                    with{' '}
                    <Typography component="span" variant="h6" sx={{ fontWeight: 'bold' }}>
                      {winningCandidates[0].votes}
                    </Typography>{' '}
                    votes each! &#127881;
                  </Typography>
                );
              }
              return null; // Should not happen if winnerDeclared is true
            })()}
          </Paper>
        </>
      )}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : results.length > 0 ? (
        <>
          <Paper sx={{ mb: 4, p: 2, height: 400 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={results}
                margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,0,0,0.1)' }} />
                <Legend />
                <Bar dataKey="votes" fill="#90caf9" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>

          <TableContainer component={Paper}>
            <Table aria-label="election results table">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Candidate</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>Votes</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 'bold' }}>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {results.map((row) => (
                  <TableRow
                    key={row.name}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row" sx={{ display: 'flex', alignItems: 'center' }}>
                      {row.photo && <img src={row.photo} alt={row.name} style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: '50%', marginRight: 8 }} />}
                      {row.name}
                      {row.isWinner && (
                        <Typography component="span" sx={{ ml: 1, color: 'gold', fontWeight: 'bold' }}>&#127881; Winner! &#127881;</Typography>
                      )}
                    </TableCell>
                    <TableCell align="right">{row.votes}</TableCell>
                    <TableCell align="center">
                      {row.isWinner ? (
                        <Typography component="span" sx={{ color: 'gold', fontWeight: 'bold' }}>Winner</Typography>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      ) : (
        <Typography align="center" sx={{mt: 4}}>No results to display yet.</Typography>
      )}
    </Container>
  );
};

export default Results;
