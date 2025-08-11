"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Placeholder content for the form.
// In a real scenario, this would be a complete form component.
export default function EditBranchForm({ user, initialBranch, instructors }: any) {
  if (user?.role !== 'admin') {
    return (
      <div className="flex items-center justify-center h-full">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Acesso Negado</CardTitle>
            <CardDescription>
              Você não tem permissão para acessar esta página.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>Esta área é restrita a administradores.</p>
            <Button asChild className="mt-4">
              <Link href={`/dashboard?role=${user?.role || 'student'}`}>Voltar ao Painel</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Editar Filial: {initialBranch?.name}</CardTitle>
        <CardDescription>Formulário para editar os detalhes da filial.</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Formulário de edição em construção.</p>
        <p>Instrutores disponíveis: {instructors?.length || 0}</p>
      </CardContent>
    </Card>
  );
}
