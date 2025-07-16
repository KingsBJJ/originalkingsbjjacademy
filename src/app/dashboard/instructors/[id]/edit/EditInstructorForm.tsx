
"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
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
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { allBelts, type User } from '@/lib/mock-data';
import { ArrowLeft } from 'lucide-react';
import { updateInstructor, type Branch, type Instructor } from '@/lib/firestoreService';

const instructorFormSchema = z.object({
  name: z.string().min(3, { message: 'O nome deve ter pelo menos 3 caracteres.' }),
  email: z.string().email({ message: 'Por favor, insira um email válido.' }),
  phone: z.string().min(10, { message: 'O telefone deve ter pelo menos 10 dígitos.' }),
  dateOfBirth: z.string().optional(),
  affiliations: z.array(z.string()).optional(),
  belt: z.string({ required_error: 'Selecione uma graduação.' }).min(1, { message: 'Selecione uma graduação.' }),
  stripes: z.coerce.number().int().min(0).max(6).optional(),
  bio: z.string().optional(),
  avatar: z.string().optional(),
});

type InstructorFormValues = z.infer<typeof instructorFormSchema>;

type EditInstructorFormProps = {
  user: User;
  initialInstructor: Instructor;
  branches: Branch[];
};

export function EditInstructorForm({ user, initialInstructor, branches }: EditInstructorFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  
  const form = useForm<InstructorFormValues>({
    resolver: zodResolver(instructorFormSchema),
    defaultValues: {
      name: initialInstructor.name,
      email: initialInstructor.email,
      phone: initialInstructor.phone,
      dateOfBirth: initialInstructor.dateOfBirth || '',
      affiliations: initialInstructor.affiliations || [],
      belt: initialInstructor.belt,
      stripes: initialInstructor.stripes || 0,
      bio: initialInstructor.bio || '',
      avatar: initialInstructor.avatar || '',
    },
  });
  
  const watchedBelt = form.watch("belt");
  
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

  const onSubmit = async (data: InstructorFormValues) => {
    setIsSaving(true);
    try {
        const { name, email, phone, belt, affiliations, bio, avatar, stripes, dateOfBirth } = data;

        const instructorData: Omit<Instructor, 'id'> = {
            name,
            email,
            phone,
            dateOfBirth,
            belt,
            affiliations: affiliations ?? [],
            bio: bio ?? '',
            avatar: avatar ?? '',
            stripes: stripes ?? 0,
        };

        await updateInstructor(initialInstructor.id, instructorData);

        toast({
            title: 'Professor Atualizado!',
            description: `O professor ${data.name} foi atualizado com sucesso.`,
        });
      
        router.push(`/dashboard/instructors?role=${user?.role}`);
        router.refresh();

    } catch (error) {
      console.error("Failed to update instructor:", error);
      toast({
        variant: "destructive",
        title: 'Erro ao atualizar',
        description: 'Não foi possível salvar as alterações. Tente novamente.',
      });
    } finally {
        setIsSaving(false);
    }
  };

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
            <h1 className="text-3xl font-bold tracking-tight">Editar Professor</h1>
            <p className="text-muted-foreground">Atualize os dados do professor.</p>
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
                  name="dateOfBirth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data de Nascimento</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} value={field.value ?? ''} />
                      </FormControl>
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
                    <FormItem className="md:col-span-2">
                      <FormLabel>URL da Foto (Opcional)</FormLabel>
                      <FormControl>
                        <Input placeholder="https://..." {...field} value={field.value ?? ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="affiliations"
                render={() => (
                  <FormItem>
                    <div className="mb-4">
                      <FormLabel className="text-base">Filiais</FormLabel>
                      <FormDescription>
                        Selecione todas as filiais onde este professor leciona.
                      </FormDescription>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 rounded-lg border p-4">
                      {branches.map((branch) => (
                        <FormField
                          key={branch.id}
                          control={form.control}
                          name="affiliations"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={branch.id}
                                className="flex flex-row items-start space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(branch.name)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...(field.value ?? []), branch.name])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== branch.name
                                            )
                                          )
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  {branch.name}
                                </FormLabel>
                              </FormItem>
                            )
                          }}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                          value={field.value ?? ''}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
