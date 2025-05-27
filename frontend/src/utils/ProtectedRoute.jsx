// src/components/ProtectedRoute.jsx
import { useAuth } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const { isLoaded, isSignedIn } = useAuth();

  // wait until Clerk finishes loading the auth state
  if (!isLoaded) return null;

  // if not signed in, redirect to your login page
  if (!isSignedIn) {
    return <Navigate to="/login" replace />;
  }

  // otherwise render the protected content
  return children;
}
