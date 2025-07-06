
"use client";

import { useContext, useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
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
import { ArrowLeft, PlusCircle, Trash2 } from 'lucide-react';
import { getBranch, updateBranch, getInstructors, type Branch, type Instructor } from '@/lib/firestoreService';
import { Skeleton } from '@/components/ui/skeleton';

const classScheduleSchema = z.object({
  name: z.string().min(1, { message: 'O nome da aula é obrigatório.' }),
  day: z.string().min(1, { message: 'O dia da semana é obrigatório.' }),
  time: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)\s*-\s*([01]\d|2[0-3]):([0-5]\d)$/, { message: 'Use o formato HH:mm - HH:mm.' }),
  instructor: z.string().min(1, { message: 'Selecione um instrutor.' }),
  category: z.enum(['Adults', 'Kids'], { required_error: 'Selecione a categoria.' }),
});

const branchFormSchema = z.object({
  name: z.string().min(3, { message: 'O nome da filial deve ter pelo menos 3 caracteres.' }),
  address: z.string().min(10, { message: 'O endereço deve ter pelo menos 10 caracteres.' }),
  phone: z.string().min(10, { message: 'O telefone deve ter pelo menos 10 dígitos.' }),
  responsible: z.string().optional(),
  instructor2: z.string().optional(),
  instructor3: z.string().optional(),
  instructor4: z.string().optional(),
  schedule: z.array(classScheduleSchema).optional(),
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
                 <div className="space-y-2"><Skeleton className="h-4 w-24" /><Skeleton className="h-10 w-full" /></div>
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
  const [isSaving, setIsSaving] = useState(false);
  const [instructors, setInstructors] = useState<Instructor[]>([]);

  const branchId = params.id as string;

  const form = useForm<BranchFormValues>({
    resolver: zodResolver(branchFormSchema),
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "schedule",
  });
  
  const { reset } = form;
  const userRole = user?.role;

  const fetchData = useCallback(async () => {
    if (!branchId) return;
    try {
      setLoading(true);
      const [branchData, instructorsData] = await Promise.all([
        getBranch(branchId),
        getInstructors(),
      ]);
      
      setInstructors(instructorsData);

      if (branchData) {
        setBranch(branchData);
        reset({
          name: branchData.name,
          address: branchData.address,
          phone: branchData.phone,
          responsible: branchData.responsible || '',
          instructor2: branchData.additionalInstructors?.[0] || '',
          instructor3: branchData.additionalInstructors?.[1] || '',
          instructor4: branchData.additionalInstructors?.[2] || '',
          schedule: branchData.schedule || [],
        });
      } else {
          toast({ variant: "destructive", title: "Filial não encontrada." });
          if(userRole) router.push(`/dashboard/branches?role=${userRole}`);
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
      toast({ variant: "destructive", title: "Erro ao carregar dados da página." });
    } finally {
      setLoading(false);
    }
  }, [branchId, reset, router, toast, userRole]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onSubmit = async (data: BranchFormValues) => {
    setIsSaving(true);
    try {
      const { name, address, phone, schedule, responsible, instructor2, instructor3, instructor4 } = data;
      
      const additionalInstructors = [instructor2, instructor3, instructor4].filter(
        (instructor): instructor is string => !!instructor && instructor.trim() !== ''
      );

      const branchData = {
        name: name,
        address: address,
        phone: phone,
        schedule: schedule ?? [],
        responsible: responsible ?? '',
        additionalInstructors: additionalInstructors ?? [],
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
    } finally {
      setIsSaving(false);
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
                      <FormLabel>Professor Responsável (Opcional)</FormLabel>
                       <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um professor" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {instructors.map((instructor) => (
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
                              {instructors.map((instructor) => (
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
                              {instructors.map((instructor) => (
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
                              {instructors.map((instructor) => (
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
              </div>
              
              {/* Schedule Section */}
              <div className="space-y-4 rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                      <div>
                          <h3 className="font-semibold">Horários das Aulas</h3>
                          <p className="text-sm text-muted-foreground">Adicione as aulas e seus horários para esta filial.</p>
                      </div>
                      <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => append({ name: '', day: '', time: '', instructor: '', category: 'Adults' })}
                      >
                          <PlusCircle className="mr-2 h-4 w-4" />
                          Adicionar Horário
                      </Button>
                  </div>
                  <div className="space-y-4">
                    {fields.map((field, index) => (
                        <div key={field.id} className="grid grid-cols-1 md:grid-cols-[2fr,1.5fr,1fr,2fr,1fr,auto] gap-2 items-end border-t pt-4">
                            <FormField control={form.control} name={`schedule.${index}.name`} render={({ field }) => (
                                <FormItem><FormLabel>Aula</FormLabel><FormControl><Input placeholder="Ex: Fundamentos" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name={`schedule.${index}.day`} render={({ field }) => (
                                <FormItem><FormLabel>Dia(s)</FormLabel><FormControl><Input placeholder="Ex: Seg/Qua/Sex" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name={`schedule.${index}.time`} render={({ field }) => (
                                <FormItem><FormLabel>Horário</FormLabel><FormControl><Input placeholder="18:00 - 19:00" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name={`schedule.${index}.instructor`} render={({ field }) => (
                                <FormItem><FormLabel>Professor</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Selecione"/></SelectTrigger></FormControl><SelectContent>{instructors.map(i => <SelectItem key={i.id} value={i.name}>{i.name}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name={`schedule.${index}.category`} render={({ field }) => (
                                <FormItem><FormLabel>Categoria</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl><SelectContent><SelectItem value="Adults">Adultos</SelectItem><SelectItem value="Kids">Kids</SelectItem></SelectContent></Select><FormMessage /></FormItem>
                            )} />
                            <Button type="button" variant="destructive" size="icon" onClick={() => remove(index)}>
                                <Trash2 className="h-4 w-4" /><span className="sr-only">Remover</span>
                            </Button>
                        </div>
                    ))}
                  </div>
                  {fields.length === 0 && (
                      <p className="text-center text-sm text-muted-foreground py-4">Nenhum horário adicionado.</p>
                  )}
              </div>
              
              <div className="flex justify-end gap-2">
                  <Button variant="outline" type="button" onClick={() => router.back()} disabled={isSaving}>
                      Cancelar
                  </Button>
                  <Button type="submit" disabled={isSaving}>
                     {isSaving ? 'Salvando...' : 'Salvar Alterações'}
                  </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
