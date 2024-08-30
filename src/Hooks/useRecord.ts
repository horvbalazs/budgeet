import { useCallback, useEffect, useState } from 'react';
import { db } from '../firebase';
import {
  collection,
  doc,
  getDocs,
  query,
  where,
  writeBatch,
} from 'firebase/firestore';
import { Record, RecordBase } from '@budgeet/types';

const COLLECTION_ID = 'financeRecords';

export function useRecord(userId: string, fetchRecords = true) {
  const [records, setRecords] = useState<Record[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (fetchRecords) {
      setLoading(true);

      const q = query(
        collection(db, COLLECTION_ID),
        where('userId', '==', userId)
      );
      getDocs(q)
        .then((snapshot) => {
          const result = snapshot.docs.map((doc) => {
            const temp: Record = {
              id: doc.id,
              date: doc.data().date,
              name: doc.data().name,
              note: doc.data().note,
              value: doc.data().value,
              currency: doc.data().currency,
              userId: doc.data().userId,
            } as Record;

            if (doc.data().type) {
              temp.type = doc.data().type;
            }

            return temp;
          });

          setRecords(result);
        })
        .catch((e) => {
          setError(e.message);
        })
        .finally(() => setLoading(false));
    }
  }, [userId, fetchRecords]);

  const addRecords = useCallback(
    async (records: RecordBase[]) => {
      setError(null);
      setLoading(true);

      try {
        const batch = writeBatch(db);
        const temp: Record[] = [];

        records.forEach(async (record) => {
          const docRef = doc(collection(db, COLLECTION_ID));
          batch.set(docRef, { ...record, userId });
          temp.push({ ...record, userId, id: docRef.id });
        });

        await batch.commit();

        setRecords((prev) => [...prev, ...temp]);
      } catch (e: any) {
        setError(e.message);
      }

      setLoading(false);
    },
    [userId, records]
  );

  const editRecords = useCallback(
    async (updatedRecords: Record[]) => {
      setError(null);
      setLoading(true);

      try {
        const batch = writeBatch(db);

        updatedRecords.forEach(async (record) => {
          batch.set(doc(db, COLLECTION_ID, record.id), { ...record, userId });
        });

        await batch.commit();

        setRecords((prev) =>
          prev.map((r) => {
            const found = updatedRecords.find((s) => s.id === r.id);

            return found ?? r;
          })
        );
      } catch (e: any) {
        setError(e.message);
      }

      setLoading(false);
    },
    [userId, records]
  );

  const deleteRecords = useCallback(
    async (ids: string[]) => {
      setError(null);
      setLoading(true);

      try {
        const batch = writeBatch(db);

        ids.forEach(async (recordId) => {
          batch.delete(doc(db, COLLECTION_ID, recordId));
        });

        await batch.commit();

        setRecords((prev) => prev.filter((r) => !ids.includes(r.id)));
      } catch (e: any) {
        setError(e.message);
      }

      setLoading(false);
    },
    [userId, records]
  );

  return {
    records,
    loading,
    error,
    addRecords,
    editRecords,
    deleteRecords,
  };
}
