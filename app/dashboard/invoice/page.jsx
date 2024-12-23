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

async function getData() {
  // Fetch data from your API here.
  return [
    {
      _id: "1",
      invoiceNo: "001",
      name: "Bhanu",
      email: "bhanu@mail.com",
      phone: "7000000012",
      address: "123, Address, Lucknow",
      pincode: "226028",
      status: "unpaid",
      amount: 3976.6,
      date: "2024-11-25",
      dueDate: "2024-12-01",
      gst: "18",
      items: [
        {
          name: "Item 1",
          description: "",
          quantity: "1",
          price: "1000",
          discount: "5",
        },
        {
          name: "Item 2",
          description: "",
          quantity: "2",
          price: "500",
          discount: "5",
        },
        {
          name: "Item 3",
          quantity: "1",
          price: "1500",
          discount: "2",
        },
      ],
    },
    {
      _id: "1",
      invoiceNo: "001",
      name: "Bhanu",
      email: "bhanu@mail.com",
      phone: "7000000012",
      address: "123, Address, Lucknow",
      pincode: "226028",
      status: "paid",
      amount: 3976.6,
      date: "2024-11-25",
      dueDate: "2024-12-01",
      gst: "18",
      items: [
        {
          name: "Item 1",
          description: "",
          quantity: "1",
          price: "1000",
          discount: "5",
        },
        {
          name: "Item 2",
          description: "",
          quantity: "2",
          price: "500",
          discount: "5",
        },
        {
          name: "Item 3",
          quantity: "1",
          price: "1500",
          discount: "2",
        },
      ],
    },
    {
      _id: "1",
      invoiceNo: "001",
      name: "Bhanu",
      email: "bhanu@mail.com",
      phone: "7000000012",
      address: "123, Address, Lucknow",
      pincode: "226028",
      status: "unpaid",
      amount: 3976.6,
      date: "2024-11-25",
      dueDate: "2024-12-01",
      gst: "18",
      items: [
        {
          name: "Item 1",
          description: "",
          quantity: "1",
          price: "1000",
          discount: "5",
        },
        {
          name: "Item 2",
          description: "",
          quantity: "2",
          price: "500",
          discount: "5",
        },
        {
          name: "Item 3",
          quantity: "1",
          price: "1500",
          discount: "2",
        },
      ],
    },
    {
      _id: "1",
      invoiceNo: "001",
      name: "Bhanu",
      email: "bhanu@mail.com",
      phone: "7000000012",
      address: "123, Address, Lucknow",
      pincode: "226028",
      status: "unpaid",
      amount: 3976.6,
      date: "2024-11-25",
      dueDate: "2024-12-01",
      gst: "18",
      items: [
        {
          name: "Item 1",
          description: "",
          quantity: "1",
          price: "1000",
          discount: "5",
        },
        {
          name: "Item 2",
          description: "",
          quantity: "2",
          price: "500",
          discount: "5",
        },
        {
          name: "Item 3",
          quantity: "1",
          price: "1500",
          discount: "2",
        },
      ],
    },
    {
      _id: "1",
      invoiceNo: "001",
      name: "Bhanu",
      email: "bhanu@mail.com",
      phone: "7000000012",
      address: "123, Address, Lucknow",
      pincode: "226028",
      status: "unpaid",
      amount: 3976.6,
      date: "2024-11-25",
      dueDate: "2024-12-01",
      gst: "18",
      items: [
        {
          name: "Item 1",
          description: "",
          quantity: "1",
          price: "1000",
          discount: "5",
        },
        {
          name: "Item 2",
          description: "",
          quantity: "2",
          price: "500",
          discount: "5",
        },
        {
          name: "Item 3",
          quantity: "1",
          price: "1500",
          discount: "2",
        },
      ],
    },
    {
      _id: "1",
      invoiceNo: "001",
      name: "Bhanu",
      email: "bhanu@mail.com",
      phone: "7000000012",
      address: "123, Address, Lucknow",
      pincode: "226028",
      status: "unpaid",
      amount: 3976.6,
      date: "2024-11-25",
      dueDate: "2024-12-01",
      gst: "18",
      items: [
        {
          name: "Item 1",
          description: "",
          quantity: "1",
          price: "1000",
          discount: "5",
        },
        {
          name: "Item 2",
          description: "",
          quantity: "2",
          price: "500",
          discount: "5",
        },
        {
          name: "Item 3",
          quantity: "1",
          price: "1500",
          discount: "2",
        },
      ],
    },
    {
      _id: "1",
      invoiceNo: "001",
      name: "Bhanu",
      email: "bhanu@mail.com",
      phone: "7000000012",
      address: "123, Address, Lucknow",
      pincode: "226028",
      status: "unpaid",
      amount: 3976.6,
      date: "2024-11-25",
      dueDate: "2024-12-01",
      gst: "18",
      items: [
        {
          name: "Item 1",
          description: "",
          quantity: "1",
          price: "1000",
          discount: "5",
        },
        {
          name: "Item 2",
          description: "",
          quantity: "2",
          price: "500",
          discount: "5",
        },
        {
          name: "Item 3",
          quantity: "1",
          price: "1500",
          discount: "2",
        },
      ],
    },
    {
      _id: "1",
      invoiceNo: "001",
      name: "Bhanu",
      email: "bhanu@mail.com",
      phone: "7000000012",
      address: "123, Address, Lucknow",
      pincode: "226028",
      status: "unpaid",
      amount: 3976.6,
      date: "2024-11-25",
      dueDate: "2024-12-01",
      gst: "18",
      items: [
        {
          name: "Item 1",
          description: "",
          quantity: "1",
          price: "1000",
          discount: "5",
        },
        {
          name: "Item 2",
          description: "",
          quantity: "2",
          price: "500",
          discount: "5",
        },
        {
          name: "Item 3",
          quantity: "1",
          price: "1500",
          discount: "2",
        },
      ],
    },
    {
      _id: "1",
      invoiceNo: "001",
      name: "Bhanu",
      email: "bhanu@mail.com",
      phone: "7000000012",
      address: "123, Address, Lucknow",
      pincode: "226028",
      status: "unpaid",
      amount: 3976.6,
      date: "2024-11-25",
      dueDate: "2024-12-01",
      gst: "18",
      items: [
        {
          name: "Item 1",
          description: "",
          quantity: "1",
          price: "1000",
          discount: "5",
        },
        {
          name: "Item 2",
          description: "",
          quantity: "2",
          price: "500",
          discount: "5",
        },
        {
          name: "Item 3",
          quantity: "1",
          price: "1500",
          discount: "2",
        },
      ],
    },
    {
      _id: "1",
      invoiceNo: "001",
      name: "Bhanu",
      email: "bhanu@mail.com",
      phone: "7000000012",
      address: "123, Address, Lucknow",
      pincode: "226028",
      status: "unpaid",
      amount: 3976.6,
      date: "2024-11-25",
      dueDate: "2024-12-01",
      gst: "18",
      items: [
        {
          name: "Item 1",
          description: "",
          quantity: "1",
          price: "1000",
          discount: "5",
        },
        {
          name: "Item 2",
          description: "",
          quantity: "2",
          price: "500",
          discount: "5",
        },
        {
          name: "Item 3",
          quantity: "1",
          price: "1500",
          discount: "2",
        },
      ],
    },
    {
      _id: "1",
      invoiceNo: "001",
      name: "Bhanu",
      email: "bhanu@mail.com",
      phone: "7000000012",
      address: "123, Address, Lucknow",
      pincode: "226028",
      status: "unpaid",
      amount: 3976.6,
      date: "2024-11-25",
      dueDate: "2024-12-01",
      gst: "18",
      items: [
        {
          name: "Item 1",
          description: "",
          quantity: "1",
          price: "1000",
          discount: "5",
        },
        {
          name: "Item 2",
          description: "",
          quantity: "2",
          price: "500",
          discount: "5",
        },
        {
          name: "Item 3",
          quantity: "1",
          price: "1500",
          discount: "2",
        },
      ],
    },
    {
      _id: "1",
      invoiceNo: "001",
      name: "Bhanu",
      email: "bhanu@mail.com",
      phone: "7000000012",
      address: "123, Address, Lucknow",
      pincode: "226028",
      status: "unpaid",
      amount: 3976.6,
      date: "2024-11-25",
      dueDate: "2024-12-02",
      gst: "18",
      items: [
        {
          name: "Item 1",
          description: "",
          quantity: "1",
          price: "1000",
          discount: "5",
        },
        {
          name: "Item 2",
          description: "",
          quantity: "2",
          price: "500",
          discount: "5",
        },
        {
          name: "Item 3",
          quantity: "1",
          price: "1500",
          discount: "2",
        },
      ],
    },
  ];
}

export const metadata = {
  title: "Invoice",
  description: "View and manage invoices",
};

export default async function Page() {
  const data = await getData();
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
              <DataTable columns={columns} data={data} />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
