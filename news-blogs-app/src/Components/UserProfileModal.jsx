import React, { useState } from 'react';
import './UserProfileModal.css';

const UserProfileModal = ({ show, onClose, user, onUpdate }) => {
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [profilePic, setProfilePic] = useState(user?.profilePic || '');
  const [activeTab, setActiveTab] = useState('profile');

  if (!show) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (activeTab === 'profile') {
      onUpdate({ name, email, profilePic });
    } else if (activeTab === 'password') {
      if (newPassword !== confirmPassword) {
        alert('New passwords do not match');
        return;
      }
      onUpdate({ currentPassword, newPassword });
    }
    onClose();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePic(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="user-profile-modal-overlay">
      <div className="user-profile-modal-content">
        <div className="user-profile-modal-header">
          <h2>User Profile</h2>
          <span className="close-button" onClick={onClose}>
            <i className="fa-solid fa-xmark"></i>
          </span>
        </div>
        
        <div className="profile-tabs">
          <button 
            className={`tab-button ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            Profile
          </button>
          <button 
            className={`tab-button ${activeTab === 'password' ? 'active' : ''}`}
            onClick={() => setActiveTab('password')}
          >
            Password
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {activeTab === 'profile' ? (
            <>
              <div className="profile-pic-section">
                <div className="profile-pic-preview">
                  <img src={profilePic || '/default-profile.png'} alt="Profile" />
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="profile-pic-input"
                />
              </div>
              
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </>
          ) : (
            <>
              <div className="form-group">
                <label>Current Password</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </>
          )}

          <div className="form-actions">
            <button type="button" onClick={onClose} className="cancel-button">
              Cancel
            </button>
            <button type="submit" className="save-button">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserProfileModal; 