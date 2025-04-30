"use client";

import { useFormContext } from "../FormContext";
import { useActionState } from "react";
import { registerClientAction } from "../actions";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import { Checkbox, FormControlLabel, FormGroup } from "@mui/material";
import { useState } from "react";

export default function AuthorizationSetupPage() {
  const { formData, updateFormData } = useFormContext();
  const [selectedScopes, setSelectedScopes] = useState<string[]>(
    formData.allowedScopes
  );
  const [copied, setCopied] = useState<string | null>(null);

  const [state, formAction, isPending] = useActionState(registerClientAction, {
    success: false,
    errors: {},
    formError: undefined,
    data: undefined,
  });

  const scopes = ["openid", "profile", "email", "roles"];

  const handleScopeChange = (scope: string) => {
    const newScopes = selectedScopes.includes(scope)
      ? selectedScopes.filter((s) => s !== scope)
      : [...selectedScopes, scope];
    setSelectedScopes(newScopes);
    updateFormData({ allowedScopes: newScopes });
  };

  const copyToClipboard = async (label: string, value: string) => {
    await navigator.clipboard.writeText(value);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

  const downloadCredentials = () => {
    const content = {
      clientId: state.data?.clientId,
      ...(state.data?.clientSecret && {
        clientSecret: state.data.clientSecret,
      }),
    };
    const blob = new Blob([JSON.stringify(content, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "client_credentials.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const buildFormData = (): FormData => {
    const fd = new FormData();
    fd.set("isConfidential", formData.isConfidential.toString());
    fd.set("clientName", formData.clientName);
    fd.set("redirectUri", formData.redirectUri);
    fd.set("domain", formData.domain);

    selectedScopes.forEach((scope) => fd.append("allowedScopes", scope));
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
          <h3 className="text-gray-800 mb-3">Select Allowed Scopes</h3>
          <FormGroup className="bg-gray-50 p-4 rounded-md border border-gray-200">
            {scopes.map((scope) => (
              <FormControlLabel
                key={scope}
                control={
                  <Checkbox
                    checked={selectedScopes.includes(scope)}
                    onChange={() => handleScopeChange(scope)}
                    icon={<CheckBoxOutlineBlankIcon />}
                    checkedIcon={<CheckBoxIcon />}
                    color="primary"
                  />
                }
                label={
                  <span className="text-sm text-gray-800 font-medium capitalize">
                    {scope}
                  </span>
                }
              />
            ))}
          </FormGroup>
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
                      copyToClipboard("clientId", state.data.clientId)
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
                          state.data.clientSecret!
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
