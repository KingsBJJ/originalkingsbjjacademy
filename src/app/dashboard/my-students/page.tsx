<<<<<<< HEAD
// src/app/dashboard/my-students/page.tsx
=======

>>>>>>> b481c2bc812841ccf4c793496605892116238ae6
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
import { getStudents, getUserByEmail, type Student } from '@/lib/firestoreService';
import { User, mockUsers, allBeltColors } from '@/lib/mock-data';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { format, formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const formatJoinDate = (date: Date | undefined) => {
<<<<<<< HEAD
  if (!date) return 'Data não registrada';

  const jsDate = date;
  const now = new Date();
  const oneMonth = 30 * 24 * 60 * 60 * 1000;

  // Check if the date is less than a month ago
  if (now.getTime() - jsDate.getTime() < oneMonth) {
    return `Há ${formatDistanceToNow(jsDate, { locale: ptBR })}`;
  }
  // Otherwise, format as "Month Year"
  return `Desde ${format(jsDate, 'MMM yyyy', { locale: ptBR })}`;
};

const formatBirthDate = (dateString: string | undefined) => {
  if (!dateString) return '-';
  try {
    const [year, month, day] = dateString.split('-').map(Number);
    return format(new Date(year, month - 1, day), 'dd/MM/yyyy');
  } catch {
    return dateString;
  }
};

const StudentTable = ({ students }: { students: Student[] }) => {
  if (students.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center text-muted-foreground">
        Nenhum aluno nesta categoria.
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Aluno</TableHead>
          <TableHead>Nascimento</TableHead>
          <TableHead>Graduação</TableHead>
          <TableHead className="text-center">Aulas (Mês)</TableHead>
          <TableHead className="text-center">Aulas (Total)</TableHead>
          <TableHead>Membro Desde</TableHead>
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
                  <p className="font-medium">{student.name}</p>
                </div>
              </TableCell>
              <TableCell>{formatBirthDate(student.dateOfBirth)}</TableCell>
              <TableCell>
                <Badge className={cn("text-xs font-semibold", beltStyle.bg, beltStyle.text)}>
                  {student.belt}
                  {(student.belt === 'Preta' || student.belt === 'Coral') && student.stripes > 0 && ` - ${student.stripes}º Grau`}
                </Badge>
              </TableCell>
              <TableCell className="text-center font-medium">{student.attendance.lastMonth}</TableCell>
              <TableCell className="text-center font-medium">{student.attendance.total}</TableCell>
              <TableCell>{formatJoinDate(student.createdAt)}</TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

const StudentsListSkeleton = () => (
  <Card>
    <CardContent className="pt-6">
      <Skeleton className="h-10 w-full mb-6" />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead><Skeleton className="h-5 w-24" /></TableHead>
            <TableHead><Skeleton className="h-5 w-24" /></TableHead>
            <TableHead><Skeleton className="h-5 w-24" /></TableHead>
            <TableHead className="text-center"><Skeleton className="h-5 w-20" /></TableHead>
            <TableHead className="text-center"><Skeleton className="h-5 w-20" /></TableHead>
            <TableHead><Skeleton className="h-5 w-24" /></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 5 }).map((_, i) => (
            <TableRow key={i}>
              <TableCell><div className="flex items-center gap-2"><Skeleton className="h-9 w-9 rounded-full" /><Skeleton className="h-4 w-32" /></div></TableCell>
              <TableCell><Skeleton className="h-4 w-20" /></TableCell>
              <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
              <TableCell className="text-center"><Skeleton className="h-4 w-8 mx-auto" /></TableCell>
              <TableCell className="text-center"><Skeleton className="h-4 w-8 mx-auto" /></TableCell>
              <TableCell><Skeleton className="h-4 w-28" /></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </CardContent>
  </Card>
=======
    if (!date) return 'Data não registrada';
    
    const jsDate = date; 
    const now = new Date();
    const oneMonth = 30 * 24 * 60 * 60 * 1000;
    
    // Check if the date is less than a month ago
    if (now.getTime() - jsDate.getTime() < oneMonth) {
        return `Há ${formatDistanceToNow(jsDate, { locale: ptBR })}`;
    }
    // Otherwise, format as "Month Year"
    return `Desde ${format(jsDate, 'MMM yyyy', { locale: ptBR })}`;
};

const formatBirthDate = (dateString: string | undefined) => {
    if (!dateString) return '-';
    try {
        const [year, month, day] = dateString.split('-').map(Number);
        return format(new Date(year, month - 1, day), 'dd/MM/yyyy');
    } catch {
        return dateString;
    }
};

const StudentTable = ({ students }: { students: Student[] }) => {
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
                    <TableHead>Nascimento</TableHead>
                    <TableHead>Graduação</TableHead>
                    <TableHead className="text-center">Aulas (Mês)</TableHead>
                    <TableHead className="text-center">Aulas (Total)</TableHead>
                    <TableHead>Membro Desde</TableHead>
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
                                    <p className="font-medium">{student.name}</p>
                                </div>
                            </TableCell>
                            <TableCell>{formatBirthDate(student.dateOfBirth)}</TableCell>
                            <TableCell>
                                <Badge className={cn("text-xs font-semibold", beltStyle.bg, beltStyle.text)}>
                                    {student.belt}
                                    {(student.belt === 'Preta' || student.belt === 'Coral') && student.stripes > 0 && ` - ${student.stripes}º Grau`}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-center font-medium">{student.attendance.lastMonth}</TableCell>
                            <TableCell className="text-center font-medium">{student.attendance.total}</TableCell>
                            <TableCell>{formatJoinDate(student.createdAt)}</TableCell>
                        </TableRow>
                    );
                })}
            </TableBody>
        </Table>
    );
};

