import { ReactNode } from "react";
import { VariantProps, tv } from "tailwind-variants";

interface ButtonProps {
  isLoading?: boolean;
  disabled?: boolean;
  className?: string;
  buttonVariant?: "primary" | "secondary";
}

const button = tv({
  base: "px-5 py-4 text-center rounded-lg font-mono font-medium leading-none flex-shrink-0 transition-all duration-300",
  variants: {
    type: {
      primary: "bg-yellow-200 hover:bg-yellow-400 text-blue-800",
      secondary:
        "border-[2px] border-blue-800 text-blue-800 bg-white hover:text-white hover:bg-blue-800",
    },
    isLoading: {
      true: "opacity-50",
    },
  },
});

export const Button = ({
  type,
  onClick,
  isLoading,
  className,
  children,
}: {
  type: "primary" | "secondary";
  onClick?: () => void;
  isLoading?: boolean;
  className?: string;
  children: ReactNode;
}) => {
  return (
    <button
      disabled={!!isLoading}
      onClick={onClick}
      className={`${button({ type, isLoading: !!isLoading })} ${className}`}
    >
      {children}
    </button>
  );
};
