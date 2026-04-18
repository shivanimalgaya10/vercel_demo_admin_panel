import * as React from "react";

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
};

export function Input({ label, error, className, ...rest }: Props) {
  return (
    <label className="block">
      {label ? (
        <span className="mb-1 block text-sm font-medium text-slate-700">
          {label}
        </span>
      ) : null}
      <input
        className={[
          "w-full rounded-lg border bg-white px-3 py-2 text-sm outline-none transition",
          error
            ? "border-rose-400 focus:ring-2 focus:ring-rose-200"
            : "border-slate-200 focus:ring-2 focus:ring-indigo-200",
          className
        ]
          .filter(Boolean)
          .join(" ")}
        {...rest}
      />
      {error ? <span className="mt-1 block text-xs text-rose-600">{error}</span> : null}
    </label>
  );
}

