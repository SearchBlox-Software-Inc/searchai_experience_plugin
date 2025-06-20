import './init'; //required to support inline-worker used in voice search

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App.jsx';

import './index.scss';


// ==========================================================================================


const queryClient = new QueryClient();


// ------------------------------


ReactDOM.createRoot(document.getElementById('sb-root')).render(
   <React.StrictMode>
      <QueryClientProvider client={queryClient}>
         <App />
      </QueryClientProvider>
   </React.StrictMode>,
);