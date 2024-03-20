// import { StyleSwitcher } from "@/components/style-switcher";
import "./globals.css";

import { ReactNode } from "react";

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

type Props = {
  children: ReactNode;
  params: { locale: string };
};

export default function RootLayout({ children, params: { locale } }: Props) {
  return children;
}
