
"use client";

import { useRouter } from "next/navigation";
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
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Basic validation
    if (!email || !password) {
        toast({
            variant: "destructive",
            title: "Erro de Login",
            description: "Por favor, preencha o email e a senha.",
        });
        setIsLoading(false);
        return;
    }
    
    // In a real app, you would have an API call here to authenticate the user.
    // For now, we'll just navigate with the email as a parameter.
    // The client-layout will determine the user type based on the email.
    
    // Simulate network delay
    setTimeout(() => {
        const params = new URLSearchParams();
        params.set("email", email);

        // Simple email-based role check for navigation
        const lowerCaseEmail = email.toLowerCase();
        if (lowerCaseEmail.includes('admin')) {
            params.set('role', 'admin');
        } else if (lowerCaseEmail.includes('professor')) {
            params.set('role', 'professor');
        } else {
            params.set('role', 'student');
        }

        router.push(`/dashboard?${params.toString()}`);
        setIsLoading(false);
    }, 500);
  };

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center p-4">
      <Image
        src="/background.jpg.png"
        alt="Dojo background"
        data-ai-hint="dojo background"
        fill
        className="object-cover object-center -z-20"
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
          <form onSubmit={handleLogin} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email" className="text-white/80">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@exemplo.com"
                required
                disabled={isLoading}
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
              <div className="relative">
                <Input 
                  id="password" 
                  type={showPassword ? "text" : "password"} 
                  required 
                  disabled={isLoading}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-white/5 border-white/20 text-white pr-10" 
                />
                 <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-white/80 hover:text-white"
                  aria-label={showPassword ? "Esconder senha" : "Mostrar senha"}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>
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
