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
import { mockUsers, User } from "@/lib/mock-data";
import {
  Award,
  Calendar,
  LayoutDashboard,
  LogOut,
  MapPin,
  User as UserIcon,
  Users,
  Shield,
} from "lucide-react";

const baseNavItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Painel" },
  { href: "/dashboard/profile", icon: UserIcon, label: "Perfil" },
  { href: "/dashboard/instructors", icon: Users, label: "Professores" },
  { href: "/dashboard/rankings", icon: Award, label: "Graduações" },
  { href: "/dashboard/branches", icon: MapPin, label: "Filiais" },
];

const adminNavItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Painel" },
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

  const navItems = user.role === 'admin' ? adminNavItems : baseNavItems;

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
              <div className="text-sm font-medium">
                  <span className="text-muted-foreground">Perfil: </span>
                  <span className="capitalize font-semibold text-primary">{user.role}</span>
              </div>
          </header>
          <main className="flex-1 overflow-auto p-4 sm:p-6">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </UserContext.Provider>
  );
}
