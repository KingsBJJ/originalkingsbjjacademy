import { db } from './firebase';
import {
  collection,
  getDocs,
  doc,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  where,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';

// Tipo para itens do horário de aulas
export type ClassScheduleItem = {
  name: string;
  day: string;
  time: string;
  instructor: string;
  category: 'Adults' | 'Kids';
};

// Tipo para filial
export type Branch = {
  id: string;
  name: string;
  address: string;
  phone: string;
  responsible: string;
  additionalInstructors?: string[];
  schedule?: ClassScheduleItem[];
};

// Tipo para aceitação de termos
export type TermsAcceptance = {
  id: string;
  parentName: string;
  childName: string;
  branchId: string;
  branchName: string;
  acceptedAt: Timestamp; // Tipagem específica para Firestore Timestamp
};

// Referências às coleções do Firestore
const branchesCollection = collection(db, 'branches');
const termsAcceptancesCollection = collection(db, 'termsAcceptances');

/**
 * Obtém todas as filiais ordenadas por nome.
 * @returns Lista de filiais.
 */
export const getBranches = async (): Promise<Branch[]> => {
  try {
    const q = query(branchesCollection, orderBy('name'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Branch));
  } catch (error) {
    console.error('Erro ao obter filiais:', error);
    throw new Error('Não foi possível obter as filiais.');
  }
};

/**
 * Obtém uma filial específica pelo ID.
 * @param id ID da filial.
 * @returns Filial correspondente ou null se não encontrada.
 */
export const getBranch = async (id: string): Promise<Branch | null> => {
  try {
    const docRef = doc(db, 'branches', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Branch;
    }
    return null;
  } catch (error) {
    console.error('Erro ao obter filial:', error);
    throw new Error('Não foi possível obter a filial.');
  }
};

/**
 * Adiciona uma nova filial.
 * @param branchData Dados da filial (sem ID).
 * @returns Referência do documento criado.
 */
export const addBranch = async (branchData: Omit<Branch, 'id'>) => {
  try {
    return await addDoc(branchesCollection, branchData);
  } catch (error) {
    console.error('Erro ao adicionar filial:', error);
    throw new Error('Não foi possível adicionar a filial.');
  }
};

/**
 * Atualiza uma filial existente.
 * @param id ID da filial.
 * @param branchData Dados a serem atualizados.
 */
export const updateBranch = async (id: string, branchData: Partial<Omit<Branch, 'id'>>) => {
  try {
    const docRef = doc(db, 'branches', id);
    await updateDoc(docRef, branchData);
  } catch (error) {
    console.error('Erro ao atualizar filial:', error);
    throw new Error('Não foi possível atualizar a filial.');
  }
};

/**
 * Exclui uma filial.
 * @param id ID da filial.
 */
export const deleteBranch = async (id: string) => {
  try {
    const docRef = doc(db, 'branches', id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Erro ao excluir filial:', error);
    throw new Error('Não foi possível excluir a filial.');
  }
};

/**
 * Salva a aceitação de termos.
 * @param data Dados do termo de aceitação.
 * @returns ID do documento criado.
 */
export const saveTermsAcceptance = async (data: {
  parentName: string;
  childName: string;
  branchId: string;
  branchName: string;
}) => {
  try {
    const docRef = await addDoc(termsAcceptancesCollection, {
      ...data,
      acceptedAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Erro ao salvar aceitação de termos:', error);
    throw new Error('Não foi possível salvar o termo de responsabilidade.');
  }
};
