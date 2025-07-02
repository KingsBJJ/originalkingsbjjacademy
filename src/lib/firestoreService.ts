import { db } from './firebase';
import { collection, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore';

export type Branch = {
  id: string;
  name: string;
  address: string;
  phone: string;
  hours: string;
  responsible: string;
};

const branchesCollection = collection(db, 'branches');

export const getBranches = async (): Promise<Branch[]> => {
  const q = query(branchesCollection, orderBy("name"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Branch));
};

// Funções de criar, editar e deletar serão implementadas em seguida.
