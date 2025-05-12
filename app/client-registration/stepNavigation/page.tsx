"use client";

import clsx from "clsx";
import Link from "next/link";
import { RegisterClientRoutes } from "../types";
import { usePathname } from "next/navigation";

const steps = [
  {
    title: "Basic Info",
    route: RegisterClientRoutes.BASIC_INFO,
    link: RegisterClientRoutes.BASIC_INFO,
  },
  {
    title: "Authorization Setup",
    route: RegisterClientRoutes.AUTH_SETUP,
    link: RegisterClientRoutes.AUTH_SETUP,
  },
];

export default function StepNavigation() {
  const pathname = usePathname();

  return (
    <div className="w-full max-w-lg bg-white p-6">
      <h3 className="text-2xl text-gray-800 mb-12 whitespace-nowrap">
        Register an Application
      </h3>

      <div className="flex flex-col gap-4">
        {steps.map((step, i) => {
          const isActive = pathname === step.route;

          return (
            <Link
              key={step.link}
              href={step.link}
              className={clsx(
                "flex items-center gap-3 rounded-lg px-4 py-2 transition duration-200 group",
                {
                  "bg-indigo-50 border border-indigo-200": isActive,
                  "hover:bg-gray-100": !isActive,
                }
              )}
              prefetch
            >
              <div
                className={clsx(
                  "h-8 w-8 flex items-center justify-center rounded-full text-sm font-semibold transition",
                  {
                    "bg-indigo-600 text-white": isActive,
                    "bg-gray-200 text-gray-600 group-hover:bg-indigo-100 group-hover:text-indigo-600":
                      !isActive,
                  }
                )}
              >
                {i + 1}
              </div>
              <span
                className={clsx("text-sm font-medium", {
                  "text-gray-900": isActive,
                  "text-gray-600 group-hover:text-indigo-600": !isActive,
                })}
              >
                {step.title}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
