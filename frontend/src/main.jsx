import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { RideProvider } from '../src/Context/RideContext.jsx'; // Ensure this path is correct

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RideProvider>
      <App />
    </RideProvider>
  </StrictMode>
);
