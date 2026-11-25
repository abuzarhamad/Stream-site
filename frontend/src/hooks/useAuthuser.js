import { useQuery } from "@tanstack/react-query";
import React from "react";
import { getAuthuser } from "../lib/api";

const useAuthuser = () => {
  const authUser = useQuery({
    queryKey: ["authUser"],
    queryFn: getAuthuser,
    retry: false, // for only one time
  });

  return { isLoading: authUser.isLoading, authUser: authUser.data?.user };
};

export default useAuthuser;
