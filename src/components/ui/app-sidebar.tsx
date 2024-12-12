"use client";

import { Calendar, TrainFront } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

// Menu items.
const items = [
  {
    title: "Trains",
    url: "/admin",
    icon: TrainFront,
  },
  {
    title: "Train Schedules",
    url: "/admin/train-schedules",
    icon: Calendar,
  },
];

export function AppSidebar() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      // Викликаємо серверний ендпоінт для видалення JWT
      const response = await fetch("/api/logout", {
        method: "GET",
      });

      if (response.ok) {
        // Редірект на сторінку авторизації після успішного видалення
        router.push("/auth");
      } else {
        console.error("Failed to log out");
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Train scheduler</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <Button variant="destructive" onClick={handleLogout}>
          Logout
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
