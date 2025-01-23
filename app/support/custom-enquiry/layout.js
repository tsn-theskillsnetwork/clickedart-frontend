import Page from "./page";

export const metadata = {
  title: "Custom Enquiry",
  description: "Custom Enquiry Form",
};
export default async function RootLayout({ children }) {
  return <div>{children}</div>;
}
