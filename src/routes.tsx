import { createBrowserRouter, Navigate } from 'react-router-dom'
import { AppLayout } from './views/_layouts/app'
import { AuthLayout } from './views/_layouts/auth'
import { SignIn } from './views/auth/sign-in'
import { ChooseType } from './views/auth/choose-type'
import { RegisterCompany } from './views/auth/register-company'
import { RegisterUniversity } from './views/auth/register-university'
import { ProtectedRoute } from './protected-route'
import { HomeUniversity } from './views/app/university/home/page'
import { EditUniversity } from './views/app/university/edit/page'
import { ViewUniversity } from './views/app/university/view/page'
import { HomeStudent } from './views/app/student/home/page'
import { EditStudent } from './views/app/student/edit/page'
import { ViewStudent } from './views/app/student/view/page'
import { HomeStudentNoTeam } from './views/app/student/no-team/home/page'
import { ViewStudentNoTeam } from './views/app/student/no-team/view/page'
import { TeamForm } from './views/app/student/no-team/team-form/page'
import { HomeCompany } from './views/app/company/home/page'
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
              { path: 'dashboard', element: <HomeUniversity /> },
              { path: 'edit/:universityId', element: <EditUniversity /> },
              { path: 'view/:universityId', element: <ViewUniversity /> },
            ],
          },
          {
            path: 'company',
            children: [
              { path: 'dashboard', element: <HomeCompany /> },
              { path: 'edit/:universityId', element: <EditUniversity /> },
              { path: 'view/:universityId', element: <ViewUniversity /> },
            ],
          },
          {
            path: 'student',
            children: [
              { path: 'dashboard', element: <HomeStudent /> },
              { path: 'edit/:id', element: <EditStudent /> },
              { path: 'view/:id', element: <ViewStudent /> },
            ],
          },
          {
            path: 'student-no-team',
            children: [
              { path: 'dashboard', element: <HomeStudentNoTeam /> },
              { path: 'team', element: <TeamForm /> }, // Adicionar equipe
              { path: 'team/:id', element: <TeamForm /> }, // Editar equipe
              { path: 'view/:id', element: <ViewStudentNoTeam /> },
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
      { path: 'register-company', element: <RegisterCompany /> },
      { path: 'register-university', element: <RegisterUniversity /> },
    ],
  },
]);