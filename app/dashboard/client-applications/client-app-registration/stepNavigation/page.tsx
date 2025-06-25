"use client";

import clsx from "clsx";
import Link from "next/link";
import { RegisterClientRoutes } from "../types";
import { usePathname } from "next/navigation";
import { CheckCircle2, Circle } from "lucide-react";

const steps = [
  {
    title: "Basic Info",
    description: "Application details and configuration",
    path: RegisterClientRoutes.BASIC_INFO,
  },
  {
    title: "Authorization Setup",
    description: "Scopes and security settings",
    path: RegisterClientRoutes.AUTH_SETUP,
  },
];

export default function StepNavigation() {
  const pathname = usePathname();
  const currentStepIndex = steps.findIndex((step) => step.path === pathname);

  return (
    <div className="w-full max-w-lg bg-white p-8">
      {/* Header */}
      <div className="mb-10">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          Register Application
        </h3>
        <p className="text-gray-600 text-sm">
          Set up your new application in just a few steps
        </p>
      </div>

      {/* Progress Steps */}
      <div className="space-y-1">
        {steps.map((step, i) => {
          const isActive = pathname === step.path;
          const isCompleted = i < currentStepIndex;
          const isClickable = i <= currentStepIndex;

          return (
            <div key={step.path} className="relative">
              {/* Connector Line */}
              {i < steps.length - 1 && <div />}

              {/* Step Item */}
              <Link
                href={isClickable ? step.path : "#"}
                className={clsx(
                  "flex items-start gap-4 rounded-xl p-4 transition-all duration-200 group relative",
                  {
                    "bg-blue-50 border-2 border-blue-200 shadow-sm": isActive,
                    "hover:bg-gray-50 cursor-pointer": !isActive && isClickable,
                    "cursor-not-allowed opacity-60": !isClickable,
                  }
                )}
                prefetch={isClickable}
              >
                {/* Step Number/Icon */}
                <div className="relative z-10">
                  <div
                    className={clsx(
                      "h-12 w-12 flex items-center justify-center rounded-full transition-all duration-200 shadow-sm",
                      {
                        "bg-blue-600 text-white shadow-blue-200": isActive,
                        "bg-green-500 text-white shadow-green-200": isCompleted,
                        "bg-white border-2 border-gray-300 text-gray-400":
                          !isActive && !isCompleted && !isClickable,
                        "bg-white border-2 border-gray-300 text-gray-600 group-hover:border-blue-300 group-hover:text-blue-600":
                          !isActive && !isCompleted && isClickable,
                      }
                    )}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="h-6 w-6" />
                    ) : isActive ? (
                      <Circle className="h-6 w-6 fill-current" />
                    ) : (
                      <span className="text-sm font-semibold">{i + 1}</span>
                    )}
                  </div>
                </div>

                {/* Step Content */}
                <div className="flex-1 min-w-0 pt-1">
                  <h4
                    className={clsx(
                      "text-sm font-semibold transition-colors duration-200",
                      {
                        "text-blue-900": isActive,
                        "text-green-800": isCompleted,
                        "text-gray-900 group-hover:text-blue-700":
                          !isActive && !isCompleted && isClickable,
                        "text-gray-500": !isClickable,
                      }
                    )}
                  >
                    {step.title}
                  </h4>
                  <p
                    className={clsx(
                      "text-xs mt-1 transition-colors duration-200",
                      {
                        "text-blue-700": isActive,
                        "text-green-600": isCompleted,
                        "text-gray-600 group-hover:text-blue-600":
                          !isActive && !isCompleted && isClickable,
                        "text-gray-400": !isClickable,
                      }
                    )}
                  >
                    {step.description}
                  </p>

                  {/* Status Badge */}
                  <div className="mt-2">
                    {isCompleted && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Completed
                      </span>
                    )}
                    {isActive && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Current
                      </span>
                    )}
                  </div>
                </div>

                {/* Active Indicator */}
                {isActive && (
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    <div className="h-2 w-2 bg-blue-500 rounded-full animate-pulse"></div>
                  </div>
                )}
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
