import React from 'react'
import ReactDOM from 'react-dom/client'
import HomePage from './HomePage.tsx'
import RedirectPage from './RedirectPage.tsx'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/redirect',
    element: <RedirectPage />,
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)