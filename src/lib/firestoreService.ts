
"use client";

import { db } from '@/lib/firebase';
import { 
    collection, 
    getDocs, 
    doc, 
    getDoc, 
    addDoc, 
    updateDoc, 
    deleteDoc, 
    query,
    serverTimestamp,
    Timestamp,
    where,
    limit,
    setDoc
} from 'firebase/firestore';

// --- Types ---

export type User = {
  id: string;
  name: string;
  email: string;
  role: "student" | "professor" | "admin";
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
  category: "Adult" | "Kids";
  mainInstructor?: string;
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
  id:string;
  name: string;
  email: string;
  phone: string;
  affiliations?: string[];
  belt: string;
  stripes?: number;
  bio?: string;
  avatar?: string;
};

export type Student = Omit<User, 'role'>;


// --- References to Firestore Collections ---
const branchesCollection = collection(db, 'branches');
const instructorsCollection = collection(db, 'instructors');
const studentsCollection = collection(db, 'students');
const usersCollection = collection(db, 'users');
const termsCollection = collection(db, 'terms');


// --- Branch Functions ---

export const getBranches = async (): Promise<Branch[]> => {
  try {
    const querySnapshot = await getDocs(query(branchesCollection));
    if (querySnapshot.empty) {
      return [];
    }
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Branch));
  } catch (error) {
    console.error("Error getting branches: ", error);
    throw new Error("Failed to fetch branches.");
  }
};

export const getBranch = async (id: string): Promise<Branch | null> => {
  try {
    const docRef = doc(db, 'branches', id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } as Branch : null;
  } catch (error) {
    console.error("Error getting branch: ", error);
    throw new Error("Failed to fetch branch.");
  }
};

export const addBranch = async (branchData: Omit<Branch, 'id'>) => {
  try {
    const docRef = await addDoc(branchesCollection, branchData);
    return { id: docRef.id };
  } catch (error) {
    console.error("Error adding branch: ", error);
    throw new Error("Failed to add branch.");
  }
};

export const updateBranch = async (id: string, branchData: Partial<Omit<Branch, 'id'>>) => {
  try {
    const docRef = doc(db, 'branches', id);
    await updateDoc(docRef, branchData);
  } catch (error) {
    console.error("Error updating branch: ", error);
    throw new Error("Failed to update branch.");
  }
};

export const deleteBranch = async (id: string) => {
  try {
    const docRef = doc(db, 'branches', id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error("Error deleting branch: ", error);
    throw new Error("Failed to delete branch.");
  }
};


// --- Instructor Functions ---

export const getInstructors = async (): Promise<Instructor[]> => {
    try {
        const querySnapshot = await getDocs(query(instructorsCollection));
        if (querySnapshot.empty) {
            return [];
        }
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Instructor));
    } catch (error) {
        console.error("Error getting instructors: ", error);
        throw new Error("Failed to fetch instructors.");
    }
};

export const getInstructor = async (id: string): Promise<Instructor | null> => {
    try {
        const docRef = doc(db, 'instructors', id);
        const docSnap = await getDoc(docRef);
        return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } as Instructor : null;
    } catch (error) {
        console.error("Error getting instructor: ", error);
        throw new Error("Failed to fetch instructor.");
    }
}

export const addInstructor = async (instructorData: Omit<Instructor, 'id'>) => {
    try {
        const docRef = await addDoc(instructorsCollection, instructorData);
        return { id: docRef.id };
    } catch (error) {
        console.error("Error adding instructor: ", error);
        throw new Error("Failed to add instructor.");
    }
};

export const updateInstructor = async (id: string, instructorData: Partial<Omit<Instructor, 'id'>>) => {
    try {
        const docRef = doc(db, 'instructors', id);
        await updateDoc(docRef, instructorData);
    } catch (error) {
        console.error("Error updating instructor: ", error);
        throw new Error("Failed to update instructor.");
    }
};

export const deleteInstructor = async (id: string) => {
    try {
        const docRef = doc(db, 'instructors', id);
        await deleteDoc(docRef);
    } catch (error) {
        console.error("Error deleting instructor: ", error);
        throw new Error("Failed to delete instructor.");
    }
};


// --- Student Functions ---
export const getStudents = async (): Promise<Student[]> => {
    try {
        const querySnapshot = await getDocs(query(studentsCollection));
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Student));
    } catch (error) {
        console.error("Error getting students: ", error);
        throw new Error("Failed to fetch students.");
    }
};


// --- Terms Acceptance Functions ---

export const saveTermsAcceptance = async (data: Omit<TermsAcceptance, 'id' | 'acceptedAt'>) => {
    try {
        const docRef = await addDoc(termsCollection, {
            ...data,
            acceptedAt: serverTimestamp(),
        });
        return docRef.id;
    } catch (error) {
        console.error("Error saving terms acceptance: ", error);
        throw new Error("Failed to save terms acceptance.");
    }
};


// --- User Functions ---

export const ensureUserExists = async (user: User) => {
  try {
      const userRef = doc(db, 'users', user.id);
      const userSnap = await getDoc(userRef);
      if (!userSnap.exists()) {
          console.log(`User ${user.id} not found in DB. Creating...`);
          await setDoc(userRef, user);
      }
  } catch (error) {
      // Log error but do not throw, as this is a background task.
      console.error(`Failed to ensure user ${user.id} exists in DB:`, error);
  }
};


export const getAppUser = async (role: 'student' | 'professor' | 'admin'): Promise<User | null> => {
    try {
        const q = query(usersCollection, where("role", "==", role), limit(1));
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) {
            return null;
        }
        const userDoc = querySnapshot.docs[0];
        return { id: userDoc.id, ...userDoc.data() } as User;
    } catch (error) {
        console.error(`Error getting user for role ${role}: `, error);
        throw new Error("Failed to fetch user.");
    }
};

export const createAppUser = async (userData: User) => {
    try {
        const docRef = doc(db, 'users', userData.id);
        await setDoc(docRef, userData);
        return userData;
    } catch (error) {
        console.error("Error creating user: ", error);
        throw new Error("Failed to create user.");
    }
}

export const updateUser = async (id: string, userData: Partial<User>) => {
    try {
        const docRef = doc(db, 'users', id);
        await updateDoc(docRef, userData);
    } catch (error) {
        console.error("Error updating user: ", error);
        throw new Error("Failed to update user.");
    }
};
