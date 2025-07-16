// src/app/dashboard/schedule/page.tsx
import { Suspense } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { getUserByEmail, type User } from '@/lib/firestoreService';
import { mockUsers } from '@/lib/mock-data';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface Props {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function SchedulePage({ searchParams }: Props) {
  const resolvedSearchParams = await searchParams; // Resolver a Promise
  const email = resolvedSearchParams?.email as string | undefined;
  let user = email ? await getUserByEmail(email) : null;

  // Fallback to role-based mock user if no real user is found
  if (!user) {
    const role = (resolvedSearchParams?.role || 'student') as User['role'];
    user = mockUsers[role] || mockUsers.student;
  }

  // Security check: Only allow admins or professors to access this page
  if (user.role !== 'professor' && user.role !== 'admin') {
    return (
      <div className="flex h-full items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Acesso Negado</CardTitle>
            <CardDescription>
              Você não tem permissão para visualizar esta página.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>Esta área é restrita a professores e administradores.</p>
            <Button asChild className="mt-4">
              <Link href={`/dashboard?role=${user?.role || 'student'}`}>Voltar ao Painel</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Mock schedule data (replace with actual data from Firestore if available)
  const schedule = [
    { id: '1', day: 'Segunda', time: '18:00', class: 'Jiu-Jitsu Adultos', instructor: 'Professor A' },
    { id: '2', day: 'Quarta', time: '19:00', class: 'Jiu-Jitsu Kids', instructor: 'Professor B' },
    { id: '3', day: 'Sexta', time: '20:00', class: 'Jiu-Jitsu Avançado', instructor: 'Professor A' },
  ];

  return (
    <Suspense fallback={<Skeleton className="h-64 w-full max-w-2xl" />}>
      <div className="grid gap-6 p-6">
        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle>Agenda de Aulas</CardTitle>
            <CardDescription>Visualize o cronograma de aulas disponíveis.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Dia</TableHead>
                  <TableHead>Horário</TableHead>
                  <TableHead>Aula</TableHead>
                  <TableHead>Instrutor</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {schedule.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.day}</TableCell>
                    <TableCell>{item.time}</TableCell>
                    <TableCell>{item.class}</TableCell>
                    <TableCell>{item.instructor}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Button asChild className="mt-4">
              <Link href={`/dashboard?role=${user.role}`}>Voltar ao Painel</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </Suspense>
  );
}