import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {createBrowserRouter,RouterProvider} from "react-router-dom"
import {QueryClient,QueryClientProvider, } from "@tanstack/react-query"
import './index.css'
import App from './App.jsx'
import MainPage from './pages/MainPage.jsx'
import About from './pages/About.jsx'
import Layout  from './libs/Layout.jsx'

const queryClient=new QueryClient()

const router=createBrowserRouter([
  {
    path:"/",element:<Layout/>,
    children:[
      {
        path:"/",element:<MainPage/>

      },
      {
        path:"/about",element:<About/>
      }
    ]
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router}  />
    </QueryClientProvider >
  </StrictMode>,
)
