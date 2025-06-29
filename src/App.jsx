
import React from 'react'
import { Button } from './components/ui/button'
import './App.css'
import { createBrowserRouter, Route } from 'react-router-dom'
import { RouterProvider } from 'react-router-dom'
import Applayout from './layout/App-layout'
import Landing from './Pages/Landing'
import Onboarding from './Pages/Onboarding'
import Joblisting from './Pages/Job-listing'
import JobPage from './Pages/Job'
import PostJob from './Pages/Post-Job'
import SaveJob from './Pages/Save-Job'
import MyJob from './Pages/My-Job'
import { ThemeProvider } from './components/ui/theme-provider'
import ProtectedRoute from './components/protected-route'



const router = createBrowserRouter([
  {
    element: <Applayout />,
    children: [
      {
       path: '/',
        element: <Landing />
      },
       {
        
       path: '/onboarding',
       
        element: 
        <ProtectedRoute>
        <Onboarding />
        </ProtectedRoute>
      },
      {
       path: '/jobs',
        element:
        <ProtectedRoute>
        <Joblisting />
        </ProtectedRoute>
      },
      {
       path: '/job/:id',
        element: 
        <ProtectedRoute>
        <JobPage/>
        </ProtectedRoute>
      },
      {
       path: '/post-job',
        element: 
        <ProtectedRoute>
        <PostJob/>
        </ProtectedRoute>
      },
      {
       path: '/save-job',
        element: 
        <ProtectedRoute>
        <SaveJob/>
        </ProtectedRoute>
      },
      {
       path: '/my-jobs',
        element:
        <ProtectedRoute>
        <MyJob/>
        </ProtectedRoute>
      },
    ]
  }
])

function App() {
 

  return (

     <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
       <RouterProvider router={router}/>
    </ThemeProvider>
   
  )
}

export default App
