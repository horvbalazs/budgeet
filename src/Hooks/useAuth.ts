import {
  AuthContext,
  generateGuest,
  generateRandomName,
  StorageContext,
  StorageKeys,
  User,
} from '@budgeet/shared';
import { useContext, useState } from 'react';
import { auth } from '../firebaseConfig';
import * as firebaseAuth from 'firebase/auth';

export function useAuth() {
  const { storage } = useContext(StorageContext);
  const { setUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function authenticate() {
    if (!storage || !setUser) {
      return;
    }

    const storageUser = await storage.cache.getItem<User>(StorageKeys.USER);

    if (storageUser) {
      setUser(storageUser);
      setLoading(false);
      setError(null);

      return;
    }

    setLoading(true);
    setError(null);

    const provider = new firebaseAuth.GoogleAuthProvider();

    firebaseAuth
      .signInWithPopup(auth, provider)
      .then(async ({ user }) => {
        if (!storage || !setUser) {
          return;
        }

        const name = user?.displayName ?? generateRandomName();
        let avatar = user?.photoURL ?? undefined;

        const _user: User = {
          id: user.uid,
          name,
          avatar,
          isAnonymous: false,
        };

        setUser(_user);
        return storage.cache.setItem(StorageKeys.USER, _user);
      })
      .catch(() => {
        setError('Something went wrong.');
      })
      .finally(() => setLoading(false));
  }

  async function signInAsGuest() {
    if (!storage || !setUser) {
      return;
    }

    const _user = generateGuest();

    setUser(_user);
    await storage.cache.setItem(StorageKeys.USER, _user);
  }

  async function logout() {
    if (!storage || !setUser) {
      return;
    }

    setLoading(true);
    setError(null);
    const _user = await storage.cache.getItem<User>(StorageKeys.USER);

    if (_user) {
      await storage?.cache.clearItem(StorageKeys.USER);

      if (!_user.isAnonymous) {
        firebaseAuth
          .signOut(auth)
          .catch(() => setError('Something went wrong.'))
          .finally(() => setUser(undefined));
      } else {
        setUser(undefined);
      }
    }
  }

  return { loading, error, authenticate, signInAsGuest, logout };
}
