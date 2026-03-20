import React, { useState } from 'react';
import { FaUser, FaLock, FaTimes } from 'react-icons/fa';
import './LoginModal.css';

const LoginModal = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {/* Header Tabs */}
        <div className="modal-header">
          <div className="modal-tabs">
            <span 
              className={`tab ${isLogin ? 'active' : ''}`} 
              onClick={() => setIsLogin(true)}>
              Login
            </span>
            <span 
              className={`tab ${!isLogin ? 'active' : ''}`} 
              onClick={() => setIsLogin(false)}>
              Sign up
            </span>
          </div>
          <FaTimes className="close-icon" onClick={onClose} />
        </div>

        {/* Inputs */}
        <div className="modal-body">
          <div className="input-group">
            <FaUser className="input-icon" />
            <input type="text" placeholder="Username" />
          </div>
          <div className="input-group">
            <FaLock className="input-icon" />
            <input type="password" placeholder="Password" />
          </div>
          
          {isLogin && <span className="forgot-password">Forgot your password?</span>}
        </div>

        {/* Footer Buttons */}
        <div className="modal-footer">
          <button className="btn-primary">{isLogin ? 'Login' : 'Sign up'}</button>
          <button className="btn-secondary" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
