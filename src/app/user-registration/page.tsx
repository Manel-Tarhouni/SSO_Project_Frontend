"use client";

import { useActionState, useEffect } from "react";
import { FiLock } from "react-icons/fi";
import { FaGithub, FaLinkedinIn } from "react-icons/fa";
import { registerAction, RegisterFormState } from "./actions";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [formState, formAction, isPending] = useActionState(registerAction, {
    errors: {},
    message: "",
  });

  const router = useRouter();

  useEffect(() => {
    if (
      formState.message &&
      !formState.errors &&
      formState.message === "Registration successful!"
    ) {
      router.push("/sso-login");
    }
  }, [formState, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f0f4f8] px-4">
      <div className="w-full max-w-sm bg-white p-10 shadow-xl">
        <div className="mb-6">
          <h2 className="text-center text-3xl font-medium text-gray-900 tracking-tight">
            Create your account
          </h2>
          <p className="text-center text-sm text-gray-500 mt-1">
            Register below to get started
          </p>
        </div>

        <form className="space-y-5" action={formAction}>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <input
              type="text"
              name="email"
              id="email"
              autoComplete="email"
              className="w-full border border-gray-300 px-4 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="you@example.com"
            />
            {formState.errors?.email && (
              <p className="text-red-600 text-sm">
                {formState.errors.email[0]}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="firstname"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              First Name
            </label>
            <input
              type="text"
              name="firstname"
              id="firstname"
              className="w-full border border-gray-300 px-4 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="John"
            />
            {formState.errors?.firstname && (
              <p className="text-red-600 text-sm">
                {formState.errors.firstname[0]}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="lastname"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Last Name
            </label>
            <input
              type="text"
              name="lastname"
              id="lastname"
              className="w-full border border-gray-300 px-4 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Doe"
            />
            {formState.errors?.lastname && (
              <p className="text-red-600 text-sm">
                {formState.errors.lastname[0]}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                name="password"
                id="password"
                autoComplete="new-password"
                className="w-full pl-10 border border-gray-300 px-4 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="••••••••"
              />
            </div>
            {formState.errors?.password && (
              <p className="text-red-600 text-sm">
                {formState.errors.password[0]}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full mt-2 bg-indigo-600 hover:bg-indigo-500 px-4 py-2 text-sm font-medium text-white shadow focus:outline-none focus:ring-2 focus:ring-indigo-500"
            disabled={isPending}
          >
            {isPending ? "Registering..." : "Register"}
          </button>
        </form>

        {formState.message && (
          <div
            className={`text-${
              formState.errors ? "red" : "green"
            }-600 text-sm mt-4`}
          >
            {formState.message}
          </div>
        )}

        <div className="mt-6 mb-4 flex items-center justify-center text-sm text-gray-400">
          <div className="w-full border-t border-gray-200" />
          <span className="px-3">or</span>
          <div className="w-full border-t border-gray-200" />
        </div>

        <div className="space-y-3 mt-6">
          <button className="w-full flex items-center justify-center border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
            <FaLinkedinIn className="w-5 h-5 mr-2 text-[#0A66C2]" />
            Continue with LinkedIn
          </button>
          <button className="w-full flex items-center justify-center border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
            <FaGithub className="w-5 h-5 mr-2" />
            Continue with GitHub
          </button>
        </div>
      </div>
    </div>
  );
}
