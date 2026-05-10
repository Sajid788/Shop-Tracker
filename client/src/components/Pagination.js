export default function Pagination({ page, totalPages, setPage }) {
  if (totalPages <= 1) return null;

  return (
    <div className="mt-9 flex flex-wrap items-center justify-center gap-2">
      <PgBtn
        onClick={() => setPage((p) => Math.max(1, p - 1))}
        disabled={page === 1}
        label="←"
      />
      {Array.from({ length: totalPages }, (_, i) => (
        <PgBtn
          key={i}
          onClick={() => setPage(i + 1)}
          active={page === i + 1}
          label={i + 1}
        />
      ))}
      <PgBtn
        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
        disabled={page === totalPages}
        label="→"
      />
    </div>
  );
}

function PgBtn({ onClick, disabled, label, active }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`min-h-[38px] min-w-[38px] rounded-[10px] border px-3 text-[13px] font-semibold transition-all ${
        active
          ? "border-transparent bg-gradient-to-br from-indigo-500 to-violet-400 text-white"
          : "border-indigo-500/20 bg-indigo-500/10 text-violet-300 hover:bg-indigo-500/20"
      } ${disabled ? "cursor-not-allowed text-slate-800 opacity-40" : ""}`}
    >
      {label}
    </button>
  );
}
