import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";
// rounded-[1.25rem]
const liquidButtonVariants = cva(
  "relative overflow-hidden whitespace-nowrap font-semibold backdrop-blur-sm cursor-pointer rounded-lg disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-white/10 border border-white/30 shadow-[inset_2px_2px_5px_rgba(255,255,255,0.3),inset_-2px_-2px_5px_rgba(0,0,0,0.1),0_6px_15px_rgba(0,0,0,0.2)] hover:bg-white/20",
        primary: [
          "bg-primary/20 hover:bg-primary/25",
          "border border-outline border-primary/20",
          "shadow-[inset_0.5px_0.5px_1px_rgba(255,255,255,0.9),inset_8px_8px_0.06px_rgba(230,230,230,0.3),0_3px_16px_rgba(0,0,0,0.08)]",
          "transition-all duration-200 ease-in-out",
          "dark:shadow-[inset_0.9px_0.9px_1px_rgba(255,255,255,0.9),inset_10px_10px_0.06px_rgba(0,0,0,0.3),0_3px_16px_rgba(0,0,0,0.08)] dark:hover:bg-white/10 dark:bg-white/8 dark:border-outline dark:border rounded-full backdrop-saturate-200 dark:border-primary/50",
        ],
        outline: [
          "bg-white/6 hover:bg-white/10",
          "border border-outline border-primary/40",
          "shadow-[inset_0.5px_0.5px_1px_rgba(255,255,255,0.9),inset_8px_8px_0.06px_rgba(230,230,230,0.3),0_3px_16px_rgba(0,0,0,0.08)]",
          "transition-all duration-200 ease-in-out",
          "dark:shadow-[inset_0.9px_0.9px_1px_rgba(255,255,255,0.9),inset_10px_10px_0.06px_rgba(0,0,0,0.3),0_3px_16px_rgba(0,0,0,0.08)] dark:hover:bg-white/10 dark:bg-white/8 dark:border-outline dark:border rounded-full backdrop-saturate-200",
        ],

        destructive:
          "bg-red-500/20 border border-red-400/30 shadow-[inset_2px_2px_5px_rgba(255,180,180,0.3),inset_-2px_-2px_5px_rgba(0,0,0,0.1),0_6px_15px_rgba(180,0,0,0.3)] hover:bg-red-500/30",
        flat: [
          "bg-white/50 hover:bg-white/50",
          "border border-outline",
          "shadow-[inset_0.5px_0.5px_1px_rgba(255,255,255,0.9),inset_8px_8px_0.06px_rgba(230,230,230,0.3),0_3px_16px_rgba(0,0,0,0.08)]",
          "transition-all duration-200 ease-in-out",
          "dark:shadow-[inset_0.9px_0.9px_1px_rgba(255,255,255,0.9),inset_10px_10px_0.06px_rgba(0,0,0,0.3),0_3px_16px_rgba(0,0,0,0.08)] dark:hover:bg-white/10 dark:bg-white/8 dark:border-outline dark:border backdrop-saturate-200",
        ],
        smart: [
          "bg-white/6 hover:bg-white/10",
          "border border-outline",
          "shadow-[inset_0.5px_0.5px_1px_rgba(255,255,255,0.9),inset_8px_8px_0.06px_rgba(230,230,230,0.3),0_3px_16px_rgba(0,0,0,0.08)]",
          "transition-all duration-200 ease-in-out",
          "dark:shadow-[inset_0.9px_0.9px_1px_rgba(255,255,255,0.9),inset_10px_10px_0.06px_rgba(0,0,0,0.3),0_3px_16px_rgba(0,0,0,0.08)] dark:hover:bg-white/10 dark:bg-white/8 dark:border-outline dark:border rounded-full backdrop-saturate-200",
        ],

        glass:
          "dark:shadow-[inset_0.9px_0.9px_1px_rgba(255,255,255,0.9),inset_10px_10px_0.06px_rgba(0,0,0,0.3),0_3px_16px_rgba(0,0,0,0.08)] dark:hover:bg-white/10 dark:bg-white/8 dark:border-outline dark:border rounded-full backdrop-blur-xl backdrop-saturate-200",
      },
      size: {
        sm: "px-3 py-1 font-medium text-sm [&_svg]:size-4",
        md: "px-5 py-2 font-medium text-sm [&_svg]:size-5",
        lg: "px-7 py-3 font-medium text-base [&_svg]:size-6",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

const LiquidGlassButton = React.forwardRef(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      children,
      onClick,
      onMouseDown,
      style,
      disabled = false,
      icon,
      iconPosition = "left",
      ...props
    },
    ref
  ) => {
    const [isPressed, setIsPressed] = React.useState(false);
    const Comp = asChild ? Slot : "button";

     const handleClick = e => {
      if (onClick) onClick(e);
    };

    return (
      <Comp
        ref={ref}
         onClick={handleClick}
        disabled={disabled}
        onMouseDown={onMouseDown}
        style={style}
        className={cn(
          liquidButtonVariants({ variant, size, className }),
          "transition-all duration-200 ease-in-out",
          isPressed ? "scale-105" : "hover:scale-102",
          "inline-flex items-center gap-2"
        )}
        {...props}
      >
        {icon && iconPosition === "left" && (
          <span className="shrink-0">{icon}</span>
        )}
        <span className="flex items-center justify-center w-full z-10 relative gap-2">
          {children}
        </span>
        {icon && iconPosition === "right" && (
          <span className="shrink-0">{icon}</span>
        )}
        <span
          className="absolute inset-0 bg-gradient-to-br from-white/25 via-white/10 to-transparent opacity-60 pointer-events-none"
          style={{
            borderRadius: "inherit",
          }}
          aria-hidden
        />
        <span
          className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-40 pointer-events-none"
          style={{
            borderRadius: "inherit",
          }}
          aria-hidden
        />
      </Comp>
    );
  }
);

LiquidGlassButton.displayName = "LiquidGlassButton";

export { LiquidGlassButton, liquidButtonVariants };
