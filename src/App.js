import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import { useAuth } from './context/AuthContext';
import LoginModal from './components/LoginModal';
import Button from '@mui/material/Button';
import EventDialogModal from './components/EventDialogModal';
import moment from 'moment';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedDate, setSelectedDate] = useState(false);
  const [modalOpen, setModalOpen] = useState(!isLoggedIn);
  const [eventDialogModalOpen, setEventDialogModalOpen] = useState(false);
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

  const handleCloseEventDialogModal = () => {
    setEventDialogModalOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    setIsLoggedIn(false);
    setModalOpen(true);
    logout();
  }

  const handleDateClick = (arg) => {
    setEventDialogModalOpen(true);
    console.log("Clicked on date: ", moment(arg.date).format('YYYY-MM-DD hh:mm A'));
    setSelectedDate(`${moment(arg.date).format('YYYY-MM-DD hh:mm A')}`);
    // Open modal here to add details
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  return (
    <div>  
      {isLoggedIn ? (
        <div className="logout-button">
          <Button sx={{ padding: '1px 10px', fontSize: '0.5rem' }} variant="contained" color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      ) : (
        <p></p>
      )}
      {isLoggedIn ? (
        <div className="view-menu">
          <Button sx={{ padding: '1px 20px', fontSize: '0.75rem' }} variant="outlined" color="secondary" onClick={() => handleViewChange('timeGridDay')}>
            Day
          </Button>
          <Button sx={{ padding: '1px 20px', fontSize: '0.75rem' }} variant="outlined" color="secondary" onClick={() => handleViewChange('timeGridWeek')}>
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
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView={calendarView}
            dateClick={handleDateClick}
          />
        ) : (
          <p></p>
        )}
        <EventDialogModal
          open={eventDialogModalOpen}
          onClose={handleCloseEventDialogModal}
          // onSubmit={handleEventSubmit}
          defaultDate={selectedDate}
        />
      </div>
    </div>
  );
}

export default App;
