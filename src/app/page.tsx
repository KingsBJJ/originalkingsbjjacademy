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
import { mockUsers } from "@/lib/mock-data";

export default function LoginPage() {
  const [email, setEmail] = useState("");

  const getRole = () => {
    if (email.toLowerCase() === mockUsers.admin.email) {
      return "admin";
    }
    if (email.toLowerCase() === mockUsers.professor.email) {
      return "professor";
    }
    return "student";
  };

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
          <KingsBjjLogo className="mx-auto mb-4 h-24 w-24" />
          <CardTitle className="text-3xl font-bold tracking-tight text-white">
            Kings BJJ
          </CardTitle>
          <CardDescription className="text-white/80">Welcome to the Game!</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email" className="text-white/80">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@exemplo.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white/5 border-white/20 text-white placeholder:text-white/50"
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password" className="text-white/80">Senha</Label>
                <Link
                  href="/forgot-password"
                  className="ml-auto inline-block text-sm text-white/80 underline hover:text-white"
                >
                  Esqueceu sua senha?
                </Link>
              </div>
              <Input id="password" type="password" required className="bg-white/5 border-white/20 text-white" />
            </div>
            <Button asChild type="submit" className="w-full">
              <Link href={`/dashboard?role=${getRole()}`}>Entrar</Link>
            </Button>
          </div>
          <div className="mt-4 text-center text-sm text-white/80">
            Não tem uma conta?{" "}
            <Link href="/signup" className="underline hover:text-white">
              Criar conta
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
