"use client";

import { useContext, useEffect, useState } from "react";
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Clock, MapPin, Phone, User as UserIcon, PlusCircle, MoreVertical } from "lucide-react";
import { UserContext } from "../client-layout";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from "@/components/ui/skeleton";
import { getBranches, type Branch } from "@/lib/firestoreService";
import { useToast } from "@/hooks/use-toast";

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
        <Skeleton className="h-4 w-1/2" />
      </div>
      <div className="flex items-center gap-3">
        <Skeleton className="h-4 w-4 rounded-full" />
        <Skeleton className="h-4 w-1/3" />
      </div>
    </CardContent>
  </Card>
);

export default function BranchesPage() {
  const user = useContext(UserContext);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const fetchedBranches = await getBranches();
        setBranches(fetchedBranches);
      } catch (error) {
        console.error("Failed to fetch branches:", error);
        toast({
          variant: "destructive",
          title: "Erro ao carregar filiais",
          description: "Não foi possível buscar os dados das filiais. Tente novamente mais tarde.",
        });
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchBranches();
    }
  }, [user, toast]);

  const handleActionClick = () => {
    toast({
      title: "Em breve!",
      description: "A funcionalidade de editar e excluir será implementada em breve.",
    });
  };

  if (!user) {
    return (
      <div className="grid gap-6">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-9 w-72 mb-2" />
            <Skeleton className="h-5 w-96" />
          </div>
        </div>
        <div className="space-y-4">
          <BranchCardSkeleton />
          <BranchCardSkeleton />
        </div>
      </div>
    );
  }

  return (
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
                <CardTitle>{branch.name}</CardTitle>
                {user.role === 'admin' && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Ações</DropdownMenuLabel>
                      <DropdownMenuItem onClick={handleActionClick}>Editar</DropdownMenuItem>
                      <DropdownMenuItem className="text-red-500" onClick={handleActionClick}>
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
                  <Clock className="h-4 w-4 text-primary" />
                  <span className="text-muted-foreground">{branch.hours}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <UserIcon className="h-4 w-4 text-primary" />
                  <span className="font-medium">Responsável:</span>
                  <span className="text-muted-foreground">{branch.responsible}</span>
                </div>
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
  );
}
