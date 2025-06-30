import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, query, orderBy } from 'firebase/firestore';
import type { Instructor } from '@/lib/mock-data';

// Omit 'id' for creation
export type InstructorData = Omit<Instructor, 'id'>;

const instructorsCollection = collection(db, 'instructors');

/**
 * Adds a new instructor to Firestore.
 * @param instructorData - The instructor data to add.
 * @returns The newly created instructor document with its ID.
 */
export async function addInstructor(instructorData: InstructorData) {
  try {
    // Ensure stripes is a number, default to 0 if not provided
    const dataToSave = {
      ...instructorData,
      stripes: instructorData.stripes || 0,
      avatar: instructorData.avatar || '',
      bio: instructorData.bio || '',
    };
    const docRef = await addDoc(instructorsCollection, dataToSave);
    return { id: docRef.id, ...dataToSave };
  } catch (error) {
    console.error("Error adding instructor: ", error);
    throw new Error("Could not add instructor.");
  }
}

/**
 * Fetches all instructors from Firestore.
 * @returns A list of all instructors.
 */
export async function getInstructors(): Promise<Instructor[]> {
  try {
    const q = query(instructorsCollection, orderBy("name"));
    const querySnapshot = await getDocs(q);
    const instructors: Instructor[] = [];
    querySnapshot.forEach((doc) => {
      instructors.push({ id: doc.id, ...doc.data() } as Instructor);
    });
    return instructors;
  } catch (error) {
    console.error("Error fetching instructors: ", error);
    throw new Error("Could not fetch instructors.");
  }
}
