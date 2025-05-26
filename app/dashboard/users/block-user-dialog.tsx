"use client";

import { useTransition } from "react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectItem,
  SelectContent,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { blockUserAction } from "./actions";

interface BlockUserDialogProps {
  userId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BlockUserDialog({
  userId,
  open,
  onOpenChange,
}: BlockUserDialogProps) {
  const [value, setValue] = useState<number>(1);
  const [unit, setUnit] = useState<"minutes" | "hours" | "days">("hours");
  const [isPending, startTransition] = useTransition();

  const handleBlock = () => {
    startTransition(async () => {
      const result = await blockUserAction(userId, { value, unit });

      if (result.success) {
        toast("Success", {
          description: result.message,
        });
        onOpenChange(false);
      } else {
        toast.error(result.message);
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Block User</DialogTitle>
          <DialogDescription>
            Set the duration for which the user will be blocked.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Input
              type="number"
              value={value}
              min={1}
              onChange={(e) => setValue(Number(e.target.value))}
              className="w-20"
            />
            <Select value={unit} onValueChange={(val) => setUnit(val as any)}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Unit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="minutes">Minutes</SelectItem>
                <SelectItem value="hours">Hours</SelectItem>
                <SelectItem value="days">Days</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button onClick={handleBlock} className="w-full" disabled={isPending}>
            {isPending ? "Blocking..." : "Confirm Block"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
