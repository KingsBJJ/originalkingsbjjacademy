
import Link from 'next/link';
import { Suspense } from 'react';
import { PlusCircle, MapPin, Phone } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { getBranches, getAppUser, type Branch, type User } from '@/lib/firestoreService';
import { mockUsers } from '@/lib/mock-data';
import { BranchActions } from './BranchActionsClient';
import { Skeleton } from '@/components/ui/skeleton';

const BranchesGridSkeleton = () => (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
                <CardHeader>
                    <Skeleton className="h-6 w-3/4" />
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full mt-2" />
                    </div>
                </CardContent>
            </Card>
        ))}
    </div>
);

async function BranchesList({ user }: { user: User | null }) {
    const branches = await getBranches();

    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {branches.length > 0 ? (
                branches.map((branch) => (
                    <Card key={branch.id}>
                        <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                            <CardTitle className="text-xl font-bold">{branch.name}</CardTitle>
                            <BranchActions branch={branch} user={user} />
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground flex items-start gap-2 pt-2">
                                <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
                                <span>{branch.address}</span>
                            </p>
                            <p className="text-sm text-muted-foreground flex items-center gap-2 pt-2">
                                <Phone className="h-4 w-4 shrink-0" />
                                <span>{branch.phone}</span>
                            </p>
                            {branch.responsible && (
                                <p className="text-sm text-muted-foreground pt-2">
                                    <strong>Responsável:</strong> {branch.responsible}
                                </p>
                            )}
                        </CardContent>
                    </Card>
                ))
            ) : (
                <Card className="md:col-span-2 lg:col-span-3">
                    <CardContent className="flex h-48 flex-col items-center justify-center text-center">
                        <h3 className="text-xl font-semibold">Nenhuma Filial Cadastrada</h3>
                        <p className="text-muted-foreground">
                            {user?.role === 'admin' 
                                ? 'Cadastre a primeira filial para começar.' 
                                : 'Aguarde o cadastro das filiais.'
                            }
                        </p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}

export default async function BranchesPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const email = searchParams.email as string | undefined;
  const role = searchParams.role as 'student' | 'professor' | 'admin' | undefined;
  
  let user: User | null = null;
  if (email === 'admin@kings.com' || email === 'admin@kingsbjj.com') {
      user = mockUsers.admin;
  } else if (email === 'professor@kingsbjj.com') {
      user = mockUsers.professor;
  } else if (role) {
      user = await getAppUser(role);
  } else {
      user = null; // Default to no user if no info
  }


  return (
    <div className="grid gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Filiais</h1>
          <p className="text-muted-foreground">
            Encontre todas as nossas unidades de treinamento.
          </p>
        </div>
        {user?.role === 'admin' && (
          <Button asChild>
            <Link href={`/dashboard/branches/new?role=${user.role}`}>
              <PlusCircle className="mr-2" />
              Adicionar Filial
            </Link>
          </Button>
        )}
      </div>
      <Suspense fallback={<BranchesGridSkeleton />}>
        <BranchesList user={user} />
      </Suspense>
    </div>
  );
}
