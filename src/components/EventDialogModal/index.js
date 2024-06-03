import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { Dialog, TextField, Button, DialogActions, DialogContent, DialogTitle, Box } from '@mui/material';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';

function EventDialogModal({ open, onClose, onSubmit, onDelete, event, handleStartDateChange, handleEndDateChange }) {
  const [mode, setMode] = useState(event.mode);
  const [title, setTitle] = useState(event.title);
  const [description, setDescription] = useState(event.description);

  useEffect(() => {
    setTitle(event.title);
  }, [event.title]);

  useEffect(() => {
    setDescription(event.description);
  }, [event.description]);

  useEffect(() => {
    setMode(event.mode);
  }, [event.mode]);

  const handleSubmit = () => {
    const payload = {
      ...(event.id && { id: event.id }),
      title,
      description,
      start: moment(event.formattedStartDate).format(),
      end: moment(event.formattedEndDate).format()
    }

    onSubmit(payload);
    onClose();
  };

  const handleDelete = () => {
    console.log(`event ${JSON.stringify(event)}`);
    onDelete(event.id);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{mode === 'edit' ? 'Edit Event' : 'Add New Event'}</DialogTitle>
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
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <DateTimePicker
          label="Start Date"
          value={moment(event.formattedStartDate)}
          onChange={handleStartDateChange}
          renderInput={(params) => <TextField {...params} fullWidth margin="dense" />}
        />
        <DateTimePicker
          label="End Date"
          value={moment(event.formattedEndDate)}
          onChange={handleEndDateChange}
          renderInput={(params) => <TextField {...params} fullWidth margin="dense" />}
        />
      </LocalizationProvider>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'space-between', width: '95%' }}>
      <Box sx={{ flex: '0 1 auto' }}> 
        <Button onClick={handleDelete}>Delete</Button>
      </Box>
      <Box sx={{ flex: '0 1 auto' }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit}>Submit</Button>
      </Box>
      </DialogActions>
    </Dialog>
  );
}

export default EventDialogModal;
