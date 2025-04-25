import type { ButtonHTMLAttributes, ReactNode } from "react";
import styles from "./Button.module.css";

type ButtonSize = "sm" | "md" | "lg";
type ButtonShape = "square" | "rounded" | "pill";
type ButtonColor =
  | "primary"
  | "secondary"
  | "success"
  | "danger"
  | "warning"
  | "neutral";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  size?: ButtonSize;
  shape?: ButtonShape;
  color?: ButtonColor;
  className?: string;
  fullWidth?: boolean;
}

function Button({
  children,
  size = "md",
  shape = "rounded",
  color = "primary",
  className = "",
  fullWidth = false,
  ...props
}: ButtonProps) {
  const buttonClasses = [
    styles.button,
    styles[`button--size-${size}`],
    styles[`button--shape-${shape}`],
    styles[`button--color-${color}`],
    fullWidth ? "w-full" : "",
    className,
  ].join(" ");

  return (
    <button className={buttonClasses} {...props}>
      {children}
    </button>
  );
}

export { Button };
