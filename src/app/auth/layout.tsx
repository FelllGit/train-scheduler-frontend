import type { Metadata } from "next";
import "./auth.css";
import Head from "next/head";

export const metadata: Metadata = {
  title: "Auth",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Head>
        <link rel="stylesheet" href="/auth.css" />
      </Head>
      <main className="auth-body *:auth-main">{children}</main>
    </>
  );
}
