import { LayoutGrid, Plus, Search, Sparkles } from "lucide-react";

function NavButton({ active, onClick, icon: IconCmp, label, accent }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-2 rounded-xl border px-4 py-2 text-[13px] font-semibold transition-all duration-200 ${
        active
          ? accent
            ? "border-transparent bg-gradient-to-br from-indigo-500 to-violet-400 text-white shadow-[0_0_20px_rgba(99,102,241,0.35)]"
            : "border-indigo-500/50 bg-indigo-500/15 text-white"
          : accent
            ? "border-transparent bg-gradient-to-br from-indigo-500 to-violet-400 text-white shadow-[0_0_18px_rgba(99,102,241,0.25)] hover:brightness-110"
            : "border-transparent text-slate-400 hover:bg-white/5 hover:text-slate-200"
      }`}
    >
      <IconCmp size={16} strokeWidth={2} className="shrink-0" />
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}

export default function Navbar({
  page,
  setPage,
  search,
  setSearch,
  onNavigateHome,
}) {
  const goHome = () => {
    onNavigateHome?.();
    setPage("home");
  };

  return (
    <nav className="fixed left-0 right-0 top-0 z-[100] flex h-[66px] items-center gap-4 border-b border-indigo-500/20 bg-[#04060f]/90 px-4 backdrop-blur-2xl sm:gap-6 sm:px-7">
      <button
        type="button"
        onClick={goHome}
        className="flex shrink-0 items-center gap-2.5 text-left sm:gap-3"
      >
        <span className="flex h-[38px] w-[38px] items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-pink-500 shadow-[0_0_20px_rgba(99,102,241,0.4)]">
          <Sparkles size={19} strokeWidth={2.2} className="text-white" />
        </span>
        <div className="hidden leading-tight sm:block">
          <div className="text-[17px] font-extrabold tracking-wide text-white">
            MobiStock
          </div>
          <div className="text-[9px] font-bold tracking-[0.2em] text-indigo-400">
            MOBILE SHOP
          </div>
        </div>
      </button>

      {page === "home" && (
        <div className="relative min-w-0 flex-1 sm:max-w-[340px]">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-indigo-400">
            <Search size={16} strokeWidth={2} />
          </span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search model or company…"
            className="box-border w-full rounded-xl border border-indigo-500/25 bg-indigo-500/[0.09] py-2.5 pl-10 pr-3.5 text-sm text-white outline-none transition-[border-color,box-shadow] placeholder:text-slate-600 focus:border-indigo-500/50 focus:shadow-[0_0_0_3px_rgba(99,102,241,0.12)]"
            aria-label="Search phones"
          />
        </div>
      )}
      <div className="ml-auto flex items-center gap-2 sm:gap-3">
        <NavButton
          active={page === "home"}
          onClick={() => goHome()}
          icon={LayoutGrid}
          label="Inventory"
        />
        <NavButton
          active={page === "add"}
          onClick={() => setPage("add")}
          icon={Plus}
          label="Add Item"
          accent
        />
      </div>
    </nav>
  );
}
