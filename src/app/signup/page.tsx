"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { KingsBjjLogo } from "@/components/kings-bjj-logo";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { mockBranches, allBelts, mockUsers } from "@/lib/mock-data";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("student");

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background p-4">
      <Card className="mx-auto w-full max-w-sm border-0 bg-transparent shadow-none sm:border sm:bg-card sm:shadow-sm">
        <CardHeader className="text-center">
          <KingsBjjLogo className="mx-auto mb-4 h-16 w-16" />
          <CardTitle className="text-3xl font-bold tracking-tight">
            Criar Conta
          </CardTitle>
          <CardDescription>Insira seus dados para começar.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nome</Label>
              <Input id="name" placeholder="Seu Nome" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Senha</Label>
              <Input id="password" type="password" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirm-password">Confirmar Senha</Label>
              <Input id="confirm-password" type="password" required />
            </div>

            <div className="grid gap-2">
              <Label>Tipo de Conta</Label>
              <RadioGroup
                defaultValue="student"
                onValueChange={setRole}
                className="flex gap-4 pt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="student" id="r-aluno" />
                  <Label htmlFor="r-aluno">Aluno</Label>
                </div>
                {email.toLowerCase() === mockUsers.admin.email && (
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="admin" id="r-admin" />
                    <Label htmlFor="r-admin">Admin</Label>
                  </div>
                )}
              </RadioGroup>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="affiliation">Filial</Label>
              <Select>
                <SelectTrigger id="affiliation">
                  <SelectValue placeholder="Selecione sua filial" />
                </SelectTrigger>
                <SelectContent>
                  {mockBranches.map((branch) => (
                    <SelectItem key={branch.id} value={branch.name}>
                      {branch.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="belt">Graduação</Label>
              <Select>
                <SelectTrigger id="belt">
                  <SelectValue placeholder="Selecione sua graduação" />
                </SelectTrigger>
                <SelectContent>
                  {allBelts.map((belt) => (
                    <SelectItem key={belt} value={belt}>
                      {belt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label>Categoria</Label>
              <RadioGroup defaultValue="adulto" className="flex gap-4 pt-2">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="adulto" id="r-adulto" />
                  <Label htmlFor="r-adulto">Adulto</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="kids" id="r-kids" />
                  <Label htmlFor="r-kids">Kids</Label>
                </div>
              </RadioGroup>
            </div>

            <Button asChild type="submit" className="w-full">
              <Link href={`/dashboard?role=${role}`}>Criar conta</Link>
            </Button>
          </div>
          <div className="mt-4 text-center text-sm">
            Já tem uma conta?{" "}
            <Link href="/" className="underline">
              Entrar
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
