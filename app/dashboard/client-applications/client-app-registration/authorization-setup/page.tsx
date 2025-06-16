/*"use client";

import { useFormContext } from "../FormContext";
import { useActionState } from "react";
import { registerClientAction } from "../actions";
import { useState } from "react";
import { downloadClientCredentials, copyToClipboard } from "../helper";
const initialState = {
  success: false,
  errors: {
    allowedScopes: [],
    logoFile: [],
    isConfidential: [],
    clientName: [],
    redirectUri: [],
    domain: [],
  },
  formError: undefined,
  data: undefined,
};

export default function AuthorizationSetupPage() {
  const { formData, updateFormData } = useFormContext();
  const [allowedScopesInput, setAllowedScopesInput] = useState<string>(
    (formData.allowedScopes || []).join(", ")
  );
  const [copied, setCopied] = useState<string | null>(null);

  const [state, formAction, isPending] = useActionState(
    registerClientAction,
    initialState
  );

  const downloadCredentials = () => {
    if (state.data) {
      downloadClientCredentials(state.data);
    }
  };

  const buildFormData = (): FormData => {
    const fd = new FormData();
    fd.set("isConfidential", formData.isConfidential.toString());
    fd.set("clientName", formData.clientName);
    fd.set("redirectUri", formData.redirectUri);
    fd.set("domain", formData.domain);
    fd.set("allowedScopes", allowedScopesInput);
    if (formData.logoFile) {
      fd.set("logoFile", formData.logoFile);
    }
    return fd;
  };

  return (
    <form
      action={() => formAction(buildFormData())}
      className="flex flex-1 flex-col items-center px-6 py-10 bg-white"
    >
      <div className="w-full max-w-2xl flex flex-col gap-6">
        <h2 className="text-2xl text-gray-900">Authorization Setup</h2>

        <div className="w-full">
          <h3 className="text-gray-800 mb-3">
            Allowed Scopes (comma-separated)
          </h3>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-md p-2 bg-white text-black"
            placeholder="e.g., openid, profile, email"
            value={allowedScopesInput}
            onChange={(e) => setAllowedScopesInput(e.target.value)}
          />
          {state.errors?.allowedScopes?.[0] && (
            <p className="text-sm text-red-500 mt-1">
              {state.errors.allowedScopes[0]}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="mt-6 w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition"
        >
          {isPending ? "Submitting..." : "Register Client"}
        </button>

        {state.formError && (
          <p className="text-sm text-red-600 mt-4 font-medium">
            {state.formError}
          </p>
        )}

        {state.success && state.data && (
          <>
            <p className="text-sm text-blue-600 font-medium mt-4">
              Client successfully registered!
            </p>

            <div className="mt-6 p-4 bg-gray-50 border rounded-md shadow-sm text-sm">
              <p className="mb-2 font-semibold text-gray-800">
                Your Client Credentials:
              </p>

              <div className="mb-3">
                <label className="block text-gray-700 font-medium">
                  Client ID
                </label>
                <div className="flex items-center bg-white border rounded px-2 py-1">
                  <span className="flex-1 break-all">
                    {state.data.clientId}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      copyToClipboard(
                        "clientId",
                        state.data.clientId,
                        setCopied
                      )
                    }
                    className="ml-2 text-blue-600 text-xs hover:underline"
                  >
                    {copied === "clientId" ? "Copied!" : "Copy"}
                  </button>
                </div>
              </div>

              {state.data.clientSecret && (
                <div className="mb-3">
                  <label className="block text-gray-700 font-medium">
                    Client Secret
                  </label>
                  <div className="flex items-center bg-white border rounded px-2 py-1">
                    <span className="flex-1 break-all">
                      {state.data.clientSecret}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        copyToClipboard(
                          "clientSecret",
                          state.data.clientSecret!,
                          setCopied
                        )
                      }
                      className="ml-2 text-blue-600 text-xs hover:underline"
                    >
                      {copied === "clientSecret" ? "Copied!" : "Copy"}
                    </button>
                  </div>
                  <p className="text-xs text-red-500 mt-1">
                    ⚠️ Please store this securely.
                  </p>
                </div>
              )}

              <button
                onClick={downloadCredentials}
                type="button"
                className="mt-2 px-3 py-1 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700"
              >
                Download as JSON
              </button>
            </div>
          </>
        )}
      </div>
    </form>
  );
}
*/

"use client";

import { useFormContext } from "../FormContext";
import { useActionState } from "react";
import { registerClientAction } from "../actions";
import { useState } from "react";
import { downloadClientCredentials, copyToClipboard } from "../helper";
import {
  KeyRound,
  Copy,
  Download,
  CheckCircle2,
  AlertTriangle,
  Lock,
  ShieldCheck,
  Info,
} from "lucide-react";

const initialState = {
  success: false,
  errors: {
    allowedScopes: [],
    logoFile: [],
    isConfidential: [],
    clientName: [],
    redirectUri: [],
    domain: [],
  },
  formError: undefined,
  data: undefined,
};

