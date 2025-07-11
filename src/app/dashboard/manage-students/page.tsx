
import Link from 'next/link';
import { Suspense } from 'react';
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
import { beltColors, beltColorsKids, mockUsers, User } from '@/lib/mock-data';
import { getStudents, type Student } from '@/lib/firestoreService';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from '@/components/ui/skeleton';

const allBeltColors = { ...beltColors, ...beltColorsKids };

const StudentTable = ({ students, userRole }: { students: Student[], userRole: User['role'] }) => {
    if (students.length === 0) {
        return (
            <div className="flex h-48 items-center justify-center text-muted-foreground">
                Nenhum aluno nesta categoria.
            </div>
        )
    }

    return (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Aluno</TableHead>
              <TableHead>Filial</TableHead>
              <TableHead>Graduação</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.map((student) => {
              const beltStyle = allBeltColors[student.belt as keyof typeof allBeltColors] || allBeltColors.Branca;
              return (
                <TableRow key={student.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={student.avatar} alt={student.name} />
                        <AvatarFallback>{student.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{student.name}</p>
                        <p className="text-xs text-muted-foreground">{student.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{student.affiliations[0]}</TableCell>
                  <TableCell>
                     <Badge
                      className={cn("text-xs font-semibold", beltStyle.bg, beltStyle.text)}
                      >
                      {student.belt}
                      {(student.belt === 'Preta' || student.belt === 'Coral') && student.stripes > 0 && ` - ${student.stripes}º Grau`}
                      </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                     <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Ações</DropdownMenuLabel>
                        <DropdownMenuItem>Ver Perfil</DropdownMenuItem>
                        <DropdownMenuItem>Editar</DropdownMenuItem>
                         <DropdownMenuItem className="text-red-500">Remover</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
    );
}

const StudentsListSkeleton = () => (
    <Card>
        <CardHeader>
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-4 w-3/4" />
        </CardHeader>
        <CardContent>
            <Skeleton className="h-10 w-full mb-4" />
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead><Skeleton className="h-5 w-24" /></TableHead>
                        <TableHead><Skeleton className="h-5 w-24" /></TableHead>
                        <TableHead><Skeleton className="h-5 w-24" /></TableHead>
                        <TableHead className="text-right"><Skeleton className="h-5 w-16" /></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {Array.from({ length: 5 }).map((_, i) => (
                        <TableRow key={i}>
                            <TableCell><div className="flex items-center gap-2"><Skeleton className="h-9 w-9 rounded-full" /><Skeleton className="h-4 w-32" /></div></TableCell>
                            <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                            <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                            <TableCell className="text-right"><Skeleton className="h-8 w-8" /></TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </CardContent>
    </Card>
);


async function StudentList({ user }: { user: User }) {
  const allStudents = await getStudents();

  // Filter students based on user role
  const filteredStudents = user.role === 'admin'
    ? allStudents // Admin sees all students
    : allStudents.filter(student => student.mainInstructor === user.name); // Professor sees only their own students

  const adultStudents = filteredStudents.filter(s => s.category === 'Adult');
  const kidsStudents = filteredStudents.filter(s => s.category === 'Kids');

  const professorAffiliationText = `Visualize os alunos que se cadastraram com você.`;

  return (
    <div className="grid gap-6">
       <div>
        <h1 className="text-3xl font-bold tracking-tight">Alunos</h1>
        <p className="text-muted-foreground">
          {user.role === 'admin' 
            ? "Visualize e gerencie todos os alunos do sistema."
            : professorAffiliationText
          }
        </p>
      </div>
       <Card>
        <CardHeader>
            <CardTitle>Lista de Alunos</CardTitle>
            <CardDescription>
                {`Total de ${filteredStudents.length} alunos encontrados.`}
            </CardDescription>
        </CardHeader>
        <CardContent>
            <Tabs defaultValue="adults" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="adults">Adultos ({adultStudents.length})</TabsTrigger>
                    <TabsTrigger value="kids">Kids ({kidsStudents.length})</TabsTrigger>
                </TabsList>
                <TabsContent value="adults" className="mt-4">
                    <StudentTable students={adultStudents} userRole={user.role} />
                </TabsContent>
                <TabsContent value="kids" className="mt-4">
                    <StudentTable students={kidsStudents} userRole={user.role} />
                </TabsContent>
            </Tabs>
        </CardContent>
       </Card>
    </div>
  );
}

export default async function ManageStudentsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const role = (searchParams?.role || 'student') as User['role'];
  
  // Create a representative user object for data fetching and permission checks.
  // This uses mock data as a base and overrides with URL params for flexibility.
  const baseUser = mockUsers[role] || mockUsers.student;
  const user: User = {
      ...baseUser,
      role,
      email: (searchParams?.email as string) || baseUser.email,
      name: (searchParams?.name as string) || baseUser.name,
      // In a real scenario, affiliations would come from the authenticated user session.
      // Here, we simulate it based on professor's mock data.
      affiliations: role === 'professor' ? baseUser.affiliations : [], 
  };
  
  if (role === 'student') {
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
            <p>Esta área é restrita a administradores e professores.</p>
             <Button asChild className="mt-4">
              <Link href={`/dashboard?role=${user?.role || 'student'}`}>Voltar ao Painel</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <Suspense fallback={<StudentsListSkeleton />}>
        <StudentList user={user} />
    </Suspense>
  );
}
