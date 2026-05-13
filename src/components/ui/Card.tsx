import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: boolean;
}

export default function Card({
  children,
  className,
  padding = true,
}: CardProps) {
  return (
    <div
      className={cn(
        "bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm",
        padding && "p-6",
        className
      )}
    >
      {children}
    </div>
  );
}
