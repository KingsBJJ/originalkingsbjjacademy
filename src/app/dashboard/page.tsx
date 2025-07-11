
"use client";

import { useContext, useEffect, useMemo, useState } from "react";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CheckCircle,
  Medal,
  Users,
  Map,
  User as UserIcon,
  BarChart,
  Trophy,
  Building,
} from "lucide-react";
import { Bar, BarChart as RechartsBarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { ChartConfig, ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { UserContext } from "./client-layout";
import { 
    getBranches, 
    getInstructors, 
    getStudents, 
    type Branch, 
    type Instructor, 
    type Student 
} from "@/lib/firestoreService";
import { Skeleton } from "@/components/ui/skeleton";
import type { Timestamp } from "firebase/firestore";

const DataCard = ({ title, value, description, icon: Icon }: { title: string; value: number | string; description: string; icon: React.ElementType }) => (
    <Card>
        <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
                <Icon className="h-5 w-5" />
                <span>{title}</span>
            </CardTitle>
        </CardHeader>
        <CardContent>
            <p className="text-4xl font-bold">{value}</p>
            <p className="text-xs text-muted-foreground">{description}</p>
        </CardContent>
    </Card>
);

const barChartConfig = {
  students: {
    label: "Alunos",
    color: "hsl(var(--primary))",
  },
  checkins: {
    label: "Check-ins",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;


const AdminDashboard = () => {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
      setLoading(true);
      try {
          const [branchesData, instructorsData, studentsData] = await Promise.all([
              getBranches(),
              getInstructors(),
              getStudents()
          ]);
          setBranches(branchesData);
          setInstructors(instructorsData);
          setStudents(studentsData);
      } catch (error) {
          console.error("Failed to fetch dashboard data", error);
      } finally {
          setLoading(false);
      }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const branchStudentData = useMemo(() => {
    if (!students || !branches) return [];
    
    const studentCounts = students.reduce((acc, student) => {
        const affiliation = student.affiliations?.[0] || "Sem Filial";
        acc[affiliation] = (acc[affiliation] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    // Ensure all branches are present, even if they have 0 students
    branches.forEach(branch => {
        if (!studentCounts[branch.name]) {
            studentCounts[branch.name] = 0;
        }
    });

    return Object.entries(studentCounts)
      .filter(([branchName]) => branchName !== "Sem Filial")
      .map(([branchName, studentCount]) => ({
        name: branchName.replace("Kings BJJ - ", ""), // Shorten name for chart
        students: studentCount,
      }));
  }, [students, branches]);
  
   const annualPerformanceData = [
    { month: 'Jan', checkins: 450 },
    { month: 'Fev', checkins: 480 },
    { month: 'Mar', checkins: 550 },
    { month: 'Abr', checkins: 520 },
    { month: 'Mai', checkins: 600 },
    { month: 'Jun', checkins: 580 },
    { month: 'Jul', checkins: 620 },
    { month: 'Ago', checkins: 650 },
    { month: 'Set', checkins: 610 },
    { month: 'Out', checkins: 680 },
    { month: 'Nov', checkins: 720 },
    { month: 'Dez', checkins: 700 },
  ];

  const bestBranch = useMemo(() => {
    if (!students || students.length === 0) {
      return null
    }

    const attendanceByBranch: Record<string, number> = {}
    for (const student of students) {
      const branchName = student.affiliations?.[0] || 'Sem Filial'
      if (branchName !== 'Sem Filial') {
        attendanceByBranch[branchName] =
          (attendanceByBranch[branchName] || 0) +
          (student.attendance?.lastMonth || 0)
      }
    }

    let bestBranchName: string | null = null
    let maxAttendance = 0

    for (const branch in attendanceByBranch) {
      if (attendanceByBranch[branch] > maxAttendance) {
        maxAttendance = attendanceByBranch[branch]
        bestBranchName = branch
      }
    }

    if (!bestBranchName || maxAttendance === 0) {
      return null
    }

    return {
      name: bestBranchName,
      attendance: maxAttendance,
    }
  }, [students]);

  if (loading) {
    return (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Skeleton className="h-36" />
            <Skeleton className="h-36" />
            <Skeleton className="h-36" />
            <Skeleton className="h-80 md:col-span-3" />
            <Skeleton className="h-40 md:col-span-3" />
        </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <DataCard title="Total de Alunos" value={students.length} description="Alunos ativos em todas as filiais" icon={Users} />
        <DataCard title="Total de Filiais" value={branches.length} description="Filiais em operação" icon={Map} />
        <DataCard title="Total de Professores" value={instructors.length} description="Professores em todas as filiais" icon={UserIcon} />
      </div>

      <Card className="md:col-span-3">
          <CardHeader>
              <CardTitle className="flex items-center gap-2"><BarChart/>Estatísticas das Filiais</CardTitle>
              <CardDescription>Visualize a quantidade de alunos para entender a demanda e o crescimento de cada unidade.</CardDescription>
          </CardHeader>
          <CardContent>
              {branchStudentData.length > 0 ? (
                <ChartContainer config={barChartConfig} className="h-64 w-full">
                    <RechartsBarChart
                        accessibilityLayer
                        data={branchStudentData}
                        margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
                    >
                        <XAxis
                            dataKey="name"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={10}
                            fontSize={12}
                        />
                        <YAxis
                            tickLine={false}
                            axisLine={false}
                            tickMargin={10}
                            fontSize={12}
                            allowDecimals={false}
                        />
                        <Tooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Bar dataKey="students" fill="var(--color-students)" radius={4} />
                    </RechartsBarChart>
                </ChartContainer>
              ) : (
                <div className="flex h-64 items-center justify-center">
                    <p className="text-muted-foreground">Nenhum dado de aluno ou filial para exibir.</p>
                </div>
              )}
          </CardContent>
      </Card>
      
      <Card className="md:col-span-3">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="text-yellow-400" />
            Estatísticas do Mês
          </CardTitle>
          <CardDescription>Insights sobre o desempenho das filiais.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border bg-card-foreground/5 p-6">
            <h3 className="text-sm font-semibold text-muted-foreground">Melhor Academia do Mês</h3>
            {bestBranch ? (
              <div className="flex items-baseline gap-4 mt-2">
                <p className="text-3xl font-bold text-primary">{bestBranch.name}</p>
                <div>
                  <span className="text-xl font-semibold">{bestBranch.attendance}</span>
                  <span className="text-sm text-muted-foreground"> check-ins</span>
                </div>
              </div>
            ) : (
              <p className="mt-2 text-muted-foreground">Nenhum dado de check-in no último mês para determinar a melhor filial.</p>
            )}
            <p className="text-xs text-muted-foreground mt-1">Baseado no número de check-ins de alunos no último mês.</p>
          </div>
        </CardContent>
      </Card>

      <Card className="md:col-span-3">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart />
            Desempenho Anual da Equipe
          </CardTitle>
          <CardDescription>
            Acompanhe o número total de check-ins ao longo do ano.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={barChartConfig} className="h-64 w-full">
            <RechartsBarChart
              accessibilityLayer
              data={annualPerformanceData}
              margin={{
                left: -10,
                right: 20,
              }}
            >
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                fontSize={12}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                fontSize={12}
                allowDecimals={false}
              />
              <Tooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Bar dataKey="checkins" fill="var(--color-checkins)" radius={4} />
            </RechartsBarChart>
          </ChartContainer>
        </CardContent>
      </Card>

    </div>
  );
};

const ProfessorDashboard = () => {
  const user = useContext(UserContext);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAffiliation, setSelectedAffiliation] = useState<string>("");

  useEffect(() => {
    if (user?.affiliations && user.affiliations.length > 0) {
      setSelectedAffiliation(user.affiliations[0]);
    }
  }, [user]);

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
        setLoading(true);
        try {
            const [branchesData, studentsData] = await Promise.all([
                getBranches(),
                getStudents()
            ]);
            setBranches(branchesData);
            setStudents(studentsData);
        } catch (error) {
            console.error("Failed to fetch professor dashboard data", error);
        } finally {
            setLoading(false);
        }
    };
    fetchData();
  }, [user]);
  
  const filteredStudents = useMemo(() => {
      if (!selectedAffiliation) return [];
      return students.filter(s => s.affiliations && s.affiliations.includes(selectedAffiliation));
  }, [students, selectedAffiliation]);


  const monthlyStats = useMemo(() => {
    if (!filteredStudents) return { checkins: 0, newStudents: 0 };
    
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    const oneMonthAgoMillis = oneMonthAgo.getTime();

    const newStudentsCount = filteredStudents.filter(student => {
        if (student.createdAt) {
            const createdAtDate = (student.createdAt as Timestamp).toDate();
            return createdAtDate.getTime() > oneMonthAgoMillis;
        }
        return false;
    }).length;

    const checkinsCount = filteredStudents.reduce((total, student) => total + (student.attendance?.lastMonth || 0), 0);

    return {
        checkins: checkinsCount,
        newStudents: newStudentsCount,
    };
  }, [filteredStudents]);

  const annualPerformanceData = [
    { month: 'Jan', checkins: 45 },
    { month: 'Fev', checkins: 48 },
    { month: 'Mar', checkins: 55 },
    { month: 'Abr', checkins: 52 },
    { month: 'Mai', checkins: 60 },
    { month: 'Jun', checkins: 58 },
    { month: 'Jul', checkins: 62 },
    { month: 'Ago', checkins: 65 },
    { month: 'Set', checkins: 61 },
    { month: 'Out', checkins: 68 },
    { month: 'Nov', checkins: 72 },
    { month: 'Dez', checkins: 70 },
  ];

  if (!user) return null;

  if (loading) {
      return (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Skeleton className="h-36" />
            <Skeleton className="h-36 lg:col-span-2" />
            <Skeleton className="h-52 md:col-span-3" />
            <Skeleton className="h-80 md:col-span-3" />
        </div>
      );
  }

  const nextClass = branches
    .flatMap(b => b.schedule?.map(s => ({...s, branchName: b.name})))
    .find(c => {
      if (!c || !user?.name || !c.instructor) return false;
      const instructorLastName = user.name.split(' ').slice(1).join(' ');
      return c.instructor.includes(instructorLastName) && c.branchName === selectedAffiliation;
    });
    
  const showAffiliationSelector = user.affiliations.length > 1;

  return (
    <div className="grid grid-cols-1 gap-6">
        {showAffiliationSelector && (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Building /> Selecionar Filial</CardTitle>
                    <CardDescription>Você leciona em mais de uma filial. Escolha qual painel deseja visualizar.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Select value={selectedAffiliation} onValueChange={setSelectedAffiliation}>
                        <SelectTrigger className="w-full md:w-1/2">
                            <SelectValue placeholder="Selecione uma filial" />
                        </SelectTrigger>
                        <SelectContent>
                            {user.affiliations.map(aff => (
                                <SelectItem key={aff} value={aff}>{aff}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </CardContent>
            </Card>
        )}

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <DataCard title="Seus Alunos" value={filteredStudents.length} description={`Alunos na filial: ${selectedAffiliation}`} icon={Users} />
            
            <Card className="col-span-1 md:col-span-2">
                <CardHeader>
                    <CardTitle>Sua Próxima Aula</CardTitle>
                    <CardDescription>
                        Prepare-se para a sua próxima aula agendada em {selectedAffiliation}.
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
                        <p className="text-muted-foreground">Nenhuma próxima aula encontrada para você nesta filial.</p>
                    )}
                </CardContent>
            </Card>
        </div>
        
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="text-yellow-400" />
              Estatísticas do Mês
            </CardTitle>
            <CardDescription>Desempenho da sua filial ({selectedAffiliation}).</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="rounded-lg border bg-card-foreground/5 p-6">
                    <h3 className="text-sm font-semibold text-muted-foreground">Total de Check-ins no Mês</h3>
                    <div className="flex items-baseline gap-4 mt-2">
                        <p className="text-3xl font-bold text-primary">{monthlyStats.checkins}</p>
                        <span className="text-sm text-muted-foreground"> check-ins</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Baseado no número de check-ins de alunos no último mês.</p>
                </div>
                 <div className="rounded-lg border bg-card-foreground/5 p-6">
                    <h3 className="text-sm font-semibold text-muted-foreground">Novos Alunos no Mês</h3>
                    <div className="flex items-baseline gap-4 mt-2">
                        <p className="text-3xl font-bold text-primary">{monthlyStats.newStudents}</p>
                        <span className="text-sm text-muted-foreground"> alunos</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Número de alunos cadastrados nos últimos 30 dias.</p>
                </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart />
              Desempenho Anual da Filial
            </CardTitle>
            <CardDescription>
              Acompanhe o número total de check-ins ao longo do ano para a filial {selectedAffiliation}.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={barChartConfig} className="h-64 w-full">
              <RechartsBarChart
                accessibilityLayer
                data={annualPerformanceData}
                margin={{ left: -10, right: 20 }}
              >
                <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} fontSize={12} />
                <YAxis tickLine={false} axisLine={false} tickMargin={8} fontSize={12} allowDecimals={false} />
                <Tooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                <Bar dataKey="checkins" fill="var(--color-checkins)" radius={4} />
              </RechartsBarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="md:col-span-3">
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
    const fetchBranches = async () => {
        setLoading(true);
        try {
            const data = await getBranches();
            setBranches(data);
        } catch (error) {
            console.error("Failed to fetch branches for student", error);
        } finally {
            setLoading(false);
        }
    };
    fetchBranches();
  }, []);

  if (!user) return null;

  if (loading) {
      return <div className="grid gap-6"><Skeleton className="h-44 w-full" /> <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"><Skeleton className="h-44" /><Skeleton className="h-44" /><Skeleton className="h-44" /></div></div>;
  }

  const nextClass = branches
      .find(b => user.affiliations && user.affiliations.includes(b.name))
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
                            {nextClass.time} com <span className="text-primary font-medium">{nextClass.instructor}</span>
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
    professor: `Welcome to the Game! ${user.name}`,
    student: `Welcome to the Game! ${user.name.split(" ")[0]}`,
  };

  const subMessage = {
    admin: "Gerencie alunos, filiais e professores.",
    professor: "Aqui está o resumo da sua academia. Vamos ao trabalho.",
    student: `Aqui está seu resumo de treinos, ${user.name.split(" ")[0]}. Vamos ao trabalho.`,
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
