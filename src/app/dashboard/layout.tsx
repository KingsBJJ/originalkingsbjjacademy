import { Suspense } from "react";
import DashboardClientLayout from "./client-layout";
import { KingsBjjLogo } from "@/components/kings-bjj-logo";

function DashboardLoading() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-4 bg-background">
      <KingsBjjLogo className="h-24 w-24 animate-pulse" />
      <p className="text-muted-foreground">Carregando painel...</p>
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<DashboardLoading />}>
      <DashboardClientLayout>{children}</DashboardClientLayout>
    </Suspense>
  );
}
