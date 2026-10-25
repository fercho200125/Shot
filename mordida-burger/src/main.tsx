import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource/league-spartan/latin-700.css';
import '@fontsource/erica-one/latin-400.css';
import './styles/tokens.css';
import './styles/base.css';
import App from './App';
import { CartProvider } from './hooks/CartContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CartProvider>
      <App />
    </CartProvider>
  </StrictMode>,
);
