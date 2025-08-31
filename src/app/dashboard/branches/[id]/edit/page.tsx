
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { getBranch, getInstructors } from '@/lib/firestoreService';
import { EditBranchForm } from './EditBranchForm';
import { KingsBjjLogo } from '@/components/kings-bjj-logo';
import { User, mockUsers } from "@/lib/mock-data";

// Generate static params for static export
export async function generateStaticParams() {
  return [
    { id: 'example' },
    { id: 'test' },
  ];
}

// This is now a Server Component
export default async function EditBranchPage({
  params,
  
}: {
  params: { id: string };
  
}) {

  const role: User["role"] = "student";
  const user = mockUsers[role] || mockUsers.student; // Simulate user for access control
  const branchId = params.id;

  // Data is fetched on the server
  const [branch, instructors] = await Promise.all([
    getBranch(branchId),
    getInstructors(),
  ]);

  if (!branch) {
    return (
        <Card className="w-full max-w-md mx-auto mt-10">
            <CardContent className="pt-6 text-center">
                <KingsBjjLogo className="h-16 w-16 mx-auto mb-4" />
                <h2 className="text-xl font-bold">Filial não encontrada</h2>
                <p className="text-muted-foreground">A filial que você está tentando editar não existe ou foi removida.</p>
            </CardContent>
        </Card>
    );
  }
  
  // The interactive form is a Client Component, receiving data as props
  return (
    <EditBranchForm 
      user={user}
      initialBranch={branch} 
      instructors={instructors} 
    />
  );
}
