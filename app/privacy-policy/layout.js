import Page from "./page";

export const metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy",
};
export default async function RootLayout({ children }) {
  return <div>{children}</div>;
}
