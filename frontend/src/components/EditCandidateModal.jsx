import { Modal, Box, Typography, TextField, Button } from '@mui/material';
import { useState, useEffect } from 'react';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
};

const EditCandidateModal = ({ open, handleClose, candidate, onSave }) => {
  const [formData, setFormData] = useState({ name: '', party: '', photo: '', description: '' });

  useEffect(() => {
    if (candidate) {
      setFormData({
        name: candidate.name || '',
        party: candidate.party || '',
        photo: candidate.photo || '', // Add photo to form data
        description: candidate.description || '',
      });
    }
  }, [candidate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    onSave(candidate._id, formData);
  };

  if (!candidate) return null;

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="edit-candidate-modal-title"
    >
      <Box sx={style}>
        <Typography id="edit-candidate-modal-title" variant="h6" component="h2">
          Edit {candidate.name}
        </Typography>
        <TextField
          fullWidth
          margin="normal"
          label="Candidate Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <TextField
          fullWidth
          margin="normal"
          label="Party"
          name="party"
          value={formData.party}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Description"
          name="description"
          multiline
          rows={4}
          value={formData.description}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Photo URL"
          name="photo"
          value={formData.photo}
          onChange={handleChange}
        />
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <Button onClick={handleClose} sx={{ mr: 1 }}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">Save Changes</Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default EditCandidateModal;
