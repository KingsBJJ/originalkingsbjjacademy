import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { mockUser, beltColors, allBelts } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { CheckCircle } from "lucide-react";

const Belt = ({
  belt,
  stripes,
  isCurrentUser,
}: {
  belt: keyof typeof beltColors;
  stripes: number;
  isCurrentUser?: boolean;
}) => {
  const beltStyle = beltColors[belt];
  return (
    <div className="relative flex items-center justify-center rounded-md p-4 transition-all hover:scale-105">
      <div
        className={cn(
          "absolute inset-0 h-full w-full rounded-md opacity-20",
          beltStyle.bg
        )}
      />
      <div
        className={cn(
          "relative flex h-16 w-full items-center justify-between rounded-md px-4 shadow-lg",
          beltStyle.bg
        )}
      >
        <span
          className={cn(
            "text-xl font-bold tracking-wider",
            beltStyle.text
          )}
        >
          {belt}
        </span>
        <div className="flex h-full w-10 items-center justify-center bg-black/70">
          <div className="flex flex-col items-center justify-center gap-1">
            {isCurrentUser && Array.from({ length: stripes }).map((_, i) => (
              <div key={i} className="h-1 w-6 bg-white" />
            ))}
          </div>
        </div>
      </div>
      {isCurrentUser && (
        <div className="absolute -top-2 -right-2 flex items-center gap-1 rounded-full bg-background px-2 py-1 text-xs font-medium text-green-400">
          <CheckCircle className="h-4 w-4 text-green-400" />
          <span>Your Rank</span>
        </div>
      )}
    </div>
  );
};

export default function RankingsPage() {
  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">BJJ Ranking System</h1>
        <p className="text-muted-foreground">
          The path of progression in Brazilian Jiu-Jitsu.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Adult Belt Ranks</CardTitle>
          <CardDescription>From white to black belt and beyond.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {allBelts.map((belt) => (
                <Belt
                    key={belt}
                    belt={belt}
                    stripes={mockUser.stripes}
                    isCurrentUser={mockUser.belt === belt}
                />
            ))}
        </CardContent>
      </Card>
    </div>
  );
}
