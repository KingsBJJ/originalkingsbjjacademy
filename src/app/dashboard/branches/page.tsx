import { Suspense } from 'react';
import Link from 'next/link';
import { PlusCircle, MapPin, Phone, User as UserIcon, Clock } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { getBranches } from '@/lib/firestoreService';
import { BranchActions } from './BranchActionsClient';
import { mockUsers } from '@/lib/mock-data';

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

async function BranchesList({ role }: { role: 'admin' | 'professor' | 'student' }) {
  const branches = await getBranches();
  const user = role ? mockUsers[role] : null;

  return (
    <div className="space-y-4">
      {branches.length > 0 ? (
        branches.map((branch) => (
          <Card key={branch.id}>
            <CardHeader className="flex flex-row items-start justify-between">
              <CardTitle>{branch.name}</CardTitle>
              <BranchActions branch={branch} user={user} />
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
        ))
      ) : (
        <Card>
           <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">Nenhuma filial cadastrada ainda.</p>
           </CardContent>
        </Card>
      )}
    </div>
  );
}

export default function BranchesPage({ searchParams }: { searchParams: { role?: 'admin' | 'professor' | 'student' } }) {
  const role = searchParams.role || 'student';

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

      <Suspense fallback={
        <div className="space-y-4">
          <BranchCardSkeleton />
          <BranchCardSkeleton />
        </div>
      }>
        <BranchesList role={role} />
      </Suspense>
    </div>
  );
}
