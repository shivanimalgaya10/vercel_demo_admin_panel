"use client";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/Button";
import { clearTokenCookie } from "@/utils/cookies";

export function Topbar() {
  const router = useRouter();

  return (
    <header className="flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4">
      <div>
        <div className="text-sm font-semibold text-slate-900">Dashboard</div>
        <div className="text-xs text-slate-500">
          Manage blogs, content, and more
        </div>
      </div>
      <Button
        variant="secondary"
        onClick={() => {
          clearTokenCookie();
          toast.success("Logged out");
          router.replace("/login");
        }}
      >
        Logout
      </Button>
    </header>
  );
}

