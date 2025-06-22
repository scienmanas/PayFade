"use client";

import { AuthPageLoader } from "@/app/ui/loaders";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Footer } from "@/app/ui/universal/Footer";
import { Navbar } from "@/app/ui/dashboard/Navbar";
import { Hero } from "@/app/ui/dashboard/Hero";
import { CreateRecord } from "@/app/ui/dashboard/CreateRecord";
import { Records } from "@/app/ui/dashboard/Records";
import { RecordsContext } from "@/app/hooks/useRecordsList";

export default function DashboardPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  // States
  const [userData, setUserData] = useState<{
    name: string;
    email: string;
    profilePhoto: string;
    id: string;
  } | null>(null);

  // This effect checks if the user is authenticated
  useEffect(() => {
    const checkAuth = async () => {
      const response = await fetch("/api/auth/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (response.status === 200) {
        const data = await response.json();
        setUserData({
          name: data.name,
          email: data.email,
          profilePhoto: data.profilePic,
          id: data.id,
        });
        setMounted(true);
      } else {
        router.push("/auth");
      }
    };

    checkAuth();
  }, [router]);

  if (!mounted) return <AuthPageLoader />;
  else
    return (
      <section className="dashboard w-full h-fit relative flex flex-col items-center justify-center gap-4">
        <Navbar
          name={userData?.name ?? ""}
          profilePic={userData?.profilePhoto ?? ""}
          email={userData?.email ?? ""}
        />
        <div className="page-contents relative w-full max-w-screen-xl h-fit flex flex-col gap-10 mt-20 p-4">
          <Hero name={userData?.name as string} />
          <RecordsContext.Provider
            value={{ records: null, setRecords: () => [] }}
          >
            <CreateRecord />
            <Records />
          </RecordsContext.Provider>
        </div>
        <Footer />
      </section>
    );
}
