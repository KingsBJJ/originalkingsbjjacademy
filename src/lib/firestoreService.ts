import { db } from './firebase';
import { collection, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc, query, orderBy, where, serverTimestamp } from 'firebase/firestore';

export type ClassScheduleItem = {
  name: string;
  day: string;
  time: string;
  instructor: string;
  category: 'Adults' | 'Kids';
};

export type Branch = {
  id: string;
  name: string;
  address: string;
  phone: string;
  responsible: string;
  additionalInstructors?: string[];
  schedule?: ClassScheduleItem[];
};

export type TermsAcceptance = {
  id:string;
  parentName: string;
  childName: string;
  branchId: string;
  branchName: string;
  acceptedAt: any; // Firestore timestamp
};


const branchesCollection = collection(db, 'branches');
const termsAcceptancesCollection = collection(db, 'termsAcceptances');

export const getBranches = async (): Promise<Branch[]> => {
  const q = query(branchesCollection, orderBy("name"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Branch));
};

export const getBranch = async (id: string): Promise<Branch | null> => {
    const docRef = doc(db, 'branches', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Branch;
    }
    return null;
}

export const addBranch = async (branchData: Omit<Branch, 'id'>) => {
    return await addDoc(branchesCollection, branchData);
}

export const updateBranch = async (id: string, branchData: Partial<Omit<Branch, 'id'>>) => {
    const docRef = doc(db, 'branches', id);
    return await updateDoc(docRef, branchData);
}

export const deleteBranch = async (id: string) => {
    const docRef = doc(db, 'branches', id);
    return await deleteDoc(docRef);
}

export const saveTermsAcceptance = async (data: { parentName: string, childName: string, branchId: string, branchName: string }) => {
  try {
    await addDoc(termsAcceptancesCollection, {
      ...data,
      acceptedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error saving terms acceptance: ", error);
    throw new Error("Não foi possível salvar o termo de responsabilidade.");
  }
};
