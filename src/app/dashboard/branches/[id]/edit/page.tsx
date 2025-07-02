"use client";

import { useContext, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
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
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { UserContext } from '../../../client-layout';
import { mockInstructors } from '@/lib/mock-data';
import { ArrowLeft } from 'lucide-react';
import { getBranch, updateBranch, type Branch } from '@/lib/firestoreService';
import { Skeleton } from '@/components/ui/skeleton';

const branchFormSchema = z.object({
  name: z.string().min(3, { message: 'O nome da filial deve ter pelo menos 3 caracteres.' }),
  address: z.string().min(10, { message: 'O endereço deve ter pelo menos 10 caracteres.' }),
  phone: z.string().min(10, { message: 'O telefone deve ter pelo menos 10 dígitos.' }),
  hours: z.string().min(5, { message: 'Insira um horário de funcionamento válido.' }),
  responsible: z.string({ required_error: 'Selecione um responsável.' }).min(1, 'Selecione um responsável.'),
  instructor2: z.string().optional(),
  instructor3: z.string().optional(),
  instructor4: z.string().optional(),
});

type BranchFormValues = z.infer<typeof branchFormSchema>;

const EditBranchPageSkeleton = () => (
    <div className="grid gap-6">
        <div className="flex items-center gap-4">
            <Skeleton className="h-10 w-10" />
            <div>
                <Skeleton className="h-8 w-64 mb-2" />
                <Skeleton className="h-5 w-80" />
            </div>
        </div>
        <Card>
            <CardContent className="pt-6 space-y-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="space-y-2"><Skeleton className="h-4 w-24" /><Skeleton className="h-10 w-full" /></div>
                    <div className="space-y-2"><Skeleton className="h-4 w-32" /><Skeleton className="h-10 w-full" /></div>
                </div>
                <div className="space-y-2"><Skeleton className="h-4 w-48" /><div className="grid grid-cols-1 md:grid-cols-3 gap-4"><Skeleton className="h-10 w-full" /><Skeleton className="h-10 w-full" /><Skeleton className="h-10 w-full" /></div></div>
                <div className="space-y-2"><Skeleton className="h-4 w-20" /><Skeleton className="h-10 w-full" /></div>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="space-y-2"><Skeleton className="h-4 w-24" /><Skeleton className="h-10 w-full" /></div>
                    <div className="space-y-2"><Skeleton className="h-4 w-40" /><Skeleton className="h-10 w-full" /></div>
                </div>
                <div className="flex justify-end gap-2">
                    <Skeleton className="h-10 w-24" />
                    <Skeleton className="h-10 w-24" />
                </div>
            </CardContent>
        </Card>
    </div>
);


export default function EditBranchPage() {
  const user = useContext(UserContext);
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const [branch, setBranch] = useState<Branch | null>(null);
  const [loading, setLoading] = useState(true);

  const branchId = params.id as string;

  const form = useForm<BranchFormValues>({
    resolver: zodResolver(branchFormSchema),
  });

  useEffect(() => {
    const fetchBranchData = async () => {
      if (!branchId) return;
      try {
        const data = await getBranch(branchId);
        if (data) {
          setBranch(data);
          form.reset({
            name: data.name,
            address: data.address,
            phone: data.phone,
            hours: data.hours,
            responsible: data.responsible,
            instructor2: data.additionalInstructors?.[0] || '',
            instructor3: data.additionalInstructors?.[1] || '',
            instructor4: data.additionalInstructors?.[2] || '',
          });
        } else {
            toast({ variant: "destructive", title: "Filial não encontrada." });
            router.push(`/dashboard/branches?role=${user?.role}`);
        }
      } catch (error) {
        console.error("Failed to fetch branch:", error);
        toast({ variant: "destructive", title: "Erro ao carregar filial." });
      } finally {
        setLoading(false);
      }
    };
    fetchBranchData();
  }, [branchId, form, router, toast, user?.role]);

  const onSubmit = async (data: BranchFormValues) => {
    try {
      const { responsible, instructor2, instructor3, instructor4, ...rest } = data;
      const additionalInstructors = [instructor2, instructor3, instructor4].filter(
        (instructor) => instructor && instructor.trim() !== ''
      );

      const branchData = {
        ...rest,
        responsible,
        additionalInstructors,
      };

      await updateBranch(branchId, branchData);

      toast({
        title: 'Filial Atualizada!',
        description: `A filial ${data.name} foi atualizada com sucesso.`,
      });
      router.push(`/dashboard/branches?role=${user?.role}`);
    } catch (error) {
      console.error("Failed to update branch:", error);
      toast({
        variant: "destructive",
        title: 'Erro ao atualizar',
        description: 'Não foi possível salvar as alterações. Tente novamente.',
      });
    }
  };

  if (loading) {
    return <EditBranchPageSkeleton />;
  }

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

  if (!branch) {
      return null;
  }

  return (
    <div className="grid gap-6">
       <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href={`/dashboard/branches?role=${user.role}`}>
            <ArrowLeft />
            <span className="sr-only">Voltar</span>
          </Link>
        </Button>
        <div>
            <h1 className="text-3xl font-bold tracking-tight">Editar Filial</h1>
            <p className="text-muted-foreground">Atualize os dados da filial.</p>
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
                      <FormLabel>Nome da Filial</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Kings BJJ - Sul" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="responsible"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Professor Responsável</FormLabel>
                       <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um professor" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {mockInstructors.map((instructor) => (
                            <SelectItem key={instructor.id} value={instructor.name}>{instructor.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label>Professores Adicionais (Opcional)</Label>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <FormField
                      control={form.control}
                      name="instructor2"
                      render={({ field }) => (
                        <FormItem>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="2º Professor" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {mockInstructors.map((instructor) => (
                                <SelectItem key={instructor.id} value={instructor.name}>{instructor.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="instructor3"
                      render={({ field }) => (
                        <FormItem>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="3º Professor" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {mockInstructors.map((instructor) => (
                                <SelectItem key={instructor.id} value={instructor.name}>{instructor.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="instructor4"
                      render={({ field }) => (
                        <FormItem>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="4º Professor" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {mockInstructors.map((instructor) => (
                                <SelectItem key={instructor.id} value={instructor.name}>{instructor.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                </div>
              </div>


              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Endereço</FormLabel>
                    <FormControl>
                      <Input placeholder="Rua, Número, Bairro, Cidade - Estado" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefone</FormLabel>
                      <FormControl>
                        <Input placeholder="(00) 0000-0000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                  <FormField
                  control={form.control}
                  name="hours"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Horário de Funcionamento</FormLabel>
                      <FormControl>
                        <Input placeholder="Seg-Sex, 9h às 21h" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="flex justify-end gap-2">
                  <Button variant="outline" type="button" onClick={() => router.back()}>
                      Cancelar
                  </Button>
                  <Button type="submit" disabled={form.formState.isSubmitting}>
                     {form.formState.isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
                  </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
