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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

      <Card>
        <CardHeader>
          <CardTitle>Lista de Professores</CardTitle>
          <CardDescription>
            {user.role === 'admin' 
              ? `Total de ${displayedInstructors.length} professores em todas as filiais.`
              : `Professores da sua filial.`
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Professor</TableHead>
                <TableHead>Filial</TableHead>
                <TableHead>Graduação</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayedInstructors.map((instructor) => {
                const beltStyle =
                  beltColors[instructor.belt] || beltColors.Branca;
                return (
                  <TableRow key={instructor.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarImage
                            src={instructor.avatar}
                            alt={instructor.name}
                          />
                          <AvatarFallback>
                            {instructor.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                           <p className="font-medium">{instructor.name}</p>
                           <p className="text-xs text-muted-foreground">{instructor.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{instructor.affiliation}</TableCell>
                    <TableCell>
                      <Badge
                        className={cn(
                          "text-xs font-semibold",
                          beltStyle.bg,
                          beltStyle.text
                        )}
                      >
                        {instructor.belt}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                       <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Ações</DropdownMenuLabel>
                          <DropdownMenuItem>Ver Perfil</DropdownMenuItem>
                          <DropdownMenuItem>Ver Bio</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
