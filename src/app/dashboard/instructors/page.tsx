
import Link from 'next/link';
import { Suspense } from 'react';
import { PlusCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { getInstructors, type User, type Instructor } from '@/lib/firestoreService';
import { mockUsers } from '@/lib/mock-data';
import InstructorTableRowClient from './InstructorTableRowClient';
import { Skeleton } from '@/components/ui/skeleton';

const BeltBadge = ({ belt, stripes }: { belt: string; stripes?: number }) => {
  const isBlackBelt = belt === 'Preta' || belt === 'Coral';
  return (
    <Badge variant="secondary">
      {belt}
      {isBlackBelt && stripes && stripes > 0 ? ` ${stripes}º Grau` : ''}
    </Badge>
  );
};

const InstructorsTableSkeleton = () => (
  <Card>
    <CardContent className="p-0">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Professor</TableHead>
            <TableHead>Filiais</TableHead>
            <TableHead>Graduação</TableHead>
            <TableHead>
              <span className="sr-only">Ações</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 5 }).map((_, i) => (
            <TableRow key={i}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-40" />
                  </div>
                </div>
              </TableCell>
              <TableCell><Skeleton className="h-4 w-24" /></TableCell>
              <TableCell><Skeleton className="h-5 w-20 rounded-full" /></TableCell>
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
                <InstructorTableRowClient key={instructor.id} instructor={instructor} userRole={user?.role || 'student'} />
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
}

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
            Gerencie os instrutores da sua equipe.
          </p>
        </div>
        {user?.role === 'admin' && (
          <Button asChild>
            <Link href={`/dashboard/instructors/new?role=${user.role}`}>
              <PlusCircle className="mr-2" />
              Cadastrar Professor
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
