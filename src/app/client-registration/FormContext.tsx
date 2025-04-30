"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { RegisterClientRequest } from "../services/client-service";

type FormData = Omit<RegisterClientRequest, "allowedScopes" | "logoFile"> & {
  allowedScopes: string[];
  logoFile?: File | null;
};

type FormContextType = {
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
};

const FormContext = createContext<FormContextType | undefined>(undefined);

export const FormProvider = ({ children }: { children: ReactNode }) => {
  const [formData, setFormData] = useState<FormData>({
    clientName: "",
    domain: "",
    redirectUri: "",
    allowedScopes: [],
    isConfidential: false,
    logoFile: null,
  });

  const updateFormData = (data: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  return (
    <FormContext.Provider value={{ formData, updateFormData }}>
      {children}
    </FormContext.Provider>
  );
};

export const useFormContext = () => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error("useFormContext must be used within a FormProvider");
  }
  return context;
};
