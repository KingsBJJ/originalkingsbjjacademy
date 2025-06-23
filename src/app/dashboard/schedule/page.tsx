"use client";

import { useContext } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockClasses } from "@/lib/mock-data";
import { Clock } from "lucide-react";
import { UserContext } from "../client-layout";

export default function SchedulePage() {
  const user = useContext(UserContext);

  if (!user) {
    return <div>Carregando...</div>;
  }

  const displayedClasses =
    user.role === "admin"
      ? mockClasses
      : mockClasses.filter((c) => c.branchId === user.branchId);

  const adultClasses = displayedClasses.filter(
    (c) => c.category === "Adults"
  );
  const kidsClasses = displayedClasses.filter((c) => c.category === "Kids");

  const classListRenderer = (classes: typeof mockClasses) => (
    <CardContent className="space-y-4">
      {classes.map((item) => (
        <div
          key={item.id}
          className="flex items-center justify-between rounded-lg border p-4"
        >
          <div>
            <p className="font-semibold">{item.name}</p>
            <p className="text-sm text-muted-foreground">
              {item.instructor}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-primary" />
              <span>{item.time}</span>
            </div>
          </div>
        </div>
      ))}
    </CardContent>
  );

  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Horários das Aulas</h1>
        <p className="text-muted-foreground">
          Encontre sua próxima aula e planeje sua semana.
        </p>
      </div>

      <Tabs defaultValue="adults" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="adults">Adultos</TabsTrigger>
          <TabsTrigger value="kids">Infantil</TabsTrigger>
        </TabsList>
        <TabsContent value="adults">
          <Card>
            <CardHeader>
              <CardTitle>Aulas para Adultos</CardTitle>
              <CardDescription>
                Horário de todas as aulas de Adulto com e sem kimono.
              </CardDescription>
            </CardHeader>
            {classListRenderer(adultClasses)}
          </Card>
        </TabsContent>
        <TabsContent value="kids">
          <Card>
            <CardHeader>
              <CardTitle>Aulas para Crianças</CardTitle>
              <CardDescription>
                Aulas de jiu-jitsu divertidas e seguras para os pequenos.
              </CardDescription>
            </CardHeader>
            {classListRenderer(kidsClasses)}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
