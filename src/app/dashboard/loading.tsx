import { KingsBjjLogo } from "@/components/kings-bjj-logo";

export default function Loading() {
  // Você pode adicionar qualquer UI aqui, incluindo um Skeleton.
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4">
        <KingsBjjLogo className="h-16 w-16 animate-spin" />
        <p className="text-muted-foreground">Carregando página...</p>
    </div>
  );
}
