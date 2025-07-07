import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { getInstructors } from "@/lib/firestoreService";
import { InstructorTableRowClient } from './InstructorTableRowClient';

export default async function InstructorsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const role = (searchParams?.role || 'student') as 'admin' | 'professor' | 'student';
  const instructors = await getInstructors();
  
  return (
      <div className="grid gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Nossos Professores</h1>
          <p className="text-muted-foreground">
            Aprenda com os melhores do ramo.
          </p>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Lista de Professores</CardTitle>
              <CardDescription>
                {`Total de ${instructors.length} professores em todas as filiais.`}
              </CardDescription>
            </div>
            {(role === 'admin' || role === 'professor') && (
              <Button asChild>
                  <Link href={`/dashboard/instructors/new?role=${role}`}>
                      <PlusCircle />
                      <span>Adicionar Professor</span>
                  </Link>
              </Button>
          )}
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Professor</TableHead>
                  <TableHead>Filiais</TableHead>
                  <TableHead>Graduação</TableHead>
                  <TableHead>Contato</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {instructors.length > 0 ? (
                  instructors.map((instructor) => (
                    <InstructorTableRowClient key={instructor.id} instructor={instructor} userRole={role} />
                  ))
                ) : (
                    <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center">
                            Nenhum professor cadastrado ainda.
                        </TableCell>
                    </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
  );
}
