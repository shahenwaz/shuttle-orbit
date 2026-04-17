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

type CreateSheetProps = {
  triggerLabel: string;
  title: string;
  description?: string;
  children: React.ReactNode;
};

export function CreateSheet({
  triggerLabel,
  title,
  description,
  children,
}: CreateSheetProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          {triggerLabel}
        </Button>
      </SheetTrigger>

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
