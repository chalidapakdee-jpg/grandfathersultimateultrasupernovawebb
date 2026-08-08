export default function StatCard({ label, value, icon: Icon, accent = "matcha" }) {
  const bg = accent === "azuki" ? "bg-azuki-50 border-azuki-400" : accent === "mustard" ? "bg-mustard-50 border-mustard-400" : "bg-matcha-50 border-matcha-400";
  return (
    <div className={`rounded-xl2 border-2 ${bg} p-4 flex flex-col gap-1`}>
      <div className="flex items-center gap-2 text-ink/70">
        {Icon && <Icon size={20} />}
        <span className="text-sm font-semibold">{label}</span>
      </div>
      <span className="font-display text-2xl font-bold text-ink">{value}</span>
    </div>
  );
}
