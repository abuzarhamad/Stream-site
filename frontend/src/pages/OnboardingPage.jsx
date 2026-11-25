import useAuthuser from "../hooks/useAuthuser";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { completeOnboarding } from "../lib/api";
import {
  CameraIcon,
  ShipWheelIcon,
  ShuffleIcon,
  Loader2Icon,
  MapPin,
} from "lucide-react";
import LANGUAGES from "../constant";
import { useState } from "react";
import { useNavigate } from "react-router";

const OnboardingPage = () => {
  const { authUser } = useAuthuser();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [formstate, setformstate] = useState({
    fullName: authUser?.fullName || "",
    bio: authUser?.bio || "",
    nativelanguage: authUser?.nativelanguage || "",
    learninglanguage: authUser?.learninglanguage || "",
    location: authUser?.location || "",
    profilepic: authUser?.profilepic || "",
  });

  const { mutate: onboardingMutation, isPending } = useMutation({
    mutationFn: completeOnboarding,

    onSuccess: async (data) => {
      console.log("Onboarding success:", data);

      toast.success("Profile onboarded successfully");

      // Refetch the logged-in user
      await queryClient.invalidateQueries({
        queryKey: ["authUser"],
        refetchType: "active",
      });

      // Go to home
      navigate("/", { replace: true });
    },

    onError: (error) => {
      console.log("Onboarding error:", error);

      toast.error(
        error?.response?.data?.message || "Something went wrong"
      );
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("FORM DATA:", formstate);

    onboardingMutation(formstate);
  };

  const handleRandomAvatar = () => {
    const idx = Math.floor(Math.random() * 100) + 1;

    const randomAvatar = `https://api.dicebear.com/10.x/avataaars/png?seed=${idx}`;

    setformstate((prev) => ({
      ...prev,
      profilepic: randomAvatar,
    }));

    toast.success("Random profile image generated");
  };

  return (
    <div className="min-h-screen bg-base-100 flex items-center justify-center p-4">
      <div className="card bg-base-200 w-full max-w-3xl shadow-xl">
        <div className="card-body p-6 sm:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6">
            Complete Your Profile
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* PROFILE PICTURE */}
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="size-32 rounded-full bg-base-300 overflow-hidden">
                {formstate.profilepic ? (
                  <img
                    src={formstate.profilepic}
                    alt="Profile preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <CameraIcon className="size-12 text-base-content opacity-40" />
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={handleRandomAvatar}
                className="btn btn-accent"
              >
                <ShuffleIcon className="size-4 mr-2" />
                Generate Random Avatar
              </button>
            </div>

            {/* FULL NAME */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Full Name</span>
              </label>

              <input
                type="text"
                name="fullName"
                value={formstate.fullName}
                onChange={(e) =>
                  setformstate((prev) => ({
                    ...prev,
                    fullName: e.target.value,
                  }))
                }
                className="input input-bordered w-full"
                placeholder="Your full name"
                required
              />
            </div>

            {/* BIO */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Bio</span>
              </label>

              <textarea
                name="bio"
                value={formstate.bio}
                onChange={(e) =>
                  setformstate((prev) => ({
                    ...prev,
                    bio: e.target.value,
                  }))
                }
                className="textarea textarea-bordered w-full"
                placeholder="Tell others about yourself and your language goals"
                rows={4}
              />
            </div>

            {/* LANGUAGES */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* NATIVE LANGUAGE */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Native Language</span>
                </label>

                <select
                  name="nativelanguage"
                  value={formstate.nativelanguage}
                  onChange={(e) =>
                    setformstate((prev) => ({
                      ...prev,
                      nativelanguage: e.target.value,
                    }))
                  }
                  className="select select-bordered w-full"
                  required
                >
                  <option value="">Select your native language</option>

                  {LANGUAGES.map((lang) => (
                    <option
                      key={`native-${lang}`}
                      value={lang.toLowerCase()}
                    >
                      {lang}
                    </option>
                  ))}
                </select>
              </div>

              {/* LEARNING LANGUAGE */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Learning Language</span>
                </label>

                <select
                  name="learninglanguage"
                  value={formstate.learninglanguage}
                  onChange={(e) =>
                    setformstate((prev) => ({
                      ...prev,
                      learninglanguage: e.target.value,
                    }))
                  }
                  className="select select-bordered w-full"
                  required
                >
                  <option value="">Select your learning language</option>

                  {LANGUAGES.map((lang) => (
                    <option
                      key={`learning-${lang}`}
                      value={lang.toLowerCase()}
                    >
                      {lang}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* LOCATION */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Location</span>
              </label>

              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 z-10 size-5 text-base-content opacity-70" />

                <input
                  type="text"
                  name="location"
                  value={formstate.location}
                  onChange={(e) =>
                    setformstate((prev) => ({
                      ...prev,
                      location: e.target.value,
                    }))
                  }
                  className="input input-bordered w-full pl-10"
                  placeholder="City, Country"
                  required
                />
              </div>
            </div>

            {/* SUBMIT */}
            <button
              className="btn btn-primary w-full"
              disabled={isPending}
              type="submit"
            >
              {!isPending ? (
                <>
                  <ShipWheelIcon className="size-5 mr-2" />
                  Complete Onboarding
                </>
              ) : (
                <>
                  <Loader2Icon className="animate-spin size-5 mr-2" />
                  Onboarding...
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;




// import useAuthuser from "../hooks/useAuthuser";
// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import toast from "react-hot-toast";
// import { completeOnboarding } from "../lib/api";
// import {
//   CameraIcon,
//   ShipWheelIcon,
//   ShuffleIcon,
//   Loader2Icon,
//   MapPin,
// } from "lucide-react";
// import LANGUAGES from "../constant";
// import { useState } from "react";

// const OnboardingPage = () => {
//   const { authUser } = useAuthuser();
//   const queryClient = useQueryClient();

//   // Form state
//   const [formstate, setformstate] = useState({
//     fullName: authUser.fullName || "",
//     bio: authUser.bio || "",
//     nativelanguage: authUser.nativelanguage || "",
//     learninglanguage: authUser.learninglanguage || "",
//     location: authUser.location || "",
//     profilepic: authUser.profilepic || "",
//   });

//   // Onboarding mutation
//   const { mutate: onboardingMutation, isPending } = useMutation({
//     mutationFn: completeOnboarding,

//     onSuccess: () => {
//       toast.success("Profile onboarded successfully");

//       queryClient.invalidateQueries({
//         queryKey: ["authUser"],
//       });
//     },

//     onError: (error) => {
//       console.log("Onboarding error:", error);

//       toast.error(error?.response?.data?.message || "Something went wrong");
//     },
//   });

//   // Submit form
//   const handleSubmit = (e) => {
//     e.preventDefault();

//     console.log("FORM DATA:", formstate);

//     onboardingMutation(formstate);
//   };

//   // Generate random avatar
//   const handleRandomAvatar = () => {
//     const idx = Math.floor(Math.random() * 100) + 1;

//     const randomAvatar = `https://api.dicebear.com/10.x/avataaars/png?seed=${idx}`;

//     setformstate((prev) => ({
//       ...prev,
//       profilepic: randomAvatar,
//     }));

//     toast.success("Random profile image generated");
//   };

//   return (
//     <div className="min-h-screen bg-base-100 flex items-center justify-center p-4">
//       <div className="card bg-base-200 w-full max-w-3xl shadow-xl">
//         <div className="card-body p-6 sm:p-8">
//           <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6">
//             Complete Your Profile
//           </h1>

//           <form onSubmit={handleSubmit} className="space-y-6">
//             {/* PROFILE PICTURE */}
//             <div className="flex flex-col items-center justify-center space-y-4">
//               <div className="size-32 rounded-full bg-base-300 overflow-hidden">
//                 {formstate.profilepic ? (
//                   <img
//                     src={formstate.profilepic}
//                     alt="Profile preview"
//                     className="w-full h-full object-cover"
//                   />
//                 ) : (
//                   <div className="flex items-center justify-center h-full">
//                     <CameraIcon className="size-12 text-base-content opacity-40" />
//                   </div>
//                 )}
//               </div>

//               {/* RANDOM AVATAR BUTTON */}
//               <button
//                 type="button"
//                 onClick={handleRandomAvatar}
//                 className="btn btn-accent"
//               >
//                 <ShuffleIcon className="size-4 mr-2" />
//                 Generate Random Avatar
//               </button>
//             </div>

//             {/* FULL NAME */}
//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text">Full Name</span>
//               </label>

//               <input
//                 type="text"
//                 name="fullName"
//                 value={formstate.fullName}
//                 onChange={(e) =>
//                   setformstate((prev) => ({
//                     ...prev,
//                     fullName: e.target.value,
//                   }))
//                 }
//                 className="input input-bordered w-full"
//                 placeholder="Your full name"
//                 required
//               />
//             </div>

//             {/* BIO */}
//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text">Bio</span>
//               </label>

//               <textarea
//                 name="bio"
//                 value={formstate.bio}
//                 onChange={(e) =>
//                   setformstate((prev) => ({
//                     ...prev,
//                     bio: e.target.value,
//                   }))
//                 }
//                 className="textarea textarea-bordered w-full"
//                 placeholder="Tell others about yourself and your language goals"
//                 rows={4}
//               />
//             </div>

//             {/* LANGUAGES */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               {/* NATIVE LANGUAGE */}
//               <div className="form-control">
//                 <label className="label">
//                   <span className="label-text">Native Language</span>
//                 </label>

//                 <select
//                   name="nativelanguage"
//                   value={formstate.nativelanguage}
//                   onChange={(e) =>
//                     setformstate((prev) => ({
//                       ...prev,
//                       nativelanguage: e.target.value,
//                     }))
//                   }
//                   className="select select-bordered w-full"
//                   required
//                 >
//                   <option value="">Select your native language</option>

//                   {LANGUAGES.map((lang) => (
//                     <option key={`native-${lang}`} value={lang.toLowerCase()}>
//                       {lang}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               {/* LEARNING LANGUAGE */}
//               <div className="form-control">
//                 <label className="label">
//                   <span className="label-text">Learning Language</span>
//                 </label>

//                 <select
//                   name="learninglanguage"
//                   value={formstate.learninglanguage}
//                   onChange={(e) =>
//                     setformstate((prev) => ({
//                       ...prev,
//                       learninglanguage: e.target.value,
//                     }))
//                   }
//                   className="select select-bordered w-full"
//                   required
//                 >
//                   <option value="">Select your learning language</option>

//                   {LANGUAGES.map((lang) => (
//                     <option key={`learning-${lang}`} value={lang.toLowerCase()}>
//                       {lang}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             </div>

//             {/* LOCATION */}
//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text">Location</span>
//               </label>

//               <div className="relative">
//                 <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 z-10 size-5 text-base-content opacity-70" />

//                 <input
//                   type="text"
//                   name="location"
//                   value={formstate.location}
//                   onChange={(e) =>
//                     setformstate((prev) => ({
//                       ...prev,
//                       location: e.target.value,
//                     }))
//                   }
//                   className="input input-bordered w-full pl-10"
//                   placeholder="City, Country"
//                   required
//                 />
//               </div>
//             </div>

//             {/* SUBMIT BUTTON */}
//             <button
//               className="btn btn-primary w-full"
//               disabled={isPending}
//               type="submit"
//             >
//               {!isPending ? (
//                 <>
//                   <ShipWheelIcon className="size-5 mr-2" />
//                   Complete Onboarding
//                 </>
//               ) : (
//                 <>
//                   <Loader2Icon className="animate-spin size-5 mr-2" />
//                   Onboarding...
//                 </>
//               )}
//             </button>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default OnboardingPage;

