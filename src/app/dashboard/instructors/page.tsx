
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
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { getInstructors, getAppUser, type Instructor, type User } from '@/lib/firestoreService';
import { InstructorActions } from './InstructorActionsClient';
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
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead>Professor</TableHead>
        <TableHead>Filiais</TableHead>
        <TableHead>Graduação</TableHead>
        <TableHead className="text-right">Ações</TableHead>
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
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={instructor.avatar} alt={instructor.name} />
                        <AvatarFallback>{instructor.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{instructor.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {instructor.email}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {instructor.affiliations && instructor.affiliations.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {instructor.affiliations.map((affiliation) => (
                          <Badge key={affiliation} variant="outline">
                            {affiliation}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <BeltBadge belt={instructor.belt} stripes={instructor.stripes} />
                  </TableCell>
                  <TableCell className="text-right">
                    <InstructorActions instructor={instructor} user={user} />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
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
  const role = searchParams.role as 'student' | 'professor' | 'admin' | undefined;
  const user = role ? await getAppUser(role) : null;

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
