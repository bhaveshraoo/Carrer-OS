import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.97]",
  {
    variants: {
      variant: {
        // Orange primary — the main CTA
        primary:
          "text-white shadow-md hover:shadow-lg hover:brightness-110 active:brightness-95",
        // Teal secondary — growth/success actions  
        default:
          "text-white shadow-sm hover:shadow-md hover:brightness-110",
        // Outlined — subtle secondary
        outline:
          "border font-medium hover:opacity-90",
        // Ghost — tertiary / nav items
        ghost:
          "hover:opacity-80",
        // Destructive
        destructive:
          "text-white hover:brightness-110",
        link: "underline-offset-4 hover:underline font-medium",
      },
      size: {
        default: "h-11 px-5 py-2",
        sm:      "h-9 px-3.5 text-sm",
        lg:      "h-12 px-7 text-base",
        icon:    "h-10 w-10",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

function getVariantStyle(variant: string | null | undefined): React.CSSProperties {
  switch (variant) {
    case "primary":
      return {
        background: "linear-gradient(135deg, var(--orange) 0%, #fb923c 100%)",
        boxShadow: "0 4px 14px rgba(249,115,22,0.35)",
      };
    case "default":
      return {
        background: "linear-gradient(135deg, var(--teal) 0%, #0f766e 100%)",
        boxShadow: "0 4px 14px rgba(13,148,136,0.30)",
      };
    case "outline":
      return {
        border: "1px solid var(--border-strong)",
        background: "transparent",
        color: "var(--text-primary)",
      };
    case "ghost":
      return {
        background: "transparent",
        color: "var(--text-secondary)",
      };
    case "destructive":
      return {
        background: "var(--red)",
        boxShadow: "0 4px 14px rgba(239,68,68,0.30)",
      };
    case "link":
      return { color: "var(--orange)", background: "transparent" };
    default:
      return {};
  }
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, style, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        style={{ ...getVariantStyle(variant), ...style }}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
