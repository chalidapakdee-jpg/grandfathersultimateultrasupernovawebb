export default function Card({ children, className = "", tone = "default" }) {
  const tones = {
    default: "bg-white/70",
    matcha: "bg-matcha-light",
    mustard: "bg-mustard-light",
    azuki: "bg-azuki-light/40",
  };
  return (
    <div
      className={`rounded-3xl border border-ink/10 p-5 shadow-soft ${tones[tone]} ${className}`}
    >
      {children}
    </div>
  );
}
