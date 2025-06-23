"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { createContext, useMemo, useContext } from "react";
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
import { mockUsers, User, mockNotifications } from "@/lib/mock-data";
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
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const studentNavItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Painel" },
  { href: "/dashboard/profile", icon: UserIcon, label: "Perfil" },
  { href: "/dashboard/schedule", icon: Calendar, label: "Horários" },
  { href: "/dashboard/check-in", icon: QrCode, label: "Check-in" },
  { href: "/dashboard/branches", icon: MapPin, label: "Filiais" },
  { href: "/dashboard/rankings", icon: Award, label: "Graduações" },
];

const professorNavItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Painel" },
  { href: "/dashboard/check-in", icon: QrCode, label: "Check-in" },
  { href: "/dashboard/schedule", icon: Calendar, label: "Horários" },
  { href: "/dashboard/profile", icon: UserIcon, label: "Perfil" },
  { href: "/dashboard/instructors", icon: Users, label: "Professores" },
  { href: "/dashboard/rankings", icon: Award, label: "Graduações" },
  { href: "/dashboard/branches", icon: MapPin, label: "Filiais" },
];

const adminNavItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Painel" },
  { href: "/dashboard/check-in", icon: QrCode, label: "Check-in" },
  { href: "/dashboard/schedule", icon: Calendar, label: "Horários" },
  { href: "/dashboard/profile", icon: UserIcon, label: "Perfil" },
  { href: "/dashboard/instructors", icon: Users, label: "Professores" },
  { href: "/dashboard/manage-students", icon: Shield, label: "Alunos" },
  { href: "/dashboard/rankings", icon: Award, label: "Graduações" },
  { href: "/dashboard/branches", icon: MapPin, label: "Filiais" },
];


export const UserContext = createContext<User | null>(null);

export default function DashboardClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const role = searchParams.get("role") || "student";
  
  const user = useMemo(() => {
    const validRole = role === 'admin' || role === 'professor' ? role : 'student';
    return mockUsers[validRole];
  }, [role]);

  const navItems = useMemo(() => {
    if (user.role === 'admin') {
      return adminNavItems;
    }
    if (user.role === 'professor') {
      return professorNavItems;
    }
    return studentNavItems;
  }, [user.role]);

  const getHref = (href: string) => `${href}?role=${role}`;

  return (
    <UserContext.Provider value={user}>
      <SidebarProvider>
        <Sidebar>
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
                    isActive={pathname === item.href}
                    tooltip={{
                      children: item.label,
                      side: "right",
                      align: "center",
                    }}
                  >
                    <Link href={getHref(item.href)}>
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
          <header className="sticky top-0 z-10 flex h-14 items-center justify-between gap-4 border-b bg-background/80 px-4 backdrop-blur-sm sm:px-6 md:justify-end">
              <SidebarTrigger className="md:hidden"/>
              <h1 className="text-lg font-semibold md:hidden">
                {navItems.find(item => item.href === pathname)?.label || 'Painel'}
              </h1>
               <div className="flex items-center gap-4">
                {(user.role === 'admin' || user.role === 'professor') && (
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
                        <h3 className="font-semibold">Notificações</h3>
                        <Badge variant="secondary">{mockNotifications.length}</Badge>
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        {mockNotifications.map((notification) => (
                          <div key={notification.id} className="flex items-start gap-3 border-b p-4 text-sm hover:bg-muted/50 last:border-b-0">
                            <div className="grid gap-1">
                              <p className="leading-relaxed">{notification.text}</p>
                              <p className="text-xs text-muted-foreground">{notification.time}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="border-t p-2">
                          <Button size="sm" variant="link" className="w-full">
                            Marcar todas como lidas
                          </Button>
                      </div>
                    </PopoverContent>
                  </Popover>
                )}
                <div className="text-sm font-medium">
                    <span className="text-muted-foreground">Perfil: </span>
                    <span className="capitalize font-semibold text-primary">{user.role}</span>
                </div>
              </div>
          </header>
          <main className="flex-1 overflow-auto p-4 sm:p-6">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </UserContext.Provider>
  );
}
