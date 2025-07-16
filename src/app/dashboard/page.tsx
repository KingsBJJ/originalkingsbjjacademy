// src/app/dashboard/page.tsx
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
  Sparkles,
  Cake,
  PartyPopper,
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
  type Student,
  type User,
} from "@/lib/firestoreService";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { KingsBjjLogo } from "@/components/kings-bjj-logo";

// Definir a função generateViewport para o Client Component
export function generateViewport() {
  return {
    viewport: "width=device-width, initial-scale=1",
  };
}

// Configuração do gráfico (exemplo, ajustar conforme os dados reais)
const chartConfig: ChartConfig = {
  students: {
    label: "Alunos",
    color: "#2563eb",
  },
} satisfies ChartConfig;

// Interface para os dados do gráfico (exemplo, ajustar conforme necessário)
interface ChartData {
  name: string;
  students: number;
}

// Componente principal
export default function DashboardPage() {
  const { user } = useContext(UserContext);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBranch, setSelectedBranch] = useState<string | null>(null);

  // Carregar dados do Firestore
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [branchesData, instructorsData, studentsData] = await Promise.all([
          getBranches(),
          getInstructors(),
          getStudents(),
        ]);
        setBranches(branchesData);
        setInstructors(instructorsData);
        setStudents(studentsData);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Filtrar alunos por filial selecionada
  const filteredStudents = useMemo(() => {
    if (!selectedBranch) return students;
    return students.filter((student) => student.branchId === selectedBranch);
  }, [students, selectedBranch]);

  // Dados de exemplo para o gráfico (ajustar conforme os dados reais)
  const chartData: ChartData[] = useMemo(() => {
    return branches.map((branch) => ({
      name: branch.name,
      students: students.filter((student) => student.branchId === branch.id).length,
    }));
  }, [branches, students]);

  return (
    <div className="grid gap-6 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <KingsBjjLogo className="h-10 w-10" />
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        </div>
        {user?.role === "admin" && (
          <Button asChild>
            <Link href="/dashboard/manage-students">
              <Users className="mr-2 h-4 w-4" />
              Gerenciar Alunos
            </Link>
          </Button>
        )}
      </div>

      {loading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      ) : (
        <>
          {/* Cards de estatísticas */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de Alunos</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{students.length}</div>
                <p className="text-xs text-muted-foreground">+{students.length} desde o último mês</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Instrutores</CardTitle>
                <UserIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{instructors.length}</div>
                <p className="text-xs text-muted-foreground">Ativos na academia</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Filiais</CardTitle>
                <Building className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{branches.length}</div>
                <p className="text-xs text-muted-foreground">Unidades registradas</p>
              </CardContent>
            </Card>
          </div>

          {/* Seleção de filial */}
          <Card>
            <CardHeader>
              <CardTitle>Filtrar por Filial</CardTitle>
              <CardDescription>Selecione uma filial para visualizar os dados</CardDescription>
            </CardHeader>
            <CardContent>
              <Select onValueChange={setSelectedBranch} value={selectedBranch || ""}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas as filiais" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as filiais</SelectItem>
                  {branches.map((branch) => (
                    <SelectItem key={branch.id} value={branch.id}>
                      {branch.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Gráfico de alunos por filial */}
          <Card>
            <CardHeader>
              <CardTitle>Distribuição de Alunos por Filial</CardTitle>
              <CardDescription>Número de alunos por unidade</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig}>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsBarChart data={chartData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="students" fill={chartConfig.students.color} />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}