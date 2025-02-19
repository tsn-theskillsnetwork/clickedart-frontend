"use client";

import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { useEffect, useState } from "react";
import useAuthStore from "@/authStore";
import axios from "axios";
import Loader from "@/components/loader";

// export const metadata = {
//   title: "Invoice",
//   description: "View and manage invoices",
// };

export default function Page() {
  const { photographer, isHydrated } = useAuthStore();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState([]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER}/api/photographeranalytics/get-photographer-analytics?photographer=${photographer._id}`
      );
      setStats(res.data.payoutHistory);
      setLoading(false);
      //console.log(res.data);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (photographer) fetchStats();
  }, [photographer]);

  if (!isHydrated) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <Loader />;
      </div>
    );
  }

  if (!photographer) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <h1 className="text-3xl font-semibold">UNAUTHORIZED</h1>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <AppSidebar currentUrl={"/dashboard/invoice"} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>
                  <Link
                    className="text-blue-500 hover:underline"
                    href={"/dashboard"}
                  >
                    Dashboard
                  </Link>
                  &nbsp; &gt; &nbsp;
                  <span>Invoice</span>
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
          <div className="text-center">
            <h4 className="text-heading-04 font-semibold underline text-secondary-200">
              Invoices
            </h4>
          </div>
          <div className="min-h-[100vh] flex-1 rounded-xl md:min-h-min">
            <div className="container mx-auto py-10">
              <DataTable columns={columns} data={stats} />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
