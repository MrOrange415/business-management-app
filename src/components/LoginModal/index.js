import React, { useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField } from '@mui/material';
import { useAuth } from '../../context/AuthContext';
const FRONT_END_URL = 'https://business-management-app-bice.vercel.app'

function LoginModal({ open, onClose }) {
  const { sendSignInLink } = useAuth();
  const [email, setEmail] = useState('');

  const handleLogin = async () => {
    const actionCodeSettings = {
      url: `${FRONT_END_URL}/auth/finish-sign-up`, // Your redirect URL after sign-in
      handleCodeInApp: true,
    };
    sendSignInLink(email, actionCodeSettings).then(() => {
      alert('Please check your email for the login link!');

      // onClose();
    }).catch((error) => {
      console.error("Failed to send email link:", error);
      alert(`Failed to send email link: ${error.message}`);
    });
  };

  return (
    <Dialog open={open} onClose={onClose}>
        <DialogTitle>Login / Create Account</DialogTitle>
        <DialogContent>
            <TextField
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                margin="dense"
                id="email"
                label="Enter Your Email Address"
                type="text"
                fullWidth
                variant="standard"
            />
        </DialogContent>
        <DialogActions>
            <Button onClick={onClose}>Cancel</Button>
            <Button onClick={handleLogin}>Send Login Email</Button> 
        </DialogActions>
    </Dialog>
  );
}

export default LoginModal;
