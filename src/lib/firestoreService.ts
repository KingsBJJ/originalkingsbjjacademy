
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
    setDoc,
    onSnapshot,
    type Unsubscribe
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

export type Student = User;


// --- Helper to throw an error if DB is not initialized ---
const ensureDbInitialized = () => {
    if (!db) {
        throw new Error("Firebase DB not initialized. This is likely due to missing environment variables. Check the browser console for more details from Firebase.");
    }
}

// --- References to Firestore Collections ---
// These are now functions to avoid errors when db is null during initialization.
const getBranchesCollection = () => { ensureDbInitialized(); return collection(db, 'branches'); }
const getInstructorsCollection = () => { ensureDbInitialized(); return collection(db, 'instructors'); }
const getUsersCollection = () => { ensureDbInitialized(); return collection(db, 'users'); }
const getTermsCollection = () => { ensureDbInitialized(); return collection(db, 'terms'); }


// --- Branch Functions ---

export const getBranches = async (): Promise<Branch[]> => {
  ensureDbInitialized();
  try {
    const querySnapshot = await getDocs(query(getBranchesCollection()));
    if (querySnapshot.empty) {
      return [];
    }
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Branch));
  } catch (error) {
    console.error("Error getting branches: ", error);
    throw new Error("Failed to fetch branches.");
  }
};

export const onBranchesUpdate = (callback: (branches: Branch[]) => void): Unsubscribe => {
    if (!db) {
        console.error("Firebase DB not initialized. Cannot set up listener for branches.");
        return () => {};
    }
    const q = query(getBranchesCollection());
    return onSnapshot(q, (querySnapshot) => {
        const branches = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Branch));
        callback(branches);
    }, (error) => {
        console.error("Error on branches snapshot: ", error);
        callback([]);
    });
};

export const getBranch = async (id: string): Promise<Branch | null> => {
  ensureDbInitialized();
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
  ensureDbInitialized();
  try {
    const docRef = await addDoc(getBranchesCollection(), branchData);
    return { id: docRef.id };
  } catch (error) {
    console.error("Error adding branch: ", error);
    throw new Error("Failed to add branch.");
  }
};

export const updateBranch = async (id: string, branchData: Partial<Omit<Branch, 'id'>>) => {
  ensureDbInitialized();
  try {
    const docRef = doc(db, 'branches', id);
    await updateDoc(docRef, branchData);
  } catch (error) {
    console.error("Error updating branch: ", error);
    throw new Error("Failed to update branch.");
  }
};

export const deleteBranch = async (id: string) => {
  ensureDbInitialized();
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
    ensureDbInitialized();
    try {
        const querySnapshot = await getDocs(query(getInstructorsCollection()));
        if (querySnapshot.empty) {
            return [];
        }
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Instructor));
    } catch (error) {
        console.error("Error getting instructors: ", error);
        throw new Error("Failed to fetch instructors.");
    }
};

export const onInstructorsUpdate = (callback: (instructors: Instructor[]) => void): Unsubscribe => {
    if (!db) {
        console.error("Firebase DB not initialized. Cannot set up listener for instructors.");
        return () => {};
    }
    const q = query(getInstructorsCollection());
    return onSnapshot(q, (querySnapshot) => {
        const instructors = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Instructor));
        callback(instructors);
    }, (error) => {
        console.error("Error on instructors snapshot: ", error);
        callback([]);
    });
};

export const getInstructor = async (id: string): Promise<Instructor | null> => {
    ensureDbInitialized();
    try {
        const docRef = doc(db, 'instructors', id);
        const docSnap = await getDoc(docRef);
        return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } as Instructor : null;
    } catch (error) {
        console.error("Error getting instructor: ", error);
        throw new Error("Failed to fetch instructor.");
    }
}

export const getInstructorsByAffiliation = async (affiliation: string): Promise<Instructor[]> => {
    ensureDbInitialized();
    try {
        const q = query(getInstructorsCollection(), where("affiliations", "array-contains", affiliation));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Instructor));
    } catch (error) {
        console.error(`Error getting instructors for affiliation ${affiliation}: `, error);
        throw new Error("Failed to fetch instructors for this affiliation.");
    }
};

export const addInstructor = async (instructorData: Omit<Instructor, 'id'>) => {
    ensureDbInitialized();
    try {
        const docRef = await addDoc(getInstructorsCollection(), instructorData);
        return { id: docRef.id };
    } catch (error) {
        console.error("Error adding instructor: ", error);
        throw new Error("Failed to add instructor.");
    }
};

export const updateInstructor = async (id: string, instructorData: Partial<Omit<Instructor, 'id'>>) => {
    ensureDbInitialized();
    try {
        const docRef = doc(db, 'instructors', id);
        await updateDoc(docRef, instructorData);
    } catch (error) {
        console.error("Error updating instructor: ", error);
        throw new Error("Failed to update instructor.");
    }
};

export const deleteInstructor = async (id: string) => {
    ensureDbInitialized();
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
    ensureDbInitialized();
    try {
        const q = query(getUsersCollection(), where("role", "==", "student"));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Student));
    } catch (error) {
        console.error("Error getting students: ", error);
        throw new Error("Failed to fetch students.");
    }
};

export const onStudentsUpdate = (callback: (students: Student[]) => void): Unsubscribe => {
    if (!db) {
        console.error("Firebase DB not initialized. Cannot set up listener for students.");
        return () => {};
    }
    const q = query(getUsersCollection(), where("role", "==", "student"));
    return onSnapshot(q, (querySnapshot) => {
        const students = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Student));
        callback(students);
    }, (error) => {
        console.error("Error on students snapshot: ", error);
        callback([]);
    });
};


// --- Terms Acceptance Functions ---

export const saveTermsAcceptance = async (data: Omit<TermsAcceptance, 'id' | 'acceptedAt'>) => {
    ensureDbInitialized();
    try {
        const docRef = await addDoc(getTermsCollection(), {
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
  if (!db) {
      // Don't throw, as this is a background/non-critical task
      console.error("DB not initialized. Cannot ensure user exists.");
      return;
  };
  try {
      const userRef = doc(db, 'users', user.id);
      const userSnap = await getDoc(userRef);
      if (!userSnap.exists()) {
          console.log(`User ${user.id} not found in DB. Creating...`);
          await setDoc(userRef, user);
      }
  } catch (error) {
      console.error(`Failed to ensure user ${user.id} exists in DB:`, error);
  }
};


export const getAppUser = async (role: 'student' | 'professor' | 'admin'): Promise<User | null> => {
    ensureDbInitialized();
    try {
        const q = query(getUsersCollection(), where("role", "==", role), limit(1));
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
    ensureDbInitialized();
    try {
        const docRef = doc(db, 'users', userData.id);
        await setDoc(docRef, userData);
        return userData;
    } catch (error)
    {
        console.error("Error creating user: ", error);
        throw new Error("Failed to create user.");
    }
}

export const updateUser = async (id: string, userData: Partial<User>) => {
    ensureDbInitialized();
    try {
        const docRef = doc(db, 'users', id);
        await updateDoc(docRef, userData);
    } catch (error) {
        console.error("Error updating user: ", error);
        throw new Error("Failed to update user.");
    }
};
