import MainLayout from "@/components/layout/main-layout";
import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import { cookies } from "next/headers";
import { verifyAuthToken } from "@/lib/auth";
import { Toaster } from "@/components/ui/sonner";
import dbConnect from "@/lib/dbConnect";
import Assignment from "@/models/assignment";

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

  let activeAssignmentCount = 0;
  if (authUser) {
    try {
      await dbConnect();
      const userAssignments = await Assignment.find({ userId: authUser.userId }, { status: 1, formMetadata: 1 }).lean();
      
      const todayString = new Date().toISOString().split("T")[0];
      
      activeAssignmentCount = userAssignments.filter((a) => {
        if (a.status === "pending" || a.status === "processing") return true;
        const dueDate = a.formMetadata?.dueDate;
        if (!dueDate) return false;
        
        const dueDateString = 
          dueDate instanceof Date ? dueDate.toISOString().split("T")[0] : String(dueDate);
        
        return dueDateString >= todayString;
      }).length;
    } catch (error) {
      console.error("Failed to fetch active assignments", error);
    }
  }

  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <body className="antialiased">
        <MainLayout user={user} activeAssignmentCount={activeAssignmentCount}>{children}</MainLayout>
        <Toaster />
      </body>
    </html>
  );
}
