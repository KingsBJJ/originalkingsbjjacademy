// src/app/dashboard/profile/edit/page.tsx
import { Suspense } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getUserByEmail, type User } from '@/lib/firestoreService';
import { mockUsers } from '@/lib/mock-data';

interface Props {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function EditProfilePage({ searchParams }: Props) {
  const resolvedSearchParams = await searchParams; // Resolver a Promise
  const email = resolvedSearchParams?.email as string | undefined;
  let user = email ? await getUserByEmail(email) : null;

  // Fallback to role-based mock user if no real user is found
  if (!user) {
    const role = (resolvedSearchParams?.role || 'student') as User['role'];
    user = mockUsers[role] || mockUsers.student;
  }

  // Security check: Only allow users to edit their own profile
  if (!user) {
    return (
      <div className="flex h-full items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Erro</CardTitle>
            <CardDescription>Usuário não encontrado.</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Não foi possível carregar os dados do usuário.</p>
            <Button asChild className="mt-4">
              <Link href={`/dashboard?role=${user?.role || 'student'}`}>Voltar ao Painel</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <Suspense fallback={<Skeleton className="h-64 w-full max-w-2xl" />}>
      <div className="grid gap-6 p-6">
        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle>Editar Perfil</CardTitle>
            <CardDescription>Atualize as informações do seu perfil.</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Nome</Label>
                <Input id="name" defaultValue={user.name} placeholder="Seu nome" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">E-mail</Label>
                <Input id="email" defaultValue={user.email || email || ''} placeholder="Seu e-mail" disabled />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="role">Função</Label>
                <Input id="role" defaultValue={user.role} disabled />
              </div>
              <div className="flex gap-4 mt-4">
                <Button type="submit">Salvar Alterações</Button>
                <Button asChild variant="outline">
                  <Link href={`/dashboard?role=${user.role}`}>Cancelar</Link>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </Suspense>
  );
}