export default function AuthorizationSetupPage() {
  const { formData, updateFormData } = useFormContext();
  const [allowedScopesInput, setAllowedScopesInput] = useState<string>(
    (formData.allowedScopes || []).join(", ")
  );
  const [copied, setCopied] = useState<string | null>(null);

  const [state, formAction, isPending] = useActionState(
    registerClientAction,
    initialState
  );

  const downloadCredentials = () => {
    if (state.data) {
      downloadClientCredentials(state.data);
    }
  };

  const buildFormData = (): FormData => {
    const fd = new FormData();
    fd.set("isConfidential", formData.isConfidential.toString());
    fd.set("clientName", formData.clientName);
    fd.set("redirectUri", formData.redirectUri);
    fd.set("domain", formData.domain);
    fd.set("allowedScopes", allowedScopesInput);
    if (formData.logoFile) {
      fd.set("logoFile", formData.logoFile);
    }
    return fd;
  };

  // Common scopes that users might want to select
  const commonScopes = ["openid", "profile", "email", "offline_access"];

  const addScope = (scope: string) => {
    const currentScopes = allowedScopesInput
      ? allowedScopesInput.split(",").map((s) => s.trim())
      : [];
    if (!currentScopes.includes(scope)) {
      const newScopes = [...currentScopes, scope];
      setAllowedScopesInput(newScopes.join(", "));
    }
  };

  return (
    <div className="flex-1 ">
      <div className="max-w-3xl mx-auto px-6 py-10">
        <form action={() => formAction(buildFormData())} className="space-y-8">
          {!state.success ? (
            <>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <ShieldCheck className="h-4 w-4 text-blue-600" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Authorization Setup
                  </h2>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Allowed Scopes
                    </label>
                    <p className="text-xs text-gray-500 mb-3">
                      Scopes define the specific access permissions requested
                      from users
                    </p>

                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-md p-2.5 bg-white text-gray-900 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      placeholder="e.g., openid, profile, email"
                      value={allowedScopesInput}
                      onChange={(e) => setAllowedScopesInput(e.target.value)}
                    />

                    {state.errors?.allowedScopes?.[0] && (
                      <p className="text-sm text-red-500 mt-1">
                        {state.errors.allowedScopes[0]}
                      </p>
                    )}

                    <div className="mt-3 flex flex-wrap gap-2">
                      {commonScopes.map((scope) => (
                        <button
                          key={scope}
                          type="button"
                          onClick={() => addScope(scope)}
                          className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs rounded-full transition-colors"
                        >
                          + {scope}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-100 rounded-md p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <Lock className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-blue-800">
                          Application Summary
                        </h3>
                        <div className="mt-2 text-sm text-blue-700 space-y-1">
                          <p>
                            <strong>Name:</strong> {formData.clientName}
                          </p>
                          <p>
                            <strong>Domain:</strong> {formData.domain}
                          </p>
                          <p>
                            <strong>Redirect URI:</strong>{" "}
                            {formData.redirectUri}
                          </p>
                          <p>
                            <strong>Type:</strong>{" "}
                            {formData.isConfidential
                              ? "Confidential"
                              : "Public"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {state.formError && (
                <div className="bg-red-50 border border-red-200 rounded-md p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <AlertTriangle className="h-5 w-5 text-red-400" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">
                        Registration Error
                      </h3>
                      <div className="mt-2 text-sm text-red-700">
                        <p>{state.formError}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-6 py-2.5 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-70"
                >
                  {isPending ? "Registering..." : "Register Application"}
                </button>
              </div>
            </>
          ) : (
            <div className="space-y-6">
              <div className="bg-green-50 border border-green-200 rounded-md p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <CheckCircle2 className="h-5 w-5 text-green-400" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-green-800">
                      Registration Successful
                    </h3>
                    <div className="mt-2 text-sm text-green-700">
                      <p>
                        Your application has been successfully registered.
                        Please securely store your credentials.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <KeyRound className="h-4 w-4 text-blue-600" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Client Credentials
                  </h2>
                </div>

                <div className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Client ID
                      </label>
                      <div className="flex items-center bg-gray-50 border rounded-md overflow-hidden">
                        <div className="flex-1 p-3 font-mono text-sm break-all">
                          {state.data?.clientId}
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            copyToClipboard(
                              "clientId",
                              state.data?.clientId || "",
                              setCopied
                            )
                          }
                          className="flex items-center justify-center h-full px-4 bg-gray-100 hover:bg-gray-200 border-l transition-colors"
                        >
                          {copied === "clientId" ? (
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                          ) : (
                            <Copy className="h-4 w-4 text-gray-600" />
                          )}
                        </button>
                      </div>
                    </div>

                    {state.data?.clientSecret && (
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="block text-sm font-medium text-gray-700">
                            Client Secret
                          </label>
                          <span className="text-xs text-red-600 font-medium flex items-center">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            Store securely, shown only once
                          </span>
                        </div>
                        <div className="flex items-center bg-gray-50 border border-amber-200 rounded-md overflow-hidden">
                          <div className="flex-1 p-3 font-mono text-sm break-all">
                            {state.data.clientSecret}
                          </div>
                          <button
                            type="button"
                            onClick={() =>
                              copyToClipboard(
                                "clientSecret",
                                state.data.clientSecret || "",
                                setCopied
                              )
                            }
                            className="flex items-center justify-center h-full px-4 bg-amber-50 hover:bg-amber-100 border-l border-amber-200 transition-colors"
                          >
                            {copied === "clientSecret" ? (
                              <CheckCircle2 className="h-4 w-4 text-green-600" />
                            ) : (
                              <Copy className="h-4 w-4 text-amber-600" />
                            )}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <button
                      onClick={downloadCredentials}
                      type="button"
                      className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download Credentials as JSON
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <Info className="h-5 w-5 text-blue-400" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800">
                      Next Steps
                    </h3>
                    <div className="mt-2 text-sm text-blue-700">
                      <p>
                        Integrate these credentials into your application to
                        enable authentication.
                      </p>
                      <p className="mt-1">
                        See our{" "}
                        <a href="#" className="font-medium underline">
                          documentation
                        </a>{" "}
                        for integration guides.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
