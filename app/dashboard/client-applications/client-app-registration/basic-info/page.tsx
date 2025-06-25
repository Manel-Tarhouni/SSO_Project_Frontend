/*"use client";

import { useFormContext } from "../FormContext";
import { useRouter } from "next/navigation";
import { Switch, TextField } from "@mui/material";
import { FiUploadCloud } from "react-icons/fi";
import { z } from "zod";
import { useState, useActionState } from "react";
import { basicInfoSchema } from "../schemas/clientRegistrationSchema";

interface FormState {
  errors: Record<string, string>;
}

const initialState: FormState = {
  errors: {},
};

export default function BasicInfoPage() {
  const { formData, updateFormData } = useFormContext();
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const router = useRouter();

  async function handleSubmit(
    prevState: FormState,
    formDataObj: FormData
  ): Promise<FormState> {
    const clientName = formDataObj.get("clientName") as string;
    const domain = formDataObj.get("domain") as string;
    const redirectUri = formDataObj.get("redirectUri") as string;
    const isConfidential = formDataObj.get("isConfidential") === "on";
    const logoFile = formDataObj.get("logoFile") as File;

    const data = { clientName, domain, redirectUri, isConfidential, logoFile };

    try {
      basicInfoSchema.parse(data);
      updateFormData(data);
      router.push("/client-registration/authorization-setup");
      return { errors: {} };
    } catch (error) {
      if (error instanceof z.ZodError) {
        const formattedErrors = error.errors.reduce(
          (acc, { path, message }) => ({
            ...acc,
            [path[0]]: message,
          }),
          {}
        );
        return { errors: formattedErrors };
      }
      return { errors: { general: "Something went wrong" } };
    }
  }

  const [state, formAction] = useActionState(handleSubmit, initialState);

  const handleLocalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, type, value, checked, files } = e.target;

    if (id === "logoFile" && files?.[0]) {
      const file = files[0];
      updateFormData({ logoFile: file });
      setLogoPreview(URL.createObjectURL(file));
    } else {
      updateFormData({
        [id]: type === "checkbox" ? checked : value,
      });
    }
  };

  return (
    <form
      action={formAction}
      className="flex flex-1 flex-col items-center px-4 py-10"
    >
      <div className="flex flex-col gap-6 max-w-xl w-full mx-auto py-6">
        <h2 className="text-2xl text-gray-800 mb-2">
          Basic Client Information
        </h2>

        <TextField
          id="clientName"
          name="clientName"
          label="Client Name"
          value={formData.clientName}
          onChange={handleLocalChange}
          placeholder="My Awesome App"
          variant="outlined"
          fullWidth
          size="small"
          error={Boolean(state.errors.clientName)}
          helperText={state.errors.clientName}
        />

        <TextField
          id="domain"
          name="domain"
          label="Domain"
          value={formData.domain}
          onChange={handleLocalChange}
          placeholder="myapp.com"
          variant="outlined"
          fullWidth
          size="small"
          error={Boolean(state.errors.domain)}
          helperText={state.errors.domain}
        />

        <TextField
          id="redirectUri"
          name="redirectUri"
          label="Redirect URI"
          value={formData.redirectUri}
          onChange={handleLocalChange}
          placeholder="https://myapp.com/callback"
          variant="outlined"
          fullWidth
          size="small"
          error={Boolean(state.errors.redirectUri)}
          helperText={state.errors.redirectUri}
        />

        <div className="flex items-center justify-between">
          <label htmlFor="isConfidential" className="text-sm text-gray-700">
            Is Confidential?
          </label>
          <Switch
            id="isConfidential"
            name="isConfidential"
            checked={formData.isConfidential}
            onChange={handleLocalChange}
            color="primary"
          />
        </div>

        <div className="w-full">
          <label
            htmlFor="logoFile"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Logo File
          </label>

          <label
            htmlFor="logoFile"
            className="flex flex-col items-center justify-center gap-2 w-full h-40 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
          >
            <FiUploadCloud className="text-3xl text-blue-600" />
            <span className="text-sm text-gray-600">
              Click to upload or drag image here
            </span>
            <input
              id="logoFile"
              name="logoFile"
              type="file"
              accept="image/*"
              onChange={handleLocalChange}
              className="hidden"
            />
          </label>

          {logoPreview && (
            <img
              src={logoPreview}
              alt="Logo preview"
              className="mt-4 h-24 rounded shadow border border-gray-200 object-contain"
            />
          )}
        </div>

        {state.errors.general && (
          <p className="text-red-500 text-sm">{state.errors.general}</p>
        )}

        <button
          type="submit"
          className="mt-6 w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
        >
          Continue
        </button>
      </div>
    </form>
  );
}
*/

"use client";

import type React from "react";

import { useFormContext } from "../FormContext";
import { useRouter } from "next/navigation";
import { Switch, TextField } from "@mui/material";
import { z } from "zod";
import { useState, useActionState } from "react";
import { basicInfoSchema } from "../schemas/clientRegistrationSchema";
import { Upload, Info, ArrowRight } from "lucide-react";
import Image from "next/image";
interface FormState {
  errors: Record<string, string>;
}

