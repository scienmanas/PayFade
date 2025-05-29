"use client";

import { PageLoader } from "@/app/ui/loaders";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  const [userData, setUserData] = useState<{
    name: string;
    email: string;
    profilePhoto: string;
  } | null>(null);
 

  useEffect(() => {
    const checkAuth = async () => {
      const response = await fetch("/api/auth/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setUserData({
          name: data.name,
          email: data.email,
          profilePhoto: data.profilePic,
        });
        setMounted(true);
      } else {
        router.push("/auth");
      }
    };

    checkAuth();
  }, [router]);

  if (!mounted) return <PageLoader />;

  else
    return (
      <section className="w-full h-fit relative flex flex-col items-center justify-center gap-4">
        Hello World
      </section>
    );
}