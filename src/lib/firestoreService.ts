
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
  orderBy,
  increment,
} from 'firebase/firestore';
import { db } from '@/lib/firebase'; // Use a instância unificada de firebase.ts
import { mockBranches, mockInstructors } from './mock-data';

// --- Types ---

export type User = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'student' | 'professor' | 'admin';
  avatar: string;
  belt: string;
  stripes: number;
  attendance: {
    total: number;
    lastMonth: number;
  };
  nextGraduationProgress: number;
  affiliations: string[];
  branchId: string;
  category: 'Adult' | 'Kids';
  mainInstructor?: string;
  isFirstLogin?: boolean;
  password?: string;
  createdAt?: Date; // Changed to Date
  dateOfBirth?: string; // Formato YYYY-MM-DD
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
  dateOfBirth?: string; // Formato YYYY-MM-DD
};

export type Student = User;

// Modificação: createdAt agora é um Date serializável
export type Notification = {
    id: string;
    title: string;
    content: string;
    authorId: string;
    authorName: string;
    authorAvatar: string;
    authorRole: 'admin' | 'professor';
    target: 'all' | string; // 'all' or branchName
    createdAt: Date;
};


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
    if (error instanceof Error) {
        throw new Error(`Failed to seed initial data: ${error.message}`);
    }
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
    return docSnap.exists() ? ({ id: docSnap.id, ...docSnap.data() } as Branch) : null;
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
    if (error instanceof Error) {
        throw new Error(`Failed to add branch: ${error.message}`);
    }
    throw new Error('Failed to add branch');
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
    if (error instanceof Error) {
        throw new Error(`Failed to update branch: ${error.message}`);
    }
    throw new Error('Failed to update branch');
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
    if (error instanceof Error) {
        throw new Error(`Failed to delete branch: ${error.message}`);
    }
     throw new Error('Failed to delete branch');
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
    return docSnap.exists() ? ({ id: docSnap.id, ...docSnap.data() } as Instructor) : null;
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
    if (error instanceof Error) {
        throw new Error(`Failed to update instructor: ${error.message}`);
    }
    throw new Error('Failed to update instructor');
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
    if (error instanceof Error) {
        throw new Error(`Failed to delete instructor: ${error.message}`);
    }
    throw new Error('Failed to delete instructor');
  }
};

// --- Student/User Functions ---

const processUserDoc = (doc: any): User => {
    const data = doc.data();
    const createdAtTimestamp = data.createdAt as Timestamp;
    return {
        id: doc.id,
        ...data,
        createdAt: createdAtTimestamp ? createdAtTimestamp.toDate() : new Date(),
    } as User;
}

export const checkIfEmailExists = async (email: string): Promise<boolean> => {
    if (!db) {
        console.error('Error checking email: Firestore is not initialized.');
        // To be safe, prevent account creation if DB is not available
        return true;
    }
    try {
        const lowercasedEmail = email.toLowerCase();
        // Check in 'users' collection
        const usersQuery = query(collection(db, 'users'), where('email', '==', lowercasedEmail), limit(1));
        const usersSnapshot = await getDocs(usersQuery);
        if (!usersSnapshot.empty) return true;

        // Check in 'instructors' collection
        const instructorsQuery = query(collection(db, 'instructors'), where('email', '==', lowercasedEmail), limit(1));
        const instructorsSnapshot = await getDocs(instructorsQuery);
        return !instructorsSnapshot.empty;

    } catch (error) {
        console.error('Error checking if email exists:', error);
        // Prevent account creation in case of error
        return true;
    }
};

