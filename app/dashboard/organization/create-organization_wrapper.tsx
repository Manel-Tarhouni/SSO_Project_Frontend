"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import CreateOrgDialog from "./create-org-dialog"; // updated import to match export below
import { useRouter } from "next/navigation";

export function CreateOrganizationWrapper() {
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
        Create Organization
      </Button>

      <CreateOrgDialog open={dialogOpen} onOpenChange={handleDialogChange} />
    </>
  );
}
