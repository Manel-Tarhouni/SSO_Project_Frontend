import { FiCheckCircle, FiXCircle } from "react-icons/fi";

// Password validation functions
export const hasLowercase = (password: string) => /[a-z]/.test(password);
export const hasUppercase = (password: string) => /[A-Z]/.test(password);
export const hasNumber = (password: string) => /[0-9]/.test(password);
export const hasSpecialChar = (password: string) => /[!@#$%^&*(),.?":{}|<>]/.test(password);
export const hasTripleRepeat = (password: string) => /(.)\1\1/.test(password);

// Password rule component
export const PasswordRule = ({ isValid, text }: { isValid: boolean; text: string }) => (
  <li className={`flex items-center ${isValid ? 'text-green-600' : 'text-red-500'}`}>
    {isValid ? (
      <FiCheckCircle className="mr-2" />
    ) : (
      <FiXCircle className="mr-2" />
    )}
    {text}
  </li>
);
