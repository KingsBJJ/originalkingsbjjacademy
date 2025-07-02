"use client";

import { useContext } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  mockClasses,
  mockGrowthMetrics,
  mockAllStudents,
  mockTeamGrowth,
} from "@/lib/mock-data";
import {
  CheckCircle,
  Medal,
  BarChart as BarChartIcon,
  Users,
  Map,
  User,
  BarChart2,
  Trophy,
} from "lucide-react";
import { UserContext } from "./client-layout";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Cell,
  LabelList,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

const AdminDashboard = () => {
  const chartData = mockTeamGrowth;
  const growthMetricsData = mockGrowthMetrics;

  const chartConfig = {
    value: {
      label: "Valor (%)",
    },
    new: {
      label: "Novos Alunos (Mês)",
      color: "hsl(var(--chart-1))",
    },
    retention: {
      label: "Retenção (Trimestre)",
      color: "hsl(var(--chart-2))",
    },
    kids: {
      label: "Crescimento Kids",
      color: "hsl(var(--chart-3))",
    },
    engagement: {
      label: "Engajamento (Check-in)",
      color: "hsl(var(--chart-4))",
    },
    graduations: {
      label: "Graduações (Ano)",
      color: "hsl(var(--chart-5))",
    },
  } satisfies ChartConfig;

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users />
            <span>Total de Alunos</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold">
            {mockAllStudents.length}
          </p>
          <p className="text-xs text-muted-foreground">
            Alunos ativos em todas as filiais
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Map />
            <span>Total de Filiais</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold">2</p>
          <p className="text-xs text-muted-foreground">Filiais em operação</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User />
            <span>Total de Professores</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold">4</p>
          <p className="text-xs text-muted-foreground">
            Professores em todas as filiais
          </p>
        </CardContent>
      </Card>
      <Card className="md:col-span-2 lg:col-span-3">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart2 />
            Estatísticas de Crescimento da Equipe
          </CardTitle>
          <CardDescription>
            Principais métricas de crescimento em porcentagem.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <BarChart
              accessibilityLayer
              data={growthMetricsData}
              margin={{
                top: 30,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="metric"
                tickLine={false}
                axisLine={false}
                tickMargin={10}
              />
              <YAxis
                tickFormatter={(value) => `${value}%`}
                domain={[0, 100]}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                <LabelList
                  position="top"
                  offset={8}
                  className="fill-foreground"
                  fontSize={12}
                  formatter={(value: number) => `${value}%`}
                />
                {growthMetricsData.map((entry) => (
                  <Cell key={entry.metric} fill={`var(--color-${entry.key})`} />
                ))}
              </Bar>
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
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
  if (!user) return null;

  const userFirstName = user.name.split(" ")[1];
  const nextClass =
    mockClasses.find((c) => c.branchId === user.branchId && c.instructor.includes(userFirstName)) ||
    mockClasses.find((c) => c.branchId === user.branchId) ||
    mockClasses[0];

  const branchMetricsData = [
    { metric: "Total", value: mockAllStudents.filter(s => s.affiliation === user.affiliation).length, key: "total", unitPrefix: "", unitSuffix: "" },
    { metric: "Novos", value: 5, key: "new", unitPrefix: "+", unitSuffix: ""},
    { metric: "Retenção", value: 96, key: "retention", unitPrefix: "", unitSuffix: "%" },
  ];

  const chartConfig = {
      value: {
        label: "Valor",
      },
      total: {
        label: "Total de Alunos",
        color: "hsl(var(--chart-1))",
      },
      new: {
        label: "Novos Alunos (Mês)",
        color: "hsl(var(--chart-2))",
      },
      retention: {
        label: "Retenção",
        color: "hsl(var(--chart-4))",
      },
  } satisfies ChartConfig;

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-1 lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users />
              <span>Seus Alunos</span>
            </CardTitle>
            <CardDescription>
              Alunos na sua filial: {user.affiliation}
            </CardDescription>
          </CardHeader>
          <CardContent>
              <p className="text-4xl font-bold">{mockAllStudents.filter(s => s.affiliation === user.affiliation).length}</p>
          </CardContent>
        </Card>
        
        <Card className="col-span-1 lg:col-span-2">
            <CardHeader>
                <CardTitle>Sua Próxima Aula</CardTitle>
                <CardDescription>
                    Prepare-se para a sua próxima aula agendada.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="text-lg font-semibold">{nextClass.name}</p>
                        <p className="text-muted-foreground">
                        Hoje às {nextClass.time.split(' - ')[0]}
                        </p>
                    </div>
                    <Button size="lg" className="w-full sm:w-auto" asChild>
                        <Link href={`/dashboard/schedule?role=${user.role}`}>Ver Grade Completa</Link>
                    </Button>
                </div>
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
        
        <Card className="md:col-span-2 lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChartIcon />
              <span>Estatísticas da sua Unidade</span>
            </CardTitle>
            <CardDescription>
              Desempenho da unidade {user.affiliation}.
            </CardDescription>
          </CardHeader>
          <CardContent>
             <ChartContainer config={chartConfig} className="h-[250px] w-full">
              <BarChart accessibilityLayer data={branchMetricsData}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="metric"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={10}
                  tick={{ fontSize: 12 }}
                />
                <YAxis
                  tickFormatter={(value) => `${value}`}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                  <LabelList
                    position="top"
                    offset={8}
                    className="fill-foreground font-semibold"
                    fontSize={12}
                    dataKey={(d: { value: number; unitPrefix: string; unitSuffix: string }) => `${d.unitPrefix}${d.value}${d.unitSuffix}`}
                  />
                  {branchMetricsData.map((entry) => (
                    <Cell key={entry.metric} fill={`var(--color-${entry.key})`} />
                  ))}
                </Bar>
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
    </div>
  );
};


const StudentDashboard = () => {
  const user = useContext(UserContext);
  if (!user) return null;

  const nextClass =
    mockClasses.find((c) => c.branchId === user.branchId) || mockClasses[0];

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
            <div>
              <p className="text-lg font-semibold">{nextClass.name}</p>
              <p className="text-muted-foreground">
                {nextClass.time} com {nextClass.instructor}
              </p>
            </div>
            <Button size="lg" className="w-full sm:w-auto" asChild>
              <Link href={`/dashboard/check-in?role=${user.role}`}>Fazer Check-in</Link>
            </Button>
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
            <CardTitle className="flex items-center gap-2">
              <BarChartIcon />
              <span>Frequência</span>
            </CardTitle>
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
    return <div>Carregando...</div>;
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
