import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import DashboardClientLayout from "./client-layout";

function DashboardLoading() {
    return (
        <div className="flex h-screen w-full bg-background">
            <div className="hidden w-64 flex-col border-r border-border bg-sidebar p-2 md:flex">
                <div className="p-2">
                    <Skeleton className="h-8 w-3/4" />
                </div>
                <div className="flex flex-1 flex-col gap-1 p-2">
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                </div>
                <div className="p-2">
                    <Skeleton className="h-12 w-full" />
                </div>
            </div>
            <div className="flex flex-1 flex-col">
                <header className="flex h-14 items-center justify-end gap-4 border-b border-border px-4 sm:px-6">
                    <Skeleton className="h-6 w-24" />
                </header>
                <main className="flex-1 p-4 sm:p-6">
                    <div className="space-y-2">
                        <Skeleton className="h-8 w-1/3" />
                        <Skeleton className="h-5 w-1/2" />
                    </div>
                </main>
            </div>
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
