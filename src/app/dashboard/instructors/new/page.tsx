"use client";

import { useContext, useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { UserContext } from '../../client-layout';
import { allBelts } from '@/lib/mock-data';
import { ArrowLeft } from 'lucide-react';
import { getBranches, addInstructor, type Branch } from '@/lib/firestoreService';

const instructorFormSchema = z.object({
  name: z.string().min(3, { message: 'O nome deve ter pelo menos 3 caracteres.' }),
  email: z.string().email({ message: 'Por favor, insira um email válido.' }),
  phone: z.string().min(10, { message: 'O telefone deve ter pelo menos 10 dígitos.' }),
  affiliation: z.string().optional(),
  belt: z.string({ required_error: 'Selecione uma graduação.' }).min(1, { message: 'Selecione uma graduação.' }),
  stripes: z.coerce.number().int().min(0).max(6).optional(),
  bio: z.string().optional(),
  avatar: z.string().optional(),
});

type InstructorFormValues = z.infer<typeof instructorFormSchema>;

export default function NewInstructorPage() {
  const user = useContext(UserContext);
  const router = useRouter();
  const { toast } = useToast();
  const [branches, setBranches] = useState<Branch[]>([]);

  const form = useForm<InstructorFormValues>({
    resolver: zodResolver(instructorFormSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      affiliation: '',
      belt: '',
      bio: '',
      avatar: '',
      stripes: 0,
    },
  });

  useEffect(() => {
    getBranches()
      .then(setBranches)
      .catch((error) => {
        console.error("Failed to fetch branches:", error);
        toast({
          variant: "destructive",
          title: "Erro ao carregar filiais.",
        });
      });
  }, [toast]);

  const watchedBelt = form.watch("belt");

  const onSubmit = async (data: InstructorFormValues) => {
    try {
      const instructorData = {
        ...data,
        affiliation: data.affiliation || '',
        bio: data.bio || '',
        avatar: data.avatar || '',
        stripes: data.stripes || 0,
      };

      await addInstructor(instructorData);

      toast({
        title: 'Professor Cadastrado!',
        description: `O professor ${data.name} foi adicionado com sucesso.`,
      });
      router.push(`/dashboard/instructors?role=${user?.role}`);
    } catch (error) {
      console.error("Failed to add instructor:", error);
      toast({
        variant: "destructive",
        title: 'Erro ao cadastrar',
        description: 'Não foi possível adicionar o professor. Tente novamente.',
      });
    }
  };

  if (user?.role !== 'admin') {
    return (
      <div className="flex items-center justify-center h-full">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Acesso Negado</CardTitle>
            <CardDescription>
              Você não tem permissão para acessar esta página.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>Esta área é restrita a administradores.</p>
            <Button asChild className="mt-4">
              <Link href={`/dashboard?role=${user?.role || 'student'}`}>Voltar ao Painel</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href={`/dashboard/instructors?role=${user.role}`}>
            <ArrowLeft />
            <span className="sr-only">Voltar</span>
          </Link>
        </Button>
        <div>
            <h1 className="text-3xl font-bold tracking-tight">Cadastrar Professor</h1>
            <p className="text-muted-foreground">Preencha os dados do novo professor.</p>
        </div>
      </div>
      <Card>
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome Completo</FormLabel>
                      <FormControl>
                        <Input placeholder="Nome do professor" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="email@exemplo.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefone</FormLabel>
                      <FormControl>
                        <Input placeholder="(00) 00000-0000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="affiliation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Filial (Opcional)</FormLabel>
                       <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione uma filial" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                           <SelectItem value="">Nenhuma</SelectItem>
                          {branches.map((branch) => (
                            <SelectItem key={branch.id} value={branch.name}>{branch.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="belt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Graduação</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione a graduação" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {allBelts.map((belt) => (
                            <SelectItem key={belt} value={belt}>{belt}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {(watchedBelt === 'Preta' || watchedBelt === 'Coral') && (
                  <FormField
                    control={form.control}
                    name="stripes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Graus na Faixa</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            max="6"
                            placeholder="Nº de graus (0-6)"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value, 10) || 0)}
                           />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                 <FormField
                  control={form.control}
                  name="avatar"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>URL da Foto (Opcional)</FormLabel>
                      <FormControl>
                        <Input placeholder="https://..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
               <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Biografia (Opcional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Fale um pouco sobre a jornada do professor..."
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              <div className="flex justify-end gap-2">
                  <Button variant="outline" type="button" onClick={() => router.back()} disabled={form.formState.isSubmitting}>
                      Cancelar
                  </Button>
                  <Button type="submit" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting ? 'Salvando...' : 'Salvar Professor'}
                  </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
