"use client";

import { Navbar } from "@/components/Navbar";
import { useAuthUser } from "@/hooks/useAuthUser";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Video, MessageSquare } from "lucide-react";

export default function ChatPage() {
  const { isAuthenticated, isLoading } = useAuthUser();
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
          <h1 className="text-3xl font-bold mb-2">Start a Conversation</h1>
          <p className="text-base-content/70">
            Connect with friends for video chats and messages
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body items-center text-center">
              <Video className="size-16 text-primary mb-4" />
              <h2 className="card-title">Video Call</h2>
              <p className="text-base-content/70 mb-4">
                Start a video call with a friend
              </p>
              <button className="btn btn-primary">
                Start Video Call
              </button>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl">
            <div className="card-body items-center text-center">
              <MessageSquare className="size-16 text-secondary mb-4" />
              <h2 className="card-title">Instant Message</h2>
              <p className="text-base-content/70 mb-4">
                Send messages to your friends
              </p>
              <button className="btn btn-secondary">
                Send Message
              </button>
            </div>
          </div>
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-4">Active Conversations</h2>
          <div className="alert alert-info">
            <span>No active conversations yet. Go to Friends to connect!</span>
          </div>
        </div>
      </main>
    </>
  );
}
