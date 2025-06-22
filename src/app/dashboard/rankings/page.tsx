"use client";

import { useContext } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { beltColors, allBelts, beltInfo } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { CheckCircle } from "lucide-react";
import { UserContext } from "../client-layout";

const BeltListItem = ({
  belt,
  stripes,
  isCurrentUser,
}: {
  belt: keyof typeof beltColors;
  stripes: number;
  isCurrentUser?: boolean;
}) => {
  const beltStyle = beltColors[belt];
  const info = beltInfo[belt];

  return (
    <Card
      className={cn(
        "transition-all duration-300",
        isCurrentUser
          ? "border-primary shadow-lg shadow-primary/20 ring-2 ring-primary"
          : "border-border"
      )}
    >
      <CardContent className="flex flex-col gap-6 p-4 md:flex-row md:items-center md:p-6">
        <div className="w-full md:w-1/3 lg:w-1/4">
          <div
            className={cn(
              "relative flex h-10 w-full items-center justify-end rounded-md pr-4 shadow-inner",
              beltStyle.bg
            )}
          >
            <div className="absolute inset-0 h-full w-full rounded-md bg-black/10" />
            <div className="relative h-full w-16 bg-black/70">
              <div className="absolute inset-y-0 right-3 flex items-center gap-1.5">
                {isCurrentUser &&
                  Array.from({ length: stripes }).map((_, i) => (
                    <div key={i} className="h-8 w-1.5 bg-zinc-300" />
                  ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold tracking-wider">Faixa {belt}</h3>
            {isCurrentUser && (
              <Badge
                variant="outline"
                className="shrink-0 border-primary text-primary"
              >
                <CheckCircle className="mr-1.5 h-3.5 w-3.5" />
                Sua Graduação
              </Badge>
            )}
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            {info.description}
          </p>
          <div className="mt-4">
            <h4 className="mb-2 text-sm font-semibold text-foreground">
              Habilidades Chave:
            </h4>
            <div className="flex flex-wrap gap-2">
              {info.skills.map((skill) => (
                <Badge key={skill} variant="secondary" className="font-normal">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default function RankingsPage() {
  const user = useContext(UserContext);

  if (!user) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Sistema de Graduação BJJ
        </h1>
        <p className="text-muted-foreground">
          O caminho de progressão no Jiu-Jitsu Brasileiro.
        </p>
      </div>

      <div className="space-y-4">
        {allBelts.map((belt) => (
          <BeltListItem
            key={belt}
            belt={belt}
            stripes={user.belt === belt ? user.stripes : 0}
            isCurrentUser={user.belt === belt}
          />
        ))}
      </div>
    </div>
  );
}
