import Page from "./page";

export const metadata = {
  title: 'Sign In - ClickedArt',
  description:
    'This is the signin page',
};
export default async function RootLayout({ children }) {
  return <div>{children}</div>;
}
