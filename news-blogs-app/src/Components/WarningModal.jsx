import React from 'react';
import './WarningModal.css';

const WarningModal = ({ show, message, onClose }) => {
  if (!show) {
    return null;
  }

  return (
    <div className="warning-modal-overlay">
      <div className="warning-modal-content">
        <div className="warning-icon">
          <i className="fa-solid fa-triangle-exclamation"></i>
        </div>
        <p className="warning-message">{message}</p>
        <button className="warning-close-button" onClick={onClose}>
          OK
        </button>
      </div>
    </div>
  );
};

export default WarningModal; 