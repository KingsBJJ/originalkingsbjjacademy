
"use client";

import { useState } from "react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  TableCell,
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
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { deleteInstructor, type Instructor } from "@/lib/firestoreService";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

export function InstructorTableRowClient({ instructor, userRole }: { instructor: Instructor, userRole: 'admin' | 'professor' | 'student' }) {
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const { toast } = useToast();
    const router = useRouter();

    const beltKey = instructor.belt as keyof typeof beltColors;
    const beltStyle = beltColors[beltKey] || beltColors.Branca;

    const handleDeleteClick = () => {
        setIsDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        setIsDeleting(true);
        try {
            await deleteInstructor(instructor.id);
            toast({
                title: "Professor Excluído!",
                description: `O professor "${instructor.name}" foi removido com sucesso.`,
            });
            router.refresh();
        } catch (error) {
            console.error("Failed to delete instructor:", error);
            toast({
                variant: "destructive",
                title: "Erro ao excluir",
                description: "Não foi possível remover o professor. Tente novamente.",
            });
        } finally {
            setIsDeleting(false);
            setIsDeleteDialogOpen(false);
        }
    };

    return (
        <>
            <TableRow>
                <TableCell>
                    <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                            <AvatarImage src={instructor.avatar} alt={instructor.name} />
                            <AvatarFallback>{instructor.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="font-medium">{instructor.name}</p>
                            <p className="text-xs text-muted-foreground">{instructor.email}</p>
                        </div>
                    </div>
                </TableCell>
                <TableCell>{instructor.affiliations?.join(', ') || 'Nenhuma'}</TableCell>
                <TableCell>
                    <Badge className={cn("text-xs font-semibold", beltStyle.bg, beltStyle.text)}>
                        {instructor.belt}
                        {(instructor.belt === 'Preta' || instructor.belt === 'Coral') && instructor.stripes && instructor.stripes > 0 && ` - ${instructor.stripes}º Grau`}
                    </Badge>
                </TableCell>
                <TableCell>{instructor.phone}</TableCell>
                <TableCell className="text-right">
                    {userRole === 'admin' && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Ações</DropdownMenuLabel>
                                <DropdownMenuItem asChild>
                                    <Link href={`/dashboard/instructors/${instructor.id}/edit?role=${userRole}`}>Editar</Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-red-500" onClick={handleDeleteClick}>Excluir</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </TableCell>
            </TableRow>
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta ação não pode ser desfeita. Isso excluirá permanentemente o professor
                            <span className="font-bold"> "{instructor.name}"</span>.
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

