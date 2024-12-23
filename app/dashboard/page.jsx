import { AppSidebar } from "@/components/app-sidebar";
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
import Link from "next/link";

export const metadata = {
  title: "Dashboard",
  description: "Dashboard page",
};

export default function Page() {
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
        <div className="flex flex-1 flex-col gap-4 p-4">
          <div className="grid auto-rows-min gap-4 lg:grid-cols-2 xl:grid-cols-3">
            <div className="rounded-xl bg-muted/50 shadow-md px-2 flex flex-col items-center gap-4 py-4">
              <h4 className="text-heading-06 sm:text-heading-05 md:text-heading-04">
                Create Invoice
              </h4>
              <Link href="/dashboard/invoice/create">
                <Button variant="success" className="text-white">
                  Create Invoice
                </Button>
              </Link>
            </div>
            <div className="rounded-xl bg-muted/50 shadow-md px-2 flex flex-col items-center gap-4 py-4">
              <h4 className="text-heading-06 sm:text-heading-05 md:text-heading-04">
                Earning This Month
              </h4>
              <h2 className="text-heading-04 sm:text-heading-03 md:text-heading-02 font-semibold text-green-600">
                ₹12,000.00
              </h2>
            </div>
            <div className="rounded-xl bg-muted/50 shadow-md px-2 flex flex-col items-center gap-4 py-4">
              <h4 className="text-heading-06 sm:text-heading-05 md:text-heading-04">
                Total Sales
              </h4>
              <h2 className="text-heading-04 sm:text-heading-03 md:text-heading-02 font-semibold text-secondary-200">
                12
              </h2>
            </div>
          </div>
          <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
