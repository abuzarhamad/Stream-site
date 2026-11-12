"use client";

import { useState } from "react";
import { ShipWheelIcon } from "lucide-react";
import Link from "next/link";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { login } from "@/lib/api";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const queryClient = useQueryClient();
  const router = useRouter();

  const { mutate, isPending, error } = useMutation({
    mutationFn: login,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      toast.success("Logged in successfully!");
      router.push("/");
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to login");
    },
  });

  const handleLogin = (event) => {
    event.preventDefault();
    if (!loginData.email || !loginData.password) {
      toast.error("Please fill in all fields");
      return;
    }
    mutate(loginData);
  };

  return (
    <div
      className="h-screen flex items-center justify-center p-4 sm:p-6 md:p-8"
      data-theme="light"
    >
      <div className="border border-primary/25 flex flex-col lg:flex-row w-full max-w-5xl mx-auto bg-base-100 rounded-xl shadow-lg overflow-hidden">
        <div className="w-full lg:w-1/2 p-4 sm:p-8 flex flex-col">
          <div className="mb-4 flex items-center justify-start gap-2">
            <ShipWheelIcon className="size-9 text-primary" />
            <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
              Streamify
            </span>
          </div>

          <form className="w-full" onSubmit={handleLogin}>
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold">Welcome back</h2>
                <p className="text-sm opacity-70">
                  Sign in to continue your language learning adventure
                </p>
              </div>

              {error && (
                <div className="alert alert-error text-sm" role="alert">
                  <span>
                    {error.response?.data?.message ||
                      "Unable to sign in. Please try again."}
                  </span>
                </div>
              )}

              <div className="space-y-3">
                <div className="form-control w-full">
                  <label className="label" htmlFor="email">
                    <span className="label-text">Email</span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="john@gmail.com"
                    className="input input-bordered w-full"
                    value={loginData.email}
                    onChange={(event) =>
                      setLoginData({ ...loginData, email: event.target.value })
                    }
                    autoComplete="email"
                    required
                  />
                </div>

                <div className="form-control w-full">
                  <label className="label" htmlFor="password">
                    <span className="label-text">Password</span>
                  </label>
                  <input
                    id="password"
                    type="password"
                    placeholder="********"
                    className="input input-bordered w-full"
                    value={loginData.password}
                    onChange={(event) =>
                      setLoginData({ ...loginData, password: event.target.value })
                    }
                    autoComplete="current-password"
                    required
                  />
                </div>
              </div>

              <button
                className="btn btn-primary w-full"
                type="submit"
                disabled={isPending}
              >
                {isPending ? "Signing in..." : "Sign In"}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm">
              Don't have an account?{" "}
              <Link href="/signup" className="link link-primary">
                Create one
              </Link>
            </p>
          </div>
        </div>

        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary to-secondary items-center justify-center p-8">
          <div className="text-center text-white">
            <ShipWheelIcon className="size-24 mx-auto mb-4" />
            <h1 className="text-4xl font-bold mb-4">Streamify</h1>
            <p className="text-lg opacity-90">
              Connect with language learners worldwide through live video chat
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
