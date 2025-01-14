"use client";

import * as React from "react";
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
  SidebarRail,
} from "@/components/ui/sidebar";
import Link from "next/link";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "ClickedArt",
      url: "#",
      items: [
        {
          title: "Dashboard",
          url: "/dashboard",
        },
        {
          title: "Photos",
          url: "/dashboard/photos",
        },
        // {
        //   title: "Invoice",
        //   url: "/dashboard/invoice",
        // },
      ],
    },
  ],
};

export function AppSidebar({ currentUrl, ...props }) {
  const router = useRouter();
  const handleLogout = () => {
    toast.success("Logged out");
    router.push("/");
  };

  return (
    <Sidebar {...props}>
      <SidebarContent className="md:pt-24">
        {data.navMain.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={item.url === currentUrl}
                    >
                      <Link href={item.url}>{item.title}</Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <SidebarGroupContent>
          {/* <SidebarMenuItem> */}
          <SidebarMenuButton
            asChild
            isActive={currentUrl === "/dashboard/settings"}
          >
            {/* <Link href="/dashboard/settings">Settings</Link> */}
          </SidebarMenuButton>
          <SidebarMenuButton onClick={handleLogout}>
            <p>Logout</p>
          </SidebarMenuButton>
          {/* </SidebarMenuItem> */}
        </SidebarGroupContent>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
