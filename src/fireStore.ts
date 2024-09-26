import {
  collection,
  doc,
  getDocs,
  query,
  where,
  writeBatch,
} from 'firebase/firestore';
import { db } from './firebaseConfig';
import {
  FirebaseStorage,
  Record,
  RECORD_COLLECTION_ID,
  RecordBase,
  RecordType,
  RecordTypeBase,
  TYPE_COLLECTION_ID,
} from '@budgeet/shared';

const fireStore: FirebaseStorage = {
  async getRecords(userId: string) {
    const q = query(
      collection(db, RECORD_COLLECTION_ID),
      where('userId', '==', userId)
    );

    return getDocs(q).then((snapshot) => {
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

      return result ?? [];
    });
  },

  async addRecords(userId: string, items: RecordBase[]) {
    const temp: Record[] = [];

    try {
      const batch = writeBatch(db);

      items.forEach(async (item) => {
        const docRef = doc(collection(db, RECORD_COLLECTION_ID));
        batch.set(docRef, { ...item, userId });
        temp.push({ ...item, userId, id: docRef.id });
      });

      await batch.commit();
    } catch (e) {
      throw e;
    }

    return temp ?? [];
  },

  async editRecords(userId: string, items: Record[]) {
    try {
      const batch = writeBatch(db);

      items.forEach(async (record) => {
        batch.set(doc(db, RECORD_COLLECTION_ID, record.id), {
          ...record,
          userId,
        });
      });

      await batch.commit();
    } catch (e) {
      throw e;
    }
  },

  async deleteRecords(ids: string[]) {
    try {
      const batch = writeBatch(db);

      ids.forEach(async (id) => {
        batch.delete(doc(db, RECORD_COLLECTION_ID, id));
      });

      await batch.commit();
    } catch (e) {
      throw e;
    }
  },

  async getRecordTypes(userId: string) {
    const q = query(
      collection(db, TYPE_COLLECTION_ID),
      where('userId', '==', userId)
    );

    return getDocs(q).then((snapshot) => {
      const result = snapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            type: doc.data().type,
            userId: doc.data().userId,
            color: doc.data().color,
          } as RecordType)
      );

      return result ?? [];
    });
  },

  async addRecordTypes(userId: string, items: RecordTypeBase[]) {
    const temp: RecordType[] = [];

    try {
      const batch = writeBatch(db);

      items.forEach(async (item) => {
        const docRef = doc(collection(db, TYPE_COLLECTION_ID));
        batch.set(docRef, { ...item, userId });
        temp.push({ ...item, userId, id: docRef.id });
      });

      await batch.commit();
    } catch (e) {
      throw e;
    }

    return temp ?? [];
  },

  async editRecordTypes(userId: string, items: RecordType[]) {
    try {
      const batch = writeBatch(db);

      items.forEach(async (item) => {
        batch.set(doc(db, TYPE_COLLECTION_ID, item.id), {
          ...item,
          userId,
        });
      });

      await batch.commit();
    } catch (e) {
      throw e;
    }
  },

  async deleteRecordTypes(ids: string[]) {
    try {
      const batch = writeBatch(db);

      ids.forEach(async (id) => {
        batch.delete(doc(db, TYPE_COLLECTION_ID, id));
      });

      await batch.commit();
    } catch (e) {
      throw e;
    }
  },
};

export default fireStore;
