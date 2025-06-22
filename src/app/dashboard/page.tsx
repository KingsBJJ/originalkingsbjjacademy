"use client";

import { useContext } from "react";
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
import { mockClasses, mockStudents, mockUsers, mockTeamGrowth } from "@/lib/mock-data";
import {
  CheckCircle,
  Medal,
  BarChart as BarChartIcon,
  Users,
  Map,
  User,
  TrendingUp,
} from "lucide-react";
import { UserContext } from "./client-layout";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

const AdminDashboard = () => {
  const chartData = mockTeamGrowth;

  const chartConfig = {
    total: {
      label: "Alunos",
      color: "hsl(var(--primary))",
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
          <p className="text-4xl font-bold">{chartData[chartData.length - 1].total}</p>
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
            <TrendingUp />
            Crescimento da Equipe
          </CardTitle>
          <CardDescription>
            Evolução do número de alunos nos últimos meses.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[250px] w-full">
            <AreaChart
              accessibilityLayer
              data={chartData}
              margin={{ top: 20, right: 20, left: -10, bottom: 0 }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                domain={["dataMin - 5", "dataMax + 5"]}
              />
              <ChartTooltip
                cursor={true}
                content={<ChartTooltipContent indicator="line" />}
              />
              <defs>
                <linearGradient id="fillTotal" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-total)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-total)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              <Area
                dataKey="total"
                type="monotone"
                fill="url(#fillTotal)"
                strokeWidth={2}
                stroke="var(--color-total)"
                stackId="a"
              />
            </AreaChart>
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
            <Button size="lg" className="w-full sm:w-auto">
              Fazer Check-in
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
    admin: "Visão Geral do Sistema",
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
      {user.role === "professor" && <StudentDashboard />}
      {user.role === "student" && <StudentDashboard />}
    </div>
  );
}
