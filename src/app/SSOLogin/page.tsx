"use client";

import { useState } from "react";
import { postAuthorize } from "../Services/AuthService";
import { useSearchParams, useRouter } from "next/navigation";
import { FiMail, FiLock } from "react-icons/fi";
import { FaLinkedinIn, FaGithub } from "react-icons/fa";
import Link from "next/link"; // Add this at the top

export default function SSOLogin() {
  const [Email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();

  const client_id = searchParams.get("clientId") || "";
  console.log(client_id);
  const redirect_uri = searchParams.get("redirect_uri") || "";
  const scope = searchParams.get("scope") || "";
  console.log("clientid",client_id);
   console.log("redirect_uri",redirect_uri);
   console.log("scope",scope);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await postAuthorize({
        client_id,
        redirect_uri,
        scope,
        Email,
        password,
      });
   console.log("clientid",client_id);
   console.log("redirect_uri",redirect_uri);
   console.log("scope",scope);
   console.log("Email",Email);


      // Success! Redirect to the client with the code
      const redirectUrl = new URL(redirect_uri);
      redirectUrl.searchParams.set("code", response.code);
      router.push(redirectUrl.toString());
    } catch (err: any) {
      setError(err.message);
    }
  };

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

        {error && (
          <div className="mb-4 text-red-600 text-sm text-center">{error}</div>
        )}

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="relative">
            <label
              htmlFor="Email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <div className="relative">
              <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                name="Email"
                id="Email"
                autoComplete="Email"
                required
                value={Email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 border border-gray-300 px-4 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Your Email"
              />
            </div>
          </div>

          <div className="relative">
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
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 border border-gray-300 px-4 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="••••••••"
              />
            </div>
          </div>
          <div className="flex justify-start text-sm items-center space-x-1">
  <span className="text-gray-500">Need an account?</span>
  <Link
    href="/UserRegistration"
    className="text-indigo-600 hover:underline font-medium"
  >
    Sign up
  </Link>
</div>
          <button
            type="submit"
            className="w-full mt-2 bg-indigo-600 hover:bg-indigo-500 px-4 py-2 text-sm font-medium text-white shadow focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Sign in
          </button>
        </form>

        {/* Divider */}
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
