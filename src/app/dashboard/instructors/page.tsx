"use client";

import { useContext } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
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

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {displayedInstructors.map((instructor) => {
          const beltStyle =
            beltColors[instructor.belt] || beltColors.Branca;
          return (
            <Card key={instructor.id} className="flex flex-col">
              <CardHeader className="items-center text-center">
                <Avatar className="h-24 w-24 border-2 border-primary">
                  <AvatarImage
                    src={instructor.avatar}
                    alt={instructor.name}
                  />
                  <AvatarFallback className="text-3xl">
                    {instructor.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="mt-4">
                  <CardTitle>{instructor.name}</CardTitle>
                   <CardDescription className="mt-1">{instructor.affiliation}</CardDescription>
                  <div className="mt-2">
                    <Badge
                      className={cn(
                        "px-3 py-0.5 text-xs font-semibold",
                        beltStyle.bg,
                        beltStyle.text
                      )}
                    >
                      Faixa {instructor.belt}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                <CardDescription>{instructor.bio}</CardDescription>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
