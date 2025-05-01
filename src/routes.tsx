import { createBrowserRouter } from 'react-router-dom'
import { AppLayout } from './views/_layouts/app'
import { AuthLayout } from './views/_layouts/auth'
import { SignIn } from './views/auth/sign-in'
import { ProtectedRoute } from './protected-route'
import { Home } from './views/app/home/page'
import { ChooseType } from './views/auth/choose-type'
import { RegisterStudent } from './views/auth/register-student'
import { RegisterCompany } from './views/auth/register-company'
import { RegisterUniversity } from './views/auth/register-university'

export const router = createBrowserRouter([
  // {
  //   path: '/',
  //   element: <Navigate to="/auth/sign-in" replace />,
  // },
  {
    path: '/app',
    element: <ProtectedRoute allowedRoles={["admin", "minister", "treasurer", "secretary", "worker", "auditor"]} />,
    children: [
      {
        element: <AppLayout />,
        children: [
          {
            path: 'home',
            element: <ProtectedRoute allowedRoles={["admin", "minister", "treasurer", "secretary", "worker", "auditor"]} />,
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