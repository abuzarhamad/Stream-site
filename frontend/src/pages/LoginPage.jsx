import { useState } from "react";
import { ShipWheelIcon } from "lucide-react";
import { Link } from "react-router";
import useLogin from "../hooks/useLogin";

const LoginPage = () => {
  const [loginData, setLoginData] = useState({ email: "", password: "" });

  // const queryClient = useQueryClient();

  // WITH FUNCTION
  // const { mutate, isPending, error } = useMutation({
  //   mutationFn: async () => {
  //     const response = await axiosInstance.post("/auth/login", loginData);
  //     return response.data;
  //   },
  //   onSuccess: () => queryClient.invalidateQueries({ queryKey: ["authUser"] }),
  // });

  // SEPARATE THE FUNCTION
  // const {
  //   mutate: loginMutation,
  //   isPending,
  //   error,
  // } = useMutation({
  //   mutationFn: login,
  //   onSuccess: () => queryClient.invalidateQueries({ queryKey: ["authUser"] }),
  // });

  const { isPending, error, loginMutation } = useLogin();

  const handleLogin = (event) => {
    event.preventDefault();
    loginMutation(loginData);
  };

  return (
    <div
      className="h-screen flex items-center justify-center p-4 sm:p-6 md:p-8"
      data-theme="forest"
    >
      <div className="border border-primary/25 flex flex-col lg:flex-row w-full max-w-5xl mx-auto bg-base-100 rounded-xl shadow-lg overflow-hidden">
        {/* FORM SECTION  */}
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
                {/* HEADER TEXT */}
                <h2 className="text-xl font-semibold">Welcome back</h2>
                {/* HEADER DESC */}
                <p className="text-sm opacity-70">
                  Sign in to continue your language learning adventure
                </p>
              </div>
              {/* SHOW ERROR */}
              {error && (
                <div className="alert alert-error text-sm" role="alert">
                  <span>
                    {error.response?.data?.message ||
                      "Unable to sign in. Please try again."}
                  </span>
                </div>
              )}
              {/* EMAIL  */}
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
                {/* PASSWORD */}
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
                      setLoginData({
                        ...loginData,
                        password: event.target.value,
                      })
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

              <div className="text-center mt-4">
                <p className="text-sm">
                  Don&apos;t have an account?{" "}
                  <Link to="/signup" className="text-primary hover:underline">
                    Create one
                  </Link>
                </p>
              </div>
            </div>
          </form>
        </div>

        {/* IMAGE SECTION */}
        <div className="hidden lg:flex flex-col bg-base-200 w-1/2 p-4 sm:p-8">
          <div className="max-w-md p-8">
            <div className="relative aspect-square max-w-sm mx-auto">
              <img
                src="/i.png"
                alt="Language connection"
                className="size-full"
              />
            </div>
            <div className="text-center space-y-3 mt-6">
              <h2 className="text-xl font-semibold">
                Reconnect with language partners worldwide
              </h2>
              <p className="opacity-70">
                Pick up your conversations, make friends, and keep improving
                together.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