export const getStudents = async (): Promise<Student[]> => {
  if (!db) {
    console.error('Error getting students: Firestore is not initialized.');
    return [];
  }
  try {
    const q = query(collection(db, 'users'), where('role', '==', 'student'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(processUserDoc);
  } catch (error) {
    console.error('Error getting students:', error);
    return [];
  }
};

export const addStudent = async (studentData: Omit<Student, 'id' | 'createdAt'>) => {
    if (!db) {
        return { success: false, message: 'Firestore not initialized' };
    }
    try {
        const emailExists = await checkIfEmailExists(studentData.email);
        if (emailExists) {
            return { success: false, message: 'Este e-mail já pertence a outra conta.' };
        }

        const userWithRole = { 
            ...studentData, 
            role: 'student' as const, 
            email: studentData.email.toLowerCase(),
            createdAt: serverTimestamp(),
        };
        const docRef = await addDoc(collection(db, 'users'), userWithRole);
        return { success: true, id: docRef.id };
    } catch (error) {
        console.error("Error adding student: ", error);
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
        return { success: false, message: errorMessage };
    }
};

export const updateUser = async (id: string, userData: Partial<User>) => {
  if (!db) {
    throw new Error('Failed to update user: Firestore is not initialized.');
  }
  try {
    const docRef = doc(db, 'users', id);
    const updateData: { [key: string]: any } = {};

    // Handle atomic increments for attendance
    if (userData.attendance) {
      if (typeof userData.attendance.total === 'number') {
        updateData['attendance.total'] = increment(userData.attendance.total);
      }
      if (typeof userData.attendance.lastMonth === 'number') {
        updateData['attendance.lastMonth'] = increment(userData.attendance.lastMonth);
      }
      // Remove attendance from main object to avoid overwriting
      delete userData.attendance;
    }

    // Merge the atomic updates with the rest of the user data
    Object.assign(updateData, userData);
    
    if (Object.keys(updateData).length > 0) {
        await updateDoc(docRef, updateData);
    }
    
  } catch (error) {
    console.error('Error updating user:', error);
    if (error instanceof Error) {
        throw new Error(`Failed to update user: ${error.message}`);
    }
    throw new Error('Failed to update user');
  }
};

export const getUserByEmail = async (email: string): Promise<User | null> => {
    if (!db) {
        console.error('Error getting user by email: Firestore is not initialized.');
        return null;
    }
    try {
        const lowercasedEmail = email.toLowerCase().trim();

        // Query the 'users' collection
        const usersQuery = query(collection(db, 'users'), where('email', '==', lowercasedEmail), limit(1));
        const usersSnapshot = await getDocs(usersQuery);
        if (!usersSnapshot.empty) {
            const userDoc = usersSnapshot.docs[0];
            return processUserDoc(userDoc);
        }

        // Query the 'instructors' collection
        const instructorsQuery = query(collection(db, 'instructors'), where('email', '==', lowercasedEmail), limit(1));
        const instructorsSnapshot = await getDocs(instructorsQuery);
        if (!instructorsSnapshot.empty) {
            const instructorDoc = instructorsSnapshot.docs[0];
            const instructorData = instructorDoc.data();
            // Adapt instructor data to User type
            return {
                id: instructorDoc.id,
                name: instructorData.name,
                email: instructorData.email,
                role: 'professor',
                phone: instructorData.phone,
                avatar: instructorData.avatar || `https://placehold.co/128x128.png?text=${instructorData.name.charAt(0)}`,
                belt: instructorData.belt,
                stripes: instructorData.stripes || 0,
                attendance: { total: 0, lastMonth: 0 }, // Professors might not have attendance tracked this way
                nextGraduationProgress: 0,
                affiliations: instructorData.affiliations || [],
                branchId: '', // Or determine from affiliations
                category: 'Adult', // Default for professors
                createdAt: undefined, // Instructors might not have this field
                dateOfBirth: instructorData.dateOfBirth,
            } as User;
        }

        return null; // No user found in either collection
    } catch (error) {
        console.error('Error getting user by email:', error);
        return null;
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
    if (error instanceof Error) {
        throw new Error(`Failed to save terms acceptance: ${error.message}`);
    }
    throw new Error('Failed to save terms acceptance');
  }
};


// --- Notification Functions ---

export const addNotification = async (notificationData: Omit<Notification, 'id' | 'createdAt'>) => {
  if (!db) {
    throw new Error('Failed to add notification: Firestore is not initialized.');
  }
  try {
    const docRef = await addDoc(collection(db, 'notifications'), {
      ...notificationData,
      createdAt: serverTimestamp(),
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error adding notification:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return { success: false, message };
  }
};

const processNotificationDoc = (doc: any): Notification => {
    const data = doc.data();
    // Firestore Timestamps need to be converted to plain JavaScript Date objects
    // for Client Components.
    const createdAtTimestamp = data.createdAt as Timestamp;
    return {
        id: doc.id,
        ...data,
        createdAt: createdAtTimestamp ? createdAtTimestamp.toDate() : new Date(),
    } as Notification;
};


export const getNotifications = async (user: User): Promise<Notification[]> => {
    if (!db) {
        console.error('Error getting notifications: Firestore is not initialized.');
        return [];
    }
    try {
        const notifsCollection = collection(db, 'notifications');
        
        if (user.role === 'admin') {
            const q = query(notifsCollection, orderBy('createdAt', 'desc'));
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(processNotificationDoc);
        }

        // Firestore does not support 'in' queries with 'orderBy' on different fields
        // without a composite index. It's more robust to fetch two separate queries and merge.
        const globalQuery = query(notifsCollection, where('target', '==', 'all'));
        
        const affiliationQueries = user.affiliations.map(affiliation => 
            query(notifsCollection, where('target', '==', affiliation))
        );

        const [globalSnapshot, ...affiliationSnapshots] = await Promise.all([
            getDocs(globalQuery),
            ...affiliationQueries.map(q => getDocs(q))
        ]);

        const notificationsMap = new Map<string, Notification>();
        
        globalSnapshot.docs.forEach(doc => {
            notificationsMap.set(doc.id, processNotificationDoc(doc));
        });
        
        affiliationSnapshots.forEach(snapshot => {
             snapshot.docs.forEach(doc => {
                notificationsMap.set(doc.id, processNotificationDoc(doc));
            });
        });
        
        const allNotifications = Array.from(notificationsMap.values());

        // Sort by creation date, descending, after merging
        allNotifications.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

        return allNotifications;

    } catch (error) {
        console.error('Error getting notifications:', error);
        return [];
    }
};


// --- Test Server Action ---

export const testServerAction = async () => {
  console.log('Test server action called');
  return { success: true, message: 'Test server action called successfully' };
};
