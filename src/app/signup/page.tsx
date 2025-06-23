"use client";

import Link from "next/link";
import { useState } from "react";
import Image from "next/image";
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
    <div className="relative flex min-h-screen w-full items-center justify-center p-4">
      <Image
        src="https://images.unsplash.com/photo-1599495810403-16a24a733ebb"
        alt="Dojo background"
        data-ai-hint="dojo background"
        fill
        className="object-cover object-center -z-10"
        quality={80}
        priority
      />
      <div className="absolute inset-0 bg-black/60 -z-10" />
      <Card className="mx-auto w-full max-w-sm border-0 bg-transparent shadow-none sm:border sm:border-white/10 sm:bg-black/20 sm:backdrop-blur-sm sm:shadow-lg">
        <CardHeader className="text-center">
          <KingsBjjLogo className="mx-auto mb-4 h-16 w-16" />
          <CardTitle className="text-3xl font-bold tracking-tight text-white">
            Criar Conta
          </CardTitle>
          <CardDescription className="text-white/80">Insira seus dados para começar.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name" className="text-white/80">Nome</Label>
              <Input id="name" placeholder="Seu Nome" required className="bg-white/5 border-white/20 text-white placeholder:text-white/50" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email" className="text-white/80">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white/5 border-white/20 text-white placeholder:text-white/50"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password" className="text-white/80">Senha</Label>
              <Input id="password" type="password" required className="bg-white/5 border-white/20 text-white" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirm-password" className="text-white/80">Confirmar Senha</Label>
              <Input id="confirm-password" type="password" required className="bg-white/5 border-white/20 text-white"/>
            </div>

            <div className="grid gap-2">
              <Label className="text-white/80">Tipo de Conta</Label>
              <RadioGroup
                defaultValue="student"
                onValueChange={setRole}
                className="flex gap-4 pt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="student" id="r-aluno" />
                  <Label htmlFor="r-aluno" className="text-white/80 font-normal">Aluno</Label>
                </div>
                {email.toLowerCase() === mockUsers.admin.email && (
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="admin" id="r-admin" />
                    <Label htmlFor="r-admin" className="text-white/80 font-normal">Admin</Label>
                  </div>
                )}
              </RadioGroup>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="affiliation" className="text-white/80">Filial</Label>
              <Select>
                <SelectTrigger id="affiliation" className="bg-white/5 border-white/20 text-white">
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
              <Label htmlFor="belt" className="text-white/80">Graduação</Label>
              <Select>
                <SelectTrigger id="belt" className="bg-white/5 border-white/20 text-white">
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
              <Label className="text-white/80">Categoria</Label>
              <RadioGroup defaultValue="adulto" className="flex gap-4 pt-2">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="adulto" id="r-adulto" />
                  <Label htmlFor="r-adulto" className="text-white/80 font-normal">Adulto</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="kids" id="r-kids" />
                  <Label htmlFor="r-kids" className="text-white/80 font-normal">Kids</Label>
                </div>
              </RadioGroup>
            </div>

            <Button asChild type="submit" className="w-full">
              <Link href={`/dashboard?role=${role}`}>Criar conta</Link>
            </Button>
          </div>
          <div className="mt-4 text-center text-sm text-white/80">
            Já tem uma conta?{" "}
            <Link href="/" className="underline hover:text-white">
              Entrar
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
