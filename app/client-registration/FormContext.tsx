"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
} from "react";
import { RegisterClientRequest } from "../services/client-service";

type FormData = Omit<RegisterClientRequest, "allowedScopes" | "logoFile"> & {
  allowedScopes: string[];
  logoFile?: File | null;
};

type FormContextType = {
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
  resetFormData: () => void;
};

const FormContext = createContext<FormContextType | undefined>(undefined);
const initialFormData: FormData = {
  clientName: "",
  domain: "",
  redirectUri: "",
  allowedScopes: [],
  isConfidential: false,
  logoFile: null,
};
export const FormProvider = ({ children }: { children: ReactNode }) => {
  const [formData, setFormData] = useState<FormData>(initialFormData);

  const updateFormData = useCallback((data: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  }, []);

  const resetFormData = useCallback(() => {
    setFormData(initialFormData);
  }, []);

  return (
    <FormContext.Provider value={{ formData, updateFormData, resetFormData }}>
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
