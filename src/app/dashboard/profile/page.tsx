
"use client";

import { useContext } from "react";
import Link from "next/link";
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
    // TODO: Add a proper loading skeleton here
    return <div>Carregando perfil...</div>;
  }

  const roleNames = {
    student: 'Aluno',
    professor: 'Professor',
    admin: 'Admin'
  };

  const beltStyle = beltColors[user.belt as keyof typeof beltColors] || beltColors.Branca;

  const getHref = (href: string) => {
    if (!user) return href;
    const params = new URLSearchParams();
    if (user.role) params.set('role', user.role);
    if (user.email) params.set('email', user.email);
    if (user.name) params.set('name', user.name);
    return `${href}?${params.toString()}`;
  };

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
            {user.affiliations && user.affiliations.join(', ')}
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
        <Button asChild>
          <Link href={getHref('/dashboard/profile/edit')}>Editar Perfil</Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Informações de Contato</CardTitle>
            <CardDescription>
                Seus detalhes de contato e afiliação.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
             <div className="flex justify-between">
                <span className="font-medium text-muted-foreground">Professor Principal:</span>
                <span>{user.mainInstructor || 'Não definido'}</span>
            </div>
             <div className="flex justify-between">
                <span className="font-medium text-muted-foreground">Telefone:</span>
                <span>{user.phone || 'Não informado'}</span>
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
                <span className="capitalize">{roleNames[user.role]}</span>
            </div>
             <div className="flex justify-between">
                <span className="font-medium text-muted-foreground">Data de Nascimento:</span>
                <span>{user.dateOfBirth || 'Não informada'}</span>
            </div>
             <div className="flex justify-between">
                <span className="font-medium text-muted-foreground">Categoria:</span>
                <span>{user.category}</span>
            </div>
             <div className="flex justify-between">
                <span className="font-medium text-muted-foreground">Plano:</span>
                <span>Plano Ouro</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Medal className="text-primary" />
              Progresso de Graduação
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">
                  Próxima Graduação: Faixa Roxa
                </span>
                <span className="text-muted-foreground">{user.nextGraduationProgress}%</span>
              </div>
              <Progress value={user.nextGraduationProgress} />
              <p className="text-xs text-muted-foreground">
                Baseado em frequência, tempo e avaliação do professor.
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="text-yellow-400" />
              Frequência
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-baseline justify-center gap-4">
            <div>
              <p className="text-4xl font-bold">{user.attendance.lastMonth}</p>
              <p className="text-sm text-muted-foreground">Aulas no Mês</p>
            </div>
            <div className="h-12 border-l" />
            <div>
              <p className="text-4xl font-bold">{user.attendance.total}</p>
              <p className="text-sm text-muted-foreground">Aulas Totais</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen />
            Histórico de Presença
          </CardTitle>
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
              {mockAttendanceHistory.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.date}</TableCell>
                  <TableCell>{item.class}</TableCell>
                  <TableCell className="text-right">
                    <Badge variant="secondary">{item.status}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
