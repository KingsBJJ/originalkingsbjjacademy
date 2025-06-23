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
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      toast({
        title: "Link de Recuperação Enviado",
        description: `Se um usuário com o email ${email} existir, um link para redefinir a senha foi enviado.`,
      });
    } else {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Por favor, insira um endereço de email.",
      });
    }
  };

  return (
    <div
      data-ai-hint="dojo background"
      className="bg-auth-screen flex min-h-screen w-full items-center justify-center p-4"
    >
      <Card className="mx-auto w-full max-w-sm border-0 bg-transparent shadow-none sm:border sm:border-white/10 sm:bg-black/20 sm:backdrop-blur-sm sm:shadow-lg">
        <CardHeader className="text-center">
           <KingsBjjLogo className="mx-auto mb-4 h-24 w-24" />
          <CardTitle className="text-2xl font-bold tracking-tight text-white">
            Esqueceu sua Senha?
          </CardTitle>
          <CardDescription className="text-white/80">
            Insira seu email para receber um link de recuperação.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4">
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
            <Button type="submit" className="w-full">
              Enviar Link de Recuperação
            </Button>
          </form>
           <div className="mt-4 text-center text-sm text-white/80">
             <Link href="/" className="inline-flex items-center gap-1 underline hover:text-white">
                <ArrowLeft className="h-3 w-3" />
                Voltar para o login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
