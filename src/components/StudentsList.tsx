// src/components/StudentsList.tsx
import { type User } from '@/lib/firestoreService'; // Ajuste o caminho

interface StudentsListProps {
  user: User | null;
}

export default function StudentsList({ user }: StudentsListProps) {
  return (
    <div>
      <h2>Lista de Alunos</h2>
      <p>Usuário: {user?.role || 'Nenhum'}</p>
      {/* Adicione a lógica real para listar alunos */}
    </div>
  );
}