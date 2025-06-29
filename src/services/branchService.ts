import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, query } from 'firebase/firestore';
import type { Branch } from '@/lib/mock-data';

// Define um tipo para os dados da filial ao criar, omitindo o 'id'
export type BranchData = Omit<Branch, 'id'>;

const branchesCollection = collection(db, 'branches');

/**
 * Adiciona uma nova filial ao Firestore.
 * @param branchData - Os dados da filial a serem adicionados.
 * @returns O documento da filial recém-criada com seu ID.
 */
export async function addBranch(branchData: BranchData) {
  try {
    const docRef = await addDoc(branchesCollection, branchData);
    return { id: docRef.id, ...branchData };
  } catch (error) {
    console.error("Erro ao adicionar filial: ", error);
    throw new Error("Não foi possível adicionar a filial.");
  }
}

/**
 * Busca todas as filiais do Firestore.
 * @returns Uma lista de todas as filiais.
 */
export async function getBranches(): Promise<Branch[]> {
  try {
    const q = query(branchesCollection);
    const querySnapshot = await getDocs(q);
    const branches: Branch[] = [];
    querySnapshot.forEach((doc) => {
      branches.push({ id: doc.id, ...doc.data() } as Branch);
    });
    return branches;
  } catch (error) {
    console.error("Erro ao buscar filiais: ", error);
    throw new Error("Não foi possível buscar as filiais.");
  }
}
