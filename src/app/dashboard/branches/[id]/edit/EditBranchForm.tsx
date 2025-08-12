
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { type Branch, type Instructor, type User } from '@/lib/firestoreService';

// This is a placeholder component.
// The form logic will be implemented in a future step.
export function EditBranchForm({
  user,
  initialBranch,
  instructors,
}: {
  user: User;
  initialBranch: Branch;
  instructors: Instructor[];
}) {
  if (user?.role !== 'admin') {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Acesso Negado</CardTitle>
          <CardDescription>
            Você não tem permissão para editar esta página.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Esta área é restrita a administradores.</p>
          <Button asChild className="mt-4">
            <Link href={`/dashboard?role=${user?.role || 'student'}`}>Voltar ao Painel</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Editar Filial: {initialBranch.name}</CardTitle>
        <CardDescription>
          Formulário de edição da filial. A lógica será implementada em breve.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>Formulário de edição para {initialBranch.name}...</p>
      </CardContent>
    </Card>
  );
}
