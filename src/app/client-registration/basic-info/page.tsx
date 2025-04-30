"use client";
import { useFormContext } from "../FormContext";
import { useRouter } from "next/navigation";
import { Switch, TextField } from "@mui/material";
import { FiUploadCloud } from "react-icons/fi";
import { z } from "zod";
import { useState } from "react";
import { basicInfoSchema } from "../schemas/clientRegistrationSchema";

export default function BasicInfoPage() {
  const { formData, updateFormData } = useFormContext();
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<any>({});
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const handleNext = async () => {
    try {
      // Validate the form data using Zod
      basicInfoSchema.parse(formData);

      // If validation passes, move to the next page
      router.push("/client-registration/authorization-setup");
    } catch (error) {
      if (error instanceof z.ZodError) {
        const formattedErrors = error.errors.reduce(
          (acc, { path, message }) => ({
            ...acc,
            [path[0]]: message,
          }),
          {}
        );
        setErrors(formattedErrors);
      }
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleNext();
      }}
      className="flex flex-1 flex-col items-center px-4 py-10"
    >
      <div className="flex flex-col gap-6 max-w-xl w-full mx-auto py-6">
        <h2 className="text-2xl text-gray-800 mb-2">
          Basic Client Information
        </h2>

        <TextField
          id="clientName"
          label="Client Name"
          value={formData.clientName}
          onChange={handleChange}
          placeholder="My Awesome App"
          variant="outlined"
          fullWidth
          size="small"
          error={Boolean(errors.clientName)}
          helperText={errors.clientName}
        />

        <TextField
          id="domain"
          label="Domain"
          value={formData.domain}
          onChange={handleChange}
          placeholder="myapp.com"
          variant="outlined"
          fullWidth
          size="small"
          error={Boolean(errors.domain)}
          helperText={errors.domain}
        />

        <TextField
          id="redirectUri"
          label="Redirect URI"
          value={formData.redirectUri}
          onChange={handleChange}
          placeholder="https://myapp.com/callback"
          variant="outlined"
          fullWidth
          size="small"
          error={Boolean(errors.redirectUri)}
          helperText={errors.redirectUri}
        />

        <div className="flex items-center justify-between">
          <label htmlFor="isConfidential" className="text-sm text-gray-700">
            Is Confidential?
          </label>
          <Switch
            id="isConfidential"
            checked={formData.isConfidential}
            onChange={handleChange}
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
              type="file"
              accept="image/*"
              onChange={handleChange}
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
