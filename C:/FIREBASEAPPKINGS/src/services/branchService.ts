import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, query, orderBy, doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import type { Branch, ClassScheduleItem } from '@/lib/mock-data';

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
    const dataToSave = {
        ...branchData,
        instructor2: branchData.instructor2 || '',
        instructor3: branchData.instructor3 || '',
        instructor4: branchData.instructor4 || '',
        schedule: branchData.schedule || [],
    };
    const docRef = await addDoc(branchesCollection, dataToSave);
    return { id: docRef.id, ...dataToSave };
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
    const q = query(branchesCollection, orderBy("name"));
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

/**
 * Busca uma filial específica pelo seu ID.
 * @param id O ID da filial.
 * @returns Os dados da filial ou null se não for encontrada.
 */
export const getBranch = async (id: string): Promise<Branch | null> => {
    const docRef = doc(db, 'branches', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Branch;
    }
    return null;
}

/**
 * Atualiza os dados de uma filial.
 * @param id O ID da filial a ser atualizada.
 * @param branchData Os novos dados da filial.
 */
export const updateBranch = async (id: string, branchData: Partial<Omit<Branch, 'id'>>) => {
    const docRef = doc(db, 'branches', id);
    return await updateDoc(docRef, branchData);
}

/**
 * Exclui uma filial.
 * @param id O ID da filial a ser excluída.
 */
export const deleteBranch = async (id: string) => {
    const docRef = doc(db, 'branches', id);
    return await deleteDoc(docRef);
}
