import React, { createContext, useContext, useState } from "react";

// 1. Define the shape of your context
export type PermissionsContextType = {
  permissions: string[];
  setPermissions: (perms: string[]) => void;
};

// 2. Create the context
const PermissionsContext = createContext<PermissionsContextType | null>(null);

// 3. Create the provider component
export const PermissionsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [permissions, setPermissions] = useState<string[]>([]);

  return (
    <PermissionsContext.Provider value={{ permissions, setPermissions }}>
      {children}
    </PermissionsContext.Provider>
  );
};

// 4. Create a custom hook to use the context
export const usePermissions = () => {
  const context = useContext(PermissionsContext);
  if (!context)
    throw new Error("usePermissions must be used within PermissionsProvider");
  return context;
};

//ps need to call this in the layout  wrapping children in it ()
