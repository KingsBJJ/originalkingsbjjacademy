<<<<<<< HEAD
// src/app/dashboard/profile/edit/page.tsx
import { Suspense } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { getUserByEmail, type User } from '@/lib/firestoreService';
import { mockUsers } from '@/lib/mock-data';

interface Props {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}
=======

"use client";

import { useContext } from "react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { mockAttendanceHistory, beltColors } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { Medal, Trophy, BookOpen, Sparkles } from "lucide-react";
import { UserContext } from "../client-layout";
>>>>>>> b481c2bc812841ccf4c793496605892116238ae6

export default async function EditProfilePage({ searchParams }: Props) {
  const resolvedSearchParams = await searchParams; // Resolver a Promise
  const email = resolvedSearchParams?.email as string | undefined;
  let user = email ? await getUserByEmail(email) : null;

  // Fallback to role-based mock user if no real user is found
  if (!user) {
    const role = (resolvedSearchParams?.role || 'student') as User['role'];
    user = mockUsers[role] || mockUsers.student;
  }

<<<<<<< HEAD
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
=======
  const roleNames = {
    student: 'Aluno',
    professor: 'Professor',
    admin: 'Admin'
  };

  const beltStyle = beltColors[user.belt as keyof typeof beltColors] || beltColors.Branca;

  const getHref = (href: string) => {
    if (!user) return href;
    const params = new URLSearchParams();
    if (user.role) params.set('role', user.role);
    if (user.email) params.set('email', user.email);
    return `${href}?${params.toString()}`;
  };

  return (
    <div className="grid gap-6">
      <div className="flex flex-col items-start gap-4 md:flex-row">
        <Avatar className="h-24 w-24 border-2 border-primary">
          <AvatarImage src={user.avatar} alt={user.name} />
          <AvatarFallback className="text-3xl">
            {user.name.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">{user.name}</h1>
          <p className="text-muted-foreground">{user.email}</p>
          <p className="text-sm text-muted-foreground">
            {user.affiliations && user.affiliations.join(', ')}
          </p>
          <div className="mt-2 flex items-center gap-2">
            <Badge
              className={cn(
                "px-4 py-1 text-sm font-semibold shadow-md",
                beltStyle.bg,
                beltStyle.text
              )}
            >
              Faixa {user.belt}
              {(user.belt === 'Preta' || user.belt === 'Coral') && user.stripes > 0 && ` - ${user.stripes}º Grau`}
            </Badge>
            {(user.belt !== 'Preta' && user.belt !== 'Coral') && (
              <div className="flex gap-1">
                {Array.from({ length: user.stripes }).map((_, i) => (
                  <div key={i} className="h-4 w-1 bg-primary" />
                ))}
              </div>
            )}
          </div>
        </div>
        <Button asChild>
          <Link href={getHref('/dashboard/profile/edit')}>Editar Perfil</Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
>>>>>>> b481c2bc812841ccf4c793496605892116238ae6
          <CardHeader>
            <CardTitle>Editar Perfil</CardTitle>
            <CardDescription>Atualize as informações do seu perfil.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div>
                <label className="block text-sm font-medium">Nome</label>
                <p className="mt-1 text-sm">{user.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium">E-mail</label>
                <p className="mt-1 text-sm">{user.email || email || 'N/A'}</p>
              </div>
<<<<<<< HEAD
              <div>
                <label className="block text-sm font-medium">Função</label>
                <p className="mt-1 text-sm">{user.role}</p>
              </div>
              <Button asChild className="mt-4">
                <Link href={`/dashboard?role=${user.role}`}>Voltar ao Painel</Link>
              </Button>
=======
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Informações Pessoais</CardTitle>
            <CardDescription>
              Seus detalhes pessoais.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
                <span className="font-medium text-muted-foreground">Função:</span>
                <span className="capitalize">{roleNames[user.role]}</span>
            </div>
             <div className="flex justify-between">
                <span className="font-medium text-muted-foreground">Telefone:</span>
                <span>{user.phone || 'Não informado'}</span>
            </div>
             <div className="flex justify-between">
                <span className="font-medium text-muted-foreground">Membro Desde:</span>
                <span>Jan 2022</span>
            </div>
             <div className="flex justify-between">
                <span className="font-medium text-muted-foreground">Contato de Emergência:</span>
                <span>(55) 5555-1111</span>
>>>>>>> b481c2bc812841ccf4c793496605892116238ae6
            </div>
          </CardContent>
        </Card>
      </div>
    </Suspense>
  );
}