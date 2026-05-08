"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (localStorage.getItem("reca_auth") !== "true") {
        router.replace("/");
      } else {
        setChecked(true);
      }
    }
  }, [router]);

  if (!checked) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <div className="text-text-secondary text-xs tracking-widest uppercase">Loading...</div>
      </div>
    );
  }

  return <>{children}</>;
}
