import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg" | "full";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    const variants = {
      primary: "bg-[#e63946] text-white hover:bg-[#c12e3a] active:scale-95",
      secondary: "bg-[#ffb703] text-black hover:bg-[#e6a600] active:scale-95",
      outline: "border-2 border-[#e63946] text-[#e63946] hover:bg-[#e63946] hover:text-white active:scale-95",
      ghost: "text-white hover:bg-white/10",
    }
    
    const sizes = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-6 py-3 text-base font-semibold",
      lg: "px-8 py-4 text-lg font-bold",
      full: "w-full py-4 text-lg font-bold",
    }

    return (
      <button
        className={cn(
          "inline-flex items-center justify-center rounded-full transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none uppercase tracking-wider",
          variants[variant],
          sizes[size],
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
