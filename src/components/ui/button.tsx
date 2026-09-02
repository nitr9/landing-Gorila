import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90 rounded-md',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-md',
        ghost: 'hover:bg-accent hover:text-accent-foreground rounded-md',
        link: 'text-primary underline-offset-4 hover:underline',
        /* Variante propia: cristal líquido sobre el video */
        glass:
          'liquid-glass text-foreground rounded-full hover:scale-[1.03] [text-shadow:0_1px_4px_rgba(0,0,0,0.45)]',
        /* Igual que glass pero con esquinas rectas */
        'glass-square':
          'liquid-glass text-foreground rounded-none hover:scale-[1.03] [text-shadow:0_1px_4px_rgba(0,0,0,0.45)]',
      },
      size: {
        default: 'h-10 px-4 py-2 text-sm',
        sm: 'h-9 px-3 text-sm',
        lg: 'h-11 px-8 text-base',
        /* Medidas exactas del diseño */
        nav: 'px-6 py-2.5 text-sm',
        hero: 'px-14 py-5 text-base',
        /* Mas angosto que hero, para CTA sobre fondo plano */
        cta: 'px-8 py-3.5 text-sm',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
