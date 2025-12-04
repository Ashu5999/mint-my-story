import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 relative overflow-hidden",
  {
    variants: {
      variant: {
        default: "bg-foreground text-background hover:bg-foreground/90 rounded-full btn-shine hover:scale-105 hover:shadow-[0_0_30px_rgba(255,255,255,0.3)]",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-full",
        outline: "border border-border bg-transparent text-foreground rounded-full btn-border-glow hover:border-foreground/50 hover:bg-secondary/50 hover:scale-105",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-full hover:scale-105",
        ghost: "hover:bg-secondary hover:text-foreground rounded-full",
        link: "text-foreground underline-offset-4 hover:underline",
        hero: "bg-foreground text-background rounded-full btn-shine hover:scale-105 hover:shadow-[0_0_40px_rgba(255,255,255,0.4)] active:scale-95",
        glass: "bg-secondary/50 backdrop-blur-md border border-border/50 hover:bg-secondary/80 text-foreground rounded-full btn-border-glow hover:scale-105 hover:border-foreground/30",
        glow: "bg-foreground text-background rounded-full btn-pulse-glow hover:scale-110 active:scale-95",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-9 px-4",
        xs: "h-7 px-3 text-xs",
        lg: "h-12 px-8",
        xl: "h-14 px-10 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
