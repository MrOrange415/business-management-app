import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import Button from '@mui/material/Button';
import EventDialogModal from '../../components/EventDialogModal';

const Calendar = ({ handleLogout, handleViewChange, calendarView, handleDateClick, handleEventClick, events, eventDialogModalOpen, handleCloseEventDialogModal, handleEventSubmit, handleEventDelete, selectedEvent, isNewEvent }) => {
    return (
        <>
            <div className="logout-button">
                <Button sx={{ padding: '1px 10px', fontSize: '0.5rem' }} variant="contained" color="inherit" onClick={handleLogout}>
                Logout
                </Button>
            </div>
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
            <FullCalendar
                key={calendarView}
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView={calendarView}
                dateClick={handleDateClick}
                eventClick={handleEventClick}
                events={events}
            />
            <EventDialogModal
                open={eventDialogModalOpen}
                onClose={handleCloseEventDialogModal}
                onSubmit={handleEventSubmit}
                onDelete={handleEventDelete}
                event={selectedEvent}
            />
        </>
    );
}

export default Calendar;