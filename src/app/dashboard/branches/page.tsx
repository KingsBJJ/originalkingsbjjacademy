"use client";

import Image from "next/image";
import { useContext } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { mockBranches } from "@/lib/mock-data";
import { Clock, MapPin, Phone } from "lucide-react";
import { UserContext } from "../layout";

export default function BranchesPage() {
  const user = useContext(UserContext);

  if (!user) {
    return <div>Carregando...</div>;
  }

  const displayedBranches =
    user.role === "admin"
      ? mockBranches
      : mockBranches.filter((b) => b.id === user.branchId);

  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Nossas Academias</h1>
        <p className="text-muted-foreground">
          Encontre uma unidade Kings BJJ perto de você.
        </p>
      </div>

      {user.role === "admin" && (
        <Card>
          <CardContent className="p-0">
            <div className="aspect-video w-full">
              <Image
                src={"https://placehold.co/1200x600.png"}
                alt="Mapa de todas as filiais"
                width={1200}
                height={600}
                className="h-full w-full object-cover"
                data-ai-hint="world map"
              />
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {displayedBranches.map((branch) => (
          <Card key={branch.id}>
            <CardHeader>
              <CardTitle>{branch.name}</CardTitle>
              <CardDescription>{branch.address}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
               <div className="aspect-video w-full rounded-md overflow-hidden mb-4">
                <Image
                    src={branch.mapImage}
                    alt={`Mapa para ${branch.name}`}
                    width={600}
                    height={400}
                    className="h-full w-full object-cover"
                    data-ai-hint="city map"
                />
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground">{branch.phone}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Clock className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground">{branch.hours}</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                <MapPin className="mr-2 h-4 w-4" />
                Ver Detalhes
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
