import { Navigate, Outlet } from "react-router-dom";

export const ProtectedRoute = ({ allowedRoles }: { allowedRoles?: string[] }) => {
  const userId = sessionStorage.getItem("userId");
  const isSubscription = sessionStorage.getItem("subscription");
  const verifyChurchIsSubscription = isSubscription === 'true';
  const userPositions = JSON.parse(sessionStorage.getItem("userPositions") || "[]") as string[];

  if (!userId || !verifyChurchIsSubscription ) return <Navigate to="/auth/sign-in" replace />;

  if (allowedRoles && !userPositions.some(position => allowedRoles.includes(position))) {
    return <Navigate to="/app/home" replace />;
  }

  return <Outlet />;
};
