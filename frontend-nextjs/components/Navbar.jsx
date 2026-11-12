"use client";

import { ShipWheelIcon, LogOut, Menu } from "lucide-react";
import Link from "next/link";
import { useAuthUser } from "@/hooks/useAuthUser";
import { logout } from "@/lib/api";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export function Navbar() {
  const { user, isAuthenticated } = useAuthUser();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { mutate: logoutMutation } = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      toast.success("Logged out successfully");
      router.push("/login");
    },
    onError: () => {
      toast.error("Failed to logout");
    },
  });

  return (
    <div className="navbar bg-base-100 shadow-md">
      <div className="flex-1">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold">
          <ShipWheelIcon className="size-8 text-primary" />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
            Streamify
          </span>
        </Link>
      </div>

      {isAuthenticated ? (
        <>
          <div className="hidden md:flex gap-4">
            <Link href="/chat" className="btn btn-ghost btn-sm">
              Chat
            </Link>
            <Link href="/notifications" className="btn btn-ghost btn-sm">
              Notifications
            </Link>
            <div className="dropdown dropdown-end">
              <button className="btn btn-ghost btn-circle avatar">
                <div className="w-10 rounded-full bg-primary text-primary-content flex items-center justify-center">
                  {user?.fullName?.charAt(0).toUpperCase()}
                </div>
              </button>
              <ul className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                <li>
                  <span className="font-semibold">{user?.fullName}</span>
                </li>
                <li>
                  <a>{user?.email}</a>
                </li>
                <li>
                  <Link href="/profile">Profile</Link>
                </li>
                <li>
                  <button onClick={() => logoutMutation()}>
                    <LogOut size={16} />
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden">
            <div className="dropdown dropdown-end">
              <button className="btn btn-ghost btn-circle">
                <Menu size={20} />
              </button>
              <ul className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                <li>
                  <Link href="/chat">Chat</Link>
                </li>
                <li>
                  <Link href="/notifications">Notifications</Link>
                </li>
                <li>
                  <Link href="/profile">Profile</Link>
                </li>
                <li>
                  <button onClick={() => logoutMutation()}>Logout</button>
                </li>
              </ul>
            </div>
          </div>
        </>
      ) : (
        <div className="flex gap-2">
          <Link href="/login" className="btn btn-ghost btn-sm">
            Sign In
          </Link>
          <Link href="/signup" className="btn btn-primary btn-sm">
            Sign Up
          </Link>
        </div>
      )}
    </div>
  );
}
