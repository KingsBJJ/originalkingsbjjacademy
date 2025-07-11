
"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { createContext, useState, useCallback, useMemo, useEffect } from "react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import { KingsBjjLogo } from "@/components/kings-bjj-logo";
import type { User } from "@/lib/firestoreService";
import { mockUsers } from "@/lib/mock-data";
import {
  Award,
  Bell,
  LayoutDashboard,
  LogOut,
  MapPin,
  User as UserIcon,
  Users,
  Shield,
  QrCode,
  Calendar,
  FileText,
  Contact,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { updateUser as updateDbUser, getNotifications, type Notification, getUserByEmail } from "@/lib/firestoreService";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';


type NavItem = {
  href: string;
  icon: React.ElementType;
  label: string;
  external?: boolean;
  className?: string;
};

const studentNavItems: NavItem[] = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Painel" },
  { href: "/dashboard/notifications", icon: Bell, label: "Notificações" },
  { href: "/dashboard/profile", icon: UserIcon, label: "Perfil" },
  { href: "/dashboard/schedule", icon: Calendar, label: "Horários" },
  { href: "/dashboard/check-in", icon: QrCode, label: "Check-in", className: "text-yellow-400 hover:text-yellow-300" },
  { href: "/dashboard/branches", icon: MapPin, label: "Filiais" },
  { href: "/dashboard/rankings", icon: Award, label: "Graduações" },
  { href: "/terms-of-service", icon: FileText, label: "Termo de Resp." },
];

const professorNavItems: NavItem[] = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Painel" },
  { href: "/dashboard/notifications", icon: Bell, label: "Notificações" },
  { href: "/dashboard/schedule", icon: Calendar, label: "Horários" },
  { href: "/dashboard/profile", icon: UserIcon, label: "Perfil" },
  { href: "/dashboard/my-students", icon: Contact, label: "Meus Alunos" },
  { href: "/dashboard/rankings", icon: Award, label: "Graduações" },
  { href: "/dashboard/branches", icon: MapPin, label: "Filiais" },
  { href: "/terms-of-service", icon: FileText, label: "Termo de Resp." },
];

const adminNavItems: NavItem[] = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Painel" },
  { href: "/dashboard/notifications", icon: Bell, label: "Notificações" },
  { href: "/dashboard/class-qr", icon: QrCode, label: "QR Code Universal" },
  { href: "/dashboard/profile", icon: UserIcon, label: "Perfil" },
  { href: "/dashboard/instructors", icon: Users, label: "Professores" },
  { href: "/dashboard/manage-students", icon: Shield, label: "Gerenciar Alunos" },
  { href: "/dashboard/rankings", icon: Award, label: "Graduações" },
  { href: "/dashboard/branches", icon: MapPin, label: "Filiais" },
  { href: "/terms-of-service", icon: FileText, label: "Termo de Resp." },
];

export const UserContext = createContext<User | null>(null);
export const UserUpdateContext = createContext<((newUserData: Partial<User>) => void) | null>(null);

const NOTIFICATION_STORAGE_KEY = 'kingsbjj_last_notification_seen_timestamp';

