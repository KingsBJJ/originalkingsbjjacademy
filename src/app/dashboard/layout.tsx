
import { Suspense } from "react";
import DashboardClientLayout from "./client-layout";
import { KingsBjjLogo } from "@/components/kings-bjj-logo";
import { User, mockUsers } from "@/lib/mock-data";

function DashboardLoading() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-4 bg-background">
      <KingsBjjLogo className="h-24 w-24 animate-pulse" />
      <p className="text-muted-foreground">Carregando painel...</p>
    </div>
  );
}

// This is now a Server Component that determines the user
export default async function DashboardLayout({
  children,
  searchParams,
}: {
  children: React.ReactNode;
  searchParams: { [key: string]: string | string[] | undefined };
}) {

  // Logic to determine user is moved here, to the server
  const email = searchParams?.email as string;
  const name = searchParams?.name as string;
  const affiliation = searchParams?.affiliation as string;
  const belt = searchParams?.belt as string;
  // Note: 'role' from searchParams is now primarily for the signup flow
  const role = (searchParams?.role as User['role']); 

  let user: User;

  // This block is for SIGNUP flow, which provides all details in params
  if (email && name && affiliation && belt) {
      user = {
          id: `user_${email.replace(/[@.]/g, '_')}`,
          name,
          email,
          role: role || 'student', // Fallback to student if role isn't specified on signup
          affiliation,
          branchId: (searchParams?.branchId as string) || '',
          mainInstructor: (searchParams?.mainInstructor as string) || '',
          category: (searchParams?.category as User['category']) || 'Adult',
          belt,
          stripes: Number(searchParams?.stripes || 0),
          avatar: "https://placehold.co/128x128.png",
          attendance: { total: 0, lastMonth: 0 },
          nextGraduationProgress: 5,
      };
  } else {
    // This block is for LOGIN flow, which only provides email
    const cleanEmail = email?.trim().toLowerCase();
    if (cleanEmail === 'admin@kingsbjj.com' || cleanEmail === 'admin@kings.com') {
      user = mockUsers.admin;
    } else if (cleanEmail === 'professor@kingsbjj.com' || cleanEmail === 'professor@kings.com') {
      user = mockUsers.professor;
    } else {
      // Default to student for any other email
      user = { ...mockUsers.student, email: email || mockUsers.student.email };
    }
  }
  
  return (
    <Suspense fallback={<DashboardLoading />}>
      {/* Pass the server-determined user to the client layout */}
      <DashboardClientLayout user={user}>{children}</DashboardClientLayout>
    </Suspense>
  );
}
