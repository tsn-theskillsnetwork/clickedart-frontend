import Page from "./page";

export const metadata = {
  title: 'Wishlist',
  description:
    'This is the wishlist page',
};
export default async function RootLayout({ children }) {
  return <div>{children}</div>;
}
