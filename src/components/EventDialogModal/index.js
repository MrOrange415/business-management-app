import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { Dialog, TextField, Button, DialogActions, DialogContent, DialogTitle } from '@mui/material';

function EventDialogModal({ open, onClose, onSubmit, startDate }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    setEndDate(moment(startDate).add(30, 'minutes').format('YYYY-MM-DD hh:mm A'));
  }, [startDate]);

  const handleSubmit = () => {
    const payload = {
      title,
      description,
      start: moment(startDate).format(),
      end: moment(endDate).format()
    }

    onSubmit(payload);
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
          label="Start Date"
          fullWidth
          variant="outlined"
          value={startDate}
          InputProps={{
            readOnly: true,
          }}
        />
        <TextField
          margin="dense"
          label="End Date"
          fullWidth
          variant="outlined"
          value={endDate}
          InputProps={{
            readOnly: false,
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
