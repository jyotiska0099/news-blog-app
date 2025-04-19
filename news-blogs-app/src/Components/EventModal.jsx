import React, { useState, useEffect } from 'react';
import './EventModal.css';

const EventModal = ({ show, date, onClose, onSave, onDelete, existingEvent }) => {
  const [eventTitle, setEventTitle] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [eventDescription, setEventDescription] = useState('');

  useEffect(() => {
    if (existingEvent) {
      setEventTitle(existingEvent.title);
      setEventTime(existingEvent.time);
      setEventDescription(existingEvent.description);
    } else {
      setEventTitle('');
      setEventTime('');
      setEventDescription('');
    }
  }, [existingEvent]);

  if (!show) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const event = {
      title: eventTitle,
      time: eventTime,
      description: eventDescription,
      date: date
    };
    onSave(event);
    onClose();
  };

  const handleDelete = () => {
    if (existingEvent) {
      onDelete(existingEvent);
    }
    onClose();
  };

  return (
    <div className="event-modal-overlay">
      <div className="event-modal-content">
        <div className="event-modal-header">
          <h2>{existingEvent ? 'Edit Event' : 'Add Event'}</h2>
          <span className="close-button" onClick={onClose}>
            <i className="fa-solid fa-xmark"></i>
          </span>
        </div>
        <div className="event-date">
          {date.toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Event Title</label>
            <input
              type="text"
              value={eventTitle}
              onChange={(e) => setEventTitle(e.target.value)}
              placeholder="Enter event title"
              required
            />
          </div>
          <div className="form-group">
            <label>Time</label>
            <input
              type="time"
              value={eventTime}
              onChange={(e) => setEventTime(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              value={eventDescription}
              onChange={(e) => setEventDescription(e.target.value)}
              placeholder="Enter event description"
            />
          </div>
          <div className="form-actions">
            {existingEvent && (
              <button 
                type="button" 
                onClick={handleDelete} 
                className="delete-button"
              >
                Delete Event
              </button>
            )}
            <button type="button" onClick={onClose} className="cancel-button">
              Cancel
            </button>
            <button type="submit" className="save-button">
              {existingEvent ? 'Update Event' : 'Save Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventModal; 