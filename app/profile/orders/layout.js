export const metadata = {
  title: "My Orders - ClickedArt",
  description: "This is the Orders page",
  openGraph: {
    title: "My Orders - ClickedArt",
    description: "This is the Orders page",
    url: `${process.env.NEXT_PUBLIC_URL}/blog`,
    image: "/assets/Logo.png",
  },
};
export default async function RootLayout({ children }) {
  return <div>{children}</div>;
}
