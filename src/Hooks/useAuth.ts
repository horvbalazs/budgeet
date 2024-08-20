import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { uniqueNamesGenerator, colors, animals } from 'unique-names-generator';
import { useContext, useState } from 'react';
import { AvatarGenerator } from 'random-avatar-generator';
import { auth } from '../firebase';
import AuthContext from '../Contexts/AuthContext';
import { User } from '../Models/User';
import { getItem, removeItem, setItem, StorageKeys } from '../storage';

export function useAuth() {
  const { setUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function authenticate() {
    const storageUser = getItem<User>(StorageKeys.USER);

    if (storageUser) {
      setUser?.(storageUser);
      setLoading(false);
      setError(null);

      return;
    }

    const provider = new GoogleAuthProvider();

    setLoading(true);
    setError(null);

    signInWithPopup(auth, provider)
      .then(({ user }) => {
        const name = user.displayName ?? randomName();
        let avatar = user.photoURL;

        if (!avatar) {
          const avatarGenerator = new AvatarGenerator();
          avatar = avatarGenerator.generateRandomAvatar(
            user.displayName ? randomName() : name
          );
        }

        const _user: User = {
          id: user.uid,
          name,
          avatar,
        };

        setUser?.(_user);
        setItem(StorageKeys.USER, _user);
      })
      .catch(() => {
        setError('Something went wrong.');
      })
      .finally(() => setLoading(false));
  }

  function logout() {
    setLoading(true);
    setError(null);
    removeItem(StorageKeys.USER);
    auth
      .signOut()
      .catch(() => setError('Something went wrong.'))
      .finally(() => setUser?.(undefined));
  }

  return { loading, error, authenticate, logout };
}

function randomName() {
  return uniqueNamesGenerator({ dictionaries: [colors, animals] });
}
