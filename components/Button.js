"use client";

const VARIANTS = {
  primary: "bg-azuki text-cream hover:bg-azuki-dark active:bg-azuki-dark",
  matcha: "bg-matcha text-cream hover:bg-matcha-dark active:bg-matcha-dark",
  mustard: "bg-mustard text-ink hover:bg-mustard-dark active:bg-mustard-dark",
  outline: "bg-transparent text-ink border-2 border-ink/20 hover:bg-ink/5",
  ghost: "bg-transparent text-ink hover:bg-ink/5",
};

export default function Button({
  children,
  onClick,
  variant = "primary",
  type = "button",
  disabled = false,
  fullWidth = false,
  icon: Icon,
  className = "",
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`tap-target inline-flex items-center justify-center gap-2 rounded-pill px-6 py-3 text-lg font-semibold shadow-soft transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
        VARIANTS[variant]
      } ${fullWidth ? "w-full" : ""} ${className}`}
    >
      {Icon && <Icon size={22} strokeWidth={2.25} aria-hidden="true" />}
      <span>{children}</span>
    </button>
  );
}
