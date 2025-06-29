"use client";

import { useContext, useEffect, useState } from "react";
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Clock, MapPin, Phone, User as UserIcon, PlusCircle, AlertCircle } from "lucide-react";
import { UserContext } from "../client-layout";
import { Button } from "@/components/ui/button";
import { getBranches } from "@/services/branchService";
import type { Branch } from "@/lib/mock-data";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";


const BranchSkeleton = () => (
    <Card>
        <CardHeader>
            <Skeleton className="h-6 w-1/2" />
        </CardHeader>
        <CardContent className="space-y-3">
             <div className="flex items-center gap-3">
                <Skeleton className="h-4 w-4 rounded-full" />
                <Skeleton className="h-4 w-3/4" />
            </div>
             <div className="flex items-center gap-3">
                <Skeleton className="h-4 w-4 rounded-full" />
                <Skeleton className="h-4 w-1/2" />
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
)


export default function BranchesPage() {
  const user = useContext(UserContext);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBranches() {
      try {
        setIsLoading(true);
        setError(null);
        const fetchedBranches = await getBranches();
        setBranches(fetchedBranches);
      } catch (err) {
        setError("Não foi possível carregar as filiais. Verifique sua conexão com o Firebase.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchBranches();
  }, []);


  if (!user) {
    return <div>Carregando...</div>;
  }

  const displayedBranches =
    user.role === "admin"
      ? branches
      : branches.filter((b) => b.id === user.branchId);

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

       {error && (
            <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Erro de Conexão</AlertTitle>
                <AlertDescription>
                    {error} Certifique-se de que suas credenciais do Firebase estão corretas no arquivo `.env.local`.
                </AlertDescription>
            </Alert>
        )}

      <div className="space-y-4">
        {isLoading ? (
            <>
                <BranchSkeleton />
                <BranchSkeleton />
            </>
        ) : displayedBranches.length > 0 ? (
          displayedBranches.map((branch) => (
            <Card key={branch.id}>
              <CardHeader>
                <CardTitle>{branch.name}</CardTitle>
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
                <CardContent className="pt-6 text-center text-muted-foreground">
                   Nenhuma filial encontrada. Comece adicionando uma nova filial.
                </CardContent>
            </Card>
        )}
      </div>
    </div>
  );
}
