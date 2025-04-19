import React, { useState } from 'react'
import './Calender.css'

function Calender() {
  const [currentDate, setCurrentDate] = useState(new Date());
  
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
      
      days.push(
        <span 
          key={day} 
          className={isToday ? 'current-day' : ''}
        >
          {day}
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
    </div>
  )
}

export default Calender
