import * as React from "react"
import { cn } from "@/lib/utils"
import { ChevronDown } from "lucide-react"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: React.ReactNode;
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", label, error, ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5">
        {label && <label className="block text-sm font-medium text-gray-300">{label}</label>}
        <input
          type={type}
          className={cn(
            "flex h-12 w-full rounded-xl border border-[#333333] bg-[#1a1a1a] px-4 py-2 text-base text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#e63946] focus:border-transparent transition-all disabled:opacity-50",
            error && "border-red-500 focus:ring-red-500",
            className
          )}
          ref={ref}
          {...props}
        />
        {error && <span className="text-xs text-red-500 mt-1">{error}</span>}
      </div>
    )
  }
)
Input.displayName = "Input"

const Select = React.forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement> & { label?: React.ReactNode; error?: string }>(
  ({ className, label, error, children, ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5">
        {label && <label className="block text-sm font-medium text-gray-300">{label}</label>}
        <div className="relative">
          <select
            className={cn(
              "flex h-12 w-full rounded-xl border border-[#333333] bg-[#1a1a1a] px-4 py-2 pr-10 text-base text-white focus:outline-none focus:ring-2 focus:ring-[#e63946] focus:border-transparent transition-all disabled:opacity-50 appearance-none",
              error && "border-red-500 focus:ring-red-500",
              className
            )}
            ref={ref}
            {...props}
          >
            {children}
          </select>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
        </div>
        {error && <span className="text-xs text-red-500 mt-1">{error}</span>}
      </div>
    )
  }
)
Select.displayName = "Select"

export { Input, Select }
