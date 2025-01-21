export const metadata = {
  title: "Blogs - ClickedArt",
  description: "This is the Blog page",
  openGraph: {
    title: "Blog - ClickedArt",
    description: "This is the Blog page",
    url: `${process.env.NEXT_PUBLIC_URL}/blog`,
    image: "/assets/Logo.png",
  },
};
export default async function RootLayout({ children }) {
  return <div>{children}</div>;
}
