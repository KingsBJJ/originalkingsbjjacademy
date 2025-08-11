"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  TableCell,
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
} from '@/components/ui/dropdown-menu';

// Placeholder component
export default function InstructorTableRowClient({ instructor, userRole }: { instructor: any, userRole: string }) {
  return (
    <TableRow>
      <TableCell>
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarImage src={instructor.avatar} alt={instructor.name} />
            <AvatarFallback>{instructor.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{instructor.name}</p>
            <p className="text-xs text-muted-foreground">{instructor.email}</p>
          </div>
        </div>
      </TableCell>
      <TableCell>{instructor.affiliations?.join(', ') || 'N/A'}</TableCell>
      <TableCell>
        <Badge variant="secondary">{instructor.belt}</Badge>
      </TableCell>
      <TableCell>{instructor.phone}</TableCell>
      <TableCell className="text-right">
        {userRole === 'admin' && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Ações</DropdownMenuLabel>
              <DropdownMenuItem>Editar</DropdownMenuItem>
              <DropdownMenuItem>Excluir</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </TableCell>
    </TableRow>
  );
}
