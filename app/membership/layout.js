import Page from "./page";

export const metadata = {
  title: 'Membership - ClickedArt',
  description:
    'This is the membership page',
};
export default async function RootLayout({ children }) {
  return <div>{children}</div>;
}
