
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

// O layout do servidor agora é muito mais simples.
// Ele não lida mais com a lógica do usuário, apenas prepara o terreno.
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<DashboardLoading />}>
      {/* O Client Layout agora cuidará de determinar o usuário */}
      <DashboardClientLayout>{children}</DashboardClientLayout>
    </Suspense>
  );
}
