"use client";

import { useContext, useEffect, useState } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  CheckCircle,
  Medal,
  Users,
  Map,
  User as UserIcon,
  Trophy,
} from "lucide-react";
import { UserContext } from "./client-layout";
import { getBranches, getInstructors, getStudents, type Branch, type Instructor, type Student } from "@/lib/firestoreService";
import { Skeleton } from "@/components/ui/skeleton";

type DashboardData = {
  branches: Branch[];
  instructors: Instructor[];
  students: Student[];
};

const DataCard = ({ title, value, description, icon: Icon }: { title: string; value: number | string; description: string; icon: React.ElementType }) => (
    <Card>
        <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <Icon />
                <span>{title}</span>
            </CardTitle>
        </CardHeader>
        <CardContent>
            <p className="text-4xl font-bold">{value}</p>
            <p className="text-xs text-muted-foreground">{description}</p>
        </CardContent>
    </Card>
);

const AdminDashboard = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [branches, instructors, students] = await Promise.all([
          getBranches(),
          getInstructors(),
          getStudents(),
        ]);
        setData({ branches, instructors, students });
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Skeleton className="h-36" />
            <Skeleton className="h-36" />
            <Skeleton className="h-36" />
        </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      <DataCard title="Total de Alunos" value={data?.students.length ?? 0} description="Alunos ativos em todas as filiais" icon={Users} />
      <DataCard title="Total de Filiais" value={data?.branches.length ?? 0} description="Filiais em operação" icon={Map} />
      <DataCard title="Total de Professores" value={data?.instructors.length ?? 0} description="Professores em todas as filiais" icon={UserIcon} />
      
      <Card className="md:col-span-2 lg:col-span-3">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy />
            <span>Filial em Destaque no Mês</span>
          </CardTitle>
          <CardDescription>
            A filial com melhor desempenho este mês.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4 rounded-lg border bg-muted/50 p-4">
            <Map className="h-10 w-10 text-primary" />
            <div>
              <h3 className="text-xl font-bold">Kings BJJ - Centro</h3>
              <p className="text-muted-foreground">
                Parabéns pelo excelente trabalho!
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-lg border p-3 text-center">
              <p className="text-2xl font-bold">+12%</p>
              <p className="text-xs text-muted-foreground">
                Crescimento de Alunos
              </p>
            </div>
            <div className="rounded-lg border p-3 text-center">
              <p className="text-2xl font-bold">95%</p>
              <p className="text-xs text-muted-foreground">Retenção</p>
            </div>
            <div className="rounded-lg border p-3 text-center">
              <p className="text-2xl font-bold">85%</p>
              <p className="text-xs text-muted-foreground">
                Engajamento nas Aulas
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const ProfessorDashboard = () => {
  const user = useContext(UserContext);
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.affiliation) {
          setLoading(false);
          return;
      }
      try {
        const [branches, students] = await Promise.all([
          getBranches(),
          getStudents(),
        ]);
        const affiliatedStudents = students.filter(s => s.affiliation === user.affiliation);
        setData({ branches, instructors: [], students: affiliatedStudents });
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user?.affiliation]);

  if (!user) return null;

  if (loading) {
      return <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"><Skeleton className="h-36 md:col-span-1 lg:col-span-3" /><Skeleton className="h-36 md:col-span-1 lg:col-span-3" /></div>;
  }

  const nextClass = data?.branches
    .flatMap(b => b.schedule?.map(s => ({...s, branchName: b.name})))
    .find(c => c.instructor.includes(user.name.split(" ")[1]));

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <DataCard title="Seus Alunos" value={data?.students.length ?? 0} description={`Alunos na sua filial: ${user.affiliation}`} icon={Users} />
        
        <Card className="col-span-1 lg:col-span-2">
            <CardHeader>
                <CardTitle>Sua Próxima Aula</CardTitle>
                <CardDescription>
                    Prepare-se para a sua próxima aula agendada.
                </CardDescription>
            </CardHeader>
            <CardContent>
                {nextClass ? (
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <p className="text-lg font-semibold">{nextClass.name}</p>
                            <p className="text-muted-foreground">
                            {nextClass.day} às {nextClass.time.split(' - ')[0]}
                            </p>
                        </div>
                        <Button size="lg" className="w-full sm:w-auto" asChild>
                            <Link href={`/dashboard/schedule?role=${user.role}`}>Ver Grade Completa</Link>
                        </Button>
                    </div>
                ) : (
                    <p className="text-muted-foreground">Nenhuma próxima aula encontrada.</p>
                )}
            </CardContent>
        </Card>

        <Card className="md:col-span-2 lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Medal />
              <span>Seu Progresso de Graduação</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">
                  Faixa {user.belt}, {user.stripes} Graus
                </span>
                <span className="text-muted-foreground">
                  {user.nextGraduationProgress}%
                </span>
              </div>
              <Progress value={user.nextGraduationProgress} />
              <p className="text-xs text-muted-foreground">
                Seu progresso pessoal para o próximo grau/faixa.
              </p>
            </div>
          </CardContent>
        </Card>
    </div>
  );
};

