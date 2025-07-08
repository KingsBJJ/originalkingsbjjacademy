import Link from "next/link";
import { Suspense } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { beltColors, mockUsers } from "@/lib/mock-data";
import { getInstructors } from "@/lib/firestoreService";
import { InstructorActions } from './InstructorActionsClient';

const InstructorRowSkeleton = () => (
  <TableRow>
    <TableCell>
      <div className="flex items-center gap-3">
        <Skeleton className="h-9 w-9 rounded-full" />
        <div>
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-40 mt-1" />
        </div>
      </div>
    </TableCell>
    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
    <TableCell><Skeleton className="h-5 w-20 rounded-full" /></TableCell>
    <TableCell><Skeleton className="h-4 w-28" /></TableCell>
    <TableCell className="text-right"><Skeleton className="h-8 w-8" /></TableCell>
  </TableRow>
);

async function InstructorsList({ role }: { role: 'admin' | 'professor' | 'student' }) {
    const instructors = await getInstructors();
    const user = role ? mockUsers[role] : null;

    return (
        <Table>
            <TableHeader>
            <TableRow>
                <TableHead>Professor</TableHead>
                <TableHead>Filiais</TableHead>
                <TableHead>Graduação</TableHead>
                <TableHead>Contato</TableHead>
                <TableHead className="text-right">Ações</TableHead>
            </TableRow>
            </TableHeader>
            <TableBody>
            {instructors.length > 0 ? (
                instructors.map((instructor) => {
                const beltKey = instructor.belt as keyof typeof beltColors;
                const beltStyle = beltColors[beltKey] || beltColors.Branca;
                return (
                    <TableRow key={instructor.id}>
                    <TableCell>
                        <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                            <AvatarImage
                            src={instructor.avatar}
                            alt={instructor.name}
                            />
                            <AvatarFallback>
                            {instructor.name.charAt(0)}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="font-medium">{instructor.name}</p>
                            <p className="text-xs text-muted-foreground">{instructor.email}</p>
                        </div>
                        </div>
                    </TableCell>
                    <TableCell>{instructor.affiliations?.join(', ') || 'Nenhuma'}</TableCell>
                    <TableCell>
                        <Badge
                        className={cn(
                            "text-xs font-semibold",
                            beltStyle.bg,
                            beltStyle.text
                        )}
                        >
                        {instructor.belt}
                        {(instructor.belt === 'Preta' || instructor.belt === 'Coral') && instructor.stripes && instructor.stripes > 0 && ` - ${instructor.stripes}º Grau`}
                        </Badge>
                    </TableCell>
                    <TableCell>{instructor.phone}</TableCell>
                    <TableCell className="text-right">
                       <InstructorActions instructor={instructor} user={user} />
                    </TableCell>
                    </TableRow>
                );
                })
            ) : (
                <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                        Nenhum professor cadastrado ainda.
                    </TableCell>
                </TableRow>
            )}
            </TableBody>
        </Table>
    );
}

export default function InstructorsPage({ searchParams }: { searchParams: { role?: 'admin' | 'professor' | 'student' } }) {
  const role = searchParams.role || 'student';
  const canAdd = role === 'admin' || role === 'professor';

  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Nossos Professores</h1>
        <p className="text-muted-foreground">
          Aprenda com os melhores do ramo.
        </p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Lista de Professores</CardTitle>
            <CardDescription>
              Gerencie os professores de todas as filiais.
            </CardDescription>
          </div>
          {canAdd && (
            <Button asChild>
                <Link href={`/dashboard/instructors/new?role=${role}`}>
                    <PlusCircle />
                    <span>Adicionar Professor</span>
                </Link>
            </Button>
        )}
        </CardHeader>
        <CardContent>
            <Suspense fallback={
                <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead>Professor</TableHead>
                        <TableHead>Filiais</TableHead>
                        <TableHead>Graduação</TableHead>
                        <TableHead>Contato</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {Array.from({ length: 4 }).map((_, i) => <InstructorRowSkeleton key={i} />)}
                    </TableBody>
                </Table>
            }>
                <InstructorsList role={role} />
            </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}
