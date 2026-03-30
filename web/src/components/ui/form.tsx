"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Projenin ilk iskeletinde “Form” bileşeni placeholder olarak sağlanır.
 * İleride react-hook-form + Zod ile entegre edilerek genişletilecektir.
 */
export function Form({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form">) {
  return (
    <form className={cn("space-y-4", className)} {...props} />
  );
}

