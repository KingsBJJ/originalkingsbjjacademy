"use client";

import { useContext } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { mockInstructors, beltColors } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { UserContext } from "../client-layout";

export default function InstructorsPage() {
  const user = useContext(UserContext);

  if (!user) {
    return <div>Carregando...</div>;
  }

  const displayedInstructors =
    user.role === "admin"
      ? mockInstructors
      : mockInstructors.filter((i) => i.affiliation === user.affiliation);

  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Nossos Professores</h1>
        <p className="text-muted-foreground">
          Aprenda com os melhores do ramo.
        </p>
      </div>

      <div className="space-y-4">
        {displayedInstructors.map((instructor) => {
          const beltStyle =
            beltColors[instructor.belt] || beltColors.Branca;
          return (
            <Card key={instructor.id}>
              <CardContent className="flex items-start gap-4 p-4">
                <Avatar className="h-20 w-20 border">
                  <AvatarImage
                    src={instructor.avatar}
                    alt={instructor.name}
                  />
                  <AvatarFallback className="text-2xl">
                    {instructor.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl">{instructor.name}</CardTitle>
                    <Badge
                      className={cn(
                        "text-xs font-semibold",
                        beltStyle.bg,
                        beltStyle.text
                      )}
                    >
                      Faixa {instructor.belt}
                    </Badge>
                  </div>
                  <CardDescription className="mt-1">
                    {instructor.affiliation}
                  </CardDescription>
                  <p className="mt-3 text-sm text-muted-foreground">
                    {instructor.bio}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
