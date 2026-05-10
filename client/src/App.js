import { useCallback, useEffect, useMemo, useState } from "react";
import { Sparkles } from "lucide-react";

import Loader from "./components/Loader";
import Navbar from "./components/Navbar";
import PhoneCard from "./components/PhoneCard";
import Sidebar from "./components/Sidebar";
import AddPhonePage from "./components/AddPhonePage";
import Pagination from "./components/Pagination";
import { PER_PAGE } from "./constants/brands";
import * as phonesApi from "./services/phonesApi";

function App() {
  const [booting, setBooting] = useState(true);
  const [bootstrapError, setBootstrapError] = useState("");
  const [meta, setMeta] = useState({ total: 0, byCompany: [] });

  const [page, setPage] = useState("home");
  const [phones, setPhones] = useState([]);
  const [listLoading, setListLoading] = useState(false);
  const [listError, setListError] = useState("");

  const [companyName, setCompanyName] = useState("all");
  const [search, setSearch] = useState("");
  const [pgNum, setPgNum] = useState(1);
  const [totalFiltered, setTotalFiltered] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const loadMeta = useCallback(async () => {
    const m = await phonesApi.fetchPhonesMeta();
    setMeta({ total: m.total ?? 0, byCompany: m.byCompany ?? [] });
  }, []);

  const loadPhonesPage = useCallback(async () => {
    setListError("");
    setListLoading(true);
    try {
      const data = await phonesApi.fetchPhones({
        companyName,
        search,
        page: pgNum,
        limit: PER_PAGE,
      });
      setPhones(Array.isArray(data.data) ? data.data : []);
      setTotalFiltered(data.total ?? data.data?.length ?? 0);
      setTotalPages(Math.max(1, data.totalPages ?? 1));
    } catch (e) {
      setListError(e.message || "Could not load showroom");
      setPhones([]);
      setTotalFiltered(0);
      setTotalPages(1);
    } finally {
      setListLoading(false);
    }
  }, [companyName, search, pgNum]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setBootstrapError("");
      setBooting(true);
      try {
        await loadMeta();
        if (cancelled) return;
      } catch (e) {
        if (!cancelled) setBootstrapError(e.message || "Could not reach API");
      } finally {
        if (!cancelled) setBooting(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [loadMeta]);

  useEffect(() => {
    if (booting) return;
    loadPhonesPage();
  }, [loadPhonesPage, booting]);

  useEffect(() => {
    setPgNum(1);
  }, [companyName, search, page]);

  const companyCounts = useMemo(() => {
    const m = {};
    (meta.byCompany || []).forEach(({ companyName: c, count }) => {
      m[c] = count;
    });
    return m;
  }, [meta.byCompany]);

  const companyKeys = useMemo(() => {
    const keys = [...(meta.byCompany || []).map((x) => x.companyName)].filter(Boolean);
    keys.sort((a, b) => String(a).localeCompare(String(b)));
    return keys;
  }, [meta.byCompany]);

  const changePageRoute = useCallback((p) => {
    setPage(p);
  }, []);

  const handleNavigateHomeReset = useCallback(() => {}, []);

  const handleDelete = async (id) => {
    try {
      await phonesApi.deletePhone(id);
      await Promise.all([loadMeta(), loadPhonesPage()]);
    } catch (e) {
      alert(e.message || "Delete failed");
    }
  };

  const handleQuantityChange = async (id, nextQty) => {
    try {
      await phonesApi.updateQuantity(id, nextQty);
      await Promise.all([loadMeta(), loadPhonesPage()]);
    } catch (e) {
      alert(e.message || "Quantity update failed");
    }
  };

  const handleAfterAddSubmitted = async () => {
    try {
      await Promise.all([loadMeta(), loadPhonesPage()]);
      setTimeout(() => setPage("home"), 1300);
    } catch (_) {
      setTimeout(() => setPage("home"), 1300);
    }
  };

  const companyLabel = companyName;

  if (booting) return <Loader />;

  return (
    <div className="min-h-screen bg-[#04060f] font-sans text-white antialiased selection:bg-indigo-500/40 selection:text-white">
      {bootstrapError && (
        <div
          className="sticky top-[66px] z-[95] flex items-start justify-between gap-3 border-b border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200 backdrop-blur"
          role="alert"
        >
          <span>
            <strong className="font-semibold">API:</strong> {bootstrapError}.
            Confirm the server is running and{" "}
            <code className="rounded bg-black/40 px-1 text-amber-100">
              REACT_APP_API_URL
            </code>{" "}
            matches it.
          </span>
        </div>
      )}

      <Navbar
        page={page}
        setPage={changePageRoute}
        search={search}
        setSearch={setSearch}
        onNavigateHome={handleNavigateHomeReset}
      />

      {/* Hero — home */}
      {page === "home" && (
        <div className="border-b border-indigo-500/[0.12] bg-gradient-to-b from-indigo-500/[0.08] to-transparent px-6 pb-14 pt-[106px] text-center md:pb-14">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-500/35 bg-indigo-500/15 px-5 py-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-violet-300">
            <Sparkles size={13} strokeWidth={2} className="text-violet-400" />
            Inventory manager
          </div>
          <h1 className="mx-auto mb-4 max-w-3xl text-balance bg-gradient-to-br from-slate-100 via-violet-300 to-pink-500 bg-clip-text pb-px text-[clamp(2rem,6vw,3.125rem)] font-black leading-[1.1] tracking-tight text-transparent">
            Track your stock
          </h1>
          <p className="mx-auto max-w-lg text-base text-slate-600 md:text-[15px]">
            {meta.total} items across {(meta.byCompany || []).length} companies.
          </p>
        </div>
      )}

      {/* Add */}
      {page === "add" && (
        <div className="pt-[66px]">
          <div className="border-b border-indigo-500/[0.1] bg-gradient-to-b from-indigo-500/[0.06] to-transparent px-7 pb-10 pt-12">
            <AddPhonePage
              companyHints={companyKeys}
              phonesOnPage={phones}
              onCancel={() => changePageRoute("home")}
              onSubmitted={handleAfterAddSubmitted}
            />
          </div>
        </div>
      )}

      {page === "home" && (
        <div
          className="flex w-full flex-col gap-6 px-4 pb-14 pt-9 md:flex-row lg:gap-10 lg:px-8 xl:gap-14"
        >
          <Sidebar
            companyKeys={companyKeys}
            active={companyName}
            setActive={setCompanyName}
            counts={companyCounts}
            totalCount={meta.total}
          />
          <main className="min-w-0 flex-1">
            <>
              <div className="mb-6 flex flex-wrap items-end justify-between gap-3 border-b border-white/[0.04] pb-4">
                <div className="text-sm">
                  <span className="font-bold text-slate-100">{totalFiltered}</span>
                  <span className="text-slate-500">
                    {" "}
                    {totalFiltered === 1 ? "item" : "items"} found
                    {companyName !== "all" && (
                      <span className="text-indigo-400"> · {companyLabel}</span>
                    )}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  {listLoading && (
                    <span className="text-xs font-medium uppercase tracking-wider text-slate-600">
                      Syncing…
                    </span>
                  )}
                  {totalPages > 1 && (
                    <span className="text-[13px] text-slate-600">
                      Page {pgNum} / {totalPages}
                    </span>
                  )}
                </div>
              </div>

              {listError && (
                <div className="mb-6 rounded-xl border border-red-500/35 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                  {listError}{" "}
                  <button
                    type="button"
                    className="ml-1 font-semibold text-red-300 underline underline-offset-2 hover:text-white"
                    onClick={() => loadPhonesPage()}
                  >
                    Retry
                  </button>
                </div>
              )}

              {phones.length === 0 && !listLoading ? (
                <div className="rounded-2xl border border-white/5 px-8 py-[4.75rem] text-center">
                  <div className="mb-4 text-6xl opacity-70" aria-hidden>
                    🔍
                  </div>
                  <div className="mb-2 text-xl font-bold text-slate-500">No items match</div>
                  <p className="text-sm text-slate-700">
                    Try another search phrase or company, or widen filters.
                  </p>
                </div>
              ) : (
                <>
                  <div
                    className={`grid gap-6 sm:gap-8 [grid-template-columns:repeat(auto-fill,minmax(236px,1fr))] ${
                      listLoading ? "opacity-60" : "opacity-100"
                    }`}
                  >
                    {phones.map((p, i) => (
                      <PhoneCard
                        key={p._id}
                        phone={p}
                        idx={i}
                        onDelete={handleDelete}
                        onQuantityChange={handleQuantityChange}
                      />
                    ))}
                  </div>

                  <Pagination page={pgNum} totalPages={totalPages} setPage={setPgNum} />
                </>
              )}
            </>
          </main>
        </div>
      )}

      <footer className="border-t border-indigo-500/[0.12] px-7 py-[22px] text-center text-[12px] text-slate-800">
        <span className="bg-gradient-to-br from-indigo-500 to-pink-500 bg-clip-text font-extrabold tracking-tight text-transparent">
          MobiStock
        </span>
        <span className="text-slate-800">
          {" "}
          · Inventory · {new Date().getFullYear()}
        </span>
      </footer>

      <style>{`
        .text-balance { text-wrap: balance; }
      `}</style>
    </div>
  );
}

export default App;
