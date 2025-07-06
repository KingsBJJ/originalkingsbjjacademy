
"use client";

import { useContext, useState, useEffect } from "react";
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
import {
  allBelts,
  allBeltsKids,
  beltColors,
  beltColorsKids,
  beltInfo,
  beltInfoKids,
} from "@/lib/mock-data";
import { getStudents, type Student } from "@/lib/firestoreService";
import { cn } from "@/lib/utils";
import { CheckCircle, GraduationCap } from "lucide-react";
import { UserContext } from "../client-layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";

type BeltListItemProps = {
  belt: string;
  stripes: number;
  isCurrentUser?: boolean;
  beltColors: Record<string, { bg: string; text: string }>;
  beltInfo: Record<string, { description: string; skills: string[] }>;
};

const BeltListItem = ({
  belt,
  stripes,
  isCurrentUser,
  beltColors,
  beltInfo,
}: BeltListItemProps) => {
  const beltStyle = beltColors[belt];
  const info = beltInfo[belt];

  if (!beltStyle || !info) return null;

  return (
    <Card
      className={cn(
        "transition-all duration-300",
        isCurrentUser
          ? "border-primary shadow-lg shadow-primary/20 ring-2 ring-primary"
          : "border-border",
        "hover:bg-primary/10 transition-colors"
      )}
    >
      <CardContent className="flex flex-col gap-6 p-4 md:flex-row md:items-center md:p-6">
        <div className="w-full md:w-1/3 lg:w-1/4">
          <div
            className={cn(
              "relative flex h-10 w-full items-center justify-end rounded-md pr-4 shadow-inner",
              beltStyle.bg
            )}
          >
            <div className="absolute inset-0 h-full w-full rounded-md bg-black/10" />
            <div className="relative h-full w-16 bg-black/70">
              <div className="absolute inset-y-0 right-3 flex items-center gap-1.5">
                {isCurrentUser && belt !== 'Preta' && belt !== 'Coral' &&
                  Array.from({ length: stripes }).map((_, i) => (
                    <div key={i} className="h-8 w-1.5 bg-zinc-300" />
                  ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold tracking-wider">
              Faixa {belt}
              {isCurrentUser && (belt === 'Preta' || belt === 'Coral') && stripes > 0 && (
                <span className="text-lg"> - {stripes}º Grau</span>
              )}
            </h3>
            {isCurrentUser && (
              <Badge
                variant="outline"
                className="shrink-0 border-primary text-primary"
              >
                <CheckCircle className="mr-1.5 h-3.5 w-3.5" />
                Sua Graduação
              </Badge>
            )}
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            {info.description}
          </p>
          <div className="mt-4">
            <h4 className="mb-2 text-sm font-semibold text-foreground">
              Habilidades Chave:
            </h4>
            <div className="flex flex-wrap gap-2">
              {info.skills.map((skill) => (
                <Badge key={skill} variant="secondary" className="font-normal">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const GraduationPlan = () => {
    const user = useContext(UserContext);
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getStudents().then(data => {
            setStudents(data);
            setLoading(false);
        }).catch(console.error);
    }, []);

    const allBeltColors = { ...beltColors, ...beltColorsKids };
    
    if (!user) return null;

    const displayedStudents = user.role === 'admin'
        ? students
        : students.filter(s => s.affiliation === user.affiliation);

    return (
        <Card className="mt-8">
        <CardHeader>
            <CardTitle className="flex items-center gap-2">
            <GraduationCap />
            Plano de Graduação de Alunos
            </CardTitle>
            <CardDescription>
            {user.role === 'admin'
                ? 'Acompanhe e promova o progresso dos alunos para a próxima graduação.'
                : 'Acompanhe e promova o progresso dos alunos da sua filial.'
            }
            </CardDescription>
        </CardHeader>
        <CardContent>
            <Table>
            <TableHeader>
                <TableRow>
                <TableHead>Aluno</TableHead>
                <TableHead>Filial</TableHead>
                <TableHead>Graduação Atual</TableHead>
                <TableHead className="w-[250px]">Progresso para Próxima</TableHead>
                <TableHead className="text-right">Ações</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {loading ? (
                    Array.from({length: 5}).map((_, i) => (
                        <TableRow key={i}>
                            <TableCell><div className="flex items-center gap-2"><Skeleton className="h-9 w-9 rounded-full" /><Skeleton className="h-4 w-32" /></div></TableCell>
                            <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                            <TableCell><Skeleton className="h-5 w-20 rounded-full" /></TableCell>
                            <TableCell><Skeleton className="h-4 w-full" /></TableCell>
                            <TableCell className="text-right"><Skeleton className="h-8 w-20" /></TableCell>
                        </TableRow>
                    ))
                ) : displayedStudents.map((student) => {
                const beltStyle = allBeltColors[student.belt as keyof typeof allBeltColors] || beltColors.Branca;
                return (
                    <TableRow key={student.id}>
                    <TableCell>
                        <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                            <AvatarImage
                            src={student.avatar}
                            alt={student.name}
                            />
                            <AvatarFallback>{student.name[0]}</AvatarFallback>
                        </Avatar>
                        <p className="font-medium">{student.name}</p>
                        </div>
                    </TableCell>
                    <TableCell>{student.affiliation}</TableCell>
                    <TableCell>
                        <Badge
                        className={cn(
                            "text-xs font-semibold",
                            beltStyle.bg,
                            beltStyle.text
                        )}
                        >
                        {student.belt}
                        {(student.belt === 'Preta' || student.belt === 'Coral') && student.stripes > 0 && ` - ${student.stripes}º Grau`}
                        </Badge>
                    </TableCell>
                    <TableCell>
                        <div className="flex items-center gap-3">
                        <Progress
                            value={student.nextGraduationProgress}
                            className="h-2"
                        />
                        <span className="text-xs font-medium text-muted-foreground">
                            {student.nextGraduationProgress}%
                        </span>
                        </div>
                    </TableCell>
                    <TableCell className="text-right">
                        <Button size="sm">Promover</Button>
                    </TableCell>
                    </TableRow>
                );
                })}
            </TableBody>
            </Table>
        </CardContent>
        </Card>
    );
};

export default function RankingsPage() {
  const user = useContext(UserContext);

  if (!user) {
    return <div>Carregando...</div>;
  }

  const canManageGraduation =
    user.role === "admin" || user.role === "professor";

  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Sistema de Graduação BJJ
        </h1>
        <p className="text-muted-foreground">
          O caminho de progressão no Jiu-Jitsu Brasileiro.
        </p>
      </div>

      <Tabs defaultValue="adults" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="adults">Adulto</TabsTrigger>
          <TabsTrigger value="kids">Infantil</TabsTrigger>
        </TabsList>
        <TabsContent value="adults" className="mt-4">
          <div className="space-y-4">
            {allBelts.map((belt) => (
              <BeltListItem
                key={belt}
                belt={belt}
                beltColors={beltColors}
                beltInfo={beltInfo}
                stripes={user.belt === belt ? user.stripes : 0}
                isCurrentUser={user.belt === belt}
              />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="kids" className="mt-4">
          <div className="space-y-4">
            {allBeltsKids.map((belt) => (
              <BeltListItem
                key={belt}
                belt={belt}
                beltColors={beltColorsKids}
                beltInfo={beltInfoKids}
                stripes={0}
                isCurrentUser={false}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {canManageGraduation && <GraduationPlan />}
    </div>
  );
}
