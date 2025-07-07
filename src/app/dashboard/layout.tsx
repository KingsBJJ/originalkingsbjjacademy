
import { Suspense } from "react";
import DashboardClientLayout from "./client-layout";
import { KingsBjjLogo } from "@/components/kings-bjj-logo";
import { User, mockUsers } from "@/lib/mock-data";
import { seedInitialData } from "@/lib/firestoreService";

function DashboardLoading() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-4 bg-background">
      <KingsBjjLogo className="h-24 w-24 animate-pulse" />
      <p className="text-muted-foreground">Carregando painel...</p>
    </div>
  );
}

// This is now a Server Component that fetches user data
export default async function DashboardLayout({
  children,
  searchParams,
}: {
  children: React.ReactNode;
  searchParams: { [key: string]: string | string[] | undefined };
}) {

  // Logic to determine user is moved here, to the server
  const role = (searchParams?.role as User['role']) || 'student';
  const name = searchParams?.name as string;
  const email = searchParams?.email as string;
  const affiliation = searchParams?.affiliation as string;
  const branchId = searchParams?.branchId as string;
  const mainInstructor = searchParams?.mainInstructor as string;
  const category = (searchParams?.category as User['category']) || 'Adult';
  const belt = searchParams?.belt as string;
  const stripes = Number(searchParams?.stripes || 0);

  let user: User;

  if (email && name && affiliation && belt) {
      user = {
          id: `user_${email.replace(/[@.]/g, '_')}`,
          name,
          email,
          role,
          affiliation,
          branchId: branchId || '',
          mainInstructor: mainInstructor || '',
          category,
          belt,
          stripes,
          avatar: "https://placehold.co/128x128.png",
          attendance: { total: 0, lastMonth: 0 },
          nextGraduationProgress: 5,
      };
  } else {
    const mockRole = role ? role.split('?')[0] as 'student' | 'professor' | 'admin' : 'student';
    user = mockUsers[mockRole] || mockUsers.student;
  }

  // The unstable database call from the layout has been removed to prevent crashes.
  // Seeding can be done manually from the admin dashboard.

  return (
    <Suspense fallback={<DashboardLoading />}>
      {/* Pass the server-fetched user to the client layout */}
      <DashboardClientLayout user={user}>{children}</DashboardClientLayout>
    </Suspense>
  );
}
