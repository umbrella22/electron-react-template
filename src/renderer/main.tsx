import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.scss';
import App from './view/app/App';

createRoot(document.getElementById('app') as HTMLElement).render(<App />);
