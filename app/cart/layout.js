import Page from "./page";

export const metadata = {
  title: 'Cart',
  description:
    'This is the cart page',
};
export default async function RootLayout({ children }) {
  return <div>{children}</div>;
}
