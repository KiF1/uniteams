import { createBrowserRouter, Navigate } from 'react-router-dom'
import { AppLayout } from './views/_layouts/app'
import { AuthLayout } from './views/_layouts/auth'
import { SignIn } from './views/auth/sign-in'
import { ChooseType } from './views/auth/choose-type'
import { RegisterStudent } from './views/auth/register-student'
import { RegisterCompany } from './views/auth/register-company'
import { RegisterUniversity } from './views/auth/register-university'
import { ProtectedRoute } from './protected-route'
import { Home } from './views/app/university/home/page'
import { EditUniversity } from './views/app/university/edit/page'
import { ViewUniversity } from './views/app/university/view/page'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/auth/sign-in" replace />,
  },
  {
    path: '/app',
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          {
            path: 'university',
            children: [
              { path: 'dashboard', element: <Home /> },
              { path: 'edit/:universityId', element: <EditUniversity /> },
              { path: 'view/:universityId', element: <ViewUniversity /> },
            ],
          },
          {
            path: 'company',
            children: [
              { path: '', element: <Home /> }
            ],
          },
          {
            path: 'student',
            children: [
              { path: '', element: <Home /> }
            ],
          },
        ]
      }
    ]
  },
  {
    path: '/auth',
    element: <AuthLayout />,
    children: [
      { path: 'sign-in', element: <SignIn /> },
      { path: 'choose-type', element: <ChooseType /> },
      { path: 'register-student', element: <RegisterStudent /> },
      { path: 'register-company', element: <RegisterCompany /> },
      { path: 'register-university', element: <RegisterUniversity /> },
    ],
  },
]);