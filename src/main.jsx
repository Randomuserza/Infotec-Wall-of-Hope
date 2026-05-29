import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, Search, Share2 } from "lucide-react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const candleColours = {
  pink: "from-[#EC008C] via-[#EC008C] to-[#7C2FC4]",
  purple: "from-[#7C2FC4] via-[#6D28D9] to-[#4C1D95]",
  blue: "from-[#00AEEF] via-[#0284C7] to-[#7C2FC4]",
  gold: "from-[#FFD166] via-[#F59E0B] to-[#EC008C]",
  white: "from-white via-sky-100 to-[#00AEEF]",
};

function Candle({ candle }) {
  const gradient = candleColours[candle.colour] || candleColours.gold;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -12, scale: 0.96 }}
      className="rounded-3xl bg-white/95 p-5 shadow-lg ring-1 ring-white/80 backdrop-blur"
    >
      <div className="mx-auto mb-4 flex h-24 w-18 items-end justify-center">
        <div className="relative flex h-20 w-12 items-end justify-center rounded-b-2xl bg-gradient-to-b from-white to-pink-50 shadow-inner">
          <motion.div
            animate={{ scale: [1, 1.08, 0.96, 1], rotate: [-2, 2, -1, 1] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            className={`absolute -top-7 h-10 w-7 rounded-full bg-gradient-to-b ${gradient} shadow-[0_0_35px_rgba(236,0,140,0.55)]`}
            style={{ borderRadius: "55% 45% 55% 45%" }}
          />
          <div className="mb-2 h-5 w-1 rounded-full bg-[#4A4A55]" />
        </div>
      </div>

      <div className="text-center">
        <p className="text-xs font-semibold uppercase tracking-wide text-[#7C2FC4]">
          {candle.candle_type}
        </p>
        <h3 className="mt-1 text-lg font-black text-[#4A4A55]">{candle.name}</h3>
        <p className="mt-3 text-sm leading-6 text-[#4A4A55]">“{candle.message}”</p>
        {candle.from_name && (
          <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-[#EC008C]">
            — {candle.from_name}
          </p>
        )}
      </div>
    </motion.div>
  );
}

function App() {
  const [candles, setCandles] = useState([]);
  const [query, setQuery] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  const [form, setForm] = useState({
    name: "",
    type: "Warrior",
    message: "",
    from: "",
    colour: "gold",
  });

  async function loadCandles() {
    const { data, error } = await supabase
      .from("candles")
      .select("*")
      .eq("approved", true)
      .order("created_at", { ascending: false });

    if (error) {
      setStatusMessage("Could not load candles yet. Please check the database connection.");
      return;
    }

    setCandles(data || []);
  }

  useEffect(() => {
    loadCandles();
  }, []);

  const addCandle = async (event) => {
    event.preventDefault();

    if (!form.name.trim() || !form.message.trim()) {
      setStatusMessage("Please add a name and a short message.");
      return;
    }

    const { error } = await supabase.from("candles").insert([
      {
        name: form.name.trim(),
        candle_type: form.type,
        message: form.message.trim(),
        from_name: form.from.trim(),
        colour: form.colour,
        approved: true,
      },
    ]);

    if (error) {
      setStatusMessage("Something went wrong. Please try again.");
      return;
    }

    setStatusMessage("Your candle has been lit 🕯️");
    setForm({ name: "", type: "Warrior", message: "", from: "", colour: "gold" });
    loadCandles();
  };

  const filteredCandles = useMemo(() => {
    return candles.filter((candle) =>
      `${candle.name} ${candle.message} ${candle.from_name || ""}`
        .toLowerCase()
        .includes(query.toLowerCase())
    );
  }, [candles, query]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#EC008C] via-[#7C2FC4] to-[#00AEEF] px-4 py-8 text-[#4A4A55]">
      <div className="mx-auto max-w-6xl">
        <section className="overflow-hidden rounded-[2rem] bg-white/95 p-6 text-[#4A4A55] shadow-2xl ring-1 ring-white/80 backdrop-blur md:p-10">
          <div className="grid gap-8 md:grid-cols-[1.2fr_0.8fr] md:items-center">
            <div>
              <div className="mb-5 flex flex-wrap items-center gap-4">
                <img
                  src="/cancervive-logo.png"
                  alt="Cancervive logo"
                  className="h-20 w-auto rounded-xl bg-white p-2 shadow-md"
                />
                <div className="rounded-full bg-[#EC008C] px-4 py-2 text-sm font-bold text-white">
                  #WeCanTogetherInfotec
                </div>
              </div>

              <h1 className="text-4xl font-black tracking-tight text-[#7C2FC4] md:text-6xl">
                Infotec Wall of Hope
              </h1>

              <p className="mt-5 max-w-2xl text-lg font-semibold leading-8 text-[#4A4A55]">
                A virtual space created as part of #WeCanTogetherInfotec, where we can light a candle
                to honour cancer survivors, warriors, loved ones remembered, and everyone touched by cancer.
              </p>

              <div className="mt-6 flex flex-wrap gap-3 text-sm font-bold text-white">
                <span className="rounded-full bg-[#EC008C] px-4 py-2">{candles.length} candles lit</span>
                <span className="rounded-full bg-[#7C2FC4] px-4 py-2">Private, gentle and respectful</span>
                <span className="rounded-full bg-[#00AEEF] px-4 py-2">Shareable with your community</span>
              </div>
            </div>

            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="rounded-3xl bg-gradient-to-br from-[#EC008C]/10 via-[#7C2FC4]/10 to-[#00AEEF]/10 p-6 text-center ring-1 ring-[#EC008C]/20"
            >
              <Flame className="mx-auto mb-4 text-[#EC008C]" size={70} />
              <p className="text-2xl font-black leading-tight text-[#4A4A55]">
                One candle. One name. One moment of love.
              </p>
            </motion.div>
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[360px_1fr]">
          <form onSubmit={addCandle} className="rounded-[2rem] bg-white/95 p-6 shadow-xl">
            <h2 className="text-2xl font-black text-[#4A4A55]">Light a candle</h2>
            <p className="mt-2 text-sm font-semibold leading-6 text-[#4A4A55]/75">
              Keep the message short, kind and respectful.
            </p>

            <label className="mt-5 block text-sm font-bold text-[#4A4A55]">Name being honoured</label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Example: Mom, Johan, All survivors..."
              className="mt-2 w-full rounded-2xl border border-[#EC008C]/20 px-4 py-3 outline-none focus:ring-2 focus:ring-[#EC008C]/40"
            />

            <label className="mt-4 block text-sm font-bold text-[#4A4A55]">Candle type</label>
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              className="mt-2 w-full rounded-2xl border border-[#7C2FC4]/20 px-4 py-3 outline-none focus:ring-2 focus:ring-[#7C2FC4]/40"
            >
              <option>Warrior</option>
              <option>Survivor</option>
              <option>In memory</option>
              <option>Supporter</option>
            </select>

            <label className="mt-4 block text-sm font-bold text-[#4A4A55]">Message</label>
            <textarea
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              placeholder="Write a short message..."
              rows={4}
              maxLength={180}
              className="mt-2 w-full rounded-2xl border border-[#00AEEF]/25 px-4 py-3 outline-none focus:ring-2 focus:ring-[#00AEEF]/40"
            />
            <p className="mt-1 text-right text-xs text-[#4A4A55]/60">{form.message.length}/180</p>

            <label className="mt-2 block text-sm font-bold text-[#4A4A55]">From / signed by</label>
            <input
              value={form.from}
              onChange={(e) => setForm({ ...form, from: e.target.value })}
              placeholder="Optional"
              className="mt-2 w-full rounded-2xl border border-[#EC008C]/20 px-4 py-3 outline-none focus:ring-2 focus:ring-[#EC008C]/40"
            />

            <label className="mt-4 block text-sm font-bold text-[#4A4A55]">Candle colour</label>
            <div className="mt-3 flex flex-wrap gap-2">
              {Object.keys(candleColours).map((colour) => (
                <button
                  type="button"
                  key={colour}
                  onClick={() => setForm({ ...form, colour })}
                  className={`rounded-full px-4 py-2 text-sm capitalize ring-1 ${
                    form.colour === colour
                      ? "bg-[#EC008C] text-white ring-[#EC008C]"
                      : "bg-white text-[#4A4A55] ring-[#EC008C]/20"
                  }`}
                >
                  {colour}
                </button>
              ))}
            </div>

            <button className="mt-6 w-full rounded-2xl bg-gradient-to-r from-[#7C2FC4] to-[#EC008C] px-5 py-4 font-black text-white shadow-lg hover:opacity-95">
              Light this candle
            </button>

            {statusMessage && (
              <div className="mt-5 rounded-2xl bg-[#EC008C]/10 p-4 text-sm font-semibold leading-6 text-[#4A4A55]">
                {statusMessage}
              </div>
            )}

            <div className="mt-5 rounded-2xl bg-[#00AEEF]/10 p-4 text-sm font-semibold leading-6 text-[#4A4A55]">
              Every candle shared here represents love, remembrance, support and hope.
            </div>
          </form>

          <div>
            <div className="mb-5 flex flex-col gap-3 rounded-[2rem] bg-white/95 p-4 shadow-xl md:flex-row md:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-3.5 text-[#7C2FC4]" size={18} />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search candles..."
                  className="w-full rounded-2xl border border-[#7C2FC4]/20 py-3 pl-11 pr-4 outline-none focus:ring-2 focus:ring-[#7C2FC4]/40"
                />
              </div>

              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  alert("Link copied to clipboard");
                }}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#4A4A55] px-4 py-3 font-bold text-white"
              >
                <Share2 size={17} /> Copy Link
              </button>
            </div>

            <AnimatePresence mode="popLayout">
              {filteredCandles.length > 0 ? (
                <motion.div layout className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  {filteredCandles.map((candle) => (
                    <Candle key={candle.id} candle={candle} />
                  ))}
                </motion.div>
              ) : (
                <div className="rounded-[2rem] bg-white/95 p-10 text-center shadow-xl">
                  <p className="text-lg font-black text-[#4A4A55]">No candles found</p>
                  <p className="mt-2 font-semibold text-[#4A4A55]/70">
                    Light the first candle or try another search.
                  </p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </section>

        <section className="mt-12 overflow-hidden rounded-[2rem] bg-gradient-to-r from-[#EC008C] via-[#7C2FC4] to-[#00AEEF] p-8 text-white shadow-2xl">
          <div className="mx-auto max-w-4xl text-center">
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.3em] text-white/80">
              #WeCanTogetherInfotec
            </p>
            <h2 className="text-3xl font-black md:text-5xl">No one fights cancer alone.</h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg font-semibold leading-8 text-white/90">
              Thank you for lighting a candle, sharing a memory, supporting a warrior, or simply standing
              with those affected by cancer.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <div className="rounded-full bg-white/20 px-5 py-3 font-bold backdrop-blur">💜 Hope</div>
              <div className="rounded-full bg-white/20 px-5 py-3 font-bold backdrop-blur">🩷 Support</div>
              <div className="rounded-full bg-white/20 px-5 py-3 font-bold backdrop-blur">💙 Remembrance</div>
              <div className="rounded-full bg-white/20 px-5 py-3 font-bold backdrop-blur">🕯 Together</div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
