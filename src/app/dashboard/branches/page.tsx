import Link from 'next/link';
import { Suspense } from 'react';
import { PlusCircle, MapPin, Phone, User as UserIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { getBranches, type Branch, type User } from '@/lib/firestoreService';
import { mockUsers } from '@/lib/mock-data';
import { BranchActions } from './BranchActionsClient';
import { Skeleton } from '@/components/ui/skeleton';

const BranchesGridSkeleton = () => (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
                <CardHeader className="flex flex-row items-start justify-between">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-8 w-8" />
                </CardHeader>
                <CardContent className="space-y-3 pt-4">
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
                             <div className="space-y-3 pt-2">
                                <p className="text-sm text-muted-foreground flex items-start gap-2 pt-2">
                                    <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
                                    <span>{branch.address}</span>
                                </p>
                                <p className="text-sm text-muted-foreground flex items-center gap-2 pt-2">
                                    <Phone className="h-4 w-4 shrink-0" />
                                    <span>{branch.phone}</span>
                                </p>
                                {branch.responsible && (
                                    <p className="text-sm text-muted-foreground flex items-center gap-2 pt-2">
                                        <UserIcon className="h-4 w-4 shrink-0" />
                                        <strong>Responsável:</strong> {branch.responsible}
                                    </p>
                                )}
                            </div>
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
  const role = searchParams?.role as User['role'] | undefined;
  
  // Use a mock user based on the role from URL for server-side permission checks.
  // The full user state is managed on the client in `client-layout.tsx`.
  const user = role ? mockUsers[role] : null;

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
