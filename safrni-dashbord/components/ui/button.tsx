import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "",
        destructive: "",
        outline: "",
        secondary: "",
        ghost: "",
        link: "",
        success: "",
        warning: "",
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
)

const variantStyles: Record<string, React.CSSProperties> = {
  default: {
    backgroundColor: 'var(--accent-primary)',
    color: 'var(--text-inverse)',
  },
  destructive: {
    backgroundColor: 'var(--accent-danger)',
    color: 'var(--text-inverse)',
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: 'var(--border-primary)',
    color: 'var(--text-primary)',
  },
  secondary: {
    backgroundColor: 'var(--bg-tertiary)',
    color: 'var(--text-primary)',
  },
  ghost: {
    backgroundColor: 'transparent',
    color: 'var(--text-primary)',
  },
  link: {
    backgroundColor: 'transparent',
    color: 'var(--accent-primary)',
    textDecoration: 'underline',
  },
  success: {
    backgroundColor: 'var(--accent-success)',
    color: 'var(--text-inverse)',
  },
  warning: {
    backgroundColor: 'var(--accent-warning)',
    color: 'var(--text-inverse)',
  },
}

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size, style, ...props }, ref) => {
    const variantStyle = variantStyles[variant || 'default']
    
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        style={{
          ...variantStyle,
          ...style
        }}
        ref={ref}
        onMouseEnter={(e) => {
          const target = e.currentTarget
          if (variant === 'default') {
            target.style.backgroundColor = 'var(--accent-primary-hover)'
          } else if (variant === 'outline' || variant === 'ghost') {
            target.style.backgroundColor = 'var(--bg-hover)'
          } else if (variant === 'destructive') {
            target.style.opacity = '0.9'
          }
          props.onMouseEnter?.(e)
        }}
        onMouseLeave={(e) => {
          const target = e.currentTarget
          if (variant === 'default') {
            target.style.backgroundColor = 'var(--accent-primary)'
          } else if (variant === 'outline' || variant === 'ghost') {
            target.style.backgroundColor = 'transparent'
          } else if (variant === 'destructive') {
            target.style.opacity = '1'
          }
          props.onMouseLeave?.(e)
        }}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
