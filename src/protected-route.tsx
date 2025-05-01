import { Navigate, Outlet } from "react-router-dom";

export const ProtectedRoute = () => {
  const userId = sessionStorage.getItem("userId");
  const userType = sessionStorage.getItem('userType');

  if (!userId || !userType ) return <Navigate to="/auth/sign-in" replace />;

  return <Outlet />;
};
