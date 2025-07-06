
"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { createContext, useMemo, useContext, useState, useEffect, useCallback } from "react";
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
import { User, mockUsers } from "@/lib/mock-data";
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
  AlertTriangle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { updateUser as updateDbUser, getAppUser, createAppUser } from "@/lib/firestoreService";
import { useToast } from "@/hooks/use-toast";


type NavItem = {
  href: string;
  icon: React.ElementType;
  label: string;
  external?: boolean;
};

const studentNavItems: NavItem[] = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Painel" },
  { href: "/dashboard/notifications", icon: Bell, label: "Notificações" },
  { href: "/dashboard/profile", icon: UserIcon, label: "Perfil" },
  { href: "/dashboard/schedule", icon: Calendar, label: "Horários" },
  { href: "/dashboard/check-in", icon: QrCode, label: "Check-in" },
  { href: "/dashboard/branches", icon: MapPin, label: "Filiais" },
  { href: "/dashboard/rankings", icon: Award, label: "Graduações" },
  { href: "/terms-of-service", icon: FileText, label: "Termo de Resp." },
];

const professorNavItems: NavItem[] = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Painel" },
  { href: "/dashboard/notifications", icon: Bell, label: "Notificações" },
  { href: "/dashboard/schedule", icon: Calendar, label: "Horários" },
  { href: "/dashboard/profile", icon: UserIcon, label: "Perfil" },
  { href: "/dashboard/instructors", icon: Users, label: "Professores" },
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
  { href: "/dashboard/manage-students", icon: Shield, label: "Alunos" },
  { href: "/dashboard/rankings", icon: Award, label: "Graduações" },
  { href: "/dashboard/branches", icon: MapPin, label: "Filiais" },
  { href: "/terms-of-service", icon: FileText, label: "Termo de Resp." },
];

export const UserContext = createContext<User | null>(null);
export const UserUpdateContext = createContext<((newUserData: Partial<User>) => void) | null>(null);

export default function DashboardClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const roleParam = searchParams.get("role");
  const { toast } = useToast();
  
  const [user, setUser] = useState<User | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    // Sanitize the role parameter to prevent invalid queries
    const role = roleParam ? roleParam.split('?')[0] as 'student' | 'professor' | 'admin' : null;

    if (role) {
      const validRole = (role || 'student') as 'student' | 'professor' | 'admin';
      
      const fetchUser = async () => {
        try {
          let userFromDb = await getAppUser(validRole);
          
          if (!userFromDb) {
            console.log(`User with role '${validRole}' not found in Firestore. Creating...`);
            const mockUser = mockUsers[validRole];
            if (!mockUser) {
              throw new Error(`Invalid role detected: ${validRole}`);
            }
            userFromDb = await createAppUser(mockUser);
          }
          
          setUser(userFromDb);
          setAuthError(null);

        } catch (error) {
          console.error("CRITICAL: Failed to connect to Firestore or create user.", error);
          setAuthError("Não foi possível conectar ao banco de dados. Exibindo dados de demonstração.");
          const mockUser = mockUsers[validRole];
          if(mockUser) setUser(mockUser);
        }
      };

      fetchUser();
    } else {
        setAuthError("Perfil de usuário não especificado. Por favor, acesse através da página de login.");
    }
  }, [roleParam]);

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
      
      if (!authError) {
          updateDbUser(prevUser.id, newUserData).catch(error => {
              console.error("Failed to update user in DB:", error);
              toast({
                variant: "destructive",
                title: "Erro de Sincronização",
                description: "Não foi possível salvar as alterações no servidor.",
              });
          });
      }
      
      return updatedUser;
    });
  }, [toast, authError]);

  const navItems: NavItem[] = useMemo(() => {
    const userRole = user?.role || (roleParam?.split('?')[0] as User['role']) || 'student';
    if (userRole === 'admin') return adminNavItems;
    if (userRole === 'professor') return professorNavItems;
    return studentNavItems;
  }, [user?.role, roleParam]);

  const getHref = (href: string) => {
      const currentRole = roleParam?.split('?')[0];
      return `${href}?role=${currentRole || 'student'}`;
  }
  
  if (!user) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center gap-4 bg-background">
        <KingsBjjLogo className="h-24 w-24 animate-pulse" />
        <p className="text-muted-foreground">Carregando painel...</p>
         {authError && (
              <Alert variant="destructive" className="max-w-md mt-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Erro Crítico</AlertTitle>
                <AlertDescription>
                  {authError}
                </AlertDescription>
              </Alert>
            )}
      </div>
    );
  }

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
                   <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="ghost" size="icon" className="relative rounded-full">
                          <Bell className="h-5 w-5" />
                           <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                           </span>
                          <span className="sr-only">Ver notificações</span>
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent align="end" className="w-96 p-0">
                        <div className="flex items-center justify-between border-b p-4">
                          <h3 className="font-semibold">Recados Recentes</h3>
                          <Badge variant="secondary">3</Badge>
                        </div>
                        <div className="max-h-80 overflow-y-auto">
                            <div className="p-4 text-center text-sm text-muted-foreground">
                                Nenhum recado recente.
                            </div>
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
                      <span className="capitalize font-semibold text-primary">{user.role}</span>
                  </div>
                </div>
            </header>
             {authError && (
              <Alert variant="destructive" className="m-4 rounded-lg">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Modo Offline</AlertTitle>
                <AlertDescription>
                  {authError} Algumas funcionalidades podem não funcionar corretamente.
                </AlertDescription>
              </Alert>
            )}
            <main className="flex-1 overflow-auto p-4 sm:p-6">{children}</main>
          </SidebarInset>
        </SidebarProvider>
      </UserUpdateContext.Provider>
    </UserContext.Provider>
  );
}
