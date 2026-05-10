import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Check,
  IndianRupee,
  Plus,
  Save,
  Smartphone,
  X,
} from "lucide-react";

import * as phonesApi from "../services/phonesApi";

function Section({ label, icon: IconCmp, children }) {
  return (
    <section className="mb-8">
      <div className="mb-3.5 flex items-center gap-2">
        <span className="text-indigo-400">
          <IconCmp size={16} strokeWidth={2} />
        </span>
        <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-slate-500">
          {label}
        </span>
        <div className="ml-2 h-px flex-1 bg-indigo-500/15" />
      </div>
      {children}
    </section>
  );
}

export default function AddPhonePage({
  companyHints = [],
  phonesOnPage = [],
  onSubmitted,
  onCancel,
}) {
  const existingCompanies = useMemo(() => {
    const fromPhones = phonesOnPage.map((p) => p.companyName);
    return [...new Set([...(companyHints || []), ...fromPhones])];
  }, [companyHints, phonesOnPage]);

  const allCompanies = useMemo(() => {
    const unique = [...new Set([...existingCompanies])].filter(Boolean);
    return unique.sort((a, b) => String(a).localeCompare(String(b)));
  }, [existingCompanies]);

  const [form, setForm] = useState({
    companyName: "",
    modelName: "",
    purchaseRate: "",
    sellingRate: "",
    quantity: "",
  });
  const [customCompany, setCustomCompany] = useState("");
  const [addingCompany, setAddingCompany] = useState(false);
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [remoteError, setRemoteError] = useState("");

  // Pick a sensible default company once backend companies load.
  useEffect(() => {
    if (!allCompanies.length) return;
    setForm((f) => {
      const nextCompany =
        f.companyName && allCompanies.includes(f.companyName)
          ? f.companyName
          : allCompanies[0];
      if (nextCompany === f.companyName) return f;
      return { ...f, companyName: nextCompany };
    });
  }, [allCompanies]);

  const set = (k, v) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => ({ ...e, [k]: "" }));
    setRemoteError("");
  };

  const validate = () => {
    const e = {};
    if (!form.companyName.trim()) e.companyName = "Company name required";
    if (!form.modelName.trim()) e.modelName = "Model name required";
    if (
      form.purchaseRate === "" ||
      isNaN(form.purchaseRate) ||
      Number(form.purchaseRate) <= 0
    ) {
      e.purchaseRate = "Valid purchase rate required";
    }
    if (
      form.sellingRate === "" ||
      isNaN(form.sellingRate) ||
      Number(form.sellingRate) <= 0
    ) {
      e.sellingRate = "Valid selling rate required";
    }
    if (form.quantity === "" || isNaN(form.quantity) || Number(form.quantity) < 0) {
      e.quantity = "Valid quantity required";
    }
    return e;
  };

  const handleSubmit = async () => {
    const v = validate();
    if (Object.keys(v).length) {
      setErrors(v);
      return;
    }
    setSubmitting(true);
    setRemoteError("");
    try {
      const payload = {
        companyName: form.companyName.trim(),
        modelName: form.modelName.trim(),
        purchaseRate: Number(form.purchaseRate),
        sellingRate: Number(form.sellingRate),
        quantity: Number(form.quantity),
      };
      const res = await phonesApi.createPhone(payload);
      setSuccess(true);
      onSubmitted?.(res.data);
      setTimeout(() => {
        setSuccess(false);
      }, 1200);
    } catch (err) {
      setRemoteError(err.message || "Could not save");
    } finally {
      setSubmitting(false);
    }
  };

  const fields = [
    {
      k: "companyName",
      label: "Company name",
      ph: "e.g. Samsung",
      Icon: Smartphone,
      full: true,
    },
    {
      k: "modelName",
      label: "Model name",
      ph: "e.g. Galaxy S25",
      Icon: Smartphone,
      full: true,
    },
    {
      k: "purchaseRate",
      label: "Purchase rate (₹)",
      ph: "e.g. 45000",
      Icon: IndianRupee,
    },
    {
      k: "sellingRate",
      label: "Selling rate (₹)",
      ph: "e.g. 52000",
      Icon: IndianRupee,
    },
    {
      k: "quantity",
      label: "Quantity",
      ph: "e.g. 10",
      Icon: Plus,
    },
  ];

  return (
    <div className="animate-[fadeUp_0.4s_ease_both] mx-auto max-w-[860px]">
      <header className="mb-9 flex flex-wrap items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-400 shadow-[0_0_24px_rgba(99,102,241,0.45)]">
          <Plus size={26} strokeWidth={2.2} className="text-white" />
        </div>
        <div>
          <h1 className="text-[26px] font-black text-slate-100">Add inventory</h1>
          <p className="mt-0.5 text-sm text-slate-600">
            Connects to your API — saved on the server
          </p>
        </div>
      </header>

      {remoteError && (
        <div
          className="mb-6 rounded-xl border border-red-500/35 bg-red-500/10 px-4 py-3 text-sm text-red-400"
          role="alert"
        >
          {remoteError}
        </div>
      )}

      <div className="rounded-[24px] border border-indigo-500/20 bg-gradient-to-br from-[rgba(10,13,35,0.95)] to-[rgba(15,18,48,0.95)] p-6 shadow-2xl sm:p-8">
        {allCompanies.length > 0 && (
          <Section label="Quick pick (optional)" icon={Smartphone}>
            <div className="flex flex-wrap items-center gap-2.5">
              {allCompanies.map((c) => {
                const active = form.companyName === c;
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => set("companyName", c)}
                    className="flex items-center gap-2 rounded-xl border px-4 py-2 text-[13px] font-semibold transition-all duration-200"
                    style={{
                      borderColor: active ? "rgba(167,139,250,0.65)" : "rgba(255,255,255,0.08)",
                      background: active
                        ? "linear-gradient(135deg,rgba(99,102,241,0.25),rgba(167,139,250,0.12))"
                        : "rgba(255,255,255,0.03)",
                      color: active ? "#a78bfa" : "#9ca3af",
                      boxShadow: active ? "0 4px 16px rgba(167,139,250,0.18)" : "none",
                    }}
                  >
                    <span aria-hidden>🏢</span>
                    {c}
                  </button>
                );
              })}
              {!addingCompany ? (
                <button
                  type="button"
                  onClick={() => setAddingCompany(true)}
                  className="flex items-center gap-2 rounded-xl border border-dashed border-indigo-500/35 bg-indigo-500/10 px-4 py-2 text-[13px] font-semibold text-indigo-400 transition-colors hover:bg-indigo-500/15"
                >
                  <Plus size={15} strokeWidth={2} />
                  New company
                </button>
              ) : (
                <div className="flex flex-wrap items-center gap-2">
                  <input
                    value={customCompany}
                    onChange={(e) => setCustomCompany(e.target.value)}
                    placeholder="Company name"
                    autoFocus
                    className="w-[180px] rounded-lg border border-indigo-500/30 bg-indigo-500/10 px-3.5 py-2 text-[13px] text-white outline-none focus:border-indigo-500/50"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (customCompany.trim()) {
                        set("companyName", customCompany.trim());
                        setAddingCompany(false);
                      }
                    }}
                    className="flex rounded-lg bg-gradient-to-br from-indigo-500 to-violet-400 p-2.5 text-white"
                    aria-label="Confirm company"
                  >
                    <Check size={17} strokeWidth={2} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setAddingCompany(false)}
                    className="flex rounded-lg border border-red-500/20 bg-red-500/15 p-2.5 text-red-400"
                    aria-label="Cancel new company"
                  >
                    <X size={17} strokeWidth={2} />
                  </button>
                </div>
              )}
            </div>
          </Section>
        )}

        <Section label="Item information" icon={Smartphone}>
          <div className="grid gap-4 sm:grid-cols-2">
            {fields.map((f) => {
              const Cmp = f.Icon;
              const err = errors[f.k];
              return (
                <div
                  key={f.k}
                  className={f.full ? "sm:col-span-2" : undefined}
                >
                  <label className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    {f.label}
                  </label>
                  <div className="relative">
                    <span
                      className={`pointer-events-none absolute left-[13px] top-1/2 -translate-y-1/2 ${
                        err ? "text-red-500" : "text-slate-600"
                      }`}
                    >
                      <Cmp size={16} strokeWidth={2} />
                    </span>
                    <input
                      value={form[f.k]}
                      onChange={(e) => set(f.k, e.target.value)}
                      placeholder={f.ph}
                      className={`box-border w-full rounded-xl border px-3.5 py-2.5 pl-10 text-sm text-slate-100 outline-none transition-[border-color,box-shadow] focus:border-indigo-500/50 focus:shadow-[0_0_0_3px_rgba(99,102,241,0.08)] ${
                        err
                          ? "border-red-500/40 bg-red-500/[0.06]"
                          : "border-indigo-500/20 bg-indigo-500/[0.07]"
                      }`}
                    />
                  </div>
                  {err && (
                    <p className="mt-1 pl-1 text-[11px] text-red-500">{err}</p>
                  )}
                </div>
              );
            })}
          </div>
        </Section>

        <div className="mt-2 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={onCancel}
            disabled={submitting || success}
            className="inline-flex items-center justify-center gap-2 rounded-[13px] border border-white/10 bg-white/5 px-6 py-3.5 text-sm font-semibold text-slate-400 transition-colors hover:bg-white/10 disabled:opacity-50"
          >
            <ArrowLeft size={17} strokeWidth={2} />
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting || success}
            className={`flex flex-1 items-center justify-center gap-2 rounded-[13px] border-0 px-4 py-3.5 text-[15px] font-bold tracking-wide text-white transition-all disabled:opacity-75 ${
              success
                ? "bg-gradient-to-br from-emerald-500 to-emerald-700 shadow-[0_8px_24px_rgba(16,185,129,0.4)]"
                : "bg-gradient-to-br from-indigo-500 to-violet-400 shadow-[0_8px_24px_rgba(99,102,241,0.35)] hover:brightness-105"
            }`}
          >
            {success ? (
              <>
                <Check size={18} strokeWidth={2} />
                Added successfully!
              </>
            ) : submitting ? (
              <>Saving…</>
            ) : (
              <>
                <Save size={18} strokeWidth={2} />
                Save item
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
