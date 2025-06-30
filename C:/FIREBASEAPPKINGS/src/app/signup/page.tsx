"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
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
import { allBelts, mockUsers, type Branch } from "@/lib/mock-data";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { getBranches } from "@/services/branchService";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("student");
  const [category, setCategory] = useState("adulto");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [selectedBelt, setSelectedBelt] = useState("");
  const [stripes, setStripes] = useState(0);
  const [branches, setBranches] = useState<Branch[]>([]);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    async function fetchBranches() {
        try {
            const fetchedBranches = await getBranches();
            setBranches(fetchedBranches);
        } catch (error) {
            console.error("Failed to fetch branches:", error);
            toast({
                variant: 'destructive',
                title: 'Erro ao Carregar Filiais',
                description: 'Não foi possível buscar a lista de filiais.',
            });
        }
    }
    fetchBranches();
  }, [toast]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (category === "kids" && !termsAccepted) {
        toast({
            variant: "destructive",
            title: "Termos não aceitos",
            description: "Você deve aceitar o termo de responsabilidade para matricular uma criança.",
        });
        return;
    }

    if (role === 'professor') {
      toast({
        title: "Solicitação Enviada",
        description: "Seu cadastro como professor foi enviado para aprovação do administrador.",
      });
    }
    // For simulation, we'll still navigate. In a real app, you'd wait for approval.
    router.push(`/dashboard?role=${role}`);
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
          <KingsBjjLogo className="mx-auto mb-4 h-16 w-16" />
          <CardTitle className="text-3xl font-bold tracking-tight text-white">
            Criar Conta
          </CardTitle>
          <CardDescription className="text-white/80">Insira seus dados para começar.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4">
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
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="professor" id="r-professor" />
                  <Label htmlFor="r-professor" className="text-white/80 font-normal">Professor</Label>
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
                  {branches.length === 0 ? (
                      <SelectItem value="loading" disabled>Carregando...</SelectItem>
                  ) : (
                    branches.map((branch) => (
                        <SelectItem key={branch.id} value={branch.name}>
                        {branch.name}
                        </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="belt" className="text-white/80">Graduação</Label>
              <Select onValueChange={setSelectedBelt}>
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

            {(selectedBelt === 'Preta' || selectedBelt === 'Coral') && (
              <div className="grid gap-2">
                <Label htmlFor="stripes" className="text-white/80">Graus</Label>
                <Input
                  id="stripes"
                  type="number"
                  min="0"
                  max="7"
                  value={stripes}
                  onChange={(e) => setStripes(parseInt(e.target.value, 10) || 0)}
                  className="bg-white/5 border-white/20 text-white placeholder:text-white/50"
                  placeholder="Nº de graus"
                />
              </div>
            )}

            <div className="grid gap-2">
              <Label className="text-white/80">Categoria</Label>
              <RadioGroup defaultValue="adulto" onValueChange={setCategory} className="flex gap-4 pt-2">
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

            {category === 'kids' && (
              <div className="items-top flex space-x-2 pt-2">
                <Checkbox 
                  id="terms" 
                  checked={termsAccepted}
                  onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
                />
                <div className="grid gap-1.5 leading-none">
                  <label
                    htmlFor="terms"
                    className="text-sm font-medium leading-none text-white/80 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Eu li e concordo com o{" "}
                    <Link href="/terms-of-service" target="_blank" className="underline hover:text-primary">
                      termo de responsabilidade dos pais
                    </Link>
                    .
                  </label>
                  <p className="text-xs text-muted-foreground">
                    Necessário para a matrícula de menores de idade.
                  </p>
                </div>
              </div>
            )}


            <Button type="submit" className="w-full">
              Criar conta
            </Button>
          </form>
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
