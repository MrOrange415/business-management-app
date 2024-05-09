import React, { useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField } from '@mui/material';
import { useAuth } from '../../context/AuthContext';

function LoginModal() {
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login, logout, user } = useAuth();

  const handleClose = () => {
    setOpen(false);
  };

  const handleLogin = async () => {
    await login(username, password);
    handleClose();
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <Dialog open={true} onClose={handleClose}>
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
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleLogin}>Login</Button>
            <Button onClick={handleLogout}>Logout</Button> {/* If you want a logout button here */}
        </DialogActions>
    </Dialog>
  );
}

export default LoginModal;
