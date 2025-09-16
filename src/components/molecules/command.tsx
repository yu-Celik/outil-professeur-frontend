"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

const Command = React.forwardRef<
  React.ElementRef<"div">,
  React.ComponentPropsWithoutRef<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground",
      className
    )}
    {...props}
  />
));
Command.displayName = "Command";

const CommandInput = React.forwardRef<
  React.ElementRef<"input">,
  React.ComponentPropsWithoutRef<"input">
>(({ className, ...props }, ref) => (
  <div className="flex items-center border-b px-3" data-slot="command-input-wrapper">
    <input
      ref={ref}
      className={cn(
        "flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  </div>
));
CommandInput.displayName = "CommandInput";

const CommandList = React.forwardRef<
  React.ElementRef<"div">,
  React.ComponentPropsWithoutRef<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("max-h-[300px] overflow-y-auto overflow-x-hidden", className)}
    {...props}
  />
));
CommandList.displayName = "CommandList";

const CommandEmpty = React.forwardRef<
  React.ElementRef<"div">,
  React.ComponentPropsWithoutRef<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("py-6 text-center text-sm text-muted-foreground", className)}
    {...props}
  />
));
CommandEmpty.displayName = "CommandEmpty";

const CommandGroup = React.forwardRef<
  React.ElementRef<"div">,
  React.ComponentPropsWithoutRef<"div"> & {
    heading?: React.ReactNode;
  }
>(({ className, heading, ...props }, ref) => (
  <div ref={ref} className={cn("overflow-hidden p-1", className)}>
    {heading && (
      <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
        {heading}
      </div>
    )}
    <div {...props} />
  </div>
));
CommandGroup.displayName = "CommandGroup";

const CommandItem = React.forwardRef<
  React.ElementRef<"div">,
  React.ComponentPropsWithoutRef<"div"> & {
    value?: string;
    onSelect?: (value: string) => void;
  }
>(({ className, onSelect, value, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    onClick={() => value && onSelect?.(value)}
    {...props}
  />
));
CommandItem.displayName = "CommandItem";

export {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
};