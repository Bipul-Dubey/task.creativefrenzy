"use client";

import { useEffect, ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useBoardStore } from "@/store/board-store";

export default function AuthWrapper({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { setCurrentUser } = useBoardStore();

  useEffect(() => {
    const user = localStorage.getItem("login");
    const isLoggedIn = Boolean(user);
    setCurrentUser(JSON.parse(user ?? "{}"));

    if (!isLoggedIn && pathname !== "/" && pathname !== "/register") {
      router.replace("/");
    }

    if (isLoggedIn && (pathname === "/" || pathname === "/register")) {
      router.replace("/task");
    }
  }, [pathname, router]);

  return <>{children}</>;
}
