import * as React from "react";
import { cn } from "@/lib/utils";

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: "sm" | "md" | "lg" | "xl";
  online?: boolean;
}

export function Avatar({
  src,
  alt = "avatar",
  fallback = "U",
  size = "md",
  online,
  className,
  ...props
}: AvatarProps) {
  const sizeClasses = {
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-12 w-12 text-base",
    xl: "h-14 w-14 text-lg",
  };

  const [hasError, setHasError] = React.useState(false);

  return (
    <div
      className={cn(
        "relative flex shrink-0 overflow-visible rounded-full select-none",
        sizeClasses[size],
        className
      )}
      {...props}
    >
      <div className="relative h-full w-full overflow-hidden rounded-full bg-slate-200">
        {src && !hasError ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={src}
            alt={alt}
            onError={() => setHasError(true)}
            suppressHydrationWarning
            className="h-full w-full object-cover rounded-full"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center font-medium uppercase text-slate-600 bg-slate-200">
            {fallback}
          </div>
        )}
      </div>

      {online !== undefined && (
        <span
          className={cn(
            "absolute bottom-0 right-0 block rounded-full ring-2 ring-white",
            online ? "bg-emerald-500" : "bg-slate-300",
            size === "sm" ? "h-2 w-2" : size === "md" ? "h-2.5 w-2.5" : "h-3.5 w-3.5"
          )}
        />
      )}
    </div>
  );
}
