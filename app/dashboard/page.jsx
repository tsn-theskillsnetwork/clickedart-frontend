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

// Importing chart.js and react-chartjs-2
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Registering chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

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
        setStats(res.data);
        setLoading(false);
        console.log(res.data);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchPhotos();
    fetchStats();
  }, [photographer]);

  // Prepare data for the graph
  const monthlyData = stats?.monthlyData || [];
  const months = monthlyData.map((data) => `Month ${data.month}`);
  const salesData = monthlyData.map((data) => data.sales);
  const royaltyData = monthlyData.map((data) => data.royaltyAmount);

  const chartData = {
    labels: months,
    datasets: [
      {
        label: "Sales",
        data: salesData,
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: true,
        tension: 0.4,
      },
      {
        label: "Royalty Amount",
        data: royaltyData,
        borderColor: "rgba(153, 102, 255, 1)",
        backgroundColor: "rgba(153, 102, 255, 0.2)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  return (
    <SidebarProvider>
      <AppSidebar currentUrl={"/dashboard"} />
      <SidebarInset>
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
            <Loader />
          </div>
        ) : (
          <div className="flex flex-1 flex-col gap-4 p-4">
            <div className="grid auto-rows-min gap-4 lg:grid-cols-2 xl:grid-cols-3">
              {/* Existing NumberCards */}
              <NumberCard
                title="Total Downloads"
                number={String(stats?.downloads) || "0"}
                color="blue"
              />
              <NumberCard
                title="Total Sales"
                number={String(stats?.totalSales) || "0"}
              />
              <div className="rounded-xl bg-muted/50 shadow-md px-2 flex flex-col items-center gap-4 py-4">
                <h4 className="text-heading-06 sm:text-heading-05 md:text-heading-04">
                  Frequently Used Categories
                </h4>

                <h2
                  className={`text-heading-04 sm:text-heading-03 md:text-heading-02 font-semibold text-secondary-200`}
                >
                  {stats?.frequentlyUsedCategories
                    ?.map((category) => category.categoryDetails.name)
                    .join(", ") || "None"}
                </h2>
              </div>
              <NumberCard
                title="Total Royalty Amount"
                number={String(stats?.totalRoyaltyAmount) || "0"}
                color="green"
              />
              <NumberCard
                title="Total Paid Amount"
                number={String(stats?.totalPaidAmount) || "0"}
                color="green"
              />
              <NumberCard
                title="Total Print Cut Amount"
                number={String(stats?.totalPrintCutAmount) || "0"}
                color="green"
              />
              <NumberCard
                title="Uploaded Photos"
                number={String(stats?.totalUploadingImgCount) || "0"}
              />
              <NumberCard
                title="Pending Photos"
                number={String(stats?.pendingImagesCount) || "0"}
                color="red"
              />
            </div>

            {/* Monthly Sales and Royalty Graph */}
            <div className="bg-white p-6 rounded-lg shadow-lg mt-8">
              <h2 className="text-xl font-semibold">
                Sales and Royalty Amount (Monthly)
              </h2>
              <Line className="!max-h-[70vh] !max-w-[70vw]" data={chartData} />
            </div>

            <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
          </div>
        )}
      </SidebarInset>
    </SidebarProvider>
  );
}
