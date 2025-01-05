"use client";

import useAuthStore from "@/authStore";
import { AppSidebar } from "@/components/app-sidebar";
import NumberCard from "@/components/cards/numberCard";
import Loader from "@/components/loader";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const { photographer } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [stats, setStats] = useState([]);

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_SERVER}/api/images/get-images-by-photographer?photographer=${photographer._id}`
        );
        console.log(res.data);
        setPhotos(res.data.photos);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };
    
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_SERVER}/api/photographeranalytics/get-photographer-analytics?photographer=${photographer._id}`
        );
        console.log("Stats",res.data);
        setStats(res.data);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchPhotos();
    fetchStats();
  }, [photographer]);

  return (
    <SidebarProvider>
      <AppSidebar currentUrl={"/dashboard"} />
      <SidebarInset className="">
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>Dashboard</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        {loading ? (
          <div className="flex items-center justify-center h-[80vh]">
            <Loader />;
          </div>
        ) : (
          <div className="flex flex-1 flex-col gap-4 p-4">
            <div className="grid auto-rows-min gap-4 lg:grid-cols-2 xl:grid-cols-3">
              {/* <NumberCard
                title="Create Invoice"
                btnText="Create Invoice"
                url="/dashboard/invoice/create"
                variant={"success"}
              /> */}
              <NumberCard
                title="Total Downloads"
                number={String(stats?.downloads) || "0"}
                color="blue"
              />
              <NumberCard
                title="Total Royalty Amount"
                number={String(stats?.totalRoyaltyAmount) || "0"}
                color="green"
              />
              <NumberCard title="Total Sales" number={String(stats?.totalSales) || "0"} />
              <NumberCard
                title="Uploaded Photos"
                number={String(stats?.totalUploadingImgCount) || "0"}
              />
              <NumberCard title="Pending Photos" number={String(stats?.pendingImagesCount) || "0"} color="red" />
            </div>
            <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
          </div>
        )}
      </SidebarInset>
    </SidebarProvider>
  );
}
