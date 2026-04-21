"use client";

import * as React from "react";
import { Plus } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type CreateSheetProps = {
  triggerLabel: string;
  title: string;
  description?: string;
  children: React.ReactNode;
  triggerClassName?: string;
  hideIcon?: boolean;
  triggerIcon?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  hideTrigger?: boolean;
};

export function CreateSheet({
  triggerLabel,
  title,
  description,
  children,
  triggerClassName,
  hideIcon = false,
  triggerIcon,
  open,
  onOpenChange,
  hideTrigger = false,
}: CreateSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      {!hideTrigger ? (
        <SheetTrigger asChild>
          <Button className={cn(triggerClassName)}>
            {triggerIcon ? (
              <span className="mr-1">{triggerIcon}</span>
            ) : !hideIcon ? (
              <Plus className="mr-1 h-3.5 w-3.5" />
            ) : null}
            {triggerLabel}
          </Button>
        </SheetTrigger>
      ) : null}

      <SheetContent
        side="right"
        className="w-full border-l border-white/10 bg-background p-0 text-foreground sm:max-w-2xl"
      >
        <div className="flex h-full flex-col">
          <div className="border-b border-white/10 px-5 py-5 sm:px-6">
            <SheetHeader className="space-y-2 text-left">
              <SheetTitle className="text-xl font-semibold tracking-tight text-foreground">
                {title}
              </SheetTitle>
              {description ? (
                <SheetDescription className="max-w-xl text-sm leading-6 text-muted-foreground">
                  {description}
                </SheetDescription>
              ) : null}
            </SheetHeader>
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-6">
            <div className="mx-auto w-full max-w-2xl">{children}</div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
