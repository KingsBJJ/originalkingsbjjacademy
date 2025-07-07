
"use client";

import { useContext, useState, useEffect } from "react";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { beltColors } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { UserContext } from "../client-layout";
import { Button } from "@/components/ui/button";
import { PlusCircle, MoreHorizontal } from "lucide-react";
import { onInstructorsUpdate, deleteInstructor, type Instructor } from "@/lib/firestoreService";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

const InstructorRowSkeleton = () => (
  <TableRow>
    <TableCell>
      <div className="flex items-center gap-3">
        <Skeleton className="h-9 w-9 rounded-full" />
        <div>
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-40 mt-1" />
        </div>
      </div>
    </TableCell>
    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
    <TableCell><Skeleton className="h-5 w-20 rounded-full" /></TableCell>
    <TableCell><Skeleton className="h-4 w-28" /></TableCell>
    <TableCell className="text-right"><Skeleton className="h-8 w-8" /></TableCell>
  </TableRow>
);

export default function InstructorsPage() {
  const user = useContext(UserContext);
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [instructorToDelete, setInstructorToDelete] = useState<Instructor | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    setLoading(true);
    const unsubscribe = onInstructorsUpdate((fetchedInstructors) => {
      setInstructors(fetchedInstructors);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleDeleteClick = (instructor: Instructor) => {
    setInstructorToDelete(instructor);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!instructorToDelete) return;
    try {
      await deleteInstructor(instructorToDelete.id);
      // The list will update automatically via the onSnapshot listener
      toast({
        title: "Professor Excluído!",
        description: `O professor "${instructorToDelete.name}" foi removido com sucesso.`,
      });
    } catch (error) {
      console.error("Failed to delete instructor:", error);
      toast({
        variant: "destructive",
        title: "Erro ao excluir",
        description: "Não foi possível remover o professor. Tente novamente.",
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setInstructorToDelete(null);
    }
  };


  if (!user) {
    return <div>Carregando...</div>;
  }

  const displayedInstructors = instructors;

  return (
    <>
      <div className="grid gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Nossos Professores</h1>
          <p className="text-muted-foreground">
            Aprenda com os melhores do ramo.
          </p>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Lista de Professores</CardTitle>
              <CardDescription>
                {`Total de ${displayedInstructors.length} professores em todas as filiais.`}
              </CardDescription>
            </div>
            {(user.role === 'admin' || user.role === 'professor') && (
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
                  <TableHead>Filiais</TableHead>
                  <TableHead>Graduação</TableHead>
                  <TableHead>Contato</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array.from({ length: 4 }).map((_, i) => <InstructorRowSkeleton key={i} />)
                ) : displayedInstructors.length > 0 ? (
                  displayedInstructors.map((instructor) => {
                    const beltKey = instructor.belt as keyof typeof beltColors;
                    const beltStyle = beltColors[beltKey] || beltColors.Branca;
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
                        <TableCell>{instructor.affiliations?.join(', ') || 'Nenhuma'}</TableCell>
                        <TableCell>
                          <Badge
                            className={cn(
                              "text-xs font-semibold",
                              beltStyle.bg,
                              beltStyle.text
                            )}
                          >
                            {instructor.belt}
                            {(instructor.belt === 'Preta' || instructor.belt === 'Coral') && instructor.stripes && instructor.stripes > 0 && ` - ${instructor.stripes}º Grau`}
                          </Badge>
                        </TableCell>
                        <TableCell>{instructor.phone}</TableCell>
                        <TableCell className="text-right">
                          {user.role === 'admin' && (
                              <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                      <Button variant="ghost" size="icon" className="h-8 w-8">
                                          <MoreHorizontal className="h-4 w-4" />
                                      </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                      <DropdownMenuLabel>Ações</DropdownMenuLabel>
                                      <DropdownMenuItem asChild>
                                          <Link href={`/dashboard/instructors/${instructor.id}/edit?role=${user.role}`}>Editar</Link>
                                      </DropdownMenuItem>
                                      <DropdownMenuItem className="text-red-500" onClick={() => handleDeleteClick(instructor)}>
                                          Excluir
                                      </DropdownMenuItem>
                                  </DropdownMenuContent>
                              </DropdownMenu>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                    <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center">
                            Nenhum professor cadastrado ainda.
                        </TableCell>
                    </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isso excluirá permanentemente o professor
              <span className="font-bold"> "{instructorToDelete?.name}"</span>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>Continuar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
