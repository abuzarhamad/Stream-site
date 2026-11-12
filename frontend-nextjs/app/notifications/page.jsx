"use client";

import { Navbar } from "@/components/Navbar";
import { useAuthUser } from "@/hooks/useAuthUser";
import {
  getFriendRequests,
  acceptFriendRequest,
} from "@/lib/api";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Check, X } from "lucide-react";

export default function NotificationsPage() {
  const { isAuthenticated, isLoading } = useAuthUser();
  const router = useRouter();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  const { data: friendRequests, isLoading: isLoadingRequests } = useQuery({
    queryKey: ["friendRequests"],
    queryFn: getFriendRequests,
    enabled: isAuthenticated,
  });

  const { mutate: acceptRequest, isPending } = useMutation({
    mutationFn: acceptFriendRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friendRequests"] });
      queryClient.invalidateQueries({ queryKey: ["myFriends"] });
      toast.success("Friend request accepted!");
    },
    onError: () => {
      toast.error("Failed to accept friend request");
    },
  });

  if (isLoading || isLoadingRequests) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      </>
    );
  }

  const requests = friendRequests?.friendRequests || [];

  return (
    <>
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8" data-theme="forest">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Notifications</h1>
          <p className="text-base-content/70">
            Manage your incoming friend requests
          </p>
        </div>

        {requests.length > 0 ? (
          <div className="space-y-4">
            {requests.map((request) => (
              <div
                key={request._id}
                className="card bg-base-100 shadow-md border border-base-300"
              >
                <div className="card-body">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="avatar placeholder">
                        <div className="bg-primary text-primary-content rounded-full w-12">
                          <span className="text-lg">
                            {request.senderId?.fullName
                              ?.charAt(0)
                              .toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">
                          {request.senderId?.fullName}
                        </h3>
                        <p className="text-sm text-base-content/70">
                          {request.senderId?.email}
                        </p>
                        {request.senderId?.nativeLanguage && (
                          <p className="text-sm mt-1">
                            <span className="font-semibold">Native:</span>{" "}
                            {request.senderId?.nativeLanguage}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        className="btn btn-success btn-sm"
                        onClick={() =>
                          acceptRequest(request.senderId?._id)
                        }
                        disabled={isPending}
                      >
                        <Check size={16} />
                        Accept
                      </button>
                      <button className="btn btn-ghost btn-sm">
                        <X size={16} />
                        Decline
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="alert alert-info">
            <span>No friend requests at the moment</span>
          </div>
        )}
      </main>
    </>
  );
}
