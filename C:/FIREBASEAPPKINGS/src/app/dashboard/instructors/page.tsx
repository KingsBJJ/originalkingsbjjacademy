"use client";

import { useContext, useEffect, useState } from "react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { beltColors, type Instructor } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { UserContext } from "../client-layout";
import { Button } from "@/components/ui/button";
import { PlusCircle, AlertCircle } from "lucide-react";
import { getInstructors } from "@/services/instructorService";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";


const InstructorTableRowSkeleton = () => (
    <TableRow>
        <TableCell>
            <div className="flex items-center gap-3">
                <Skeleton className="h-9 w-9 rounded-full" />
                <div>
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-32 mt-1" />
                </div>
            </div>
        </TableCell>
        <TableCell><Skeleton className="h-4 w-20" /></TableCell>
        <TableCell><Skeleton className="h-6 w-24 rounded-full" /></TableCell>
        <TableCell className="text-right"><Skeleton className="h-4 w-16" /></TableCell>
    </TableRow>
);


export default function InstructorsPage() {
  const user = useContext(UserContext);
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
      async function fetchInstructors() {
          try {
              setIsLoading(true);
              setError(null);
              const fetchedInstructors = await getInstructors();
              setInstructors(fetchedInstructors);
          } catch (err) {
              setError("Não foi possível carregar os professores. Verifique sua conexão e tente novamente.");
              console.error(err);
          } finally {
              setIsLoading(false);
          }
      }
      fetchInstructors();
  }, []);


  if (!user) {
    return <div>Carregando...</div>;
  }

  const displayedInstructors =
    user.role === "admin"
      ? instructors
      : instructors.filter((i) => i.affiliation === user.affiliation);

  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Nossos Professores</h1>
        <p className="text-muted-foreground">
          Aprenda com os melhores do ramo.
        </p>
      </div>

       {error && (
        <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Erro ao Carregar</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
        </Alert>
        )}

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Lista de Professores</CardTitle>
            <CardDescription>
              {user.role === 'admin' 
                ? `Total de ${displayedInstructors.length} professores em todas as filiais.`
                : `Professores da sua filial.`
              }
            </CardDescription>
          </div>
           {user.role === 'admin' && (
            <Button asChild>
                <Link href={`/dashboard/instructors/new?role=${user.role}`}>
                    <PlusCircle />
                    <span>Adicionar Professor</span>
                </Link>
            </Button>
        )}
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Professor</TableHead>
                <TableHead>Filial</TableHead>
                <TableHead>Graduação</TableHead>
                <TableHead className="text-right">Contato</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
                {isLoading ? (
                    <>
                        <InstructorTableRowSkeleton />
                        <InstructorTableRowSkeleton />
                        <InstructorTableRowSkeleton />
                    </>
                ) : displayedInstructors.length > 0 ? (
                    displayedInstructors.map((instructor) => {
                        const beltStyle =
                        beltColors[instructor.belt] || beltColors.Branca;
                        return (
                        <TableRow key={instructor.id}>
                            <TableCell>
                            <div className="flex items-center gap-3">
                                <Avatar className="h-9 w-9">
                                <AvatarImage
                                    src={instructor.avatar}
                                    alt={instructor.name}
                                />
                                <AvatarFallback>
                                    {instructor.name.charAt(0)}
                                </AvatarFallback>
                                </Avatar>
                                <div>
                                <p className="font-medium">{instructor.name}</p>
                                <p className="text-xs text-muted-foreground">{instructor.email}</p>
                                </div>
                            </div>
                            </TableCell>
                            <TableCell>{instructor.affiliation}</TableCell>
                            <TableCell>
                            <Badge
                                className={cn(
                                "text-xs font-semibold",
                                beltStyle.bg,
                                beltStyle.text
                                )}
                            >
                                {instructor.belt}
                                {(instructor.belt === 'Preta' || instructor.belt === 'Coral') && instructor.stripes > 0 && ` - ${instructor.stripes}º Grau`}
                            </Badge>
                            </TableCell>
                            <TableCell className="text-right">{instructor.phone}</TableCell>
                        </TableRow>
                        );
                    })
                ) : (
                    <TableRow>
                        <TableCell colSpan={4} className="h-24 text-center">
                           Nenhum professor encontrado.
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
