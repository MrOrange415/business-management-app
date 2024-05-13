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
  const [modalOpen, setModalOpen] = useState(!isLoggedIn);
  const [eventDialogModalOpen, setEventDialogModalOpen] = useState(false);
  const [calendarView, setCalendarView] = useState(localStorage.getItem('calendarView') || 'dayGridMonth');
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState({
    formattedStartDate: '',
    formattedEndDate: '',
    title: '',
    description: '',
    mode: 'new'
  });
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
    fetchEvents();
  }, []);

  const fetchEvents = () => {
    const token = localStorage.getItem('accessToken');
    fetch('http://localhost:3001/events', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(data => {
        console.log(`got data ${JSON.stringify(data)}`);
        setEvents(data);
    })
    .catch(error => console.error('Error fetching events:', error));
};

  const handleViewChange = (view) => {
    setCalendarView(view);
    localStorage.setItem('calendarView', view);
    console.log(`calendarView ${calendarView}`);
  };

  const handleCloseEventDialogModal = () => {
    setEventDialogModalOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('calendarView');
    setIsLoggedIn(false);
    setModalOpen(true);
    logout();
  }

  const handleDateClick = (arg) => {
    setSelectedEvent({
      formattedStartDate: moment(arg.date).format('YYYY-MM-DD hh:mm A'),
      formattedEndDate: moment(arg.date).add(30, 'minutes').format('YYYY-MM-DD hh:mm A'),
      title: '',
      description: '',
      mode: 'new'
    });

    setEventDialogModalOpen(true);
  };

  const handleEventClick = (clickInfo) => {
    setSelectedEvent({
      formattedStartDate: moment(clickInfo.event.start).format('YYYY-MM-DD hh:mm A'),
      formattedEndDate: moment(clickInfo.event.end).format('YYYY-MM-DD hh:mm A'),
      title: clickInfo.event.title,
      description: clickInfo.event.extendedProps.description,
      mode: 'edit'
    });

    setEventDialogModalOpen(true);
};

  const handleCloseModal = () => {
    setModalOpen(false);
  };


  const handleEventSubmit = async (payload) => {
    const token = localStorage.getItem('accessToken');

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
        setEventDialogModalOpen(false);
        fetchEvents();
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
            eventClick={handleEventClick}
            events={events}
          />
        ) : (
          <p></p>
        )}
        <EventDialogModal
          open={eventDialogModalOpen}
          onClose={handleCloseEventDialogModal}
          onSubmit={handleEventSubmit}
          event={selectedEvent}
        />
      </div>
    </div>
  );
}

export default App;
