"use client";

import React, { useState } from "react";
import { ShipWheelIcon } from "lucide-react";
import Link from "next/link";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { signup } from "@/lib/api";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const [signupData, setSignupData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const queryClient = useQueryClient();
  const router = useRouter();

  const {
    mutate: signupmutation,
    isPending,
    error,
  } = useMutation({
    mutationFn: signup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      toast.success("Account created successfully!");
      router.push("/onboarding");
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to create account");
    },
  });

  const handleSignup = (e) => {
    e.preventDefault();
    if (!signupData.fullName || !signupData.email || !signupData.password) {
      toast.error("Please fill in all fields");
      return;
    }
    if (signupData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    signupmutation(signupData);
  };

  return (
    <>
      <div
        className="h-screen flex items-center justify-center p-4 sm:p-6 md:p-8"
        data-theme="forest"
      >
        <div className="border border-primary/25 flex flex-col lg:flex-row w-full max-w-5xl mx-auto bg-base-100 rounded-xl shadow-lg overflow-hidden">
          {/* leftside */}
          <div className="w-full lg:w-1/2 p-4 sm:p-8 flex flex-col ">
            {/* logo */}
            <div className="mb-4 flex items-center justify-start gap-2">
              <ShipWheelIcon className="size-9 text-primary" />
              <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
                Streamify
              </span>
            </div>

            {/* ERROR MESSAGE */}

            {error && (
              <div className="alert alert-error mb-4">
                <span>{error.response?.data?.message || "Signup failed"}</span>
              </div>
            )}
            <div className="w-full">
              <form onSubmit={handleSignup}>
                <div className="space-y-4 ">
                  <div>
                    <h2 className="text-xl font-semibold ">
                      Create An Account
                    </h2>
                    <p className="text-sm opacity-70">
                      Join Streamify and start your language learning adventure
                    </p>
                  </div>

                  <div className="space-y-3">
                    {/* FULL NAME */}
                    <div className="form-control w-full">
                      <label className="label">
                        <span className="label-text">Full Name</span>
                      </label>

                      <input
                        type="text"
                        placeholder="john Doe"
                        className="input input-bordered w-full "
                        value={signupData.fullName}
                        onChange={(e) =>
                          setSignupData({
                            ...signupData,
                            fullName: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    {/* EMAIL */}
                    <div className="form-control w-full">
                      <label className="label">
                        <span className="label-text">Email</span>
                      </label>

                      <input
                        type="email"
                        placeholder="john@gmail.com"
                        className="input input-bordered w-full "
                        value={signupData.email}
                        onChange={(e) =>
                          setSignupData({
                            ...signupData,
                            email: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    {/* PASSWORD */}
                    <div className="form-control w-full">
                      <label className="label">
                        <span className="label-text">Password</span>
                      </label>

                      <input
                        type="password"
                        placeholder="enter password"
                        className="input input-bordered w-full"
                        value={signupData.password}
                        onChange={(e) =>
                          setSignupData({
                            ...signupData,
                            password: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isPending}
                    className="btn btn-primary w-full"
                  >
                    {isPending ? "Creating account..." : "Create Account"}
                  </button>
                </div>
              </form>
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm">
                Already have an account?{" "}
                <Link href="/login" className="link link-primary">
                  Sign in
                </Link>
              </p>
            </div>
          </div>

          {/* right side */}
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
    </>
  );
}
