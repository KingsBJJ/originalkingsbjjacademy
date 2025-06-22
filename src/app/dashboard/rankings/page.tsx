"use client";

import { useContext } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  beltColors,
  allBelts,
  beltInfo,
  beltColorsKids,
  allBeltsKids,
  beltInfoKids,
} from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { CheckCircle } from "lucide-react";
import { UserContext } from "../client-layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type BeltListItemProps = {
  belt: string;
  stripes: number;
  isCurrentUser?: boolean;
  beltColors: Record<string, { bg: string; text: string }>;
  beltInfo: Record<string, { description: string; skills: string[] }>;
};

const BeltListItem = ({
  belt,
  stripes,
  isCurrentUser,
  beltColors,
  beltInfo,
}: BeltListItemProps) => {
  const beltStyle = beltColors[belt];
  const info = beltInfo[belt];

  if (!beltStyle || !info) return null;

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

      <Tabs defaultValue="adults" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="adults">Adulto</TabsTrigger>
          <TabsTrigger value="kids">Infantil</TabsTrigger>
        </TabsList>
        <TabsContent value="adults" className="mt-4">
          <div className="space-y-4">
            {allBelts.map((belt) => (
              <BeltListItem
                key={belt}
                belt={belt}
                beltColors={beltColors}
                beltInfo={beltInfo}
                stripes={user.belt === belt ? user.stripes : 0}
                isCurrentUser={user.belt === belt}
              />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="kids" className="mt-4">
           <div className="space-y-4">
            {allBeltsKids.map((belt) => (
              <BeltListItem
                key={belt}
                belt={belt}
                beltColors={beltColorsKids}
                beltInfo={beltInfoKids}
                stripes={0}
                isCurrentUser={false}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
