
import { getBranches, getInstructor } from '@/lib/firestoreService';
import { EditInstructorForm } from './EditInstructorForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { KingsBjjLogo } from '@/components/kings-bjj-logo';
import { User, mockUsers } from "@/lib/mock-data";

export default async function EditInstructorServerPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const role = searchParams?.role as User['role'] || 'student';
  const user = mockUsers[role] || mockUsers.student; // Simulate user for access control
  const instructorId = params.id;

  const [instructor, branches] = await Promise.all([
    getInstructor(instructorId),
    getBranches(),
  ]);

  if (!instructor) {
    return (
      <Card className="w-full max-w-md mx-auto mt-10">
          <CardHeader className="text-center">
            <KingsBjjLogo className="h-16 w-16 mx-auto mb-4" />
            <CardTitle>Professor não encontrado</CardTitle>
          </CardHeader>
          <CardContent className="pt-0 text-center">
            <p className="text-muted-foreground">O professor que você está tentando editar não existe ou foi removido.</p>
          </CardContent>
      </Card>
    );
  }
  
  return (
    <EditInstructorForm 
      user={user}
      initialInstructor={instructor} 
      branches={branches}
    />
  );
}
