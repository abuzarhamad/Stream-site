"use client";

import { Navbar } from "@/components/Navbar";
import { useAuthUser } from "@/hooks/useAuthUser";
import {
  getRecommendedUsers,
  sendFriendRequest,
  getOutgoingFriendRequests,
} from "@/lib/api";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { UserPlus, Check } from "lucide-react";

export default function FriendsPage() {
  const { isAuthenticated, isLoading } = useAuthUser();
  const router = useRouter();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  const { data: recommendedUsers, isLoading: isLoadingUsers } = useQuery({
    queryKey: ["recommendedUsers"],
    queryFn: getRecommendedUsers,
    enabled: isAuthenticated,
  });

  const { data: outgoingRequests } = useQuery({
    queryKey: ["outgoingFriendRequests"],
    queryFn: getOutgoingFriendRequests,
    enabled: isAuthenticated,
  });

  const { mutate: sendRequest, isPending } = useMutation({
    mutationFn: sendFriendRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recommendedUsers"] });
      queryClient.invalidateQueries({ queryKey: ["outgoingFriendRequests"] });
      toast.success("Friend request sent!");
    },
    onError: () => {
      toast.error("Failed to send friend request");
    },
  });

  const outgoingUserIds = new Set(
    outgoingRequests?.outgoingFriendRequests?.map((req) => req.receiverId) || []
  );

  if (isLoading || isLoadingUsers) {
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
          <h1 className="text-3xl font-bold mb-2">Find Friends</h1>
          <p className="text-base-content/70">
            Connect with other language learners and practice together
          </p>
        </div>

        {recommendedUsers?.users && recommendedUsers.users.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendedUsers.users.map((user) => (
              <div key={user._id} className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h2 className="card-title text-lg">{user.fullName}</h2>
                      <p className="text-sm text-base-content/70">
                        {user.email}
                      </p>
                    </div>
                    <div className="avatar placeholder">
                      <div className="bg-primary text-primary-content rounded-full w-12">
                        <span className="text-lg">
                          {user.fullName?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {user.nativeLanguage && (
                    <div className="mt-4 space-y-2">
                      <p className="text-sm">
                        <span className="font-semibold">Native:</span>{" "}
                        {user.nativeLanguage}
                      </p>
                      {user.learningLanguages && (
                        <p className="text-sm">
                          <span className="font-semibold">Learning:</span>{" "}
                          {Array.isArray(user.learningLanguages)
                            ? user.learningLanguages.join(", ")
                            : user.learningLanguages}
                        </p>
                      )}
                    </div>
                  )}

                  <div className="card-actions justify-end mt-4">
                    {outgoingUserIds.has(user._id) ? (
                      <button className="btn btn-ghost btn-sm" disabled>
                        <Check size={16} />
                        Request Sent
                      </button>
                    ) : (
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => sendRequest(user._id)}
                        disabled={isPending}
                      >
                        <UserPlus size={16} />
                        Add Friend
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="alert alert-info">
            <span>No recommended users available at the moment</span>
          </div>
        )}
      </main>
    </>
  );
}
