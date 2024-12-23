import Page from "./page";

export const metadata = {
  title: 'Sign Up - ClickedArt',
  description:
    'This is the signup page',
};
export default async function RootLayout({ children }) {
  return <div>{children}</div>;
}