export default function DashboardClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const [user, setUser] = useState<User | null>(null);
  const [newStudentNotification, setNewStudentNotification] = useState(false);
  const [newStudentName, setNewStudentName] = useState('');

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [hasNewNotification, setHasNewNotification] = useState(false);

  useEffect(() => {
    const determineUser = async () => {
      const roleParam = searchParams.get('role') as User['role'];
      const email = searchParams.get('email');
      const name = searchParams.get('name');
      const isNewStudent = searchParams.get('newStudent') === 'true';

      if (isNewStudent && name) {
        setNewStudentNotification(true);
        setNewStudentName(name);
      }
      
      const cleanEmail = email?.trim().toLowerCase();
      let userToSet: User | null = null;
      
      // Admin check - uses mock data
      if (cleanEmail === 'admin@kingsbjj.com' || cleanEmail === 'admin@kings.com' || roleParam === 'admin') {
          userToSet = mockUsers.admin;
          setUser(userToSet);
          return;
      }
      
      // If email is present, prioritize finding a real user in the database
      if (cleanEmail) {
        const foundUser = await getUserByEmail(cleanEmail);
        if (foundUser) {
          userToSet = foundUser;
          setUser(userToSet);
          return;
        }
      }

      // If it's a new student signup, construct the user object from params
      if (!userToSet && isNewStudent) {
          const affiliation = searchParams.get('affiliation') || '';
          const belt = searchParams.get('belt') || '';
          userToSet = {
              id: `user_${(email || Date.now().toString()).replace(/[@.]/g, '_')}`,
              name: name || 'Novo Aluno',
              email: email || '',
              role: 'student',
              affiliations: affiliation ? [affiliation] : [],
              branchId: searchParams.get('branchId') || '',
              mainInstructor: searchParams.get('mainInstructor') || '',
              category: (searchParams.get('category') as User['category']) || 'Adult',
              belt,
              stripes: Number(searchParams.get('stripes') || 0),
              avatar: `https://placehold.co/128x128.png?text=${(name || 'A').charAt(0)}`,
              attendance: { total: 0, lastMonth: 0 },
              nextGraduationProgress: 5,
          };
          setUser(userToSet);
          return;
      }
      
      // Fallback for demonstration purposes (e.g., professor login) or if no user is found
      if (!userToSet) {
          if (roleParam === 'professor') {
            userToSet = { ...mockUsers.professor };
          } else {
            userToSet = { ...mockUsers.student };
          }
          if (cleanEmail) userToSet.email = cleanEmail;
          if (name) userToSet.name = name;
      }

      setUser(userToSet);
    };

    determineUser();
  }, [searchParams]);

   useEffect(() => {
    if (!user) return;

    let unsubscribe = () => {};

    const fetchInitialAndListen = async () => {
      // Get initial data
      const initialNotifs = await getNotifications(user);
      setNotifications(initialNotifs);

      // Check for new notifications on initial load
      const lastSeenTimestamp = localStorage.getItem(NOTIFICATION_STORAGE_KEY) || '0';
      const mostRecentNotifTimestamp = initialNotifs[0]?.createdAt?.getTime() || 0;
      
      if (mostRecentNotifTimestamp > parseInt(lastSeenTimestamp)) {
        setHasNewNotification(true);
      }

      // Set up listener for real-time updates - (this is a simplified poll)
      const intervalId = setInterval(async () => {
        const newNotifs = await getNotifications(user);
        if (newNotifs.length > 0 && newNotifs[0].id !== (notifications[0]?.id || '')) {
             setNotifications(newNotifs);
             setHasNewNotification(true);
        }
      }, 30000); // Poll every 30 seconds

      unsubscribe = () => clearInterval(intervalId);
    };

    fetchInitialAndListen();
    return () => unsubscribe();
  }, [user, notifications]);

  const markNotificationsAsSeen = () => {
    if (hasNewNotification || newStudentNotification) {
      setHasNewNotification(false);
      setNewStudentNotification(false);
      
      const mostRecentTimestamp = notifications[0]?.createdAt?.getTime() || Date.now();
      localStorage.setItem(NOTIFICATION_STORAGE_KEY, mostRecentTimestamp.toString());
    }
  };


  const updateUser = useCallback((newUserData: Partial<User>) => {
    setUser(prevUser => {
      if (!prevUser) return null;
      const updatedUser = { ...prevUser, ...newUserData };
      
      if (newUserData.attendance) {
        updatedUser.attendance = {
          ...prevUser.attendance,
          ...newUserData.attendance
        };
      }
      
      updateDbUser(updatedUser.id, newUserData).catch(error => {
          console.error("Failed to update user in DB:", error);
          toast({
            variant: "destructive",
            title: "Erro de Sincronização",
            description: "Não foi possível salvar as alterações no servidor.",
          });
      });
      
      return updatedUser;
    });
  }, [toast]);

  const navItems: NavItem[] = useMemo(() => {
    if (user?.role === 'admin') return adminNavItems;
    if (user?.role === 'professor') return professorNavItems;
    return studentNavItems;
  }, [user?.role]);

  const getHref = (href: string) => {
    if (!user) return href;
    const params = new URLSearchParams();
    
    searchParams.forEach((value, key) => {
        if (key !== 'newStudent') {
            params.set(key, value);
        }
    });

    if (!params.has('role') && user.role) {
      params.set('role', user.role);
    }
    if (!params.has('email') && user.email) {
      params.set('email', user.email);
    }
    if (!params.has('name') && user.name) {
      params.set('name', user.name);
    }

    return `${href}?${params.toString()}`;
  }
  
  if (!user) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center gap-4 bg-background">
        <KingsBjjLogo className="h-24 w-24 animate-pulse" />
        <p className="text-muted-foreground">Inicializando painel...</p>
      </div>
    );
  }

  const roleNames = {
    student: 'Aluno',
    professor: 'Professor',
    admin: 'Admin'
  };

  const notificationIndicator = hasNewNotification || newStudentNotification;
  
  const lastSeenTimestamp = parseInt(localStorage.getItem(NOTIFICATION_STORAGE_KEY) || '0');


  return (
    <UserContext.Provider value={user}>
      <UserUpdateContext.Provider value={updateUser}>
        <SidebarProvider>
          <Sidebar className="print:hidden">
            <SidebarHeader>
              <div className="flex items-center gap-2">
                <KingsBjjLogo className="h-8 w-8" />
                <span className="text-lg font-semibold tracking-tight">Kings BJJ</span>
              </div>
            </SidebarHeader>
            <SidebarContent>
              <SidebarMenu>
                {navItems.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={!item.external && pathname === item.href}
                      tooltip={{
                        children: item.label,
                        side: "right",
                        align: "center",
                      }}
                    >
                      <Link
                        href={item.external ? item.href : getHref(item.href)}
                        target={item.external ? "_blank" : undefined}
                        rel={item.external ? "noopener noreferrer" : undefined}
                        className={cn(item.className)}
                      >
                        <item.icon />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarContent>
            <SidebarFooter>
              <div className="flex items-center gap-3">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback>
                    {user.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 overflow-hidden">
                    <p className="truncate text-sm font-medium">{user.name}</p>
                    <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                </div>
                <Button variant="ghost" size="icon" className="shrink-0" asChild>
                    <Link href="/"><LogOut /></Link>
                </Button>
              </div>
            </SidebarFooter>
          </Sidebar>
          <SidebarInset>
            <header className="sticky top-0 z-10 flex h-auto min-h-14 flex-col gap-2 border-b bg-background/80 px-4 py-2 backdrop-blur-sm sm:px-6 md:flex-row md:items-center md:justify-end print:hidden">
                <div className="flex items-center justify-between gap-2 md:flex-1">
                    <SidebarTrigger className="md:hidden"/>
                    <h1 className="text-lg font-semibold md:hidden">
                    {navItems.find(item => item.href === pathname)?.label || 'Painel'}
                    </h1>
                </div>
                 <div className="flex items-center gap-4">
                   <Popover onOpenChange={(isOpen) => { if (isOpen) markNotificationsAsSeen(); }}>
                      <PopoverTrigger asChild>
                        <Button variant="ghost" size="icon" className="relative rounded-full">
                          <Bell className="h-5 w-5" />
                           {notificationIndicator && (
                            <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                           </span>
                           )}
                          <span className="sr-only">Ver notificações</span>
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent align="end" className="w-96 p-0">
                        <div className="flex items-center justify-between border-b p-4">
                          <h3 className="font-semibold">Recados Recentes</h3>
                          <Badge variant="secondary">{notifications.length + (newStudentNotification ? 1 : 0)}</Badge>
                        </div>
                        <div className="max-h-80 overflow-y-auto p-2">
                            {newStudentNotification && (
                                <div className="p-2">
                                    <div className="flex items-start gap-3">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500/20">
                                           <UserIcon className="h-4 w-4 text-green-400"/>
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-semibold">Novo Aluno Cadastrado</p>
                                            <p className="text-sm text-muted-foreground">
                                                O aluno <span className="font-bold text-foreground">{newStudentName}</span> acaba de se cadastrar.
                                            </p>
                                            <Button variant="link" size="sm" className="p-0 h-auto mt-1" asChild>
                                                <Link href={getHref('/dashboard/manage-students')}>Ver lista de alunos</Link>
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {notifications.length > 0 ? (
                                notifications.map(notif => {
                                    const isNew = notif.createdAt.getTime() > lastSeenTimestamp;
                                    return (
                                        <div key={notif.id} className="p-2 hover:bg-muted/50 rounded-md">
                                            <div className="flex items-start gap-3">
                                                <div className="relative flex-shrink-0">
                                                    <Avatar className="h-8 w-8">
                                                        <AvatarImage src={notif.authorAvatar} alt={notif.authorName} />
                                                        <AvatarFallback>{notif.authorName.charAt(0)}</AvatarFallback>
                                                    </Avatar>
                                                    {isNew && <span className="absolute -top-0.5 -right-0.5 block h-2 w-2 rounded-full bg-primary ring-2 ring-background" />}
                                                </div>
                                                <div className="flex-1">
                                                    <p className="font-semibold text-sm">{notif.title}</p>
                                                    <p className="text-xs text-muted-foreground truncate">{notif.content}</p>
                                                    <p className="text-xs text-muted-foreground mt-1">{formatDistanceToNow(notif.createdAt, { addSuffix: true, locale: ptBR })}</p>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (!newStudentNotification && (
                                <div className="p-4 text-center text-sm text-muted-foreground">
                                    Nenhum recado recente.
                                </div>
                            ))}
                        </div>
                        <div className="border-t p-2">
                            <Button size="sm" variant="link" className="w-full" asChild>
                               <Link href={getHref('/dashboard/notifications')}>Ver todos os recados</Link>
                            </Button>
                        </div>
                      </PopoverContent>
                    </Popover>
                  <div className="text-sm font-medium">
                      <span className="text-muted-foreground">Perfil: </span>
                      <span className="capitalize font-semibold text-primary">{roleNames[user.role]}</span>
                  </div>
                </div>
            </header>
            <main className="flex-1 overflow-auto p-4 sm:p-6">{children}</main>
          </SidebarInset>
        </SidebarProvider>
      </UserUpdateContext.Provider>
    </UserContext.Provider>
  );
}
