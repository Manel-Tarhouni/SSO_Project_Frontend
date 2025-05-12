"use client";

import { handleSSOLogin, LoginFormState } from "./actions";
import { FiLock, FiMail } from "react-icons/fi";
import { useActionState, useEffect } from "react";

interface SSOLoginProps {
  client_id: string;
  redirect_uri: string;
  scope: string;
}

const initialState: LoginFormState = {
  success: true,
  errors: {},
  formError: undefined,
};

declare global {
  interface Window {
    google: any;
  }
}

export default function SSOLogin({
  client_id,
  redirect_uri,
  scope,
}: SSOLoginProps) {
  const [state, formAction, isPending] = useActionState(
    handleSSOLogin,
    initialState
  );

  useEffect(() => {
    if (state?.success && !isPending && state?.redirectUrl) {
      window.location.href = state.redirectUrl;
    }
  }, [state, isPending]);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;

    script.onload = () => {
      window.google.accounts.id.initialize({
        client_id:
          "159835260108-r5pojlbr7khl195g8leh8qq9jqk5m4br.apps.googleusercontent.com",
        callback: handleCredentialResponse,
      });

      window.google.accounts.id.renderButton(
        document.getElementById("google-signin-button"),
        { theme: "outline", size: "large" }
      );
    };

    document.body.appendChild(script);
  }, []);

  function handleCredentialResponse(response: any) {
    const idToken = response.credential;

    const formData = new FormData();
    formData.append("Provider", "Google");
    formData.append("IdToken", idToken);
    formData.append("client_id", client_id);
    formData.append("redirect_uri", redirect_uri);
    formData.append("scope", scope);

    formAction(formData);
  }

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
          <input type="hidden" name="Provider" value="credentials" />

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
          <div id="google-signin-button"></div>
        </div>
      </div>
    </div>
  );
}
