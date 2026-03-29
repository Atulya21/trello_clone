"use client";

import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "secondary", size = "md", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed",
          {
            "bg-[#0052cc] text-white hover:bg-[#0747a6] focus:ring-blue-500": variant === "primary",
            "bg-[#091e420f] text-[#172b4d] hover:bg-[#091e4221] focus:ring-gray-400": variant === "secondary",
            "text-[#172b4d] hover:bg-[#091e420f] focus:ring-gray-400": variant === "ghost",
            "bg-[#de350b] text-white hover:bg-[#bf2600] focus:ring-red-500": variant === "danger",
          },
          {
            "px-2 py-1 text-xs gap-1": size === "sm",
            "px-3 py-1.5 text-sm gap-1.5": size === "md",
            "px-4 py-2 text-base gap-2": size === "lg",
          },
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
