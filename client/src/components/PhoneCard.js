import { useState } from "react";
import { Minus, Plus, Smartphone, Trash2 } from "lucide-react";
import { formatInr } from "../utils/format";

export default function PhoneCard({ phone, idx, onDelete, onQuantityChange }) {
  const [hov, setHov] = useState(false);
  const [qtyBusy, setQtyBusy] = useState(false);
  const neon = "#d6ff2a";
  const neonSoft = "rgba(214,255,42,0.22)";
  const qty = Number(phone.quantity ?? 0);

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      className="group relative overflow-hidden rounded-[28px] border bg-gradient-to-b from-[#0a0e22] to-[#070a16] transition-all duration-[380ms]"
      style={{
        borderColor: hov ? "rgba(214,255,42,0.55)" : "rgba(255,255,255,0.08)",
        transform: hov ? "translateY(-10px) scale(1.015)" : "translateY(0) scale(1)",
        boxShadow: hov
          ? `0 34px 70px rgba(0,0,0,0.6), 0 0 0 1px rgba(214,255,42,0.18), 0 22px 70px rgba(214,255,42,0.14)`
          : "0 10px 34px rgba(0,0,0,0.45)",
        animation: `fadeUp 0.5s ease ${idx * 0.06}s both`,
      }}
    >
      {/* subtle dotted texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.14]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.18) 1px, transparent 0)",
          backgroundSize: "10px 10px",
          maskImage: "radial-gradient(circle at 50% 35%, black 0%, transparent 72%)",
          WebkitMaskImage: "radial-gradient(circle at 50% 35%, black 0%, transparent 72%)",
        }}
      />
      {/* neon glow */}
      <div
        className="pointer-events-none absolute -inset-20 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: `radial-gradient(closest-side, ${neonSoft}, transparent 70%)`,
        }}
      />

      <div
        className="relative flex h-[208px] items-center justify-center overflow-hidden"
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 50% 70%, rgba(214,255,42,0.18), transparent 62%)",
          }}
        />

        <div
          className="relative flex h-[132px] w-[132px] items-center justify-center rounded-[36px] transition-transform duration-300 ease-out"
          style={{
            transform: hov ? "scale(1.05) translateY(-6px)" : "scale(1)",
            boxShadow: `0 26px 60px rgba(0,0,0,0.55), 0 0 0 2px rgba(214,255,42,0.18)`,
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.01))",
          }}
          aria-hidden
        >
          <div
            className="pointer-events-none absolute inset-0 rounded-[36px]"
            style={{
              boxShadow: `inset 0 0 0 2px rgba(214,255,42,0.25), 0 0 34px rgba(214,255,42,0.22)`,
            }}
          />
          <Smartphone
            size={92}
            strokeWidth={1.8}
            style={{
              color: neon,
              filter: "drop-shadow(0 20px 48px rgba(214,255,42,0.22))",
            }}
          />
          <div
            className="pointer-events-none absolute -bottom-3 left-1/2 h-7 w-24 -translate-x-1/2 rounded-full blur-xl"
            style={{ backgroundColor: "rgba(214,255,42,0.28)" }}
          />
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(phone._id);
          }}
          title="Delete item"
          className={`absolute right-4 top-4 flex rounded-xl border border-red-500/25 bg-red-500/10 p-2 text-red-400 backdrop-blur transition-all duration-200 hover:bg-red-500/20 hover:text-red-300 ${
            hov ? "opacity-100" : "opacity-0"
          }`}
          aria-label="Delete phone"
        >
          <Trash2 size={15} strokeWidth={2} />
        </button>
      </div>

      {/* bottom panel */}
      <div className="border-t border-white/5 bg-gradient-to-b from-white/[0.02] to-transparent px-6 pb-6 pt-5">
        <div className="mb-3 inline-flex items-center rounded-full border px-3.5 py-1 text-[11px] font-black uppercase tracking-[0.22em]"
          style={{
            borderColor: "rgba(214,255,42,0.38)",
            color: neon,
            background: "rgba(214,255,42,0.06)",
          }}
        >
          {String(phone.companyName || "").toUpperCase()}
        </div>

        <div className="mb-2 line-clamp-2 text-[22px] font-black leading-[1.05] tracking-tight text-white">
          {phone.modelName}
        </div>
        <div
          className="mb-3 text-[24px] font-black tracking-tight"
          style={{
            color: neon,
            textShadow: "0 0 22px rgba(214,255,42,0.18)",
          }}
        >
          {formatInr(phone.sellingRate)}
        </div>

        <div className="overflow-hidden rounded-[22px] border border-white/10 bg-white/[0.03]">
          <div className="grid grid-cols-2">
            <div className="px-5 py-4 text-center">
              <div className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-500">
                Purchase
              </div>
              <div className="mt-1 text-sm font-extrabold text-slate-200">
                {formatInr(phone.purchaseRate)}
              </div>
            </div>
            <div className="border-l border-white/10 px-5 py-4 text-center">
              <div className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-500">
                Qty
              </div>
              <div className="mt-2 flex items-center justify-center ">
                <button
                  type="button"
                  disabled={qtyBusy || qty <= 0}
                  onClick={async (e) => {
                    e.stopPropagation();
                    if (!onQuantityChange) return;
                    const next = Math.max(0, qty - 1);
                    try {
                      setQtyBusy(true);
                      await onQuantityChange(phone._id, next);
                    } finally {
                      setQtyBusy(false);
                    }
                  }}
                  className="inline-flex px-1 py-0.5 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-slate-200 transition-all hover:bg-white/10 disabled:opacity-50"
                  aria-label="Decrease quantity"
                  style={{
                    boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.04)",
                  }}
                >
                  <Minus size={18} strokeWidth={2.6} />
                </button>
                <div
                  className="min-w-8 text-center text-[14px] font-black tabular-nums"
                  style={{ color: qtyBusy ? "#94a3b8" : neon }}
                >
                  {qtyBusy ? "…" : qty}
                </div>
                <button
                  type="button"
                  disabled={qtyBusy}
                  onClick={async (e) => {
                    e.stopPropagation();
                    if (!onQuantityChange) return;
                    const next = qty + 1;
                    try {
                      setQtyBusy(true);
                      await onQuantityChange(phone._id, next);
                    } finally {
                      setQtyBusy(false);
                    }
                  }}
                  className="inline-flex px-1 py-0.5  items-center justify-center rounded-md border text-slate-900 transition-all disabled:opacity-50"
                  aria-label="Increase quantity"
                  style={{
                    borderColor: "rgba(214,255,42,0.45)",
                    background: "rgba(214,255,42,0.92)",
                    boxShadow: "0 14px 26px rgba(214,255,42,0.18)",
                  }}
                >
                  <Plus size={18} strokeWidth={2.6} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
