
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
import { getStudents, getUserByEmail, type Student } from '@/lib/firestoreService';
import { User, mockUsers, beltColors, beltColorsKids } from '@/lib/mock-data';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { format, formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";


const allBeltColors = { ...beltColors, ...beltColorsKids };

const StudentsGrid = ({ students }: { students: Student[] }) => {
    if (students.length === 0) {
        return (
            <div className="flex h-48 items-center justify-center text-muted-foreground">
                Nenhum aluno nesta categoria.
            </div>
        )
    }

    const formatJoinDate = (date: Date | undefined) => {
        if (!date) return 'Data não registrada';
        
        const jsDate = date; // It's already a Date object
        const now = new Date();
        const oneMonth = 30 * 24 * 60 * 60 * 1000;
        
        if (now.getTime() - jsDate.getTime() < oneMonth) {
            return `Há ${formatDistanceToNow(jsDate, { locale: ptBR })}`;
        }
        return `Desde ${format(jsDate, 'MMM yyyy', { locale: ptBR })}`;
    };

    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {students.map((student) => {
                const beltStyle = allBeltColors[student.belt as keyof typeof allBeltColors] || allBeltColors.Branca;
                return (
                    <Card key={student.id}>
                        <CardHeader>
                            <div className="flex items-center gap-4">
                                <Avatar className="h-14 w-14">
                                    <AvatarImage src={student.avatar} alt={student.name} />
                                    <AvatarFallback className="text-xl">{student.name[0]}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-bold text-lg">{student.name}</p>
                                    <p className="text-sm text-muted-foreground">{student.email}</p>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div>
                                <h4 className="text-xs font-semibold text-muted-foreground mb-1">Graduação</h4>
                                <Badge className={cn("text-sm font-semibold", beltStyle.bg, beltStyle.text)}>
                                    {student.belt}
                                    {(student.belt === 'Preta' || student.belt === 'Coral') && student.stripes > 0 && ` - ${student.stripes}º Grau`}
                                </Badge>
                            </div>
                            <div>
                                <h4 className="text-xs font-semibold text-muted-foreground mb-1">Tempo de Equipe</h4>
                                <p className="text-sm font-medium">{formatJoinDate(student.createdAt)}</p>
                            </div>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
};


const StudentsListSkeleton = () => (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
                <CardHeader className="flex flex-row items-center gap-4">
                    <Skeleton className="h-14 w-14 rounded-full" />
                    <div className="space-y-2">
                        <Skeleton className="h-5 w-32" />
                        <Skeleton className="h-4 w-40" />
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-1">
                        <Skeleton className="h-3 w-20" />
                        <Skeleton className="h-6 w-24 rounded-full" />
                    </div>
                     <div className="space-y-1">
                        <Skeleton className="h-3 w-24" />
                        <Skeleton className="h-4 w-28" />
                    </div>
                </CardContent>
            </Card>
        ))}
    </div>
);

async function MyStudentsList({ user }: { user: User }) {
  const allStudents = await getStudents();

  // For admins, show all students. For professors, filter by mainInstructor.
  const myStudents = user.role === 'admin' 
    ? allStudents 
    : allStudents.filter(student => student.mainInstructor === user.name);

  const adultStudents = myStudents.filter(s => s.category === 'Adult');
  const kidsStudents = myStudents.filter(s => s.category === 'Kids');

  return (
    <div className="grid gap-6">
       <div>
        <h1 className="text-3xl font-bold tracking-tight">Meus Alunos</h1>
        <p className="text-muted-foreground">
          {user.role === 'admin' 
            ? 'Visualize todos os alunos do sistema.'
            : 'Visualize os alunos que se cadastraram com você como professor principal.'
          }
        </p>
      </div>
       <Card>
        <CardContent className="pt-6">
            <Tabs defaultValue="adults" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="adults">Adultos ({adultStudents.length})</TabsTrigger>
                    <TabsTrigger value="kids">Kids ({kidsStudents.length})</TabsTrigger>
                </TabsList>
                <TabsContent value="adults" className="mt-6">
                    <StudentsGrid students={adultStudents} />
                </TabsContent>
                <TabsContent value="kids" className="mt-6">
                    <StudentsGrid students={kidsStudents} />
                </TabsContent>
            </Tabs>
        </CardContent>
       </Card>
    </div>
  );
}


export default async function MyStudentsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const email = searchParams?.email as string;
  let user = email ? await getUserByEmail(email) : null;

  // Fallback to role-based mock user if no real user is found
  if (!user) {
    const role = (searchParams?.role || 'student') as User['role'];
    user = mockUsers[role] || mockUsers.student;
  }
  
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
        <MyStudentsList user={user} />
    </Suspense>
  );
}
