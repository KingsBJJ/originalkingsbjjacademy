
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
import { allBelts, allBeltsKids } from "@/lib/mock-data";
import { useToast } from "@/hooks/use-toast";
import { Check } from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter,
  DialogTrigger
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getBranches, saveTermsAcceptance, getInstructorsByAffiliation, addStudent, type Branch, type Instructor, type User } from "@/lib/firestoreService";


function TermsDialog({ onAccept, isAccepted }: { onAccept: (parentName: string, childName: string) => void, isAccepted: boolean }) {
  const [parentName, setParentName] = useState('');
  const [childName, setChildName] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const handleAccept = () => {
    if (parentName && childName) {
      onAccept(parentName, childName);
      setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="link" type="button" className="text-primary p-0 h-auto shrink-0">
          {isAccepted ? 'Visualizar Termo' : 'Ler e Assinar'}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">Termo de Responsabilidade - Matrícula Infantil</DialogTitle>
          <DialogDescription>
            Leia atentamente, preencha os nomes e clique em "Concordar e Assinar" para prosseguir.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
            <ScrollArea className="h-72 w-full rounded-md border p-4 text-sm">
             <div className="space-y-4">
                <p>
                    Eu, <span className="font-bold">{parentName || '[NOME DO RESPONSÁVEL]'}</span>, portador(a) do RG/CPF [NÚMERO DO DOCUMENTO], na qualidade de responsável legal pelo(a) menor <span className="font-bold">{childName || '[NOME DO(A) MENOR]'}</span>, nascido(a) em [DATA DE NASCIMENTO DO(A) MENOR], autorizo sua participação nas aulas de Jiu-Jitsu Brasileiro oferecidas pela academia Kings BJJ.
                </p>
                <h3 className="font-bold text-lg pt-2">1. Reconhecimento dos Riscos</h3>
                <p>
                    Declaro estar ciente de que o Jiu-Jitsu Brasileiro é uma arte marcial e um esporte de contato que envolve riscos inerentes, incluindo, mas não se limitando a, lesões musculares, contusões, fraturas, luxações e outras lesões graves. Compreendo que tais riscos não podem ser totalmente eliminados, mesmo com o cumprimento de todas as normas de segurança.
                </p>
                <h3 className="font-bold text-lg pt-2">2. Condição de Saúde</h3>
                <p>
                    Atesto que o(a) menor encontra-se em plenas condições de saúde e apto(a) a participar das atividades físicas propostas. Comprometo-me a informar imediatamente à equipe da Kings BJJ sobre qualquer condição médica preexistente, alergia, ou qualquer outra restrição que possa afetar sua participação segura nas aulas.
                </p>
             </div>
            </ScrollArea>
             <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="parent-name">Nome do Responsável</Label>
                    <Input id="parent-name" value={parentName} onChange={(e) => setParentName(e.target.value)} placeholder="Nome completo do responsável" />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="child-name">Nome do(a) Menor</Label>
                    <Input id="child-name" value={childName} onChange={(e) => setChildName(e.target.value)} placeholder="Nome completo do menor" />
                </div>
            </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>Cancelar</Button>
          <Button onClick={handleAccept} disabled={!parentName || !childName || isAccepted}>
            {isAccepted ? 'Termo já assinado' : 'Concordar e Assinar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


export default function SignUpPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [password, setPassword] = useState("");
  const [belt, setBelt] = useState("");
  const [stripes, setStripes] = useState(0);
  const [category, setCategory] = useState("adulto");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [filteredInstructors, setFilteredInstructors] = useState<Instructor[]>([]);
  const [loadingInstructors, setLoadingInstructors] = useState(false);
  const [affiliation, setAffiliation] = useState("");
  const [mainInstructor, setMainInstructor] = useState("");
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const fetchBranches = async () => {
        try {
            const fetchedBranches = await getBranches();
            setBranches(fetchedBranches);
        } catch (error) {
            console.error("Failed to fetch branches:", error);
            toast({
                variant: "destructive",
                title: "Erro ao carregar filiais",
                description: "Não foi possível buscar os dados de filiais.",
            });
        }
    };
    fetchBranches();
  }, [toast]);

  useEffect(() => {
    if (!affiliation) {
      setFilteredInstructors([]);
      setMainInstructor("");
      return;
    }

    const fetchInstructors = async () => {
        setLoadingInstructors(true);
        setMainInstructor(""); // Reset instructor on affiliation change
        try {
            const instructors = await getInstructorsByAffiliation(affiliation);
            setFilteredInstructors(instructors);
        } catch (error) {
            console.error("Failed to fetch instructors for affiliation:", error);
            toast({
                variant: "destructive",
                title: "Erro ao buscar instrutores",
                description: "Não foi possível carregar os instrutores desta filial.",
            });
        } finally {
            setLoadingInstructors(false);
        }
    };

    fetchInstructors();
  }, [affiliation, toast]);


  const handleCategoryChange = (newCategory: string) => {
    setCategory(newCategory);
    setBelt("");
    setTermsAccepted(false);
  };

  const handleAcceptTerms = async (parentName: string, childName: string) => {
    if (!affiliation) {
        toast({
            variant: "destructive",
            title: "Filial não selecionada",
            description: "Por favor, selecione uma filial antes de assinar o termo.",
        });
        return;
    }
    
    try {
        const selectedBranch = branches.find(b => b.name === affiliation);
        if (!selectedBranch) throw new Error("Filial selecionada não encontrada.");

        await saveTermsAcceptance({
            parentName,
            childName,
            branchId: selectedBranch.id,
            branchName: selectedBranch.name,
        });

        toast({
            title: "Termo Assinado com Sucesso!",
            description: "As informações foram salvas e enviadas ao professor responsável.",
        });
        setTermsAccepted(true);

    } catch (error) {
        console.error("Failed to accept terms:", error);
        toast({
            variant: "destructive",
            title: "Erro ao Salvar Termo",
            description: "Não foi possível salvar o termo. Tente novamente.",
        });
        setTermsAccepted(false);
    }
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (category === "kids" && !termsAccepted) {
        toast({
            variant: "destructive",
            title: "Termos não aceitos",
            description: "Você deve aceitar o termo de responsabilidade para matricular uma criança.",
        });
        return;
    }

    const selectedBranch = branches.find(b => b.name === affiliation);
    const branchId = selectedBranch ? selectedBranch.id : '';

    const newStudentData: Omit<User, 'id'> = {
        name,
        email,
        dateOfBirth,
        password, // In a real app, this should be hashed server-side
        role: 'student',
        affiliations: affiliation ? [affiliation] : [],
        branchId,
        mainInstructor,
        category: category === 'adulto' ? 'Adult' : 'Kids',
        belt,
        stripes,
        avatar: `https://placehold.co/128x128.png?text=${name.charAt(0)}`,
        attendance: { total: 0, lastMonth: 0 },
        nextGraduationProgress: 0,
        isFirstLogin: true,
    };

    const result = await addStudent(newStudentData);

    if (result.success) {
        toast({
            title: "Cadastro realizado com sucesso!",
            description: "Você será redirecionado para o painel."
        });
        const params = new URLSearchParams({
            role: 'student',
            name,
            email,
            affiliation,
            branchId,
            mainInstructor,
            category: category === 'adulto' ? 'Adult' : 'Kids',
            belt,
            stripes: String(stripes),
            newStudent: "true", // Flag for admin notification
        });
        router.push(`/dashboard?${params.toString()}`);
    } else {
        toast({
            variant: "destructive",
            title: "Erro no cadastro",
            description: result.message || "Não foi possível criar a conta. Tente novamente."
        });
    }
  };

  const currentBeltList = category === 'adulto' ? allBelts : allBeltsKids;
  
  const isFormInvalid =
    !name ||
    !email ||
    !password ||
    !affiliation ||
    !mainInstructor ||
    !belt ||
    !dateOfBirth ||
    (category === "kids" && !termsAccepted);


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
      <Card className="mx-auto w-full max-w-lg border-0 bg-transparent shadow-none sm:border sm:border-white/10 sm:bg-black/20 sm:backdrop-blur-sm sm:shadow-lg">
        <CardHeader className="text-center">
          <KingsBjjLogo className="mx-auto mb-4 h-16 w-16" />
          <CardTitle className="text-3xl font-bold tracking-tight text-white">
            Criar Conta de Aluno
          </CardTitle>
          <CardDescription className="text-white/80">Insira seus dados para começar.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="name" className="text-white/80">Nome Completo</Label>
                  <Input id="name" placeholder="Seu Nome" required className="bg-white/5 border-white/20 text-white placeholder:text-white/50" value={name} onChange={e => setName(e.target.value)} />
                </div>
                 <div className="grid gap-2">
                  <Label htmlFor="dateOfBirth" className="text-white/80">Data de Nascimento</Label>
                  <Input id="dateOfBirth" type="date" required className="bg-white/5 border-white/20 text-white placeholder:text-white/50" value={dateOfBirth} onChange={e => setDateOfBirth(e.target.value)} />
                </div>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="password" className="text-white/80">Senha</Label>
                  <Input id="password" type="password" required className="bg-white/5 border-white/20 text-white" value={password} onChange={e => setPassword(e.target.value)} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="confirm-password" className="text-white/80">Confirmar Senha</Label>
                  <Input id="confirm-password" type="password" required className="bg-white/5 border-white/20 text-white"/>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="affiliation" className="text-white/80">Filial</Label>
                  <Select onValueChange={setAffiliation} value={affiliation}>
                    <SelectTrigger id="affiliation" className="bg-white/5 border-white/20 text-white">
                      <SelectValue placeholder="Selecione sua filial" />
                    </SelectTrigger>
                    <SelectContent>
                      {branches.map((branch) => (
                        <SelectItem key={branch.id} value={branch.name}>
                          {branch.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="mainInstructor" className="text-white/80">Professor</Label>
                    <Select onValueChange={setMainInstructor} value={mainInstructor} disabled={!affiliation || loadingInstructors || filteredInstructors.length === 0}>
                        <SelectTrigger id="mainInstructor" className="bg-white/5 border-white/20 text-white">
                            <SelectValue placeholder={
                                loadingInstructors 
                                    ? "Carregando professores..." 
                                    : !affiliation 
                                    ? "Selecione a filial primeiro" 
                                    : filteredInstructors.length === 0 
                                    ? "Nenhum professor encontrado" 
                                    : "Selecione seu professor"
                            } />
                        </SelectTrigger>
                        <SelectContent>
                            {filteredInstructors.map((instructor) => (
                                <SelectItem key={instructor.id} value={instructor.name}>
                                    {instructor.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                    <Label className="text-white/80">Categoria</Label>
                    <RadioGroup defaultValue="adulto" onValueChange={handleCategoryChange} className="flex gap-4 pt-2">
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
                <div className="grid gap-2">
                  <Label htmlFor="belt" className="text-white/80">Graduação</Label>
                  <Select onValueChange={setBelt} value={belt}>
                    <SelectTrigger id="belt" className="bg-white/5 border-white/20 text-white">
                      <SelectValue placeholder="Selecione sua graduação" />
                    </SelectTrigger>
                    <SelectContent>
                      {currentBeltList.map((beltOption) => (
                        <SelectItem key={beltOption} value={beltOption}>
                          {beltOption}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
            </div>
            
            {(belt === "Preta" || belt === "Coral") && (
                <div className="grid gap-2">
                  <Label htmlFor="stripes" className="text-white/80">Graus na Faixa</Label>
                  <Input
                    id="stripes"
                    type="number"
                    min="0"
                    max="6"
                    placeholder="Nº de graus (0-6)"
                    className="bg-white/5 border-white/20 text-white placeholder:text-white/50"
                    value={String(stripes)}
                    onChange={e => setStripes(Number(e.target.value))}
                  />
                </div>
              )}

            {category === 'kids' && (
              <div className="grid gap-2 pt-2">
                  <Label className="text-white/80">Termo de Responsabilidade</Label>
                  <div className="flex items-center rounded-md border border-input bg-white/5 p-3">
                      <div className="flex-1">
                          {termsAccepted ? (
                              <div className="flex items-center gap-2 text-green-400">
                                  <Check className="h-4 w-4" />
                                  <p className="text-sm font-semibold">Termo assinado.</p>
                              </div>
                          ) : (
                              <p className="text-sm text-muted-foreground">
                                  Assinatura pendente.
                              </p>
                          )}
                      </div>
                      <TermsDialog 
                        onAccept={handleAcceptTerms}
                        isAccepted={termsAccepted}
                      />
                  </div>
                  {!termsAccepted && (
                    <p className="text-xs text-muted-foreground px-1">
                        É obrigatório assinar o termo para matricular um menor.
                    </p>
                  )}
              </div>
            )}


            <Button type="submit" className="w-full" disabled={isFormInvalid}>
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
