"use client";

import { Navbar } from "@/components/Navbar";
import { useAuthUser } from "@/hooks/useAuthUser";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { isAuthenticated, isLoading, user } = useAuthUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8" data-theme="forest">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <section className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Welcome, {user?.fullName}!</h2>
              <p>Ready to practice languages with native speakers?</p>
              <div className="card-actions justify-end">
                <Link href="/chat" className="btn btn-primary">
                  Start a Conversation
                </Link>
              </div>
            </div>
          </section>

          <section className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Find Friends</h2>
              <p>Connect with language learners who share your interests</p>
              <div className="card-actions justify-end">
                <Link href="/friends" className="btn btn-secondary">
                  Browse Friends
                </Link>
              </div>
            </div>
          </section>

          <section className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Friend Requests</h2>
              <p>Check and manage your friend requests</p>
              <div className="card-actions justify-end">
                <Link href="/notifications" className="btn btn-accent">
                  View Requests
                </Link>
              </div>
            </div>
          </section>

          <section className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Your Profile</h2>
              <p>Update your profile information and preferences</p>
              <div className="card-actions justify-end">
                <Link href="/profile" className="btn btn-info">
                  Edit Profile
                </Link>
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
