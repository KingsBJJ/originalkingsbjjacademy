
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Clock } from "lucide-react";
import { getBranches, type ClassScheduleItem } from "@/lib/firestoreService";
import { User, mockUsers } from "@/lib/mock-data";

type ClassWithBranch = ClassScheduleItem & { branchName: string };

const ClassListRenderer = ({ classes, userRole }: { classes: ClassWithBranch[], userRole: User['role'] }) => {
    if (classes.length === 0) {
      return (
          <CardContent>
              <p className="text-sm text-center text-muted-foreground pt-6">Nenhuma aula disponível para sua filial.</p>
          </CardContent>
      );
    }
    return (
        <CardContent className="space-y-4">
        {classes.map((item, index) => (
            <div
            key={index}
            className="flex items-center justify-between rounded-lg border p-4"
            >
            <div>
                <p className="font-semibold">{item.name}</p>
                <p className="text-sm text-muted-foreground">
                 <span className="text-primary font-medium">{item.instructor}</span> {userRole === 'admin' && `(${item.branchName})`}
                </p>
            </div>
            <div className="flex items-center gap-4 text-right">
                <div className="flex flex-col items-end gap-1 text-sm">
                    <span>{item.day}</span>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-primary" />
                      <span>{item.time}</span>
                    </div>
                </div>
            </div>
            </div>
        ))}
        </CardContent>
    );
};

export default async function SchedulePage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const role = (searchParams?.role || 'student') as User['role'];
  
  // Get user details from URL or mock data to determine affiliation
  const affiliationFromParams = searchParams?.affiliation as string;
  
  // Use a mock user to get affiliations for server-side rendering logic.
  // The actual, full user object is handled on the client.
  const userFromMock = mockUsers[role] || mockUsers.student;
  const userAffiliations = affiliationFromParams 
      ? [affiliationFromParams] 
      : userFromMock.affiliations;

  const branches = await getBranches();

  // Flatten all class schedules from all branches into a single array
  const allClasses = branches.flatMap(branch => 
      (branch.schedule ?? []).map(item => ({
          ...item,
          branchName: branch.name,
      }))
  );

  // Filter classes based on user role and affiliation
  const displayedClasses = role === "admin"
      ? allClasses // Admin sees all classes
      : allClasses.filter((c) => userAffiliations.includes(c.branchName)); // Students/professors see their branch's classes

  const adultClasses = displayedClasses.filter(c => c.category === "Adults");
  const kidsClasses = displayedClasses.filter(c => c.category === "Kids");

  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Horários das Aulas</h1>
        <p className="text-muted-foreground">
          Encontre sua próxima aula e planeje sua semana.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Aulas para Adultos</CardTitle>
          <CardDescription>
            Horário de todas as aulas de Adulto com e sem kimono.
          </CardDescription>
        </CardHeader>
        <ClassListRenderer classes={adultClasses} userRole={role} />
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Aulas para Crianças</CardTitle>
          <CardDescription>
            Aulas de jiu-jitsu divertidas e seguras para os pequenos.
          </CardDescription>
        </CardHeader>
        <ClassListRenderer classes={kidsClasses} userRole={role} />
      </Card>
    </div>
  );
}
