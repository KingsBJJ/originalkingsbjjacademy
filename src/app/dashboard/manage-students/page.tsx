// src/app/dashboard/manage-students/page.tsx
import { Suspense } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button'; // Ajuste o caminho conforme sua estrutura
import { PlusCircle } from 'lucide-react'; // Ajuste o caminho conforme sua estrutura
import StudentsList from '@/components/StudentsList'; // Ajuste o caminho
import InstructorsTableSkeleton from '@/components/InstructorsTableSkeleton'; // Ajuste o caminho
import { mockUsers } from '@/lib/mockUsers'; // Ajuste o caminho

interface Props {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ManageStudentsPage({ searchParams }: Props) {
  const resolvedSearchParams = await searchParams; // Resolver a Promise
  const roleParam = resolvedSearchParams?.role;
  const role = Array.isArray(roleParam) ? roleParam[0] : roleParam;
  const user = role ? mockUsers[role as keyof typeof mockUsers] : null;

  return (
    <div className="grid gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Alunos</h1>
          <p className="text-muted-foreground">Gerencie os alunos da sua equipe.</p>
        </div>
        {user?.role === 'admin' && (
          <Button asChild>
            <Link href={`/dashboard/manage-students/new?role=${user.role}`}>
              <PlusCircle className="mr-2" />
              Cadastrar Aluno
            </Link>
          </Button>
        )}
      </div>

      <Suspense fallback={<InstructorsTableSkeleton />}>
        <StudentsList user={user} />
      </Suspense>
    </div>
  );
}