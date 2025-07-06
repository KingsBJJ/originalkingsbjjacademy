
import { mockBranches, mockInstructors } from './mock-data';

// Helper function to simulate network delay
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

// --- Types (Keep them as they are) ---
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
  acceptedAt: Date;
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
};

// --- LocalStorage Keys ---
const BRANCHES_KEY = 'kings-bjj-branches';
const INSTRUCTORS_KEY = 'kings-bjj-instructors';
const TERMS_KEY = 'kings-bjj-terms';

// --- Branch Functions ---

export const getBranches = async (): Promise<Branch[]> => {
  await delay(200); // Simulate network latency
  if (typeof window === 'undefined') return [];
  const branchesJson = localStorage.getItem(BRANCHES_KEY);
  if (!branchesJson || JSON.parse(branchesJson).length === 0) {
    // If no data, populate with mock data
    localStorage.setItem(BRANCHES_KEY, JSON.stringify(mockBranches));
    return mockBranches;
  }
  return JSON.parse(branchesJson);
};

export const getBranch = async (id: string): Promise<Branch | null> => {
  await delay(200);
  const branches = await getBranches();
  return branches.find(b => b.id === id) || null;
};

export const addBranch = async (branchData: Omit<Branch, 'id'>) => {
  await delay(300);
  const branches = await getBranches();
  const newBranch: Branch = {
    id: `branch_${Date.now()}`,
    ...branchData,
  };
  branches.push(newBranch);
  localStorage.setItem(BRANCHES_KEY, JSON.stringify(branches));
  return { id: newBranch.id }; 
};

export const updateBranch = async (id: string, branchData: Partial<Omit<Branch, 'id'>>) => {
  await delay(300);
  let branches = await getBranches();
  branches = branches.map(b => (b.id === id ? { ...b, ...branchData } : b));
  localStorage.setItem(BRANCHES_KEY, JSON.stringify(branches));
};

export const deleteBranch = async (id: string) => {
  await delay(300);
  let branches = await getBranches();
  branches = branches.filter(b => b.id !== id);
  localStorage.setItem(BRANCHES_KEY, JSON.stringify(branches));
};

// --- Instructor Functions ---

export const getInstructors = async (): Promise<Instructor[]> => {
  await delay(200);
  if (typeof window === 'undefined') return [];
  const instructorsJson = localStorage.getItem(INSTRUCTORS_KEY);
  if (!instructorsJson || JSON.parse(instructorsJson).length === 0) {
    localStorage.setItem(INSTRUCTORS_KEY, JSON.stringify(mockInstructors));
    return mockInstructors;
  }
  return JSON.parse(instructorsJson);
};

export const getInstructor = async (id: string): Promise<Instructor | null> => {
    await delay(200);
    const instructors = await getInstructors();
    return instructors.find(i => i.id === id) || null;
}

export const addInstructor = async (instructorData: Omit<Instructor, 'id'>) => {
    await delay(300);
    const instructors = await getInstructors();
    const newInstructor: Instructor = {
        id: `instructor_${Date.now()}`,
        ...instructorData,
    };
    instructors.push(newInstructor);
    localStorage.setItem(INSTRUCTORS_KEY, JSON.stringify(instructors));
    return { id: newInstructor.id };
};

export const updateInstructor = async (id: string, instructorData: Partial<Omit<Instructor, 'id'>>) => {
    await delay(300);
    let instructors = await getInstructors();
    instructors = instructors.map(i => i.id === id ? { ...i, ...instructorData } : i);
    localStorage.setItem(INSTRUCTORS_KEY, JSON.stringify(instructors));
};

export const deleteInstructor = async (id: string) => {
    await delay(300);
    let instructors = await getInstructors();
    instructors = instructors.filter(i => i.id !== id);
    localStorage.setItem(INSTRUCTORS_KEY, JSON.stringify(instructors));
};


// --- Terms Acceptance Functions ---

export const saveTermsAcceptance = async (data: Omit<TermsAcceptance, 'id' | 'acceptedAt'>) => {
    await delay(300);
    if (typeof window === 'undefined') return;
    const termsJson = localStorage.getItem(TERMS_KEY);
    const terms: TermsAcceptance[] = termsJson ? JSON.parse(termsJson) : [];
    
    const newAcceptance: TermsAcceptance = {
        id: `term_${Date.now()}`,
        ...data,
        acceptedAt: new Date(),
    };

    terms.push(newAcceptance);
    localStorage.setItem(TERMS_KEY, JSON.stringify(terms));
    return newAcceptance.id;
};
