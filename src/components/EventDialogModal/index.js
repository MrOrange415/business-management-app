import React, { useState } from 'react';
import { Dialog, TextField, Button, DialogActions, DialogContent, DialogTitle } from '@mui/material';

function EventDialogModal({ open, onClose, onSubmit, defaultDate }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = () => {
    onSubmit({
      title,
      description,
      date: defaultDate
    });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add New Event</DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          label="Title"
          fullWidth
          variant="outlined"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Description"
          fullWidth
          multiline
          rows={4}
          variant="outlined"
          value={description}
          onChange={e => setDescription(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Date"
          fullWidth
          variant="outlined"
          value={defaultDate}
          InputProps={{
            readOnly: true,
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit}>Submit</Button>
      </DialogActions>
    </Dialog>
  );
}

export default EventDialogModal;
