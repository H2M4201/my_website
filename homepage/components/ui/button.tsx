import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant = "default", ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
        variant === "default" && "bg-blue-600 text-white hover:bg-blue-700",
        variant === "outline" && "border border-blue-600 text-blue-600 bg-transparent hover:bg-blue-50 dark:hover:bg-blue-900",
        variant === "ghost" && "bg-transparent text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900",
        className
      )}
      {...props}
    />
  )
})
Button.displayName = "Button"

export { Button }
