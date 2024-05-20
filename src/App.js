import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import LoginModal from './components/LoginModal';
import Calendar from './components/Calendar';
import FinishSignUp from './components/FinishSignUp';
import moment from 'moment';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [modalOpen, setModalOpen] = useState(!isLoggedIn);
  const [eventDialogModalOpen, setEventDialogModalOpen] = useState(false);
  const [calendarView, setCalendarView] = useState(localStorage.getItem('calendarView') || 'dayGridMonth');
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState({
    id: '',
    formattedStartDate: '',
    formattedEndDate: '',
    title: '',
    description: '',
    mode: 'new'
  });
  const { currentUser, logout } = useAuth();

  useEffect(() => {
    console.log(`checking for a current user`);
    if (currentUser) {
      console.log(`currentUser ${currentUser}`);
      setIsLoggedIn(true);
    } else {
      console.log(`isLoggedIn ${isLoggedIn}`);
      handleLogout();
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [isLoggedIn]);

  const fetchEvents = () => {
    // const token = localStorage.getItem('accessToken');
    // fetch('http://localhost:3001/events', {
    //     headers: {
    //         'Authorization': `Bearer ${token}`
    //     }
    // })
    // .then(response => response.json())
    // .then(data => {
    //     console.log(`got data ${JSON.stringify(data)}`);
    //     setEvents(data);
    // })
    // .catch(error => console.error('Error fetching events:', error));
};

  const handleViewChange = (view) => {
    setCalendarView(view);
    localStorage.setItem('calendarView', view);
    console.log(`calendarView ${calendarView}`);
  };

  const handleCloseEventDialogModal = () => {
    setEventDialogModalOpen(false);
  };

  const handleLogout = async () => {
    // localStorage.removeItem('emailForSignIn');
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
    console.log(`clickInfo ${JSON.stringify(clickInfo.event)}`);
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

  const handleEventDelete = async (eventId) => {
    const token = localStorage.getItem('accessToken');

    try {
      const response = await fetch(`http://localhost:3001/events/${eventId}`, {
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
        />} />
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/auth/finish-sign-up" element={<FinishSignUp />} />
      </Routes>
  );
}

export default App;
