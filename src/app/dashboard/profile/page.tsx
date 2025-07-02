"use client";

import { useContext } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { mockAttendanceHistory, beltColors } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { Medal, Trophy, BookOpen, Sparkles } from "lucide-react";
import { UserContext } from "../client-layout";


export default function ProfilePage() {
  const user = useContext(UserContext);

  if (!user) {
    return <div>Carregando...</div>;
  }

  const beltStyle = beltColors[user.belt] || beltColors.Branca;

  return (
    <div className="grid gap-6">
      <div className="flex flex-col items-start gap-4 md:flex-row">
        <Avatar className="h-24 w-24 border-2 border-primary">
          <AvatarImage src={user.avatar} alt={user.name} />
          <AvatarFallback className="text-3xl">
            {user.name.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">{user.name}</h1>
          <p className="text-muted-foreground">{user.email}</p>
          <p className="text-sm text-muted-foreground">
            {user.affiliation}
          </p>
          <div className="mt-2 flex items-center gap-2">
            <Badge
              className={cn(
                "px-4 py-1 text-sm font-semibold shadow-md",
                beltStyle.bg,
                beltStyle.text
              )}
            >
              Faixa {user.belt}
              {(user.belt === 'Preta' || user.belt === 'Coral') && user.stripes > 0 && ` - ${user.stripes}º Grau`}
            </Badge>
            {(user.belt !== 'Preta' && user.belt !== 'Coral') && (
              <div className="flex gap-1">
                {Array.from({ length: user.stripes }).map((_, i) => (
                  <div key={i} className="h-4 w-1 bg-primary" />
                ))}
              </div>
            )}
          </div>
        </div>
        <Button>Editar Perfil</Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Medal />
              <span>Progresso de Graduação</span>
            </CardTitle>
            <CardDescription>
              Acompanhe sua jornada para o próximo nível.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm font-medium">
                <span>Para o Próximo Grau/Faixa</span>
                <span>{user.nextGraduationProgress}%</span>
              </div>
              <Progress value={user.nextGraduationProgress} />
            </div>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold">
                  {user.attendance.total}
                </p>
                <p className="text-sm text-muted-foreground">Total de Aulas</p>
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {user.attendance.lastMonth}
                </p>
                <p className="text-sm text-muted-foreground">Aulas no Mês</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Informações Pessoais</CardTitle>
            <CardDescription>
              Seus detalhes pessoais.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
                <span className="font-medium text-muted-foreground">Função:</span>
                <span className="capitalize">{user.role}</span>
            </div>
             <div className="flex justify-between">
                <span className="font-medium text-muted-foreground">Membro Desde:</span>
                <span>Jan 2022</span>
            </div>
             <div className="flex justify-between">
                <span className="font-medium text-muted-foreground">Contato de Emergência:</span>
                <span>(55) 5555-1111</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {user.role === 'student' ? (
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Presença</CardTitle>
              <CardDescription>
                Seus check-ins de aulas recentes.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Aula</TableHead>
                    <TableHead className="text-right">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockAttendanceHistory.map((item) => (
                    <TableRow key={item.date}>
                      <TableCell>{item.date}</TableCell>
                      <TableCell>{item.class}</TableCell>
                      <TableCell className="text-right">
                        <Badge
                          variant={
                            item.status === "Presente" ? "default" : "destructive"
                          }
                          className={cn(
                            item.status === "Presente" && "bg-green-500/20 text-green-300 border-green-500/30"
                          )}
                        >
                          {item.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
      ) : (
        <Card>
          <CardHeader>
              <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5" />
                  Qualificações e Conquistas
              </CardTitle>
              <CardDescription>
                  Resumo da jornada e especialidades do professor.
              </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
              <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2"><BookOpen className="h-4 w-4 text-primary" /> Biografia</h4>
                  <p className="text-sm text-muted-foreground pl-6 border-l-2 border-primary/20 ml-2">
                      Com mais de 20 anos de dedicação ao Jiu-Jitsu, Professor {user.name.split(' ')[1]} é faixa preta {user.stripes}º grau, reconhecido por sua técnica refinada e didática excepcional. Sua jornada é marcada por inúmeros títulos e, principalmente, pela formação de centenas de atletas e cidadãos.
                  </p>
              </div>
              <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2"><Medal className="h-4 w-4 text-primary" /> Principais Conquistas</h4>
                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 pl-8">
                      <li>Campeão Mundial IBJJF (2010)</li>
                      <li>Campeão Pan-Americano (2009, 2011)</li>
                      <li>Mestre do Ano - Federação Estadual (2018)</li>
                  </ul>
              </div>
              <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2"><Sparkles className="h-4 w-4 text-primary" /> Especialidades</h4>
                  <div className="flex flex-wrap gap-2 pl-8">
                      <Badge variant="secondary">Guarda De La Riva</Badge>
                      <Badge variant="secondary">Passagem de Pressão</Badge>
                      <Badge variant="secondary">Jiu-Jitsu Infantil</Badge>
                      <Badge variant="secondary">Defesa Pessoal</Badge>
                  </div>
              </div>
          </CardContent>
      </Card>
      )}
    </div>
  );
}
