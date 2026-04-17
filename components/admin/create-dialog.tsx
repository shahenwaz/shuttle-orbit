"use client";

import * as React from "react";
import { Plus } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type CreateDialogProps = {
  triggerLabel: string;
  title: string;
  description?: string;
  children: React.ReactNode;
};

export function CreateDialog({
  triggerLabel,
  title,
  description,
  children,
}: CreateDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          {triggerLabel}
        </Button>
      </DialogTrigger>

      <DialogContent className="border-white/10 bg-background p-0 text-foreground sm:max-w-lg">
        <div className="flex flex-col">
          <div className="border-b border-white/10 px-5 py-5 sm:px-6">
            <DialogHeader className="space-y-2 text-left">
              <DialogTitle className="text-xl font-semibold tracking-tight text-foreground">
                {title}
              </DialogTitle>
              {description ? (
                <DialogDescription className="text-sm leading-6 text-muted-foreground">
                  {description}
                </DialogDescription>
              ) : null}
            </DialogHeader>
          </div>

          <div className="px-5 py-5 sm:px-6">
            <div className="w-full">{children}</div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
