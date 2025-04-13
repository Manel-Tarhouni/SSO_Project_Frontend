"use client";
import { useState } from "react";
import { registerUser } from "../Services/UserService";
import { FiUser, FiLock } from "react-icons/fi";
import { FaGithub, FaLinkedinIn } from "react-icons/fa";
import { hasLowercase, hasUppercase, hasNumber, hasSpecialChar, hasTripleRepeat, PasswordRule } from "./utils";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    email: "",
    firstname: "",
    lastname: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
  
    // Check if the password meets all requirements before submitting
    if (
      !hasLowercase(formData.password) ||
      !hasUppercase(formData.password) ||
      !hasNumber(formData.password) ||
      !hasSpecialChar(formData.password) ||
      hasTripleRepeat(formData.password)
    ) {
      setError("Password does not meet all requirements.");
      setLoading(false);
      return;
    }
  
    try {
      const response = await registerUser(formData);
      setSuccess(response.message);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
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

        <form className="space-y-5" onSubmit={handleSubmit}>
        <div>
  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
    Email
  </label>
  <div>
    <input
      type="email"
      name="email"
      id="email"
      autoComplete="email"
      required
      className="w-full border border-gray-300 px-4 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      placeholder="you@example.com"
      value={formData.email}
      onChange={handleChange}
    />

  </div>
</div>


          <div>
            <label htmlFor="firstname" className="block text-sm font-medium text-gray-700 mb-1">
              First Name
            </label>
            <input
              type="text"
              name="firstname"
              id="firstname"
              required
              className="w-full border border-gray-300 px-4 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="John"
              value={formData.firstname}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="lastname" className="block text-sm font-medium text-gray-700 mb-1">
              Last Name
            </label>
            <input
              type="text"
              name="lastname"
              id="lastname"
              required
              className="w-full border border-gray-300 px-4 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Doe"
              value={formData.lastname}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                name="password"
                id="password"
                autoComplete="new-password"
                required
                className="w-full pl-10 border border-gray-300 px-4 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            {formData.password && (
  <div className="mt-2 p-4 border border-gray-300 bg-white rounded-lg shadow-sm text-sm text-gray-700">
    <p className="mb-2 font-semibold">Your password must contain:</p>
    <ul className="space-y-1">
      <PasswordRule
        isValid={hasLowercase(formData.password)}
        text="Lowercase letters (a–z)"
      />
      <PasswordRule
        isValid={hasUppercase(formData.password)}
        text="Uppercase letters (A–Z)"
      />
      <PasswordRule
        isValid={hasNumber(formData.password)}
        text="Numbers (0–9)"
      />
      <PasswordRule
        isValid={hasSpecialChar(formData.password)}
        text="Special characters (ex. !@#)"
      />
      <PasswordRule
        isValid={!hasTripleRepeat(formData.password)}
        text="No more than 2 identical characters in a row"
      />
    </ul>
  </div>
)}

          </div>

          <button
            type="submit"
            className="w-full mt-2 bg-indigo-600 hover:bg-indigo-500 px-4 py-2 text-sm font-medium text-white shadow focus:outline-none focus:ring-2 focus:ring-indigo-500"
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        {error && (
  <div className="text-red-600 text-sm mt-4 whitespace-pre-line">
    {error}
  </div>
)}

        {success && <p className="text-green-600 text-sm mt-4">{success}</p>}

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