const StudentDashboard = () => {
  const user = useContext(UserContext);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBranches().then(data => {
        setBranches(data);
        setLoading(false);
    }).catch(console.error);
  }, []);

  if (!user) return null;

  if (loading) {
      return <div className="grid gap-6"><Skeleton className="h-44 w-full" /> <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"><Skeleton className="h-44" /><Skeleton className="h-44" /><Skeleton className="h-44" /></div></div>;
  }

  const nextClass = branches
      .find(b => b.id === user.branchId)
      ?.schedule?.[0];

  return (
    <>
      <Card className="bg-primary/10 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="text-primary" />
            <span>Check-in da Próxima Aula</span>
          </CardTitle>
          <CardDescription>
            Sua próxima aula começa em breve. Faça o check-in para marcar sua
            presença.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            {nextClass ? (
                <>
                    <div>
                        <p className="text-lg font-semibold">{nextClass.name}</p>
                        <p className="text-muted-foreground">
                            {nextClass.time} com {nextClass.instructor}
                        </p>
                    </div>
                    <Button size="lg" className="w-full sm:w-auto" asChild>
                        <Link href={`/dashboard/check-in?role=${user.role}`}>Fazer Check-in</Link>
                    </Button>
                </>
            ) : (
                 <p className="text-muted-foreground">Nenhuma aula agendada para sua filial.</p>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Medal />
              <span>Progresso de Graduação</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">
                  Faixa {user.belt}, {user.stripes} Graus
                </span>
                <span className="text-muted-foreground">
                  {user.nextGraduationProgress}%
                </span>
              </div>
              <Progress value={user.nextGraduationProgress} />
              <p className="text-xs text-muted-foreground">
                Progresso para seu próximo grau/faixa.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Frequência</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-baseline justify-center gap-2">
              <p className="text-4xl font-bold">{user.attendance.lastMonth}</p>
              <p className="text-sm text-muted-foreground">
                aulas no último mês
              </p>
            </div>
            <div className="text-center text-sm text-muted-foreground">
              Frequência total: {user.attendance.total} aulas
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 lg:col-span-1">
          <CardHeader>
            <CardTitle>Foco do Treino</CardTitle>
            <CardDescription>Baseado em suas aulas recentes</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <span className="text-primary">●</span> Raspagens da Guarda
                Aranha
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary">●</span> Ajustes de Triângulo
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary">●</span> Saídas da Montada
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default function DashboardPage() {
  const user = useContext(UserContext);

  if (!user) {
    return <div className="grid gap-6">
        <Skeleton className="h-10 w-1/2" />
        <Skeleton className="h-5 w-3/4" />
        <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Skeleton className="h-36" />
            <Skeleton className="h-36" />
            <Skeleton className="h-36" />
        </div>
    </div>
  }

  const welcomeMessage = {
    admin: "Visão geral da Kings Bjj",
    professor: `Bem-vindo de volta, ${user.name.split(" ")[0]}!`,
    student: `Bem-vindo de volta, ${user.name.split(" ")[0]}!`,
  };

  const subMessage = {
    admin: "Gerencie alunos, filiais e professores.",
    professor: "Aqui está o resumo da sua academia. Vamos ao trabalho.",
    student: "Aqui está seu resumo de treinos. Vamos ao trabalho.",
  };

  return (
    <div className="grid gap-6">
      <div className="grid gap-2">
        <h1 className="text-3xl font-bold tracking-tight">
          {welcomeMessage[user.role]}
        </h1>
        <p className="text-muted-foreground">{subMessage[user.role]}</p>
      </div>

      {user.role === "admin" && <AdminDashboard />}
      {user.role === "professor" && <ProfessorDashboard />}
      {user.role === "student" && <StudentDashboard />}
    </div>
  );
}
