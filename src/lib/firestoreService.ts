
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
import { mockBranches, mockInstructors } from './mock-data';

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
  id:string;
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

// Helper to check for DB initialization
function checkDb() {
    if (!db) {
        throw new Error("Firestore is not initialized. Check your Firebase configuration.");
    }
}

// --- Seeding Function ---

export const seedInitialData = async () => {
    checkDb();
    try {
        console.log("Checking and seeding initial data if necessary...");
        // Check if branches collection is empty
        const branchesQuery = query(collection(db, 'branches'), limit(1));
        const branchesSnapshot = await getDocs(branchesQuery);
        if (branchesSnapshot.empty) {
            console.log("Branches collection is empty. Seeding initial data...");
            const branchPromises = mockBranches.map(branch => {
                const { id, ...branchData } = branch;
                return setDoc(doc(db, 'branches', id), branchData);
            });
            await Promise.all(branchPromises);
            console.log("✅ Seeding branches completed.");
        } else {
            console.log("Branches collection already has data. Skipping seed.");
        }

        // Check if instructors collection is empty
        const instructorsQuery = query(collection(db, 'instructors'), limit(1));
        const instructorsSnapshot = await getDocs(instructorsQuery);
        if (instructorsSnapshot.empty) {
            console.log("Instructors collection is empty. Seeding initial data...");
            const instructorPromises = mockInstructors.map(instructor => {
                const { id, ...instructorData } = instructor;
                return setDoc(doc(db, 'instructors', id), instructorData);
            });
            await Promise.all(instructorPromises);
            console.log("✅ Seeding instructors completed.");
        } else {
            console.log("Instructors collection already has data. Skipping seed.");
        }
        return { success: true, message: "Data seeding check completed." };
    } catch (error) {
        console.error("❌ Error seeding initial data:", error);
        throw new Error("Failed to seed initial data. Check Firestore connection and permissions.");
    }
};

// --- Branch Functions ---

export const getBranches = async (): Promise<Branch[]> => {
  checkDb();
  try {
    const querySnapshot = await getDocs(query(collection(db, 'branches')));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Branch));
  } catch (error) {
    console.error("Error getting branches: ", error);
    throw new Error("Failed to fetch branches.");
  }
};

export const getBranch = async (id: string): Promise<Branch | null> => {
  checkDb();
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
  checkDb();
  try {
    const docRef = await addDoc(collection(db, 'branches'), branchData);
    return { id: docRef.id };
  } catch (error) {
    console.error("Error adding branch: ", error);
    throw new Error("Failed to add branch.");
  }
};

export const updateBranch = async (id: string, branchData: Partial<Omit<Branch, 'id'>>) => {
  checkDb();
  try {
    const docRef = doc(db, 'branches', id);
    await updateDoc(docRef, branchData);
  } catch (error) {
    console.error("Error updating branch: ", error);
    throw new Error("Failed to update branch.");
  }
};

export const deleteBranch = async (id: string) => {
  checkDb();
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
    checkDb();
    try {
        const querySnapshot = await getDocs(query(collection(db, 'instructors')));
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Instructor));
    } catch (error) {
        console.error("Error getting instructors: ", error);
        throw new Error("Failed to fetch instructors.");
    }
};

export const getInstructorsByAffiliation = async (affiliation: string): Promise<Instructor[]> => {
    checkDb();
    if (!affiliation) return [];
    try {
        const allInstructors = await getInstructors();
        return allInstructors.filter(instructor => 
            instructor.affiliations?.includes(affiliation)
        );
    } catch (error) {
        console.error(`Error getting instructors for affiliation ${affiliation}:`, error);
        throw new Error("Failed to fetch instructors for the selected affiliation.");
    }
};

export const getInstructor = async (id: string): Promise<Instructor | null> => {
    checkDb();
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
    checkDb();
    try {
        const docRef = await addDoc(collection(db, 'instructors'), instructorData);
        return { id: docRef.id };
    } catch (error) {
        console.error("Error adding instructor: ", error);
        throw new Error("Failed to add instructor.");
    }
};

export const updateInstructor = async (id: string, instructorData: Partial<Omit<Instructor, 'id'>>) => {
    checkDb();
    try {
        const docRef = doc(db, 'instructors', id);
        await updateDoc(docRef, instructorData);
    } catch (error) {
        console.error("Error updating instructor: ", error);
        throw new Error("Failed to update instructor.");
    }
};

export const deleteInstructor = async (id: string) => {
    checkDb();
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
    checkDb();
    try {
        const q = query(collection(db, 'users'), where("role", "==", "student"));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Student));
    } catch (error) {
        console.error("Error getting students: ", error);
        throw new Error("Failed to fetch students.");
    }
};


// --- Terms Acceptance Functions ---

export const saveTermsAcceptance = async (data: Omit<TermsAcceptance, 'id' | 'acceptedAt'>) => {
    checkDb();
    try {
        const docRef = await addDoc(collection(db, 'terms'), {
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
  checkDb();
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
    checkDb();
    try {
        const q = query(collection(db, 'users'), where("role", "==", role), limit(1));
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
    checkDb();
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
    checkDb();
    try {
        const docRef = doc(db, 'users', id);
        await updateDoc(docRef, userData);
    } catch (error) {
        console.error("Error updating user: ", error);
        throw new Error("Failed to update user.");
    }
};

export const findInstructorByEmail = async (email: string): Promise<Instructor | null> => {
  checkDb();
  try {
    const q = query(collection(db, 'instructors'), where("email", "==", email), limit(1));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      return null;
    }
    const instructorDoc = querySnapshot.docs[0];
    return { id: instructorDoc.id, ...instructorDoc.data() } as Instructor;
  } catch (error) {
    console.error("Error finding instructor by email: ", error);
    throw new Error("Failed to find instructor by email.");
  }
};
