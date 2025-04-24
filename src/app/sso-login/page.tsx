"use client";

import { handleSSOLogin } from "./actions";
import { FiLock, FiMail } from "react-icons/fi";
import { FaGithub, FaLinkedinIn } from "react-icons/fa";
import { useActionState, useEffect } from "react";

interface PageProps {
  searchParams: {
    clientId?: string;
    redirect_uri?: string;
    scope?: string;
  };
}

const initialState = {
  success: true,
  errors: {},
  formError: undefined,
};

export default function SSOLogin({ searchParams }: PageProps) {
  const client_id = searchParams.clientId ?? "";
  const redirect_uri = searchParams.redirect_uri ?? "";
  const scope = searchParams.scope ?? "";

  const [state, formAction, isPending] = useActionState(
    handleSSOLogin,
    initialState
  );

  useEffect(() => {
    if (state?.success && !isPending && state?.redirectUrl) {
      window.location.href = state.redirectUrl;
    }
  }, [state, isPending]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f0f4f8] px-4">
      <div className="w-full max-w-sm bg-white p-10 shadow-xl">
        <div className="mb-6">
          <h2 className="text-center text-3xl font-medium text-gray-900 tracking-tight">
            Welcome back
          </h2>
          <p className="text-center text-sm text-gray-500 mt-1">
            Sign in to your account to continue
          </p>
        </div>

        {state?.formError && (
          <p className="text-sm text-red-500 text-center mb-4">
            {state.formError}
          </p>
        )}

        <form action={formAction} className="space-y-5">
          <input type="hidden" name="client_id" value={client_id} />
          <input type="hidden" name="redirect_uri" value={redirect_uri} />
          <input type="hidden" name="scope" value={scope} />

          <div>
            <label
              htmlFor="Email"
              className="text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <div className="relative">
              <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                name="Email"
                id="Email"
                required
                className="w-full pl-10 border border-gray-300 px-4 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Your Email"
              />
            </div>
            {state?.errors?.Email && (
              <p className="text-sm text-red-500 mt-1">
                {state.errors.Email[0]}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                name="password"
                id="password"
                required
                className="w-full pl-10 border border-gray-300 px-4 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="••••••••"
              />
            </div>
            {state?.errors?.password && (
              <p className="text-sm text-red-500 mt-1">
                {state.errors.password[0]}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-500 px-4 py-2 text-sm font-medium text-white"
          >
            {isPending ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <div className="mt-6 flex items-center justify-center text-sm text-gray-400">
          <div className="w-full border-t border-gray-200" />
          <span className="px-3">or</span>
          <div className="w-full border-t border-gray-200" />
        </div>
        <div className="mt-6 text-center text-sm text-gray-600">
          <span>Need an account? </span>
          <a
            href="/user-registration"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Sign up
          </a>
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
