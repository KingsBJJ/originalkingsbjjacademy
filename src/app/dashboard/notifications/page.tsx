
"use client";

import { useContext, useState, useEffect } from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserContext } from "../client-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, Rss } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { addNotification, getNotifications, type Notification } from "@/lib/firestoreService";
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Form schema
const notificationFormSchema = z.object({
    title: z.string().min(5, { message: "O título deve ter pelo menos 5 caracteres." }),
    content: z.string().min(10, { message: "O conteúdo deve ter pelo menos 10 caracteres." }),
});
type NotificationFormValues = z.infer<typeof notificationFormSchema>;

// The form component
function NotificationForm({ onPost }: { onPost: () => void }) {
    const user = useContext(UserContext);
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const form = useForm<NotificationFormValues>({
        resolver: zodResolver(notificationFormSchema),
        defaultValues: { title: "", content: "" }
    });

    const onSubmit = async (data: NotificationFormValues) => {
        if (!user || (user.role !== 'admin' && user.role !== 'professor')) return;

        setIsSubmitting(true);
        try {
            const notificationData = {
                title: data.title,
                content: data.content,
                authorId: user.id,
                authorName: user.name,
                authorAvatar: user.avatar,
                authorRole: user.role,
                target: user.role === 'admin' ? 'all' : user.affiliation,
            };

            const result = await addNotification(notificationData as any);
            
            if (result.success) {
                toast({
                    title: "Notificação Enviada!",
                    description: "Seu recado foi publicado.",
                });
                form.reset();
                onPost(); // Callback to refresh the list
            } else {
                 throw new Error(result.message);
            }

        } catch (error) {
            console.error("Failed to send notification:", error);
            toast({
                variant: 'destructive',
                title: "Erro ao Enviar",
                description: error instanceof Error ? error.message : "Não foi possível publicar o recado. Tente novamente.",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Enviar um Novo Recado</CardTitle>
                <CardDescription>
                    {user?.role === 'admin' 
                        ? "Escreva uma notificação para toda a equipe."
                        : `Escreva uma notificação para a filial ${user?.affiliation}.`
                    }
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField control={form.control} name="title" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Título</FormLabel>
                                <FormControl><Input placeholder="Ex: Seminário de Sábado" {...field} disabled={isSubmitting} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="content" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Mensagem</FormLabel>
                                <FormControl><Textarea placeholder="Detalhes do evento, notícia, etc." className="resize-y" {...field} disabled={isSubmitting} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <div className="flex justify-end">
                            <Button type="submit" disabled={isSubmitting}>
                                <Send className="mr-2 h-4 w-4" />
                                {isSubmitting ? "Publicando..." : "Publicar"}
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
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();

    const fetchNotifications = async () => {
        if (!user) return;
        setIsLoading(true);
        try {
            const data = await getNotifications(user);
            setNotifications(data);
        } catch (error) {
            console.error("Failed to fetch notifications", error);
            toast({
                variant: 'destructive',
                title: 'Erro ao buscar recados',
                description: 'Não foi possível carregar o mural de recados.',
            });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if(user) {
          fetchNotifications();
        }
    }, [user]);

    const renderTimestamp = (timestamp: Date) => {
        if (!timestamp) return 'data inválida';
        try {
            return formatDistanceToNow(timestamp, { addSuffix: true, locale: ptBR });
        } catch (error) {
            return 'data inválida';
        }
    };

    return (
        <div className="grid gap-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Mural de Recados</h1>
                <p className="text-muted-foreground">
                    Fique por dentro das últimas notícias e comunicados da equipe.
                </p>
            </div>

            {canPost && <NotificationForm onPost={fetchNotifications} />}

            <div className="space-y-4">
                {isLoading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                        <Card key={i}>
                            <CardHeader><Skeleton className="h-5 w-3/5" /></CardHeader>
                            <CardContent className="space-y-2"><Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-4/5" /></CardContent>
                        </Card>
                    ))
                ) : notifications.length === 0 ? (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center gap-4 text-center h-48">
                           <Rss className="h-12 w-12 text-muted-foreground" />
                           <div className="space-y-1">
                             <h3 className="font-semibold">Nenhum recado ainda</h3>
                             <p className="text-sm text-muted-foreground">Não há nada novo por aqui. Volte mais tarde!</p>
                           </div>
                        </CardContent>
                    </Card>
                ) : (
                    notifications.map((announcement) => (
                        <Card key={announcement.id} className="transition-colors hover:bg-muted/50">
                            <CardHeader>
                                <div className="flex items-start justify-between gap-4">
                                    <div className="space-y-1.5">
                                        <CardTitle>{announcement.title}</CardTitle>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Avatar className="h-6 w-6">
                                                <AvatarImage src={announcement.authorAvatar} alt={announcement.authorName} />
                                                <AvatarFallback>{announcement.authorName.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <span>{announcement.authorName}</span>
                                            <span>&middot;</span>
                                            <span>{renderTimestamp(announcement.createdAt)}</span>
                                        </div>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="whitespace-pre-wrap text-sm text-muted-foreground">{announcement.content}</p>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
