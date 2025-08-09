'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { User } from '@/lib/firestoreService';

interface Props {
  student: {
    id: string;
    name: string;
    email: string;
    // adicione mais campos se precisar
  };
  user: User | null;
}

export function StudentActions({ student, user }: Props) {
  if (!user) return null;

  const canEdit = user.role === 'admin' || user.role === 'teacher';
  const canDelete = user.role === 'admin';

  const handleEdit = () => {
    // aqui você pode redirecionar para edição, ou abrir modal, etc
    alert(`Editar aluno: ${student.name}`);
  };

  const handleDelete = () => {
    if (confirm(`Deseja realmente excluir o aluno ${student.name}?`)) {
      // Coloque aqui a lógica para deletar o aluno
      alert(`Aluno ${student.name} excluído.`);
    }
  };

  return (
    <div className="flex gap-2 justify-end">
      {canEdit && (
        <Button size="sm" onClick={handleEdit}>
          Editar
        </Button>
      )}
      {canDelete && (
        <Button size="sm" variant="destructive" onClick={handleDelete}>
          Excluir
        </Button>
      )}
    </div>
  );
}
