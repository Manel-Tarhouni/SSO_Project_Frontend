"use client";

import { useActionState, useEffect, useRef } from "react";
import { registerAction } from "./actions";
import { FiLock } from "react-icons/fi";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface RegisterUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RegisterUserDialog({
  open,
  onOpenChange,
}: RegisterUserDialogProps) {
  const [formState, formAction, isPending] = useActionState(registerAction, {
    errors: {},
    message: "",
  });

  const hasShownToast = useRef(false);

  useEffect(() => {
    if (
      formState.message === "Registration successful!" &&
      !formState.errors &&
      !hasShownToast.current
    ) {
      toast("Success", {
        description: "User created successfully",
        duration: 5000,
      });
      hasShownToast.current = true;
      onOpenChange(false);
    }
  }, [formState, onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create User</DialogTitle>
          <DialogDescription>
            Fill in user details to register in the system.
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-4" action={formAction}>
          <div>
            <Label htmlFor="email" className="mb-2 block">
              Email
            </Label>
            <Input
              type="email"
              name="email"
              id="email"
              placeholder="you@example.com"
            />
            {formState.errors?.email && (
              <p className="text-sm text-red-600">
                {formState.errors.email[0]}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="firstname" className="mb-2 block">
              First Name
            </Label>
            <Input
              type="text"
              name="firstname"
              id="firstname"
              placeholder="John"
            />
            {formState.errors?.firstname && (
              <p className="text-sm text-red-600">
                {formState.errors.firstname[0]}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="lastname" className="mb-2 block">
              Last Name
            </Label>
            <Input
              type="text"
              name="lastname"
              id="lastname"
              placeholder="Doe"
            />
            {formState.errors?.lastname && (
              <p className="text-sm text-red-600">
                {formState.errors.lastname[0]}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="password" className="mb-2 block">
              Password
            </Label>
            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                type="password"
                name="password"
                id="password"
                className="pl-10"
                placeholder="••••••••"
                autoComplete="new-password"
              />
            </div>
            {formState.errors?.password && (
              <p className="text-sm text-red-600">
                {formState.errors.password[0]}
              </p>
            )}
          </div>

          <div className="flex justify-between gap-4 mt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1 border border-red-600 text-red-600 bg-white hover:bg-red-600 hover:text-white"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              className="flex-1 border border-cyan-600 text-cyan-600 bg-white hover:bg-cyan-600 hover:text-white"
              disabled={isPending}
            >
              {isPending ? "Registering..." : "Register"}
            </Button>
          </div>

          {formState.message && (
            <p
              className={`text-sm mt-2 ${
                formState.errors ? "text-red-600" : "text-green-600"
              }`}
            >
              {formState.message}
            </p>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}
