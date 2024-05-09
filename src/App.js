import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginModal from './components/LoginModal';
import dayGridPlugin from '@fullcalendar/daygrid'; // for day grid view

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

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
          localStorage.removeItem('accessToken');
        }
      })
      .catch(error => console.error('accessToken validation error:', error));
    }
  }, []);

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  return (
    <AuthProvider>
      <div>
        {!isLoggedIn ? (
          <LoginModal open={modalOpen} onClose={handleCloseModal} />
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
    </AuthProvider>
  );
}

export default App;
