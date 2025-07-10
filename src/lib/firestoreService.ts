// src/lib/firestoreService.ts
'use server';

import {
  collection,
  getDocs,
  doc,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  limit,
  setDoc,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase'; // Use apenas a instância db de firebase.ts
import { mockBranches, mockInstructors } from './mock-data';

// --- Types ---

export type User = {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'professor' | 'admin';
  avatar: string;
  belt: string;
  stripes: number;
  attendance: {
    total: number;
    lastMonth: number;
  };
  nextGraduationProgress: number;
  affiliation: string;
  branchId: string;
  category: 'Adult' | 'Kids';
  mainInstructor?: string;
  isFirstLogin?: boolean;
  password?: string;
};

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
  responsible?: string;
  additionalInstructors?: string[];
  schedule?: ClassScheduleItem[];
};

export type TermsAcceptance = {
  id: string;
  parentName: string;
  childName: string;
  branchId: string;
  branchName: string;
  acceptedAt: Timestamp;
};

export type Instructor = {
  id: string;
  name: string;
  email: string;
  phone: string;
  affiliations?: string[];
  belt: string;
  stripes?: number;
  bio?: string;
  avatar?: string;
  password?: string;
  isFirstLogin?: boolean;
  teachingCategories?: ('Adults' | 'Kids')[];
};

export type Student = User;

// --- Seeding Function ---

export const seedInitialData = async () => {
  if (!db) {
    console.error('❌ Firestore not initialized. Skipping data seeding.');
    throw new Error('Firestore not initialized.');
  }
  try {
    console.log('Checking and seeding initial data if necessary...');
    const branchesQuery = query(collection(db, 'branches'), limit(1));
    const branchesSnapshot = await getDocs(branchesQuery);
    if (branchesSnapshot.empty) {
      console.log('Seeding branches...');
      const branchPromises = mockBranches.map(branch => {
        const { id, ...branchData } = branch;
        return setDoc(doc(db, 'branches', id), branchData);
      });
      await Promise.all(branchPromises);
      console.log('✅ Seeding branches completed.');
    }

    const instructorsQuery = query(collection(db, 'instructors'), limit(1));
    const instructorsSnapshot = await getDocs(instructorsQuery);
    if (instructorsSnapshot.empty) {
      console.log('Seeding instructors...');
      const instructorPromises = mockInstructors.map(instructor => {
        const { id, ...instructorData } = instructor;
        return setDoc(doc(db, 'instructors', id), instructorData);
      });
      await Promise.all(instructorPromises);
      console.log('✅ Seeding instructors completed.');
    }
    return { success: true, message: 'Data seeding check completed.' };
  } catch (error) {
    console.error('❌ Error seeding initial data:', error);
    throw new Error('Failed to seed initial data.');
  }
};

// --- Branch Functions ---

export const getBranches = async (): Promise<Branch[]> => {
  if (!db) {
    console.error('Error getting branches: Firestore is not initialized.');
    return [];
  }
  try {
    const branchesCollection = collection(db, 'branches');
    const snapshot = await getDocs(branchesCollection);
    console.log(`Firestore: Successfully fetched ${snapshot.docs.length} documents from 'branches' collection.`);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Branch));
  } catch (error) {
    console.error('Error getting branches:', error);
    return [];
  }
};

export const getBranch = async (id: string): Promise<Branch | null> => {
  if (!db) {
    console.error(`Error getting branch with id ${id}: Firestore is not initialized.`);
    return null;
  }
  try {
    const docRef = doc(db, 'branches', id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? { id: docSnap.id, ...doc.data() } as Branch : null;
  } catch (error) {
    console.error(`Error getting branch with id ${id}:`, error);
    return null;
  }
};

export const addBranch = async (branchData: Omit<Branch, 'id'>) => {
  if (!db) {
    console.error('Attempting to add branch but Firestore is not initialized.');
    throw new Error('Failed to add branch: Firestore is not initialized.');
  }
  try {
    const docRef = await addDoc(collection(db, 'branches'), branchData);
    return { id: docRef.id };
  } catch (error) {
    console.error('Error adding branch:', error);
    throw new Error(`Failed to add branch: ${error.message}`);
  }
};

export const updateBranch = async (id: string, branchData: Partial<Omit<Branch, 'id'>>) => {
  if (!db) {
    throw new Error('Failed to update branch: Firestore is not initialized.');
  }
  try {
    const docRef = doc(db, 'branches', id);
    await updateDoc(docRef, branchData);
  } catch (error) {
    console.error('Error updating branch:', error);
    throw new Error(`Failed to update branch: ${error.message}`);
  }
};

export const deleteBranch = async (id: string) => {
  if (!db) {
    throw new Error('Failed to delete branch: Firestore is not initialized.');
  }
  try {
    const docRef = doc(db, 'branches', id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting branch:', error);
    throw new Error(`Failed to delete branch: ${error.message}`);
  }
};

// --- Instructor Functions ---

export const getInstructors = async (): Promise<Instructor[]> => {
  if (!db) {
    console.error('Error getting instructors: Firestore is not initialized.');
    return [];
  }
  try {
    const instructorsCollection = collection(db, 'instructors');
    const snapshot = await getDocs(instructorsCollection);
    console.log(`Firestore: Successfully fetched ${snapshot.docs.length} documents from 'instructors' collection.`);
    if (snapshot.empty) {
      console.log("The 'instructors' collection is empty. Use the seed data button on the dashboard if needed.");
    }
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Instructor));
  } catch (error) {
    console.error('Erro ao obter instructors:', error);
    return [];
  }
};

