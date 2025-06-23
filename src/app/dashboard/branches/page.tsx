"use client";

import { useContext } from "react";
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { mockBranches } from "@/lib/mock-data";
import { Clock, MapPin, Phone, User as UserIcon, PlusCircle } from "lucide-react";
import { UserContext } from "../client-layout";
import { Button } from "@/components/ui/button";

export default function BranchesPage() {
  const user = useContext(UserContext);

  if (!user) {
    return <div>Carregando...</div>;
  }

  const displayedBranches =
    user.role === "admin"
      ? mockBranches
      : mockBranches.filter((b) => b.id === user.branchId);

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
        {displayedBranches.map((branch) => (
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
        ))}
      </div>
    </div>
  );
}
