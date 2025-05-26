"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { RegisterUserDialog } from "./createuser-dialog";
import { useRouter } from "next/navigation";

export function ClientCreateUserWrapper() {
  const [dialogOpen, setDialogOpen] = useState(false);

  const router = useRouter();

  const handleDialogChange = (open: boolean) => {
    setDialogOpen(open);
    if (!open) {
      router.refresh();
    }
  };

  return (
    <>
      <Button
        className="bg-cyan-600 hover:bg-cyan-700 text-white"
        onClick={() => setDialogOpen(true)}
      >
        <Plus className="mr-2 h-4 w-4" />
        Create User
      </Button>

      <RegisterUserDialog open={dialogOpen} onOpenChange={handleDialogChange} />
    </>
  );
}
