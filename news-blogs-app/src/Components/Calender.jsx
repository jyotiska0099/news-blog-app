import React, { useState, useEffect } from 'react'
import './Calender.css'
import EventModal from './EventModal'

function Calender() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  
  useEffect(() => {
    const savedEvents = JSON.parse(localStorage.getItem('calendarEvents')) || [];
    setEvents(savedEvents);
  }, []);

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();
    
    return { daysInMonth, startingDay };
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleDateClick = (day) => {
    const clickedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedDate(clickedDate);
    setSelectedEvent(null);
    setShowEventModal(true);
  };

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setSelectedDate(new Date(event.date));
    setShowEventModal(true);
  };

  const handleSaveEvent = (event) => {
    let updatedEvents;
    if (selectedEvent) {
      // Update existing event
      updatedEvents = events.map(e => 
        e.id === selectedEvent.id ? { ...event, id: e.id } : e
      );
    } else {
      // Add new event
      const newEvent = { ...event, id: Date.now() };
      updatedEvents = [...events, newEvent];
    }
    setEvents(updatedEvents);
    localStorage.setItem('calendarEvents', JSON.stringify(updatedEvents));
    setShowEventModal(false);
    setSelectedEvent(null);
  };

  const handleDeleteEvent = (event) => {
    const updatedEvents = events.filter(e => e.id !== event.id);
    setEvents(updatedEvents);
    localStorage.setItem('calendarEvents', JSON.stringify(updatedEvents));
    setShowEventModal(false);
    setSelectedEvent(null);
  };

  const { daysInMonth, startingDay } = getDaysInMonth(currentDate);
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const renderDays = () => {
    const days = [];
    const today = new Date();
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDay; i++) {
      days.push(<span key={`empty-${i}`} className="empty-day"></span>);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const isToday = 
        day === today.getDate() && 
        currentDate.getMonth() === today.getMonth() && 
        currentDate.getFullYear() === today.getFullYear();
      
      const dayEvents = events.filter(event => {
        const eventDate = new Date(event.date);
        return eventDate.getDate() === day && 
               eventDate.getMonth() === currentDate.getMonth() && 
               eventDate.getFullYear() === currentDate.getFullYear();
      });
      
      days.push(
        <span 
          key={day} 
          className={`${isToday ? 'current-day' : ''} ${dayEvents.length > 0 ? 'has-event' : ''}`}
          onClick={() => handleDateClick(day)}
        >
          {day}
          {dayEvents.length > 0 && (
            <div className="event-dots">
              {dayEvents.map(event => (
                <span 
                  key={event.id}
                  className="event-dot"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEventClick(event);
                  }}
                ></span>
              ))}
            </div>
          )}
        </span>
      );
    }

    return days;
  };

  return (
    <div className='calender'> 
      <div className="navigate-date">
        <h2 className="month">{monthNames[currentDate.getMonth()]}</h2>
        <h2 className="year">{currentDate.getFullYear()}</h2>
        <div className="buttons">
          <i className="fa-solid fa-chevron-left" onClick={handlePrevMonth}></i>
          <i className="fa-solid fa-chevron-right" onClick={handleNextMonth}></i>
        </div>
      </div>
      <div className="weekdays">
        {weekDays.map(day => (
          <span key={day}>{day}</span>
        ))}
      </div>
      <div className="days">
        {renderDays()}
      </div>
      <EventModal
        show={showEventModal}
        date={selectedDate}
        onClose={() => {
          setShowEventModal(false);
          setSelectedEvent(null);
        }}
        onSave={handleSaveEvent}
        onDelete={handleDeleteEvent}
        existingEvent={selectedEvent}
      />
    </div>
  )
}

export default Calender