const StudentsListSkeleton = () => (
    <Card>
        <CardContent className="pt-6">
            <Skeleton className="h-10 w-full mb-6" />
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead><Skeleton className="h-5 w-24" /></TableHead>
                        <TableHead><Skeleton className="h-5 w-24" /></TableHead>
                        <TableHead><Skeleton className="h-5 w-24" /></TableHead>
                        <TableHead className="text-center"><Skeleton className="h-5 w-20" /></TableHead>
                        <TableHead className="text-center"><Skeleton className="h-5 w-20" /></TableHead>
                        <TableHead><Skeleton className="h-5 w-24" /></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {Array.from({ length: 5 }).map((_, i) => (
                        <TableRow key={i}>
                            <TableCell><div className="flex items-center gap-2"><Skeleton className="h-9 w-9 rounded-full" /><Skeleton className="h-4 w-32" /></div></TableCell>
                             <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                            <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                            <TableCell className="text-center"><Skeleton className="h-4 w-8 mx-auto" /></TableCell>
                            <TableCell className="text-center"><Skeleton className="h-4 w-8 mx-auto" /></TableCell>
                            <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </CardContent>
    </Card>
>>>>>>> b481c2bc812841ccf4c793496605892116238ae6
);

async function MyStudentsList({ user }: { user: User }) {
  const allStudents = await getStudents();

  // For admins, show all students. For professors, filter by mainInstructor.
<<<<<<< HEAD
  const myStudents = user.role === 'admin'
    ? allStudents
=======
  const myStudents = user.role === 'admin' 
    ? allStudents 
>>>>>>> b481c2bc812841ccf4c793496605892116238ae6
    : allStudents.filter(student => student.mainInstructor === user.name);

  const adultStudents = myStudents.filter(s => s.category === 'Adult');
  const kidsStudents = myStudents.filter(s => s.category === 'Kids');

  return (
    <div className="grid gap-6">
<<<<<<< HEAD
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Meus Alunos</h1>
        <p className="text-muted-foreground">
          {user.role === 'admin'
=======
       <div>
        <h1 className="text-3xl font-bold tracking-tight">Meus Alunos</h1>
        <p className="text-muted-foreground">
          {user.role === 'admin' 
>>>>>>> b481c2bc812841ccf4c793496605892116238ae6
            ? 'Visualize todos os alunos do sistema.'
            : 'Visualize os alunos que se cadastraram com você como professor principal.'
          }
        </p>
      </div>
<<<<<<< HEAD
      <Card>
        <CardContent className="pt-6">
          <Tabs defaultValue="adults" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="adults">Adultos ({adultStudents.length})</TabsTrigger>
              <TabsTrigger value="kids">Kids ({kidsStudents.length})</TabsTrigger>
            </TabsList>
            <TabsContent value="adults" className="mt-6">
              <StudentTable students={adultStudents} />
            </TabsContent>
            <TabsContent value="kids" className="mt-6">
              <StudentTable students={kidsStudents} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
=======
       <Card>
        <CardContent className="pt-6">
            <Tabs defaultValue="adults" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="adults">Adultos ({adultStudents.length})</TabsTrigger>
                    <TabsTrigger value="kids">Kids ({kidsStudents.length})</TabsTrigger>
                </TabsList>
                <TabsContent value="adults" className="mt-6">
                    <StudentTable students={adultStudents} />
                </TabsContent>
                <TabsContent value="kids" className="mt-6">
                    <StudentTable students={kidsStudents} />
                </TabsContent>
            </Tabs>
        </CardContent>
       </Card>
>>>>>>> b481c2bc812841ccf4c793496605892116238ae6
    </div>
  );
}

<<<<<<< HEAD
interface Props {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function MyStudentsPage({ searchParams }: Props) {
  const resolvedSearchParams = await searchParams; // Resolver a Promise
  const email = resolvedSearchParams?.email as string | undefined;
=======

export default async function MyStudentsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const email = searchParams?.email as string;
>>>>>>> b481c2bc812841ccf4c793496605892116238ae6
  let user = email ? await getUserByEmail(email) : null;

  // Fallback to role-based mock user if no real user is found
  if (!user) {
<<<<<<< HEAD
    const role = (resolvedSearchParams?.role || 'student') as User['role'];
    user = mockUsers[role] || mockUsers.student;
  }

=======
    const role = (searchParams?.role || 'student') as User['role'];
    user = mockUsers[role] || mockUsers.student;
  }
  
>>>>>>> b481c2bc812841ccf4c793496605892116238ae6
  // Security check: Only professors and admins can access this page.
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
<<<<<<< HEAD
            <Button asChild className="mt-4">
=======
             <Button asChild className="mt-4">
>>>>>>> b481c2bc812841ccf4c793496605892116238ae6
              <Link href={`/dashboard?role=${user?.role || 'student'}`}>Voltar ao Painel</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <Suspense fallback={<StudentsListSkeleton />}>
<<<<<<< HEAD
      <MyStudentsList user={user} />
    </Suspense>
  );
}
=======
        <MyStudentsList user={user} />
    </Suspense>
  );
}
>>>>>>> b481c2bc812841ccf4c793496605892116238ae6
