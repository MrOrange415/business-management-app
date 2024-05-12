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
  const [selectedDate, setSelectedDate] = useState(moment());
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
    setSelectedDate(`${moment(arg.date).format('YYYY-MM-DD hh:mm A')}`);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };


  const handleEventSubmit = async (payload) => {
    const token = localStorage.getItem('accessToken');
    console.log(`payload ${JSON.stringify(payload)}`);
    try {
      const response = await fetch('http://localhost:3001/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        console.log('Event created successfully:', response);
        setEventDialogModalOpen(false);
        return response.json();
      } else {
        console.error('Event creation failed', await response.text());
      }
    } catch (error) {
      console.error('Network error', error);
    }
  }
  

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
          onSubmit={handleEventSubmit}
          startDate={selectedDate}
        />
      </div>
    </div>
  );
}

export default App;
