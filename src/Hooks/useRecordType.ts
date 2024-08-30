import { useCallback, useEffect, useState } from 'react';
import { db } from '../firebase';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from 'firebase/firestore';
import { RecordType, RecordTypeBase } from '@budgeet/types';

const COLLECTION_ID = 'types';

export const DEFAULT_TYPE: RecordType = {
  id: '0',
  color: '#cacaca',
  type: 'Other',
  userId: '0',
};

export function useRecordType(userId: string) {
  const [recordTypes, setRecordTypes] = useState<RecordType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);

    const q = query(
      collection(db, COLLECTION_ID),
      where('userId', '==', userId)
    );
    getDocs(q)
      .then((snapshot) => {
        const result = snapshot.docs.map(
          (doc) =>
            ({
              id: doc.id,
              type: doc.data().type,
              userId: doc.data().userId,
              color: doc.data().color,
            } as RecordType)
        );

        setRecordTypes([...result, DEFAULT_TYPE]);
      })
      .catch((e) => {
        setError(e.message);
      })
      .finally(() => setLoading(false));
  }, [userId]);

  const addRecordType = useCallback(
    async (type: RecordTypeBase) => {
      setError(null);
      setLoading(true);

      try {
        const docRef = await addDoc(collection(db, COLLECTION_ID), {
          ...type,
          userId,
        });

        setRecordTypes((prev) => [
          ...prev,
          {
            id: docRef.id,
            ...type,
            userId,
          },
        ]);
      } catch (e: any) {
        setError(e.message);
      }

      setLoading(false);
    },
    [userId, recordTypes]
  );

  const editRecordType = useCallback(
    async (type: RecordType) => {
      setError(null);
      setLoading(true);

      try {
        await setDoc(doc(db, COLLECTION_ID, type.id), {
          type: type.type,
          color: type.color,
          userId,
        });

        setRecordTypes((prev) =>
          prev.map((p) => (p.id === type.id ? type : p))
        );
      } catch (e: any) {
        setError(e.message);
      }

      setLoading(false);
    },
    [userId]
  );

  const deleteRecordType = useCallback(
    async (typeId: string) => {
      setError(null);
      setLoading(true);

      try {
        await deleteDoc(doc(db, COLLECTION_ID, typeId));

        setRecordTypes((prev) => prev.filter((t) => t.id !== typeId));
      } catch (e: any) {
        setError(e.message);
      }

      setLoading(false);
    },
    [userId]
  );

  return {
    recordTypes,
    loading,
    error,
    addRecordType,
    editRecordType,
    deleteRecordType,
  };
}
