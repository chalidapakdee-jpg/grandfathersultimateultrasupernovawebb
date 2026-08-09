export default function StatCard({ icon: Icon, label, value, tone = "matcha" }) {
  const tones = {
    matcha: "bg-matcha-light text-matcha-dark",
    azuki: "bg-azuki-light/40 text-azuki-dark",
    mustard: "bg-mustard-light text-mustard-dark",
  };
  return (
    <div className={`flex items-center gap-3 rounded-3xl p-4 shadow-soft ${tones[tone]}`}>
      {Icon && (
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/60">
          <Icon size={26} strokeWidth={2.25} aria-hidden="true" />
        </div>
      )}
      <div>
        <p className="text-sm opacity-80">{label}</p>
        <p className="font-display text-2xl font-bold">{value}</p>
      </div>
    </div>
  );
}
