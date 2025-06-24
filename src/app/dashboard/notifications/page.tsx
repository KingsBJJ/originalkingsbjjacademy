"use client";

import { useContext } from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserContext } from "../client-layout";
import { mockAnnouncements } from "@/lib/mock-data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send } from "lucide-react";

// Form schema
const notificationFormSchema = z.object({
    title: z.string().min(5, { message: "O título deve ter pelo menos 5 caracteres." }),
    content: z.string().min(10, { message: "O conteúdo deve ter pelo menos 10 caracteres." }),
});
type NotificationFormValues = z.infer<typeof notificationFormSchema>;

// The form component
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
                <CardDescription>Escreva uma notificação para toda a equipe.</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField control={form.control} name="title" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Título</FormLabel>
                                <FormControl><Input placeholder="Ex: Seminário de Sábado" {...field} /></FormControl>
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
                                Publicar
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}

// Main page component
export default function NotificationsPage() {
    const user = useContext(UserContext);
    const canPost = user?.role === 'admin' || user?.role === 'professor';

    return (
        <div className="grid gap-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Mural de Recados</h1>
                <p className="text-muted-foreground">
                    Fique por dentro das últimas notícias e comunicados da equipe.
                </p>
            </div>
            {canPost && <NotificationForm />}
            <div className="space-y-4">
                {mockAnnouncements.map((announcement) => (
                    <Card key={announcement.id}>
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
            </div>
        </div>
    );
}
