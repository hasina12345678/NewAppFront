import { useState, useEffect } from 'react';

function Toast({ message, type = 'error', onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={{
      position: 'fixed',
      bottom: '100px',
      left: '20px',
      padding: '12px 20px',
      backgroundColor: type === 'error' ? '#f44336' : '#4caf50',
      color: 'white',
      borderRadius: '4px',
      zIndex: 99999,
      boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
    }}>
      {message}
    </div>
  );
}

export default Toast;