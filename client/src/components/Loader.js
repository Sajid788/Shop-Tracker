export default function Loader() {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#04060f]">
      <div className="relative h-[88px] w-[88px]">
        {[0, 8, 16].map((inset, k) => (
          <div
            key={k}
            className="absolute rounded-full border-[2.5px] border-transparent"
            style={{
              inset,
              borderTopColor: ["#6366f1", "#a78bfa", "#ec4899"][k],
              animation: `spin ${[1, 0.7, 0.5][k]}s linear infinite ${
                k % 2 ? "reverse" : "normal"
              }`,
            }}
          />
        ))}
        <div className="absolute inset-6 flex items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-pink-500 text-xl">
          📱
        </div>
      </div>
      <p className="mt-7 text-[13px] font-semibold uppercase tracking-[0.35em] text-[#a78bfa]">
        MobiStock
      </p>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