export const getInstructorsByAffiliation = async (affiliation: string): Promise<Instructor[]> => {
  if (!affiliation) return [];
  if (!db) {
    console.error(`Error getting instructors for affiliation ${affiliation}: Firestore is not initialized.`);
    return [];
  }
  try {
    const q = query(collection(db, 'instructors'), where('affiliations', 'array-contains', affiliation));
    const querySnapshot = await getDocs(q);
    console.log(`Firestore: Found ${querySnapshot.docs.length} instructors for affiliation '${affiliation}'.`);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Instructor));
  } catch (error) {
    console.error(`Error getting instructors for affiliation ${affiliation}:`, error);
    return [];
  }
};

export const getInstructor = async (id: string): Promise<Instructor | null> => {
  if (!db) {
    console.error(`Error getting instructor with id ${id}: Firestore is not initialized.`);
    return null;
  }
  try {
    const docRef = doc(db, 'instructors', id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? { id: docSnap.id, ...doc.data() } as Instructor : null;
  } catch (error) {
    console.error(`Error getting instructor with id ${id}:`, error);
    return null;
  }
};

export const addInstructor = async (instructorData: Omit<Instructor, 'id'>): Promise<{ success: boolean; message: string; id?: string }> => {
  if (!db) {
    console.error('Attempting to add instructor but Firestore is not initialized.');
    return { success: false, message: 'Failed to add instructor: Firestore is not initialized.' };
  }
  try {
    console.log('Adding instructor with data:', JSON.stringify(instructorData, null, 2));
    const docRef = await addDoc(collection(db, 'instructors'), instructorData);
    console.log('Instructor added successfully with ID:', docRef.id);
    return { success: true, message: 'Instructor added successfully', id: docRef.id };
  } catch (error) {
    console.error('Error adding instructor:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return { success: false, message: `Failed to add instructor: ${errorMessage}` };
  }
};

export const updateInstructor = async (id: string, instructorData: Partial<Omit<Instructor, 'id'>>) => {
  if (!db) {
    throw new Error('Failed to update instructor: Firestore is not initialized.');
  }
  try {
    const docRef = doc(db, 'instructors', id);
    await updateDoc(docRef, instructorData);
  } catch (error) {
    console.error('Error updating instructor:', error);
    throw new Error(`Failed to update instructor: ${error.message}`);
  }
};

export const deleteInstructor = async (id: string) => {
  if (!db) {
    throw new Error('Failed to delete instructor: Firestore is not initialized.');
  }
  try {
    const docRef = doc(db, 'instructors', id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting instructor:', error);
    throw new Error(`Failed to delete instructor: ${error.message}`);
  }
};

// --- Student Functions ---

export const getStudents = async (): Promise<Student[]> => {
  if (!db) {
    console.error('Error getting students: Firestore is not initialized.');
    return [];
  }
  try {
    const q = query(collection(db, 'users'), where('role', '==', 'student'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Student));
  } catch (error) {
    console.error('Error getting students:', error);
    return [];
  }
};

// --- Terms Acceptance Functions ---

export const saveTermsAcceptance = async (data: Omit<TermsAcceptance, 'id' | 'acceptedAt'>) => {
  if (!db) {
    throw new Error('Failed to save terms acceptance: Firestore is not initialized.');
  }
  try {
    const docRef = await addDoc(collection(db, 'terms'), {
      ...data,
      acceptedAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error saving terms acceptance:', error);
    throw new Error(`Failed to save terms acceptance: ${error.message}`);
  }
};

// --- User Functions ---

export const updateUser = async (id: string, userData: Partial<User>) => {
  if (!db) {
    throw new Error('Failed to update user: Firestore is not initialized.');
  }
  try {
    const docRef = doc(db, 'users', id);
    await updateDoc(docRef, userData);
  } catch (error) {
    console.error('Error updating user:', error);
    throw new Error(`Failed to update user: ${error.message}`);
  }
};

// --- Test Server Action ---

export const testServerAction = async () => {
  console.log('Test server action called');
  return { success: true, message: 'Test server action called successfully' };
};