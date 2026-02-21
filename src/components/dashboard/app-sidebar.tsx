"use client";

import * as React from "react"
import { GithubIcon } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { usePathname } from "next/navigation";
import { useRequireAuth } from "@/hooks/query/auth";

// This is sample data.
const data = {
  navigation: [
    {
      title: "Application Menu",
      url: "#",
      items: [
        {
          title: "Dashboard",
          url: "/dashboard",
        },
        {
          title: "Repository",
          url: "/dashboard/repository",
        },
        {
          title: "Reviews",
          url: "/dashboard/reviews",
        },
        {
          title: "Subscription",
          url: "/dashboard/subscription",
        },
        {
          title: "Settings",
          url: "/dashboard/settings",
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname().split('/').filter(Boolean);
  const currentPath = pathname[pathname.length - 1];

  const { data: user } = useRequireAuth();

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <div className='w-full flex justify-start items-center px-3 gap-3'>
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-sm">
                  <GithubIcon className="size-4" />
                </div>
                <div className="flex flex-col gap-1 leading-none">
                  <span className="font-medium font-sans text-[14px] tracking-tight">Connected Github</span>
                  <span className="font-normal text-[11px]">{user?.user?.name}</span>
                </div>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {data.navigation.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <a href={item.url} className="font-medium">
                    {item.title}
                  </a>
                </SidebarMenuButton>
                {item.items?.length ? (
                  <SidebarMenuSub>
                    {item.items.map((item) => (
                      <SidebarMenuSubItem key={item.title}>
                        <SidebarMenuSubButton asChild isActive={currentPath.toLowerCase() === item.title.toLowerCase() ? true : false}>
                          <a href={item.url}>{item.title}</a>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                ) : null}
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
