import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import { useAuth } from './context/AuthContext';
import LoginModal from './components/LoginModal';
import dayGridPlugin from '@fullcalendar/daygrid';
import Button from '@mui/material/Button';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [modalOpen, setModalOpen] = useState(!isLoggedIn);
  const { logout, user } = useAuth();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      fetch('http://localhost:3001/validateToken', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(res => {
        if (res.ok) {
          setIsLoggedIn(true);
        } else {
          handleLogout();
        }
      })
      .catch(error => console.error('accessToken validation error:', error));
    }
  }, []);

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    setIsLoggedIn(false);
    logout();
  }

  return (
    <div>
      <div style={{ margin: '20px' }}>
      {isLoggedIn ? (
        <Button variant="contained" color="primary" onClick={handleLogout}>
          Logout
        </Button>
        ) : (
          <p></p>
        )}
      </div>
      <div>
        {!isLoggedIn ? (
          <LoginModal open={modalOpen} onClose={handleCloseModal} setIsLoggedIn={setIsLoggedIn} />
        ) : (
          <p></p>
        )}
        {isLoggedIn ? (
          <FullCalendar
            plugins={[dayGridPlugin]}
            initialView="dayGridMonth"
          />
        ) : (
          <p></p>
        )}
      </div>
    </div>
  );
}

export default App;
