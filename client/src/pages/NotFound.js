import React from 'react';
import { useNavigate } from 'react-router-dom';
import './NotFound.css';

/**
 * NotFound component - displays a 404 error page
 * with a link to return to the dashboard
 */
function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <div className="error-code">404</div>
        <h1>Page Not Found</h1>
        <p>Sorry, the page you're looking for doesn't exist or has been moved.</p>
        <button
          className="not-found-btn"
          onClick={() => navigate('/dashboard')}
        >
          Go to Dashboard
        </button>
      </div>
      <div className="not-found-decoration">
        <div className="floating-icon">🔍</div>
      </div>
    </div>
  );
}

export default NotFound;
