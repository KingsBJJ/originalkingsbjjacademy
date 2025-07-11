
"use client";

import { useState } from "react";
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Clock, MapPin, Phone, User as UserIcon, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { deleteBranch, type Branch } from "@/lib/firestoreService";
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
import { useRouter } from "next/navigation";

export function BranchCardClient({ branch, userRole }: { branch: Branch, userRole: string }) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleDeleteClick = () => {
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    try {
      await deleteBranch(branch.id);
      toast({
        title: "Filial Excluída!",
        description: `A filial "${branch.name}" foi removida com sucesso.`,
      });
      router.refresh(); // Re-fetches data on the server and re-renders
    } catch (error) {
      console.error("Failed to delete branch:", error);
      toast({
        variant: "destructive",
        title: "Erro ao excluir",
        description: "Não foi possível remover a filial. Tente novamente.",
      });
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
    }
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-start justify-between">
          <CardTitle>{branch.name}</CardTitle>
          {userRole === 'admin' && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Ações</DropdownMenuLabel>
                <DropdownMenuItem asChild>
                   <Link href={`/dashboard/branches/${branch.id}/edit?role=${userRole}`}>Editar</Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="text-red-500" onClick={handleDeleteClick}>
                  Excluir
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-3 text-sm">
            <MapPin className="h-4 w-4 text-primary" />
            <span className="text-muted-foreground">{branch.address}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Phone className="h-4 w-4 text-primary" />
            <span className="text-muted-foreground">{branch.phone}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <UserIcon className="h-4 w-4 text-primary" />
            <span className="font-medium">Responsável:</span>
            <span className="text-muted-foreground">{branch.responsible || 'Não definido'}</span>
          </div>
           {branch.schedule && branch.schedule.length > 0 && (
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1" className="border-b-0">
                  <AccordionTrigger className="p-0 hover:no-underline">
                     <div className="flex items-center gap-3 text-sm font-normal">
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
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isso excluirá permanentemente a filial
              <span className="font-bold"> "{branch.name}"</span> e todos os seus dados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} disabled={isDeleting}>
                {isDeleting ? 'Excluindo...' : 'Continuar'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
