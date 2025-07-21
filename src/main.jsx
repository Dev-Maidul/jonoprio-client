import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import '@stripe/stripe-js';
import '@stripe/react-stripe-js';
import AuthProvider from './Context/AuthProvider.jsx';
import { Toaster } from 'react-hot-toast';
import { RouterProvider } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { router } from './Router/Routes.jsx';
// create Query Client
const queryClient=new QueryClient();
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
      <RouterProvider router={router} />
      <Toaster position="top-right" reverseOrder={false} />
    </AuthProvider>
    </QueryClientProvider>
  </StrictMode>
);