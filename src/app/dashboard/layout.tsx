import { getUserFromSession, UserSession } from "@/lib/auth";
import { cookies } from "next/headers";
import { UserProvider } from "./UserContext";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let user: UserSession | null = null;
  const sessionToken = (await cookies()).get("session")?.value;
  if (sessionToken) {
    user = getUserFromSession(sessionToken);
  }

  return (
    <UserProvider user={user}>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </div>
    </UserProvider>
  );
}
