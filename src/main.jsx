import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { MascotProvider } from './context/MascotContext.jsx';
import './styles/global.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <MascotProvider>
      <App />
    </MascotProvider>
  </React.StrictMode>
);