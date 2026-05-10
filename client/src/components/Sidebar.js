export default function Sidebar({
  companyKeys,
  active,
  setActive,
  counts,
  totalCount,
}) {
  const list = ["all", ...companyKeys];

  return (
    <aside className="-mx-2 flex w-full shrink-0 flex-row gap-2 overflow-x-auto px-2 pb-2 lg:mx-0 lg:w-[196px] lg:flex-col lg:gap-0 lg:overflow-visible lg:pb-0 lg:px-0">
      <div className="mb-0 hidden w-full pl-1 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-600 lg:mb-3.5 lg:block">
        Companies
      </div>
      {list.map((b) => {
        const label = b === "all" ? "All" : b;
        const count =
          b === "all" ? totalCount : counts[b] ?? 0;
        const act = active === b;

        return (
          <button
            key={b}
            type="button"
            onClick={() => setActive(b)}
            className="flex shrink-0 items-center gap-2.5 rounded-[13px] border px-3.5 py-2.5 text-left text-[13px] font-medium transition-colors lg:mb-1.5 lg:w-full lg:shrink"
            style={{
              borderColor: act ? "rgba(99,102,241,0.45)" : "transparent",
              background: act
                ? "linear-gradient(135deg,rgba(99,102,241,0.22),rgba(99,102,241,0.05))"
                : "transparent",
              color: act ? "#a78bfa" : "#64748b",
              fontWeight: act ? 700 : 500,
            }}
          >
            <span className="text-base" aria-hidden>📱</span>
            <span className="flex-1 whitespace-nowrap">{label}</span>
            <span
              className="rounded-full border px-2 py-0.5 text-[10px] font-bold tabular-nums"
              style={{
                backgroundColor: act ? "rgba(167,139,250,0.22)" : "rgba(255,255,255,0.05)",
                borderColor: act ? "rgba(167,139,250,0.22)" : "rgba(255,255,255,0.07)",
                color: act ? "#a78bfa" : "#374151",
              }}
            >
              {count}
            </span>
          </button>
        );
      })}
    </aside>
  );
}
