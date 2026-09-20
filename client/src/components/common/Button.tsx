import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant =
  | "primary"
  | "secondary"
  | "danger"
  | "ghost"
  | "success";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: ButtonVariant;
  loading?: boolean;
}

export default function Button({
  children,
  variant = "primary",
  loading = false,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`ui-button ui-button-${variant}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? "Processing..." : children}
    </button>
  );
}