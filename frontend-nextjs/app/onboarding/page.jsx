"use client";

import { useState } from "react";
import { ShipWheelIcon } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { completeOnboarding } from "@/lib/api";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const languages = [
  "English",
  "Spanish",
  "French",
  "German",
  "Italian",
  "Portuguese",
  "Japanese",
  "Mandarin",
  "Korean",
  "Arabic",
];

export default function OnboardingPage() {
  const [onboardingData, setOnboardingData] = useState({
    nativeLanguage: "",
    learningLanguages: [],
    proficiency: "",
  });

  const queryClient = useQueryClient();
  const router = useRouter();

  const { mutate, isPending, error } = useMutation({
    mutationFn: completeOnboarding,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      toast.success("Onboarding completed!");
      router.push("/");
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Onboarding failed");
    },
  });

  const toggleLanguage = (language) => {
    setOnboardingData((prev) => {
      const learningLanguages = prev.learningLanguages.includes(language)
        ? prev.learningLanguages.filter((l) => l !== language)
        : [...prev.learningLanguages, language];
      return { ...prev, learningLanguages };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      !onboardingData.nativeLanguage ||
      onboardingData.learningLanguages.length === 0 ||
      !onboardingData.proficiency
    ) {
      toast.error("Please fill in all fields");
      return;
    }
    mutate(onboardingData);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 sm:p-6 md:p-8"
      data-theme="forest"
    >
      <div className="w-full max-w-2xl bg-base-100 rounded-xl shadow-lg p-8">
        <div className="mb-8 flex items-center justify-center gap-2">
          <ShipWheelIcon className="size-9 text-primary" />
          <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
            Streamify
          </span>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold">Complete Your Profile</h2>
              <p className="text-sm opacity-70 mt-2">
                Tell us about your language learning journey
              </p>
            </div>

            {error && (
              <div className="alert alert-error text-sm">
                <span>{error.response?.data?.message || "An error occurred"}</span>
              </div>
            )}

            {/* Native Language */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-semibold">Native Language</span>
              </label>
              <select
                className="select select-bordered w-full"
                value={onboardingData.nativeLanguage}
                onChange={(e) =>
                  setOnboardingData({
                    ...onboardingData,
                    nativeLanguage: e.target.value,
                  })
                }
                required
              >
                <option value="">Select your native language</option>
                {languages.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang}
                  </option>
                ))}
              </select>
            </div>

            {/* Learning Languages */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-semibold">
                  Languages You Want to Learn
                </span>
              </label>
              <div className="grid grid-cols-2 gap-3 mt-3">
                {languages.map((lang) => (
                  <label key={lang} className="flex gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="checkbox checkbox-primary"
                      checked={onboardingData.learningLanguages.includes(lang)}
                      onChange={() => toggleLanguage(lang)}
                    />
                    <span className="label-text">{lang}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Proficiency Level */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-semibold">
                  Your Proficiency Level
                </span>
              </label>
              <select
                className="select select-bordered w-full"
                value={onboardingData.proficiency}
                onChange={(e) =>
                  setOnboardingData({
                    ...onboardingData,
                    proficiency: e.target.value,
                  })
                }
                required
              >
                <option value="">Select your proficiency level</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
                <option value="fluent">Fluent</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="btn btn-primary w-full"
            >
              {isPending ? "Completing..." : "Complete Onboarding"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
