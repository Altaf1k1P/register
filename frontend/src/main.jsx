import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Store, {persistor} from "./Store/Store.js"
import {Provider} from "react-redux"
import { PersistGate } from 'redux-persist/integration/react';
import {createBrowserRouter,
  RouterProvider,} from "react-router-dom"
import Signup from './component/Signup.jsx'
import Login from './component/Login.jsx'
import Home from './component/Home.jsx'
import AddPost from './component/addPost.jsx'
import MyPost from './component/MyPost.jsx'
import EditPost from './component/EditPost.jsx'
import AuthLayout from "./component/authLayout.jsx"

  const router = createBrowserRouter([
    {
      path: '/',
      element:
        <App />,
      children: [
        {
          path: '/signup',
          element: <Signup />,
        },
        {
          path: '/login',
          element: <Login />,
        },
        {
          path: '/',
          element: <AuthLayout>
              <Home />
          </AuthLayout>
          ,
        },
        {
          path: '/my-post',
          element: <AuthLayout>
              <MyPost />
          </AuthLayout>
          ,
        },
        {
          path: '/add-post',
          element: <AuthLayout>
              <AddPost />
          </AuthLayout>
          ,
        },
        {
          path: '/:postId',
          element: <AuthLayout>
              <EditPost />
          </AuthLayout>
          ,
        }
      ],
    }
  ])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={Store}>
     <PersistGate loading={false} persistor={persistor}>
       <RouterProvider router={router}/>
      </PersistGate>
    </Provider>
  </StrictMode>,
)
