"use client"

import { Plane, Package, ListChecks, Users, FlaskConical, FileText, LogOut } from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

const navigation = [
  { name: "Aircraft", href: "/dashboard/aircraft", icon: Plane, roles: ["Administrator", "Engineer", "Operator"] },
  { name: "Parts", href: "/dashboard/parts", icon: Package, roles: ["Administrator", "Engineer", "Operator"] },
  { name: "Production", href: "/dashboard/production", icon: ListChecks, roles: ["Administrator", "Engineer"] },
  { name: "Employees", href: "/dashboard/employees", icon: Users, roles: ["Administrator"] },
  { name: "Tests", href: "/dashboard/tests", icon: FlaskConical, roles: ["Administrator", "Engineer"] },
  { name: "Reports", href: "/dashboard/reports", icon: FileText, roles: ["Administrator", "Engineer"] },
]

export function AppSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const filteredNavigation = navigation.filter((item) => user && item.roles.includes(user.role))

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-sidebar-primary flex items-center justify-center">
            <Plane className="h-5 w-5 text-sidebar-primary-foreground" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-sidebar-foreground">Aerocode</h2>
            <p className="text-xs text-sidebar-foreground/60">Production System</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu className="p-2">
          {filteredNavigation.map((item) => (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton asChild isActive={pathname === item.href}>
                <Link href={item.href}>
                  <item.icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border p-4">
        <div className="flex items-center gap-3 mb-3">
          <Avatar className="h-9 w-9">
            <AvatarFallback className="bg-sidebar-accent text-sidebar-accent-foreground">
              {user?.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-sidebar-foreground truncate">{user?.name}</p>
            <p className="text-xs text-sidebar-foreground/60">{user?.role}</p>
          </div>
        </div>
        <Button variant="outline" size="sm" className="w-full justify-start bg-transparent" onClick={handleLogout}>
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </Button>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
