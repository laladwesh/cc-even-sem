// src/components/AdminRoute.jsx
import { useAuth, useUser } from '@clerk/clerk-react';
import { Navigate } from 'react-router-dom';

export default function AdminRoute({ children }) {
  const { isLoaded: authLoaded, isSignedIn } = useAuth();
  const { isLoaded: userLoaded, user } = useUser();

  // 1. Wait for Clerk to finish initializing
  if (!authLoaded || !userLoaded) return null;

  // 2. Must be signed in…
  if (!isSignedIn) {
    return <Navigate to="/login" replace />;
  }

  // 3. …and must have “admin” role
  const role = user.publicMetadata.role;
  if (role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  // 4. Otherwise render the protected content
  return children;
}
