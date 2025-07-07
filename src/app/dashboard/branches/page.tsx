import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { PlusCircle } from "lucide-react";
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { getBranches } from "@/lib/firestoreService";
import { BranchCardClient } from './BranchCardClient';

export default async function BranchesPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const role = searchParams?.role || 'student';
  // Data is fetched on the server, bypassing client-side connection issues.
  const branches = await getBranches();

  return (
    <div className="grid gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Nossas Academias</h1>
          <p className="text-muted-foreground">
            Encontre uma unidade Kings BJJ perto de você.
          </p>
        </div>
        {role === 'admin' && (
            <Button asChild>
                <Link href={`/dashboard/branches/new?role=${role}`}>
                    <PlusCircle />
                    <span>Adicionar Filial</span>
                </Link>
            </Button>
        )}
      </div>

      <div className="space-y-4">
        {branches.length > 0 ? (
          branches.map((branch) => (
            // Each card is now a client component to handle its own state
            <BranchCardClient key={branch.id} branch={branch} userRole={role as string} />
          ))
        ) : (
          <Card>
             <CardContent className="pt-6">
                <p className="text-center text-muted-foreground">Nenhuma filial cadastrada ainda. Clique em "Adicionar Filial" para começar.</p>
             </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
