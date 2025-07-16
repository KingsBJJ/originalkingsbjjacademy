
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
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft } from 'lucide-react';
import { sendPasswordResetEmail } from "firebase/auth";
<<<<<<< HEAD
import { auth } from "@/lib/firebase";
=======
import { auth } from "@/lib/firebase"; // Correctly import the shared auth instance
>>>>>>> b481c2bc812841ccf4c793496605892116238ae6

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Por favor, insira um endereço de e-mail válido.",
      });
      return;
    }

    setIsLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      toast({
        title: "Link de Recuperação Enviado",
<<<<<<< HEAD
        description: `Se o e-mail ${email} estiver cadastrado, você receberá um link para redefinir sua senha. Verifique sua caixa de entrada e spam.`,
      });
    } catch (error: any) {
      console.error("Erro ao enviar recuperação de senha:", error);
      toast({
        variant: "destructive",
        title: "Erro ao enviar email",
        description: error.message || "Ocorreu um erro. Verifique o e-mail digitado ou tente novamente.",
      });
    } finally {
      setIsLoading(false);
=======
        description: `Se um usuário com o email ${email} existir, um link para redefinir a senha foi enviado. Verifique sua caixa de entrada e spam.`,
      });
    } catch (error) {
       console.error("Password reset error:", error);
       toast({
        variant: "destructive",
        title: "Erro ao Enviar Email",
        description: "Não foi possível enviar o link. Verifique o email digitado ou tente novamente.",
      });
    } finally {
        setIsLoading(false);
>>>>>>> b481c2bc812841ccf4c793496605892116238ae6
    }
  };

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center p-4">
      <Image
        src="/background.jpg.png"
        alt="Dojo background"
        fill
        className="object-cover object-center -z-10"
      />
      <Card className="w-full max-w-md bg-white/80 backdrop-blur-md">
        <CardHeader>
          <CardTitle className="text-center">Esqueceu sua Senha?</CardTitle>
          <CardDescription className="text-center">
            Digite seu e-mail e enviaremos um link para redefinir sua senha.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
<<<<<<< HEAD
                required
              />
            </div>
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? "Enviando..." : "Enviar Link de Recuperação"}
=======
                disabled={isLoading}
                className="bg-white/5 border-white/20 text-white placeholder:text-white/50"
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Enviando...' : 'Enviar Link de Recuperação'}
>>>>>>> b481c2bc812841ccf4c793496605892116238ae6
            </Button>
            <div className="text-center mt-4">
              <Link href="/login" className="text-sm text-blue-500 hover:underline">
                <ArrowLeft className="inline mr-1 w-4 h-4" />
                Voltar ao login
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}