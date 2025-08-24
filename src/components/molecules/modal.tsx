"use client";

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/atoms/button";
import { cva, type VariantProps } from "class-variance-authority";

const modalVariants = cva(
  "relative bg-background border rounded-lg shadow-lg w-full mx-4 overflow-y-auto",
  {
    variants: {
      size: {
        sm: "max-w-sm",
        md: "max-w-md",
        lg: "max-w-lg",
        xl: "max-w-xl",
        "2xl": "max-w-2xl",
        "3xl": "max-w-3xl",
        "4xl": "max-w-4xl",
        "5xl": "max-w-5xl",
        "6xl": "max-w-6xl",
        "7xl": "max-w-7xl",
        full: "max-w-[calc(100vw-2rem)]",
      },
      height: {
        auto: "max-h-[80vh]",
        sm: "max-h-[40vh]",
        md: "max-h-[60vh]",
        lg: "max-h-[75vh]",
        xl: "max-h-[85vh]",
        "2xl": "max-h-[90vh]",
        full: "max-h-[calc(100vh-2rem)]",
        fit: "h-fit max-h-[90vh]",
        screen: "h-[calc(100vh-4rem)]",
      },
    },
    defaultVariants: {
      size: "lg",
      height: "auto",
    },
  },
);

interface ModalProps extends VariantProps<typeof modalVariants> {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  className,
  size,
  height,
}: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className={cn(modalVariants({ size, height }), className)}>
        <ModalHeader>
          <div className="space-y-1">
            <ModalTitle>{title}</ModalTitle>
            {description && <ModalDescription>{description}</ModalDescription>}
          </div>
          <ModalClose onClick={onClose}>
            <X className="h-4 w-4" />
            <span className="sr-only">Fermer</span>
          </ModalClose>
        </ModalHeader>
        <ModalContent>{children}</ModalContent>
      </div>
    </div>
  );
}

// Compound components for better composability
const ModalHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center justify-between p-6 border-b", className)}
    {...props}
  />
));
ModalHeader.displayName = "ModalHeader";

const ModalTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h2 ref={ref} className={cn("text-lg font-semibold", className)} {...props} />
));
ModalTitle.displayName = "ModalTitle";

const ModalDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
ModalDescription.displayName = "ModalDescription";

const ModalContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6", className)} {...props} />
));
ModalContent.displayName = "ModalContent";

const ModalClose = React.forwardRef<
  React.ElementRef<typeof Button>,
  React.ComponentPropsWithoutRef<typeof Button>
>(({ className, ...props }, ref) => (
  <Button
    ref={ref}
    variant="ghost"
    size="sm"
    className={cn("h-8 w-8 p-0", className)}
    {...props}
  />
));
ModalClose.displayName = "ModalClose";

export {
  Modal,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalContent,
  ModalClose,
  modalVariants,
};
