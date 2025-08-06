<<<<<<< HEAD
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
=======

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { getUserByEmail, getBranches, getInstructors, type User, type Branch, type Instructor } from '@/lib/firestoreService';
import { EditProfileForm } from './EditProfileForm';
import { KingsBjjLogo } from '@/components/kings-bjj-logo';

export default async function EditProfilePage({
  searchParams,
}: {
  searchParams: { [key:string]: string | string[] | undefined };
}) {
  const email = searchParams?.email as string;
  
  const [user, branches, instructors] = await Promise.all([
    getUserByEmail(email),
    getBranches(),
    getInstructors()
  ]);

  if (!user) {
    return (
        <Card className="w-full max-w-md mx-auto mt-10">
            <CardHeader className="text-center">
                <KingsBjjLogo className="h-16 w-16 mx-auto mb-4" />
                <CardTitle>Usuário não encontrado</CardTitle>
            </CardHeader>
            <CardContent className="pt-0 text-center">
                <p className="text-muted-foreground">O perfil que você está tentando editar não existe ou não pôde ser carregado.</p>
            </CardContent>
        </Card>
>>>>>>> b481c2bc812841ccf4c793496605892116238ae6
    );
  }

  return (
<<<<<<< HEAD
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
=======
    <div className="grid gap-6">
       <div>
        <h1 className="text-3xl font-bold tracking-tight">Editar Perfil</h1>
        <p className="text-muted-foreground">Atualize suas informações pessoais.</p>
      </div>
      <EditProfileForm 
        initialUser={user}
        branches={branches}
        allInstructors={instructors}
      />
    </div>
  );
}
>>>>>>> b481c2bc812841ccf4c793496605892116238ae6
