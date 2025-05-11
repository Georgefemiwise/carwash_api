import React from 'react';
import { Button } from '@/components/ui/button';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  "btn",
  {
    variants: {
      variant: {
        default: "btn-primary",
        secondary: "btn-secondary",
        destructive: "btn-error",
        outline: "btn-outline",
        ghost: "btn-ghost",
        link: "btn-link",
      },
      size: {
        default: "btn-md",
        sm: "btn-sm",
        lg: "btn-lg",
        xs: "btn-xs",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ThemedButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
}

const ThemedButton = React.forwardRef<HTMLButtonElement, ThemedButtonProps>(
  ({ className, variant, size, isLoading, children, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size }), className, {
          'loading': isLoading,
        })}
        ref={ref}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {children}
      </button>
    );
  }
);

ThemedButton.displayName = "ThemedButton";

export { ThemedButton, buttonVariants };