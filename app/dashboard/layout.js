export const metadata = {
  title: "Dashboard - ClickedArt",
  description: "This is the Dashboard page",
  openGraph: {
    title: "Dashboard - ClickedArt",
    description: "This is the Dashboard page",
    url: `${process.env.NEXT_PUBLIC_URL}/dashboard`,
    image: "/assets/Logo.png",
  },
};
export default async function RootLayout({ children }) {
  return <div>{children}</div>;
}
