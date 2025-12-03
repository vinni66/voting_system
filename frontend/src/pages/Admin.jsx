import { useState, useEffect } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { addCandidate, getCandidates, updateCandidate, deleteCandidate, resetVotes, declareWinner } from '../services/api';
import { Box, Button, Typography, Container, TextField, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Alert, Grid, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PeopleIcon from '@mui/icons-material/People';
import WarningIcon from '@mui/icons-material/Warning';
import EditCandidateModal from '../components/EditCandidateModal';
import DeleteConfirmDialog from '../components/DeleteConfirmDialog';

const Admin = () => {
  const [candidates, setCandidates] = useState([]);
  const [formState, setFormState] = useState({ name: '', party: '', photo: '', description: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // State for modals
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [declareResultDialogOpen, setDeclareResultDialogOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  const fetchCandidates = async () => {
    try {
      const { data } = await getCandidates();
      setCandidates(data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch candidates.');
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  const handleChange = (e) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!formState.name) {
      setError('Candidate name is required.');
      return;
    }
    try {
      await addCandidate(formState);
      setSuccess(`Candidate "${formState.name}" added successfully!`);
      setFormState({ name: '', party: '', description: '' }); // Reset form
      fetchCandidates();
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to add candidate.');
    }
  };

  const handleEditOpen = (candidate) => {
    setSelectedCandidate(candidate);
    setEditModalOpen(true);
  };

  const handleEditClose = () => {
    setEditModalOpen(false);
    setSelectedCandidate(null);
  };

  const handleUpdateSave = async (id, updatedData) => {
    try {
      await updateCandidate(id, updatedData);
      setSuccess('Candidate updated successfully!');
      handleEditClose();
      fetchCandidates();
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to update candidate.');
    }
  };

  const handleDeleteOpen = (candidate) => {
    setSelectedCandidate(candidate);
    setDeleteDialogOpen(true);
  };

  const handleDeleteClose = () => {
    setDeleteDialogOpen(false);
    setSelectedCandidate(null);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteCandidate(selectedCandidate._id);
      setSuccess('Candidate deleted successfully!');
      fetchCandidates();
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to delete candidate.');
    } finally {
      handleDeleteClose();
    }
  };

  const handleResetOpen = () => {
    setResetDialogOpen(true);
  };

  const handleResetClose = () => {
    setResetDialogOpen(false);
  };

  const handleResetConfirm = async () => {
    try {
      await resetVotes();
      setSuccess('All votes have been successfully reset.');
      fetchCandidates(); // Refresh candidate vote counts
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to reset votes.');
    } finally {
      handleResetClose(); // Ensure dialog closes
    }
  };

  const handleDeclareResultOpen = () => {
    setDeclareResultDialogOpen(true);
  };

  const handleDeclareResultClose = () => {
    setDeclareResultDialogOpen(false);
  };

  const handleDeclareResultConfirm = async () => {
    try {
      await declareWinner();
      setSuccess('Election winner(s) declared successfully!');
      fetchCandidates(); // Refresh to show winner(s)
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to declare winner(s).');
    } finally {
      handleDeclareResultClose();
    }
  };


  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom sx={{ my: 4 }}>
        Admin Dashboard
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2, height: '100%' }}>
                <Typography variant="h6" gutterBottom>Admin Controls</Typography>
                <Button component={RouterLink} to="/admin/users" startIcon={<PeopleIcon />} variant="outlined">
                    View User Management
                </Button>
            </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2, height: '100%' }}>
                <Typography variant="h6" gutterBottom>Election Controls</Typography>
                <Button onClick={handleResetOpen} startIcon={<WarningIcon />} variant="contained" color="error" sx={{ mr: 2 }}>
                    Reset All Votes
                </Button>
                <Button onClick={handleDeclareResultOpen} startIcon={<WarningIcon />} variant="contained" color="success">
                    Declare Result
                </Button>
            </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Typography variant="h6" gutterBottom>Add New Candidate</Typography>
          <Paper component="form" onSubmit={handleAddSubmit} sx={{ p: 2 }}>
            <TextField fullWidth margin="normal" label="Candidate Name" name="name" value={formState.name} onChange={handleChange} required />
            <TextField fullWidth margin="normal" label="Party (Optional)" name="party" value={formState.party} onChange={handleChange} />
            <TextField fullWidth margin="normal" label="Description (Optional)" name="description" multiline rows={4} value={formState.description} onChange={handleChange} />
            <TextField fullWidth margin="normal" label="Photo URL (Optional)" name="photo" value={formState.photo} onChange={handleChange} />
            <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>Add Candidate</Button>
          </Paper>
        </Grid>

        <Grid item xs={12} md={8}>
          <Typography variant="h6" gutterBottom>Current Candidates</Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Photo</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Party</TableCell>
                  <TableCell align="right">Votes</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {candidates.map((c) => (
                  <TableRow key={c._id}>
                    <TableCell>
                      {c.photo && <img src={c.photo} alt={c.name} style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: '50%' }} />}
                    </TableCell>
                    <TableCell>{c.name}</TableCell>
                    <TableCell>{c.party || 'N/A'}</TableCell>
                    <TableCell align="right">{c.votes}</TableCell>
                    <TableCell align="center">
                      <IconButton onClick={() => handleEditOpen(c)} color="primary"><EditIcon /></IconButton>
                      <IconButton onClick={() => handleDeleteOpen(c)} color="error"><DeleteIcon /></IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
      
      {selectedCandidate && (
        <EditCandidateModal
          open={editModalOpen}
          handleClose={handleEditClose}
          candidate={selectedCandidate}
          onSave={handleUpdateSave}
        />
      )}

      {selectedCandidate && (
        <DeleteConfirmDialog
          open={deleteDialogOpen}
          handleClose={handleDeleteClose}
          onConfirm={handleDeleteConfirm}
          itemName={selectedCandidate.name}
        />
      )}

      <DeleteConfirmDialog
        open={resetDialogOpen}
        handleClose={handleResetClose}
        onConfirm={handleResetConfirm}
        itemName={"the entire election (all votes will be set to 0)"}
      />

      <DeleteConfirmDialog
        open={declareResultDialogOpen}
        handleClose={handleDeclareResultClose}
        onConfirm={handleDeclareResultConfirm}
        itemName={"the election winner(s). This will mark the candidate(s) with the highest votes as winner(s)."}
      />

    </Container>
  );
};

export default Admin;
