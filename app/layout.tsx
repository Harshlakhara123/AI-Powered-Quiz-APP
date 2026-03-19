import MainLayout from "@/components/layout/main-layout";
import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import { cookies } from "next/headers";
import { verifyAuthToken } from "@/lib/auth";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  const authUser = token ? verifyAuthToken(token) : null;

  const user = authUser
    ? {
        name: authUser.name,
        schoolName: authUser.schoolName,
        schoolTown: authUser.schoolTown,
      }
    : undefined;

  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <body className="antialiased">
        <MainLayout user={user}>{children}</MainLayout>
      </body>
    </html>
  );
}
