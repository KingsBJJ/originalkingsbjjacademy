"use client";

import { useContext } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { beltColors, allBelts, beltInfo } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { CheckCircle } from "lucide-react";
import { UserContext } from "../client-layout";

const BeltCard = ({
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
        "overflow-hidden transition-all duration-300",
        isCurrentUser
          ? "border-primary shadow-lg shadow-primary/20 ring-2 ring-primary"
          : "border-border"
      )}
    >
      <div className={cn("p-4", beltStyle.bg)}>
        <div className="flex items-center justify-between">
          <h3
            className={cn(
              "text-2xl font-bold tracking-wider",
              beltStyle.text
            )}
          >
            {belt}
          </h3>
          {isCurrentUser && (
            <div className="flex items-center gap-1.5 rounded-full bg-black/50 px-3 py-1 text-xs font-medium text-white">
              <CheckCircle className="h-4 w-4" />
              <span>Sua Graduação</span>
            </div>
          )}
        </div>
        <div
          className={cn(
            "relative mt-4 flex h-8 w-full items-center justify-end rounded-sm pr-4",
            beltStyle.bg
          )}
        >
          <div className="absolute inset-0 h-full w-full bg-black/10" />
          <div className="relative h-full w-12 bg-black/70">
            <div className="absolute inset-y-0 right-2 flex items-center gap-1">
              {isCurrentUser &&
                Array.from({ length: stripes }).map((_, i) => (
                  <div key={i} className="h-5 w-1 bg-white" />
                ))}
            </div>
          </div>
        </div>
      </div>
      <CardContent className="space-y-4 p-6">
        <p className="text-muted-foreground">{info.description}</p>
        <div>
          <h4 className="mb-2 font-semibold text-foreground">
            Habilidades Chave
          </h4>
          <div className="flex flex-wrap gap-2">
            {info.skills.map((skill) => (
              <Badge key={skill} variant="secondary" className="font-normal">
                {skill}
              </Badge>
            ))}
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
    <div className="grid gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Sistema de Graduação BJJ
        </h1>
        <p className="text-muted-foreground">
          O caminho de progressão no Jiu-Jitsu Brasileiro.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
        {allBelts.map((belt) => (
          <BeltCard
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
