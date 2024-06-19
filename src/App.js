import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { auth } from './config/firebase-config';
import { useAuth } from './context/AuthContext';
import LoginModal from './components/LoginModal';
import Calendar from './components/Calendar';
import FinishSignUp from './components/FinishSignUp';
import moment from 'moment';
import './App.css';
const BACKEND_URL = 'https://serene-coast-40702-6512a6817c62.herokuapp.com';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [modalOpen, setModalOpen] = useState(!isLoggedIn);
  const [eventDialogModalOpen, setEventDialogModalOpen] = useState(false);
  const [calendarView, setCalendarView] = useState(localStorage.getItem('calendarView') || 'dayGridMonth');
  const [events, setEvents] = useState([]);
  const [isNewEvent, setIsNewEvent] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState({
    id: '',
    formattedStartDate: '',
    formattedEndDate: '',
    title: '',
    description: '',
    mode: 'new'
  });
  const { logout } = useAuth();

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [isLoggedIn]);

  const fetchEvents = async () => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const token = await user.getIdToken();
        console.log(`token ${token}`);
        fetch(`${BACKEND_URL}/events`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        .then(response => response.json())
        .then(data => {
          setEvents(data)
        })
        .catch(error => {
          console.error('Error fetching events:', error);
        });
  
      } else {
        // User is signed out
        console.log('No user is logged in, cannot fetch events.');
      }
    });
  };

  const handleViewChange = (view) => {
    setCalendarView(view);
    localStorage.setItem('calendarView', view);
  };

  const handleCloseEventDialogModal = () => {
    setEventDialogModalOpen(false);
  };

  const handleLogout = async () => {
    localStorage.removeItem('calendarView');
    try {
      await logout();
      console.log("Logged out successfully!");
      setIsLoggedIn(false);
      setModalOpen(true);
      console.log(`modalOpen ${modalOpen}`)
    } catch (error) {
        console.error("Failed to log out:", error);
    }
  }

  const handleStartDateChange = (event) => {
    let updatedEvent = {
      ...selectedEvent,
      formattedStartDate: event
    }

    if (updatedEvent.formattedStartDate.isSameOrAfter(moment(selectedEvent.formattedEndDate))) {
      updatedEvent = {
        ...updatedEvent,
        formattedEndDate: updatedEvent.formattedStartDate.clone().add(30, 'minutes')
      }
    }
    setSelectedEvent(updatedEvent);

  };

  const handleEndDateChange = (event) => {
    let updatedEvent = {
      ...selectedEvent,
      formattedEndDate: event
    }
    setSelectedEvent(updatedEvent);
  };

  const handleDateClick = (arg) => {
    setIsNewEvent(true);

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
    setIsNewEvent(false);

    setSelectedEvent({
      id: clickInfo.event.extendedProps._id,
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
    console.log(`payload ${JSON.stringify(payload)}`);
    const auth = getAuth();
    const user = auth.currentUser;
    const token = await user.getIdToken();
    let response;

    if (isNewEvent) {
      try {
        response = await fetch(`${BACKEND_URL}/events`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });
      } catch (error) {
        console.error('Network error', error);
      }
    } else {
      try {
        response = await fetch(`${BACKEND_URL}/events/${payload.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });
      } catch (error) {
        console.error('Network error', error);
      }
    }

    if (response.ok) {
      setEventDialogModalOpen(false);
      fetchEvents();
      return response.json();
    } else {
      console.error('Event creation failed', await response.text());
    }
  }

  const handleEventDelete = async (eventId) => {
    const auth = getAuth();
    const user = auth.currentUser;
    const token = await user.getIdToken();

    try {
      const response = await fetch(`${BACKEND_URL}/events/${eventId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setEventDialogModalOpen(false);
        fetchEvents();
        return response.json();
      } else {
        console.error('Event deletion failed', await response.text());
      }
    } catch (error) {
      console.error('Network error', error);
    }
  }
  
  return (
      <Routes>
        <Route path="/login" element={<LoginModal open={modalOpen} onClose={handleCloseModal} />} />
        <Route path="/calendar" element={<Calendar 
          handleLogout={handleLogout}
          handleViewChange={handleViewChange}
          calendarView={calendarView}
          handleDateClick={handleDateClick}
          handleEventClick={handleEventClick}
          events={events}
          eventDialogModalOpen={eventDialogModalOpen}
          handleCloseEventDialogModal={handleCloseEventDialogModal}
          handleEventSubmit={handleEventSubmit}
          handleEventDelete={handleEventDelete}
          selectedEvent={selectedEvent}
          handleStartDateChange={handleStartDateChange}
          handleEndDateChange={handleEndDateChange}
        />} />
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/auth/finish-sign-up" element={<FinishSignUp />} />
      </Routes>
  );
}

export default App;
