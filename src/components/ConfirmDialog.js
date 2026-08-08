"use client";

export default function ConfirmDialog({ open, title, description, confirmLabel = "ยืนยัน", cancelLabel = "ยกเลิก", danger, onConfirm, onCancel }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 p-4" role="dialog" aria-modal="true">
      <div className="w-full max-w-sm rounded-xl2 bg-cream p-6 shadow-soft border-4 border-matcha-700">
        <h2 className="font-display text-lg font-bold text-ink mb-2">{title}</h2>
        {description && <p className="font-body text-ink/80 mb-5">{description}</p>}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 rounded-xl border-2 border-matcha-600 py-3 font-bold text-matcha-700 hover:bg-matcha-50"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className={[
              "flex-1 rounded-xl py-3 font-bold text-cream",
              danger ? "bg-azuki-600 hover:bg-azuki-700" : "bg-matcha-600 hover:bg-matcha-700",
            ].join(" ")}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
