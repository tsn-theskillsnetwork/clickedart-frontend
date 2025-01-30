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
import toast from "react-hot-toast";
import Button2 from "@/components/button2";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

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
  const [stats, setStats] = useState([]);
  const [dateRange, setDateRange] = useState({
    startDate: "",
    endDate: "",
  });
  const [isCustomDate, setIsCustomDate] = useState(false);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER}/api/photographeranalytics/get-photographer-analytics?photographer=${photographer._id}`
      );
      setStats(res.data);
      setIsCustomDate(false);
      console.log(res.data);
    } catch (error) {
      setError(error);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [photographer]);

  const fetchCustomStats = async () => {
    if (!dateRange.startDate || !dateRange.endDate) {
      toast.error("Please select a date range. Getting all Data instead.");
      fetchStats();
      setIsCustomDate(false);
      return;
    }
    try {
      setLoading(true);
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER}/api/photographeranalytics/custom-analytics-by-date?photographer=${photographer._id}&startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`
      );
      setStats(res.data);
      setIsCustomDate(true);
      console.log(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

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
        // fill: true,
        tension: 0.4,
      },
      {
        label: "Royalty Amount",
        data: royaltyData,
        borderColor: "rgba(153, 102, 255, 1)",
        backgroundColor: "rgba(153, 102, 255, 0.2)",
        // fill: true,
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
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <div className="flex items-center flex-wrap justify-center gap-4">
                Custom Date Range:
                <div className="flex gap-4">
                  <DatePicker
                    label="From"
                    value={dayjs(dateRange.startDate)}
                    maxDate={dayjs(Date.now())}
                    onChange={(date) =>
                      setDateRange({ ...dateRange, startDate: date })
                    }
                  />
                  <DatePicker
                    label="To"
                    value={dayjs(dateRange.endDate)}
                    minDate={dayjs(dateRange.startDate)}
                    onChange={(date) =>
                      setDateRange({ ...dateRange, endDate: date })
                    }
                  />
                </div>
                <div className="flex gap-4">
                  <Button2 size="sm" onClick={fetchCustomStats}>
                    Get Data
                  </Button2>
                  <Button2 size="sm" onClick={fetchStats}>
                    Show All Data
                  </Button2>
                </div>
              </div>
              {isCustomDate ? (
                <p className="text-sm text-secondary-200 text-center">
                  Showing data from{" "}
                  {dayjs(dateRange.startDate).format("DD MMM YYYY")} to{" "}
                  {dayjs(dateRange.endDate).format("DD MMM YYYY")}
                </p>
              ) : (
                <p className="text-sm text-secondary-200 text-center">
                  Showing all data
                </p>
              )}
            </LocalizationProvider>
            <div className="bg-white p-6 rounded-lg shadow-md shadow-zinc-300 mt-8">
              <h4 className="text-xl font-semibold">Revenue Overview</h4>
              <div className="grid auto-rows-min gap-4 lg:grid-cols-2 xl:grid-cols-3">
                {/* Existing NumberCards */}
                <NumberCard
                  title="Total Digital Sales"
                  number={`₹${String(stats?.totalSales || "0")}`}
                />
                <NumberCard
                  title="Total Print Sales"
                  number={`₹${String(
                    stats?.totalPrintSales?.toFixed(2) || "0"
                  )}`}
                />
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md shadow-zinc-300 mt-8">
              <h4 className="text-xl font-semibold">Sales Metrics</h4>
              <div className="grid auto-rows-min gap-4 lg:grid-cols-2 xl:grid-cols-3 mt-5">
                <NumberCard
                  title="Digital Sale(s)"
                  number={`${String(stats?.totalDigitalDownloads || "0")}`}
                  color="blue"
                />
                <NumberCard
                  title="Print Sale(s)"
                  number={`${String(stats?.totalPrintDownloads || "0")}`}
                  color="blue"
                />
                {!isCustomDate ? (
                  <NumberCard
                    title="Active Buyer(s)"
                    number={`${String(stats?.activeBuyers || "0")}`}
                    color="blue"
                  />
                ) : (
                  <NumberCard
                    title="Total Sales"
                    number={`${String(
                      stats?.totalDigitalDownloads +
                        stats?.totalPrintDownloads || "0"
                    )}`}
                    color="blue"
                  />
                )}
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md shadow-zinc-300 mt-8">
              <h4 className="text-xl font-semibold">Earning</h4>
              <div className="grid auto-rows-min gap-4 lg:grid-cols-2 xl:grid-cols-3 mt-5">
                <NumberCard
                  title="Total Digital Royalty Amount"
                  number={`₹${String(stats?.totalRoyaltyAmount || "0")}`}
                  color="green"
                />
                <NumberCard
                  title="Total Print Royalty Amount"
                  number={`₹${String(
                    stats?.totalPrintCutAmount?.toFixed(2) || "0"
                  )}`}
                  color="green"
                />
                <NumberCard
                  title="Total Referral Amount"
                  number={`₹${String(
                    stats?.totalReferralAmount?.toFixed(2) || "0"
                  )}`}
                  color="green"
                />
                <NumberCard
                  title="Total Paid Amount"
                  number={`₹${String(stats?.totalPaidAmount || "0")}`}
                  color="green"
                />
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md shadow-zinc-300 mt-8">
              <h4 className="text-xl font-semibold">Photos</h4>
              <div className="grid auto-rows-min gap-4 lg:grid-cols-2 xl:grid-cols-3 mt-5">
                <NumberCard
                  title="Approved"
                  number={`${String(stats?.totalUploadingImgCount || "0")}`}
                />
                <NumberCard
                  title="Pending for Approval"
                  number={`${String(stats?.pendingImagesCount || "0")}`}
                  color="red"
                />
              </div>
            </div>

            {/* Monthly Sales and Royalty Graph */}
            <div className="bg-white p-6 rounded-lg shadow-md shadow-zinc-300 mt-8">
              <h4 className="text-xl font-semibold">
                Frequently Used Categories
              </h4>

              <p className={`text-paragraph font-medium text-secondary-200`}>
                {stats?.frequentlyUsedCategories
                  ?.map((category) => category.categoryDetails.name)
                  .join(", ") || "None"}
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md shadow-zinc-300">
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
