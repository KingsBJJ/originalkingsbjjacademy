"use client";

import { useContext, useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Clock } from "lucide-react";
import { UserContext } from "../client-layout";
import { getBranches, type Branch, type ClassScheduleItem } from "@/lib/firestoreService";
import { Skeleton } from "@/components/ui/skeleton";

type ClassWithBranch = ClassScheduleItem & { branchName: string };

const ScheduleSkeleton = () => (
    <Card>
        <CardHeader>
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-72 mt-1" />
        </CardHeader>
        <CardContent className="space-y-4">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
        </CardContent>
    </Card>
);

export default function SchedulePage() {
  const user = useContext(UserContext);
  const [allClasses, setAllClasses] = useState<ClassWithBranch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
      const fetchSchedules = async () => {
          try {
              setLoading(true);
              const branches = await getBranches();
              
              const allClasses = branches.flatMap(branch => 
                  (branch.schedule ?? []).map(item => ({
                      ...item,
                      branchName: branch.name,
                  }))
              );
              
              setAllClasses(allClasses);
          } catch (error) {
              console.error("Failed to fetch schedules:", error);
          } finally {
              setLoading(false);
          }
      };

      fetchSchedules();
  }, []);

  if (!user) {
    return <ScheduleSkeleton />;
  }

  // Filter based on user role and affiliation
  const displayedClasses = user.role === "admin"
      ? allClasses
      : allClasses.filter((c) => c.branchName === user.affiliation);

  const adultClasses = displayedClasses.filter(
    (c) => c.category === "Adults"
  );
  const kidsClasses = displayedClasses.filter((c) => c.category === "Kids");

  const classListRenderer = (classes: ClassWithBranch[]) => {
    if (classes.length === 0) {
      return (
          <CardContent>
              <p className="text-sm text-center text-muted-foreground pt-6">Nenhuma aula disponível nesta categoria.</p>
          </CardContent>
      );
    }
    return (
        <CardContent className="space-y-4">
        {classes.map((item, index) => (
            <div
            key={index}
            className="flex items-center justify-between rounded-lg border p-4"
            >
            <div>
                <p className="font-semibold">{item.name}</p>
                <p className="text-sm text-muted-foreground">
                {item.instructor} {user.role === 'admin' && `(${item.branchName})`}
                </p>
            </div>
            <div className="flex items-center gap-4 text-right">
                <div className="flex flex-col items-end gap-1 text-sm">
                    <span>{item.day}</span>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-primary" />
                      <span>{item.time}</span>
                    </div>
                </div>
            </div>
            </div>
        ))}
        </CardContent>
    );
  };
  
  if (loading) {
      return (
          <div className="grid gap-6">
              <div>
                  <h1 className="text-3xl font-bold tracking-tight">Horários das Aulas</h1>
                  <p className="text-muted-foreground">
                      Encontre sua próxima aula e planeje sua semana.
                  </p>
              </div>
              <ScheduleSkeleton />
              <ScheduleSkeleton />
          </div>
      );
  }

  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Horários das Aulas</h1>
        <p className="text-muted-foreground">
          Encontre sua próxima aula e planeje sua semana.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Aulas para Adultos</CardTitle>
          <CardDescription>
            Horário de todas as aulas de Adulto com e sem kimono.
          </CardDescription>
        </CardHeader>
        {classListRenderer(adultClasses)}
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Aulas para Crianças</CardTitle>
          <CardDescription>
            Aulas de jiu-jitsu divertidas e seguras para os pequenos.
          </CardDescription>
        </CardHeader>
        {classListRenderer(kidsClasses)}
      </Card>
    </div>
  );
}
