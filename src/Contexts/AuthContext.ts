import { createContext } from 'react';
import { User } from '@budgeet/types';

interface AuthContextValue {
  user?: User;
  setUser?: (user?: User) => void;
}

const AuthContext = createContext<AuthContextValue>({});

export default AuthContext;
