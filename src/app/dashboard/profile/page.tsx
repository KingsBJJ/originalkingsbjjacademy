"use client";

import { useContext } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { mockAttendanceHistory, beltColors, mockAnnouncements } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { Medal, Send } from "lucide-react";
import { UserContext } from "../client-layout";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

// Form schema for notifications
const notificationFormSchema = z.object({
    title: z.string().min(5, { message: "O título deve ter pelo menos 5 caracteres." }),
    content: z.string().min(10, { message: "O conteúdo deve ter pelo menos 10 caracteres." }),
});
type NotificationFormValues = z.infer<typeof notificationFormSchema>;

// The form component for notifications
function NotificationForm() {
    const { toast } = useToast();
    const form = useForm<NotificationFormValues>({
        resolver: zodResolver(notificationFormSchema),
        defaultValues: { title: "", content: "" }
    });

    const onSubmit = (data: NotificationFormValues) => {
        console.log("Nova notificação:", data);
        toast({
            title: "Notificação Enviada!",
            description: "Seu recado foi publicado para todos os membros.",
        });
        form.reset();
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Enviar um Novo Recado</CardTitle>
                <CardDescription>Escreva uma notificação que aparecerá no mural.</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField control={form.control} name="title" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Título</FormLabel>
                                <FormControl><Input placeholder="Ex: Lembrete sobre o Seminário" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="content" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Mensagem</FormLabel>
                                <FormControl><Textarea placeholder="Detalhes do evento, notícia, etc." className="resize-y" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <div className="flex justify-end">
                            <Button type="submit">
                                <Send className="mr-2 h-4 w-4" />
                                Publicar Recado
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}


export default function ProfilePage() {
  const user = useContext(UserContext);

  if (!user) {
    return <div>Carregando...</div>;
  }

  const beltStyle = beltColors[user.belt] || beltColors.Branca;

  return (
    <div className="grid gap-6">
      <div className="flex flex-col items-start gap-4 md:flex-row">
        <Avatar className="h-24 w-24 border-2 border-primary">
          <AvatarImage src={user.avatar} alt={user.name} />
          <AvatarFallback className="text-3xl">
            {user.name.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">{user.name}</h1>
          <p className="text-muted-foreground">{user.email}</p>
          <p className="text-sm text-muted-foreground">
            {user.affiliation}
          </p>
          <div className="mt-2 flex items-center gap-2">
            <Badge
              className={cn(
                "px-4 py-1 text-sm font-semibold shadow-md",
                beltStyle.bg,
                beltStyle.text
              )}
            >
              Faixa {user.belt}
              {(user.belt === 'Preta' || user.belt === 'Coral') && user.stripes > 0 && ` - ${user.stripes}º Grau`}
            </Badge>
            {(user.belt !== 'Preta' && user.belt !== 'Coral') && (
              <div className="flex gap-1">
                {Array.from({ length: user.stripes }).map((_, i) => (
                  <div key={i} className="h-4 w-1 bg-primary" />
                ))}
              </div>
            )}
          </div>
        </div>
        <Button>Editar Perfil</Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Medal />
              <span>Progresso de Graduação</span>
            </CardTitle>
            <CardDescription>
              Acompanhe sua jornada para o próximo nível.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm font-medium">
                <span>Para o Próximo Grau/Faixa</span>
                <span>{user.nextGraduationProgress}%</span>
              </div>
              <Progress value={user.nextGraduationProgress} />
            </div>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold">
                  {user.attendance.total}
                </p>
                <p className="text-sm text-muted-foreground">Total de Aulas</p>
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {user.attendance.lastMonth}
                </p>
                <p className="text-sm text-muted-foreground">Aulas no Mês</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Informações Pessoais</CardTitle>
            <CardDescription>
              Seus detalhes pessoais.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
                <span className="font-medium text-muted-foreground">Função:</span>
                <span className="capitalize">{user.role}</span>
            </div>
             <div className="flex justify-between">
                <span className="font-medium text-muted-foreground">Membro Desde:</span>
                <span>Jan 2022</span>
            </div>
             <div className="flex justify-between">
                <span className="font-medium text-muted-foreground">Contato de Emergência:</span>
                <span>(55) 5555-1111</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {user.role === 'student' ? (
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Presença</CardTitle>
              <CardDescription>
                Seus check-ins de aulas recentes.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Aula</TableHead>
                    <TableHead className="text-right">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockAttendanceHistory.map((item) => (
                    <TableRow key={item.date}>
                      <TableCell>{item.date}</TableCell>
                      <TableCell>{item.class}</TableCell>
                      <TableCell className="text-right">
                        <Badge
                          variant={
                            item.status === "Presente" ? "default" : "destructive"
                          }
                          className={cn(
                            item.status === "Presente" && "bg-green-500/20 text-green-300 border-green-500/30"
                          )}
                        >
                          {item.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
      ) : (
        <div className="space-y-6">
          <NotificationForm />
          <Card>
            <CardHeader>
                <CardTitle>Mural de Recados Recentes</CardTitle>
                <CardDescription>
                    Os últimos recados publicados para a equipe.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {mockAnnouncements.map((announcement) => (
                    <Card key={announcement.id} className="transition-colors hover:bg-muted/50">
                        <CardHeader>
                            <div className="flex items-start justify-between gap-4">
                                <div className="space-y-1.5">
                                    <CardTitle>{announcement.title}</CardTitle>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Avatar className="h-6 w-6">
                                            <AvatarImage src={announcement.authorAvatar} alt={announcement.author} />
                                            <AvatarFallback>{announcement.author.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <span>{announcement.author}</span>
                                        <span>&middot;</span>
                                        <span>{announcement.timestamp}</span>
                                    </div>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="whitespace-pre-wrap text-sm text-muted-foreground">{announcement.content}</p>
                        </CardContent>
                    </Card>
                ))}
            </CardContent>
        </Card>
       </div>
      )}
    </div>
  );
}