const initialState: FormState = {
  errors: {},
};

export default function BasicInfoPage() {
  const { formData, updateFormData } = useFormContext();
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const router = useRouter();

  // Preserve the original handleSubmit function to maintain logic
  async function handleSubmit(
    prevState: FormState,
    formDataObj: FormData
  ): Promise<FormState> {
    const clientName = formDataObj.get("clientName") as string;
    const domain = formDataObj.get("domain") as string;
    const redirectUri = formDataObj.get("redirectUri") as string;
    const isConfidential = formDataObj.get("isConfidential") === "on";
    const logoFile = formDataObj.get("logoFile") as File;

    const data = { clientName, domain, redirectUri, isConfidential, logoFile };

    try {
      basicInfoSchema.parse(data);
      updateFormData(data);
      router.push(
        "/dashboard/client-applications/client-app-registration/authorization-setup"
      );
      return { errors: {} };
    } catch (error) {
      if (error instanceof z.ZodError) {
        const formattedErrors = error.errors.reduce(
          (acc, { path, message }) => ({
            ...acc,
            [path[0]]: message,
          }),
          {}
        );
        return { errors: formattedErrors };
      }
      return { errors: { general: "Something went wrong" } };
    }
  }

  const [state, formAction] = useActionState(handleSubmit, initialState);

  const handleLocalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, type, value, checked, files } = e.target;

    if (id === "logoFile" && files?.[0]) {
      const file = files[0];
      updateFormData({ logoFile: file });
      setLogoPreview(URL.createObjectURL(file));
    } else {
      updateFormData({
        [id]: type === "checkbox" ? checked : value,
      });
    }
  };

  return (
    <div className="flex-1 ">
      <div className="max-w-3xl mx-auto px-6 py-10">
        <form action={formAction} className="space-y-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                <Info className="h-4 w-4 text-blue-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">
                Basic Client Information
              </h2>
            </div>

            <div className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <TextField
                    id="clientName"
                    name="clientName"
                    label="Client Name"
                    value={formData.clientName}
                    onChange={handleLocalChange}
                    placeholder="My Awesome App"
                    variant="outlined"
                    fullWidth
                    size="small"
                    error={Boolean(state.errors.clientName)}
                    helperText={state.errors.clientName}
                  />
                </div>

                <div>
                  <TextField
                    id="domain"
                    name="domain"
                    label="Domain"
                    value={formData.domain}
                    onChange={handleLocalChange}
                    placeholder="myapp.com"
                    variant="outlined"
                    fullWidth
                    size="small"
                    error={Boolean(state.errors.domain)}
                    helperText={state.errors.domain}
                  />
                </div>
              </div>

              <div>
                <TextField
                  id="redirectUri"
                  name="redirectUri"
                  label="Redirect URI"
                  value={formData.redirectUri}
                  onChange={handleLocalChange}
                  placeholder="https://myapp.com/callback"
                  variant="outlined"
                  fullWidth
                  size="small"
                  error={Boolean(state.errors.redirectUri)}
                  helperText={
                    state.errors.redirectUri ||
                    "The URI where users will be redirected after authentication"
                  }
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                <div>
                  <label
                    htmlFor="isConfidential"
                    className="text-sm font-medium text-gray-700"
                  >
                    Confidential Client
                  </label>
                  <p className="text-xs text-gray-500 mt-1">
                    Enable for applications that run on secure servers and can
                    safely store client secrets.
                  </p>
                </div>
                <Switch
                  id="isConfidential"
                  name="isConfidential"
                  checked={formData.isConfidential}
                  onChange={handleLocalChange}
                  color="primary"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="logoFile"
                  className="block text-sm font-medium text-gray-700"
                >
                  Application Logo
                </label>
                <p className="text-xs text-gray-500">
                  Upload a square logo (recommended size: 256x256px)
                </p>

                <div className="flex items-start space-x-4">
                  <label
                    htmlFor="logoFile"
                    className="flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    {logoPreview ? (
                      <img
                        src={logoPreview || "/placeholder.svg"}
                        alt="Logo preview"
                        className="w-full h-full object-contain rounded-lg"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full p-2">
                        <Upload className="h-6 w-6 text-blue-600 mb-2" />
                        <span className="text-xs text-center text-gray-600">
                          Click to upload
                        </span>
                      </div>
                    )}
                    <input
                      id="logoFile"
                      name="logoFile"
                      type="file"
                      accept="image/*"
                      onChange={handleLocalChange}
                      className="hidden"
                    />
                  </label>

                  <div className="flex-1">
                    <p className="text-sm text-gray-600">
                      Your logo will be displayed on login screens and consent
                      pages.
                    </p>
                    {state.errors.logoFile && (
                      <p className="text-red-500 text-xs mt-1">
                        {state.errors.logoFile}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {state.errors.general && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md text-sm">
              {state.errors.general}
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              className="flex items-center px-6 py-2.5 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors shadow-sm"
            >
              Continue
              <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
