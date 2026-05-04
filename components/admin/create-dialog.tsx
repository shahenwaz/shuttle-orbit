"use client";

import * as React from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type CreateDialogProps = {
  triggerLabel: string;
  title: string;
  description?: string;
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  hideTrigger?: boolean;
  triggerClassName?: string;
  triggerIcon?: React.ReactNode;
  triggerDisabled?: boolean;
};

export function CreateDialog({
  triggerLabel,
  title,
  description,
  children,
  open,
  onOpenChange,
  hideTrigger = false,
  triggerClassName,
  triggerIcon,
  triggerDisabled,
}: CreateDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {!hideTrigger ? (
        <DialogTrigger asChild>
          <Button className={cn(triggerClassName)} disabled={triggerDisabled}>
            {triggerIcon ? <span className="mr-1">{triggerIcon}</span> : null}
            {triggerLabel}
          </Button>
        </DialogTrigger>
      ) : null}

      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description ? (
            <DialogDescription>{description}</DialogDescription>
          ) : null}
        </DialogHeader>

        {children}
      </DialogContent>
    </Dialog>
  );
}
