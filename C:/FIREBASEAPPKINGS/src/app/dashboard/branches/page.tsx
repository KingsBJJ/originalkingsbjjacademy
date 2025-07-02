"use client";

import { useContext, useEffect, useState } from "react";
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Clock, MapPin, Phone, User as UserIcon, PlusCircle, MoreVertical, AlertCircle } from "lucide-react";
import { UserContext } from "../client-layout";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from "@/components/ui/skeleton";
import { getBranches, deleteBranch, type Branch } from "@/services/branchService";
import { useToast } from "@/hooks/use-toast";
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
import { Badge } from "@/components/ui/badge";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";


const BranchCardSkeleton = () => (
  <Card>
    <CardHeader>
      <Skeleton className="h-6 w-48" />
    </CardHeader>
    <CardContent className="space-y-3">
      <div className="flex items-center gap-3">
        <Skeleton className="h-4 w-4 rounded-full" />
        <Skeleton className="h-4 w-full" />
      </div>
      <div className="flex items-center gap-3">
        <Skeleton className="h-4 w-4 rounded-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
      <div className="flex items-center gap-3">
        <Skeleton className="h-4 w-4 rounded-full" />
        <Skeleton className="h-4 w-1/3" />
      </div>
      <div className="flex items-center gap-3">
        <Skeleton className="h-4 w-4 rounded-full" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    </CardContent>
  </Card>
);

export default function BranchesPage() {
  const user = useContext(UserContext);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [branchToDelete, setBranchToDelete] = useState<Branch | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        setLoading(true);
        setError(null);
        const fetchedBranches = await getBranches();
        setBranches(fetchedBranches);
      } catch (error) {
        console.error("Failed to fetch branches:", error);
        setError("Não foi possível carregar as filiais. Verifique sua conexão e tente novamente.");
      } finally {
        setLoading(false);
      }
    };

    fetchBranches();
  }, []);

  const handleDeleteClick = (branch: Branch) => {
    setBranchToDelete(branch);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!branchToDelete) return;
    try {
      await deleteBranch(branchToDelete.id);
      setBranches(branches.filter(b => b.id !== branchToDelete.id));
      toast({
        title: "Filial Excluída!",
        description: `A filial "${branchToDelete.name}" foi removida com sucesso.`,
      });
    } catch (error) {
      console.error("Failed to delete branch:", error);
      toast({
        variant: "destructive",
        title: "Erro ao excluir",
        description: "Não foi possível remover a filial. Tente novamente.",
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setBranchToDelete(null);
    }
  };

  if (!user) {
    return <BranchCardSkeleton/>;
  }
  
  return (
    <>
      <div className="grid gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Nossas Academias</h1>
            <p className="text-muted-foreground">
              Encontre uma unidade Kings BJJ perto de você.
            </p>
          </div>
          {user.role === 'admin' && (
              <Button asChild>
                  <Link href={`/dashboard/branches/new?role=${user.role}`}>
                      <PlusCircle />
                      <span>Adicionar Filial</span>
                  </Link>
              </Button>
          )}
        </div>

        {error && (
            <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Erro de Conexão</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}

        <div className="space-y-4">
          {loading ? (
            <>
              <BranchCardSkeleton />
              <BranchCardSkeleton />
            </>
          ) : branches.length > 0 ? (
            branches.map((branch) => (
              <Card key={branch.id}>
                <CardHeader className="flex flex-row items-start justify-between">
                    <div>
                        <CardTitle>{branch.name}</CardTitle>
                        <CardDescription>{branch.address}</CardDescription>
                    </div>
                  {user.role === 'admin' && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Ações</DropdownMenuLabel>
                        <DropdownMenuItem asChild>
                           <Link href={`/dashboard/branches/${branch.id}/edit?role=${user.role}`}>Editar</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-500" onClick={() => handleDeleteClick(branch)}>
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="h-4 w-4 text-primary" />
                    <span className="text-muted-foreground">{branch.phone}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Clock className="h-4 w-4 text-primary" />
                    <span className="text-muted-foreground">{branch.hours}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <UserIcon className="h-4 w-4 text-primary" />
                    <span className="font-medium">Responsável:</span>
                    <span className="text-muted-foreground">{branch.responsible}</span>
                  </div>
                   {branch.schedule && branch.schedule.length > 0 && (
                      <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="item-1" className="border-b-0">
                          <AccordionTrigger className="p-0 hover:no-underline text-sm font-medium">
                             <div className="flex items-center gap-3">
                                <Clock className="h-4 w-4 text-primary" />
                                <span>Ver Horários das Aulas</span>
                              </div>
                          </AccordionTrigger>
                          <AccordionContent className="pt-2">
                             <div className="space-y-2 rounded-md border p-2">
                                {branch.schedule.map((item, index) => (
                                    <div key={index} className="flex items-center justify-between text-xs p-2 rounded-md bg-muted/50">
                                        <div>
                                            <p className="font-medium">{item.name} <Badge variant="secondary" className="ml-1">{item.category === 'Adults' ? 'Adulto' : 'Kids'}</Badge></p>
                                            <p className="text-muted-foreground">{item.day}, {item.time}</p>
                                        </div>
                                        <p className="text-muted-foreground">{item.instructor}</p>
                                    </div>
                                ))}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                   )}
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
               <CardContent className="pt-6">
                  <p className="text-center text-muted-foreground">Nenhuma filial cadastrada ainda.</p>
               </CardContent>
            </Card>
          )}
        </div>
      </div>
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isso excluirá permanentemente a filial
              <span className="font-bold"> "{branchToDelete?.name}"</span> e todos os seus dados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive hover:bg-destructive/90">Continuar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
