import { useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { signup } from "../lib/api";

const useSignup = () => {
  const queryclient = useQueryClient();
  const { mutate, isPending, error } = useMutation({
    mutationFn: signup,
    onSuccess: () => queryclient.invalidateQueries({ queryKey: ["authUser"] }),
  });

  return { signupMutation: mutate, isPending, error };
};

export default useSignup;
