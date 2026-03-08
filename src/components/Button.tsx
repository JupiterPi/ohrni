import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
}

const baseClasses =
  "inline-flex items-center justify-center gap-1.5 rounded-full font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/80 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 disabled:opacity-50 disabled:cursor-not-allowed";

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-emerald-500 text-slate-950 hover:bg-emerald-400 active:bg-emerald-500/90 shadow-sm",
  secondary:
    "border border-slate-600/80 bg-slate-900/80 text-slate-100 hover:bg-slate-800 active:bg-slate-900",
  ghost: "text-slate-300 hover:bg-slate-800/70 active:bg-slate-900",
};

const sizeClasses: Record<Size, string> = {
  sm: "px-3 py-2 text-xs",
  md: "px-4 py-3 text-sm",
};

export function Button({
  variant = "primary",
  size = "md",
  iconLeft,
  iconRight,
  className = "",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {iconLeft && <span className="mr-0.5 inline-flex">{iconLeft}</span>}
      <span>{children}</span>
      {iconRight && <span className="ml-0.5 inline-flex">{iconRight}</span>}
    </button>
  );
}

