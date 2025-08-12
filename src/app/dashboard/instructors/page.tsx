
import { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import { PlusCircle } from 'lucide-react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getInstructors, type User } from '@/lib/firestoreService';
import { mockUsers } from '@/lib/mock-data';
<<<<<<< HEAD
import { Skeleton } from '@/components/ui/skeleton'; 
import { InstructorActions } from './InstructorActionsClient';
=======
import { InstructorTableRowClient } from './InstructorTableRowClient';
import { Skeleton } from '@/components/ui/skeleton';
>>>>>>> ccd82443213cfc940a531324e7cba62ab366217f

const InstructorsTableSkeleton = () => (
    <Card>
        <CardHeader>
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-4 w-3/4" />
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead><Skeleton className="h-5 w-24" /></TableHead>
                        <TableHead><Skeleton className="h-5 w-32" /></TableHead>
                        <TableHead><Skeleton className="h-5 w-24" /></TableHead>
                        <TableHead><Skeleton className="h-5 w-24" /></TableHead>
                        <TableHead className="text-right"><Skeleton className="h-5 w-16" /></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {Array.from({ length: 3 }).map((_, i) => (
                        <TableRow key={i}>
                            <TableCell><div className="flex items-center gap-2"><Skeleton className="h-9 w-9 rounded-full" /><Skeleton className="h-4 w-32" /></div></TableCell>
                            <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                            <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                            <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                            <TableCell className="text-right"><Skeleton className="h-8 w-8" /></TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </CardContent>
    </Card>
);

async function InstructorsList({ user }: { user: User | null }) {
    const instructors = await getInstructors();

<<<<<<< HEAD
  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Professor</TableHead>
              <TableHead>Filiais</TableHead>
              <TableHead>Graduação</TableHead>
               <TableHead>Telefone</TableHead>
              <TableHead>
                <span className="sr-only">Ações</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {instructors.length > 0 ? (
              instructors.map((instructor) => (
                 <TableRow key={instructor.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarImage src={instructor.avatar} alt={instructor.name} />
                          <AvatarFallback>{instructor.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{instructor.name}</p>
                          <p className="text-xs text-muted-foreground">{instructor.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{instructor.affiliations?.join(', ') || 'N/A'}</TableCell>
                    <TableCell>
                      <BeltBadge belt={instructor.belt} stripes={instructor.stripes} />
                    </TableCell>
                    <TableCell>{instructor.phone}</TableCell>
                    <TableCell className="text-right">
                       <InstructorActions instructor={instructor} user={user} />
                    </TableCell>
                  </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  Nenhum professor cadastrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
=======
    return (
        <Card>
            <CardHeader>
                <CardTitle>Professores</CardTitle>
                <CardDescription>
                    Lista de todos os professores e faixas pretas da equipe.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Professor</TableHead>
                            <TableHead>Filiais</TableHead>
                            <TableHead>Graduação</TableHead>
                            <TableHead>Telefone</TableHead>
                            <TableHead>
                                <span className="sr-only">Ações</span>
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {instructors.length > 0 ? (
                            instructors.map((instructor) => (
                                <InstructorTableRowClient 
                                    key={instructor.id} 
                                    instructor={instructor} 
                                    userRole={user?.role || 'student'} 
                                />
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center">
                                    Nenhum professor encontrado.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
>>>>>>> ccd82443213cfc940a531324e7cba62ab366217f
}

export const metadata: Metadata = {
    title: 'Kings BJJ | Professores',
    description: 'Lista de professores da equipe Kings BJJ.',
};

export default async function InstructorsPage({
    searchParams,
}: {
    searchParams: { [key: string]: string | string[] | undefined };
}) {
    const role = searchParams?.role as User['role'] | undefined;
    const user = role ? mockUsers[role] : null;

    return (
        <div className="grid gap-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Professores</h1>
                    <p className="text-muted-foreground">
                        Gerencie os professores e faixas pretas da sua equipe.
                    </p>
                </div>
                {user?.role === 'admin' && (
                    <Button asChild>
                        <Link href={`/dashboard/instructors/new?role=${user.role}`}>
                            <PlusCircle className="mr-2" />
                            Adicionar Professor
                        </Link>
                    </Button>
                )}
            </div>
            <Suspense fallback={<InstructorsTableSkeleton />}>
                <InstructorsList user={user} />
            </Suspense>
        </div>
    );
}
