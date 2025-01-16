import Page from "./page";

export const metadata = {
  title: 'Featured Artists',
  description:
    'This is the Featured Artist page',
};
export default async function RootLayout({ children }) {
  return <div>{children}</div>;
}
