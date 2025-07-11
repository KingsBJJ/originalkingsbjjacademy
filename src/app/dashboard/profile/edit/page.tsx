
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { getUserByEmail, type User } from '@/lib/firestoreService';
import { EditProfileForm } from './EditProfileForm';
import { KingsBjjLogo } from '@/components/kings-bjj-logo';

export default async function EditProfilePage({
  searchParams,
}: {
  searchParams: { [key:string]: string | string[] | undefined };
}) {
  const email = searchParams?.email as string;
  const user = await getUserByEmail(email);

  if (!user) {
    return (
        <Card className="w-full max-w-md mx-auto mt-10">
            <CardHeader className="text-center">
                <KingsBjjLogo className="h-16 w-16 mx-auto mb-4" />
                <CardTitle>Usuário não encontrado</CardTitle>
            </CardHeader>
            <CardContent className="pt-0 text-center">
                <p className="text-muted-foreground">O perfil que você está tentando editar não existe ou não pôde ser carregado.</p>
            </CardContent>
        </Card>
    );
  }

  return (
    <div className="grid gap-6">
       <div>
        <h1 className="text-3xl font-bold tracking-tight">Editar Perfil</h1>
        <p className="text-muted-foreground">Atualize suas informações pessoais.</p>
      </div>
      <EditProfileForm initialUser={user} />
    </div>
  );
}
