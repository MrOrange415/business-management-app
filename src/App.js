import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import { useAuth } from './context/AuthContext';
import LoginModal from './components/LoginModal';
import Button from '@mui/material/Button';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [modalOpen, setModalOpen] = useState(!isLoggedIn);
  const [calendarView, setCalendarView] = useState('dayGridMonth');
  const { logout } = useAuth();

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

  useEffect(() => {
    console.log("View changed to:", calendarView);
  }, [calendarView]);

  const handleViewChange = (view) => {
    setCalendarView(view);
    console.log(`calendarView ${calendarView}`);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    setIsLoggedIn(false);
    setModalOpen(true);
    logout();
  }

  return (
    <div>  
      {isLoggedIn ? (
        <div class="logout-button">
          <Button sx={{ padding: '1px 10px', fontSize: '0.5rem' }} variant="contained" color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      ) : (
        <p></p>
      )}
      {isLoggedIn ? (
        <div class="view-menu">
          <Button sx={{ padding: '1px 20px', fontSize: '0.75rem' }} variant="outlined" color="secondary" onClick={() => handleViewChange('dayGridDay')}>
            Day
          </Button>
          <Button sx={{ padding: '1px 20px', fontSize: '0.75rem' }} variant="outlined" color="secondary" onClick={() => handleViewChange('dayGridWeek')}>
            Week
          </Button>
          <Button sx={{ padding: '1px 20px', fontSize: '0.75rem' }} variant="outlined" color="secondary" onClick={() => handleViewChange('dayGridMonth')}>
            Month
          </Button>
          <Button sx={{ padding: '1px 20px', fontSize: '0.75rem' }} variant="outlined" color="secondary" onClick={() => handleViewChange('dayGridYear')}>
            Year
          </Button>
        </div>
      ) : (
        <p></p>
      )}
      <div>
        {!isLoggedIn ? (
          <LoginModal open={modalOpen} onClose={handleCloseModal} setIsLoggedIn={setIsLoggedIn} />
        ) : (
          <p></p>
        )}
        {isLoggedIn ? (
          <FullCalendar
            key={calendarView}
            plugins={[dayGridPlugin, timeGridPlugin]}
            initialView={calendarView}
          />
        ) : (
          <p></p>
        )}
      </div>
    </div>
  );
}

export default App;
