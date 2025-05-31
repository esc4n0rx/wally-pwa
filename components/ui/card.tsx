// components/ui/card.tsx
import * as React from "react";
import { cn } from "@/lib/utils";

// Define os tipos para as props do componente Card
type CardProps = React.HTMLAttributes<HTMLDivElement>;

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-3xl border-2 border-border/50 bg-card/80 backdrop-blur-sm text-card-foreground shadow-lg hover:shadow-xl transition-all duration-300",
        className
      )}
      {...props}
    />
  )
);
Card.displayName = "Card";

// Define os tipos para as props do componente CardHeader
type CardHeaderProps = React.HTMLAttributes<HTMLDivElement>;

const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex flex-col space-y-2 p-6", className)}
      {...props}
    />
  )
);
CardHeader.displayName = "CardHeader";

// Define os tipos para as props do componente CardTitle
type CardTitleProps = React.HTMLAttributes<HTMLDivElement>;

const CardTitle = React.forwardRef<HTMLDivElement, CardTitleProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("text-xl font-heading leading-none tracking-tight", className)}
      {...props}
    />
  )
);
CardTitle.displayName = "CardTitle";

// Define os tipos para as props do componente CardDescription
type CardDescriptionProps = React.HTMLAttributes<HTMLDivElement>;

const CardDescription = React.forwardRef<HTMLDivElement, CardDescriptionProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("text-sm text-muted-foreground font-body", className)}
      {...props}
    />
  )
);
CardDescription.displayName = "CardDescription";

// Define os tipos para as props do componente CardContent
type CardContentProps = React.HTMLAttributes<HTMLDivElement>;

const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
  )
);
CardContent.displayName = "CardContent";

// Define os tipos para as props do componente CardFooter
type CardFooterProps = React.HTMLAttributes<HTMLDivElement>;

const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex items-center p-6 pt-0", className)}
      {...props}
    />
  )
);
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };