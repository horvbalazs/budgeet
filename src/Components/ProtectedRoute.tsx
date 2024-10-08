import { AuthContext } from '@budgeet/shared';
import { PropsWithChildren, useContext } from 'react';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }: PropsWithChildren) {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
}
