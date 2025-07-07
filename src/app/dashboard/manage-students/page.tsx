
"use client";

import { useContext, useState, useEffect } from 'react';
import Link from 'next/link';
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
import { UserContext } from '../client-layout';
import { beltColors, beltColorsKids } from '@/lib/mock-data';
import { onStudentsUpdate, type Student } from '@/lib/firestoreService';
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

const StudentTableRowSkeleton = () => (
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
      <TableCell className="text-right"><Skeleton className="h-8 w-8" /></TableCell>
    </TableRow>
);


const StudentTable = ({ students, userRole, isLoading, userName }: { students: Student[], userRole: 'admin' | 'professor' | 'student', isLoading: boolean, userName?: string }) => {
    const title = userRole === 'admin' ? "Lista de Alunos" : `Alunos do Prof. ${userName}`;
    const description = userRole === 'admin' 
        ? `Total de ${students.length} alunos cadastrados.`
        : `Total de ${students.length} alunos na sua turma.`;

    return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
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
            {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => <StudentTableRowSkeleton key={i} />)
            ) : students.length > 0 ? students.map((student) => {
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
                  <TableCell>{student.affiliation}</TableCell>
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
            }) : (
                <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                        Nenhum aluno encontrado para sua turma.
                    </TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
)};


export default function ManageStudentsPage() {
  const user = useContext(UserContext);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = onStudentsUpdate((fetchedStudents) => {
      setStudents(fetchedStudents);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (!user || user.role === 'student') {
    return (
      <div className="flex items-center justify-center h-full">
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

  const filteredStudents = user.role === 'admin'
    ? students
    : students.filter(s => s.affiliation === user.affiliation && s.mainInstructor === user.name);
  
  const adultStudents = filteredStudents.filter(s => s.category === 'Adult');
  const kidsStudents = filteredStudents.filter(s => s.category === 'Kids');

  return (
    <div className="grid gap-6">
       <div>
        <h1 className="text-3xl font-bold tracking-tight">Alunos</h1>
        <p className="text-muted-foreground">
          {user.role === 'admin' 
            ? "Visualize e gerencie todos os alunos do sistema."
            : "Visualize e gerencie os alunos da sua turma."
          }
        </p>
      </div>
       <Tabs defaultValue="adults" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="adults">Adultos ({adultStudents.length})</TabsTrigger>
          <TabsTrigger value="kids">Kids ({kidsStudents.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="adults" className="mt-4">
          <StudentTable students={adultStudents} userRole={user.role} isLoading={loading} userName={user.name} />
        </TabsContent>
        <TabsContent value="kids" className="mt-4">
          <StudentTable students={kidsStudents} userRole={user.role} isLoading={loading} userName={user.name} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
