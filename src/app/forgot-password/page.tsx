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
    <div className="flex min-h-screen w-full items-center justify-center bg-background p-4">
      <Card className="mx-auto w-full max-w-sm">
        <CardHeader className="text-center">
           <KingsBjjLogo className="mx-auto mb-4 h-24 w-24" />
          <CardTitle className="text-2xl font-bold tracking-tight">
            Esqueceu sua Senha?
          </CardTitle>
          <CardDescription>
            Insira seu email para receber um link de recuperação.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@exemplo.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full">
              Enviar Link de Recuperação
            </Button>
          </form>
           <div className="mt-4 text-center text-sm">
             <Link href="/" className="inline-flex items-center gap-1 underline">
                <ArrowLeft className="h-3 w-3" />
                Voltar para o login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
