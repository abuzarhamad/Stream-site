"use client";

import { Navbar } from "@/components/Navbar";
import { useAuthUser } from "@/hooks/useAuthUser";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProfilePage() {
  const { isAuthenticated, isLoading, user } = useAuthUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8" data-theme="forest">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Profile</h1>
          <p className="text-base-content/70">
            View and manage your profile information
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="md:col-span-1">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body items-center text-center">
                <div className="avatar placeholder mb-4">
                  <div className="bg-primary text-primary-content rounded-full w-24">
                    <span className="text-3xl">
                      {user?.fullName?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </div>
                <h2 className="card-title">{user?.fullName}</h2>
                <p className="text-base-content/70">{user?.email}</p>
                <button className="btn btn-primary mt-4">Edit Profile</button>
              </div>
            </div>
          </div>

          {/* User Details */}
          <div className="md:col-span-2">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title mb-4">Profile Information</h2>

                <div className="space-y-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-semibold">Full Name</span>
                    </label>
                    <input
                      type="text"
                      className="input input-bordered"
                      value={user?.fullName || ""}
                      disabled
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-semibold">Email</span>
                    </label>
                    <input
                      type="email"
                      className="input input-bordered"
                      value={user?.email || ""}
                      disabled
                    />
                  </div>

                  {user?.nativeLanguage && (
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-semibold">
                          Native Language
                        </span>
                      </label>
                      <input
                        type="text"
                        className="input input-bordered"
                        value={user?.nativeLanguage || ""}
                        disabled
                      />
                    </div>
                  )}

                  {user?.learningLanguages && (
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-semibold">
                          Learning Languages
                        </span>
                      </label>
                      <input
                        type="text"
                        className="input input-bordered"
                        value={Array.isArray(user?.learningLanguages)
                          ? user?.learningLanguages.join(", ")
                          : user?.learningLanguages || ""}
                        disabled
                      />
                    </div>
                  )}

                  {user?.proficiency && (
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-semibold">
                          Proficiency Level
                        </span>
                      </label>
                      <input
                        type="text"
                        className="input input-bordered"
                        value={user?.proficiency || ""}
                        disabled
                      />
                    </div>
                  )}
                </div>

                <div className="card-actions justify-end mt-6">
                  <button className="btn btn-primary">Edit Information</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
