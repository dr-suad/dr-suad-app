import React from 'react';
import ReactDOM from 'react-dom/client';
import { MotionConfig } from 'framer-motion';
import App from './App.jsx';
import { MascotProvider } from './context/MascotContext.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import './styles/global.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <MotionConfig reducedMotion="user">
      <MascotProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </MascotProvider>
    </MotionConfig>
  </React.StrictMode>
);