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
import { mockUser, mockClasses } from "@/lib/mock-data";
import { CheckCircle, Medal, BarChart } from "lucide-react";

export default function DashboardPage() {
  const nextClass = mockClasses[0];

  return (
    <div className="grid gap-6">
      <div className="grid gap-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Bem-vindo de volta, {mockUser.name.split(" ")[0]}!
        </h1>
        <p className="text-muted-foreground">
          Aqui está seu resumo de treinos. Vamos ao trabalho.
        </p>
      </div>

      <Card className="bg-primary/10 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="text-primary" />
            <span>Check-in da Próxima Aula</span>
          </CardTitle>
          <CardDescription>
            Sua próxima aula começa em breve. Faça o check-in para marcar sua presença.
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
                  Faixa {mockUser.belt}, {mockUser.stripes} Graus
                </span>
                <span className="text-muted-foreground">
                  {mockUser.nextGraduationProgress}%
                </span>
              </div>
              <Progress value={mockUser.nextGraduationProgress} />
              <p className="text-xs text-muted-foreground">
                Progresso para seu próximo grau/faixa.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart />
              <span>Frequência</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="flex items-baseline justify-center gap-2">
                <p className="text-4xl font-bold">{mockUser.attendance.lastMonth}</p>
                <p className="text-sm text-muted-foreground">aulas no último mês</p>
            </div>
            <div className="text-center text-sm text-muted-foreground">
                Frequência total: {mockUser.attendance.total} aulas
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
                        <span className="text-primary">●</span> Raspagens da Guarda Aranha
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
    </div>
  );
}
