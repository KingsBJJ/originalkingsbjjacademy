<<<<<<< HEAD
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
=======

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Clock } from "lucide-react";
import { getBranches, type ClassScheduleItem } from "@/lib/firestoreService";
import { User, mockUsers } from "@/lib/mock-data";

type ClassWithBranch = ClassScheduleItem & { branchName: string };

const ClassListRenderer = ({ classes, userRole }: { classes: ClassWithBranch[], userRole: User['role'] }) => {
    if (classes.length === 0) {
      return (
          <CardContent>
              <p className="text-sm text-center text-muted-foreground pt-6">Nenhuma aula disponível para sua filial.</p>
          </CardContent>
      );
    }
    return (
        <CardContent className="space-y-4">
        {classes.map((item, index) => (
            <div
            key={index}
            className="flex items-center justify-between rounded-lg border p-4"
            >
            <div>
                <p className="font-semibold">{item.name}</p>
                <p className="text-sm text-muted-foreground">
                 <span className="text-primary font-medium">{item.instructor}</span> {userRole === 'admin' && `(${item.branchName})`}
                </p>
            </div>
            <div className="flex items-center gap-4 text-right">
                <div className="flex flex-col items-end gap-1 text-sm">
                    <span>{item.day}</span>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-primary" />
                      <span>{item.time}</span>
                    </div>
                </div>
            </div>
            </div>
        ))}
        </CardContent>
    );
};

export default async function SchedulePage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const role = (searchParams?.role || 'student') as User['role'];
  
  // Get user details from URL or mock data to determine affiliation
  const affiliationFromParams = searchParams?.affiliation as string;
  
  // Use a mock user to get affiliations for server-side rendering logic.
  // The actual, full user object is handled on the client.
  const userFromMock = mockUsers[role] || mockUsers.student;
  const userAffiliations = affiliationFromParams 
      ? [affiliationFromParams] 
      : userFromMock.affiliations;

  const branches = await getBranches();

  // Flatten all class schedules from all branches into a single array
  const allClasses = branches.flatMap(branch => 
      (branch.schedule ?? []).map(item => ({
          ...item,
          branchName: branch.name,
      }))
  );

  // Filter classes based on user role and affiliation
  const displayedClasses = role === "admin"
      ? allClasses // Admin sees all classes
      : allClasses.filter((c) => userAffiliations.includes(c.branchName)); // Students/professors see their branch's classes

  const adultClasses = displayedClasses.filter(c => c.category === "Adults");
  const kidsClasses = displayedClasses.filter(c => c.category === "Kids");
>>>>>>> b481c2bc812841ccf4c793496605892116238ae6

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
<<<<<<< HEAD
    </Suspense>
=======

      <Card>
        <CardHeader>
          <CardTitle>Aulas para Adultos</CardTitle>
          <CardDescription>
            Horário de todas as aulas de Adulto com e sem kimono.
          </CardDescription>
        </CardHeader>
        <ClassListRenderer classes={adultClasses} userRole={role} />
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Aulas para Crianças</CardTitle>
          <CardDescription>
            Aulas de jiu-jitsu divertidas e seguras para os pequenos.
          </CardDescription>
        </CardHeader>
        <ClassListRenderer classes={kidsClasses} userRole={role} />
      </Card>
    </div>
>>>>>>> b481c2bc812841ccf4c793496605892116238ae6
  );
}