
'use client';

import { useState, useMemo, useEffect } from 'react';
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
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { updateUser, type User, type Branch, type Instructor } from '@/lib/firestoreService';

const profileFormSchema = z.object({
  name: z.string().min(3, { message: 'O nome deve ter pelo menos 3 caracteres.' }),
  email: z.string().email({ message: 'Por favor, insira um e-mail válido.' }),
  phone: z.string().min(10, { message: 'O telefone deve ter pelo menos 10 dígitos.' }).optional(),
  avatar: z.string().url({ message: 'Por favor, insira uma URL válida.' }).or(z.literal('')).optional(),
  affiliation: z.string().min(1, { message: 'Selecione uma filial.' }),
  mainInstructor: z.string().min(1, { message: 'Selecione um professor.' }),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

type EditProfileFormProps = {
  initialUser: User;
  branches: Branch[];
  allInstructors: Instructor[];
};

export function EditProfileForm({ initialUser, branches, allInstructors }: EditProfileFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: initialUser.name,
      email: initialUser.email,
      phone: initialUser.phone || '',
      avatar: initialUser.avatar.startsWith('https://placehold.co') ? '' : initialUser.avatar,
      affiliation: initialUser.affiliations?.[0] || '',
      mainInstructor: initialUser.mainInstructor || '',
    },
  });

  const selectedAffiliation = form.watch('affiliation');

  const filteredInstructors = useMemo(() => {
    if (!selectedAffiliation) return [];
    return allInstructors.filter(
      (instructor) => instructor.affiliations?.includes(selectedAffiliation)
    );
  }, [selectedAffiliation, allInstructors]);

  // Reset mainInstructor if it's not in the filtered list
  useEffect(() => {
    const isCurrentInstructorValid = filteredInstructors.some(
      (instructor) => instructor.name === form.getValues('mainInstructor')
    );
    if (!isCurrentInstructorValid) {
      form.setValue('mainInstructor', '');
    }
  }, [filteredInstructors, form]);


  const onSubmit = async (data: ProfileFormValues) => {
    setIsSaving(true);
    try {
      const selectedBranch = branches.find(b => b.name === data.affiliation);
      const branchId = selectedBranch ? selectedBranch.id : '';

      const updateData: Partial<User> = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        avatar: data.avatar || `https://placehold.co/128x128.png?text=${data.name.charAt(0)}`,
        affiliations: [data.affiliation],
        branchId: branchId,
        mainInstructor: data.mainInstructor,
      };
      
      await updateUser(initialUser.id, updateData);

      toast({
        title: 'Perfil Atualizado!',
        description: 'Suas informações foram salvas com sucesso.',
      });

      const params = new URLSearchParams({
        role: initialUser.role,
        email: data.email,
        name: data.name,
      });
      
      router.push(`/dashboard/profile?${params.toString()}`);
      router.refresh();

    } catch (error) {
      console.error("Failed to update profile:", error);
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
                      <Input placeholder="Seu nome" {...field} />
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
                      <Input type="email" placeholder="seu@email.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                 <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefone (Opcional)</FormLabel>
                      <FormControl>
                        <Input placeholder="(00) 00000-0000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
            
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField
                  control={form.control}
                  name="affiliation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Filial</FormLabel>
                       <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione sua filial" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
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
                  name="mainInstructor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Professor Principal</FormLabel>
                       <Select onValueChange={field.onChange} value={field.value} disabled={!selectedAffiliation || filteredInstructors.length === 0}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={!selectedAffiliation ? "Selecione a filial primeiro" : "Selecione seu professor"} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {filteredInstructors.map((instructor) => (
                            <SelectItem key={instructor.id} value={instructor.name}>{instructor.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
            </div>


            <div className="flex justify-end gap-2 pt-4">
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
  );
}
