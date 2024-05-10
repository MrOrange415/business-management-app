import React, { useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField } from '@mui/material';
import { useAuth } from '../../context/AuthContext';

function LoginModal({ open, onClose, setIsLoggedIn }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const handleLogin = async () => {
    const result = await login(username, password);
    if (result.success) {
      onClose();
      setIsLoggedIn(true);
    } else {
        console.error(result.message);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
        <DialogTitle>Login / Create Account</DialogTitle>
        <DialogContent>
            <TextField
                autoFocus
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                margin="dense"
                id="username"
                label="Username"
                type="text"
                fullWidth
                variant="standard"
            />
            <TextField
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                margin="dense"
                id="password"
                label="Password"
                type="password"
                fullWidth
                variant="standard"
            />
        </DialogContent>
        <DialogActions>
            <Button onClick={onClose}>Cancel</Button>
            <Button onClick={handleLogin}>Login</Button>
        </DialogActions>
    </Dialog>
  );
}

export default LoginModal;
