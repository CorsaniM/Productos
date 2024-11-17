import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "~/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-2xl text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-gray-950",
  {
    variants: {
      variant: {
        default: "bg-green-500 text-white hover:bg-green-600", // Fondo verde con hover más oscuro
        destructive:
          "bg-red-600 text-white hover:bg-red-500", // Fondo rojo para botones destructivos
        outline:
          "border border-green-500 text-green-500 hover:bg-green-500 hover:text-white", // Borde verde con texto que cambia al hacer hover
        secondary:
          "bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900 dark:text-green-100 dark:hover:bg-green-800", // Fondo verde claro con texto oscuro
        ghost:
          "text-green-500 hover:bg-green-100 dark:text-green-400 dark:hover:bg-green-900", // Botón con solo texto verde y fondo sutil al hover
        link: "text-green-500 underline-offset-4 hover:underline dark:text-green-400", // Enlaces verdes
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);


export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
