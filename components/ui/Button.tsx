import * as React from "react";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger";
  isLoading?: boolean;
};

const base =
  "inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed";

const variants: Record<NonNullable<Props["variant"]>, string> = {
  primary: "bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-600",
  secondary:
    "bg-slate-100 text-slate-900 hover:bg-slate-200 focus:ring-slate-400",
  danger: "bg-rose-600 text-white hover:bg-rose-700 focus:ring-rose-600"
};

export function Button({
  variant = "primary",
  isLoading,
  className,
  children,
  ...rest
}: Props) {
  return (
    <button
      className={[base, variants[variant], className].filter(Boolean).join(" ")}
      {...rest}
      disabled={rest.disabled || isLoading}
    >
      {isLoading ? "Loading..." : children}
    </button>
  );
}

