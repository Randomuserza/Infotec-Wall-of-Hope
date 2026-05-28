import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  Flame,
  ShieldCheck,
  Share2,
  Trash2,
  Check,
} from "lucide-react";

const STORAGE_KEY = "candle-wall-of-hope-demo";

const starterCandles = [
  {
    id: 1,
    name: "All Warriors",
    type: "Warrior",
    message:
      "For every prayer, every smile, and every moment of hope you shared.",
    from: "With love",
    colour: "pink",
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    name: "All Survivors",
    type: "Survivor",
    message: "Your strength lights the way for others.",
    from: "Cancervive family",
    colour: "blue",
    createdAt: new Date().toISOString(),
  },
  {
    id: 3,
    name: "Those we carry in our hearts",
    type: "In memory",
    message: "Gone from our sight, never from our hearts.",
    from: "We Can Together",
    colour: "purple",
    createdAt: new Date().toISOString(),
  },
];

const candleColours = {
  pink: "from-pink-300 via-pink-400 to-rose-500",
  purple: "from-purple-300 via-violet-400 to-purple-600",
  blue: "from-sky-300 via-blue-400 to-indigo-500",
  gold: "from-yellow-200 via-amber-400 to-orange-500",
  white: "from-white via-slate-100 to-slate-300",
};

function Candle({ candle, onDelete, onOpen }) {
  const gradient = candleColours[candle.colour] || candleColours.gold;

  return (
    <motion.button
      type="button"
      onClick={() => onOpen(candle)}
      layout
      initial={{ opacity: 0, y: 20, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -12, scale: 0.96 }}
      className="group relative rounded-2xl bg-white/85 p-3 text-center shadow-lg ring-1 ring-white/70 backdrop-blur transition hover:-translate-y-1 hover:shadow-2xl sm:rounded-3xl sm:p-4"
    >
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onDelete(candle.id);
        }}
        className="absolute right-3 top-3 hidden rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 group-hover:block"
      >
        <Trash2 size={14} />
      </button>

      <div className="mx-auto mb-2 flex h-16 w-12 items-end justify-center sm:mb-3 sm:h-20 sm:w-14">
        <div className="relative flex h-12 w-8 items-end justify-center rounded-b-xl bg-gradient-to-b from-slate-50 to-slate-200 shadow-inner sm:h-16 sm:w-10">
          <motion.div
            animate={{
              scale: [1, 1.08, 0.96, 1],
              rotate: [-2, 2, -1, 1],
            }}
            transition={{
              duration: 1.8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className={`absolute -top-5 h-8 w-5 rounded-full bg-gradient-to-b ${gradient} shadow-[0_0_22px_rgba(251,191,36,0.7)] sm:-top-7 sm:h-10 sm:w-6`}
            style={{ borderRadius: "55% 45% 55% 45%" }}
          />
          <div className="mb-1 h-3 w-1 rounded-full bg-slate-700 sm:mb-2 sm:h-4" />
        </div>
      </div>

      <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500 sm:text-[11px]">
        {candle.type}
      </p>

      <h3 className="mt-1 line-clamp-2 text-sm font-black text-slate-900 sm:text-base">
        {candle.name}
      </h3>

      <p className="mt-1 text-[11px] text-slate-400 sm:mt-2 sm:text-xs">
        Tap to read
      </p>
    </motion.button>
  );
}

export default function CandleWallOfHope() {
  const [candles, setCandles] = useState(starterCandles);
  const [filter, setFilter] = useState("All");

  const [form, setForm] = useState({
    name: "",
    type: "Warrior",
    message: "",
    from: "",
    colour: "gold",
  });

  const [selectedCandle, setSelectedCandle] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setCandles(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(candles));
  }, [candles]);

  const filteredCandles = useMemo(() => {
    return candles.filter((candle) => {
      return filter === "All" || candle.type === filter;
    });
  }, [candles, filter]);

  const addCandle = (event) => {
    event.preventDefault();

    if (!form.name.trim() || !form.message.trim()) return;

    setCandles([
      {
        id: Date.now(),
        ...form,
        createdAt: new Date().toISOString(),
      },
      ...candles,
    ]);

    setForm({
      name: "",
      type: "Warrior",
      message: "",
      from: "",
      colour: "gold",
    });
  };

  const deleteCandle = (id) => {
    setCandles(candles.filter((candle) => candle.id !== id));
  };

  const shareLink = "https://infotec-wall-of-hope.vercel.app/";

  const copyShareLink = async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      window.prompt("Copy this link:", shareLink);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-purple-950 px-3 py-4 text-slate-900 sm:px-4 sm:py-8">
      <div className="mx-auto max-w-6xl">

        <section className="overflow-hidden rounded-3xl bg-white/10 p-4 text-white shadow-2xl ring-1 ring-white/15 backdrop-blur sm:rounded-[2rem] sm:p-6 md:p-10">

          <div className="grid gap-5 md:grid-cols-[1.2fr_0.8fr] md:items-center md:gap-8">

            <div>

              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-2 text-xs ring-1 ring-white/15 sm:mb-4 sm:px-4 sm:text-sm">
                <Heart size={16} />
                We Can Together
              </div>

              <h1 className="text-3xl font-black tracking-tight sm:text-4xl md:text-6xl">
                Candle Wall of Hope
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-white/80 sm:mt-5 sm:text-lg sm:leading-8">
                Light a candle to honour cancer survivors, warriors, and the beautiful lives we carry in our hearts.
              </p>

              <div className="mt-4 flex flex-wrap gap-2 text-xs text-white/80 sm:mt-6 sm:gap-3 sm:text-sm">

                <span className="rounded-full bg-white/10 px-4 py-2">
                  {candles.length} candles lit
                </span>

                <span className="rounded-full bg-white/10 px-4 py-2">
                  Private, gentle and respectful
                </span>

                <span className="rounded-full bg-white/10 px-4 py-2">
                  Shareable with your community
                </span>

                <span className="rounded-full bg-white/10 px-4 py-2 text-sm font-bold text-white sm:px-5 sm:text-[120%]">
                  #WeCanTogetherInfotec
                </span>

              </div>
            </div>

            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="rounded-3xl bg-white/10 p-5 text-center ring-1 ring-white/15 sm:p-6"
            >

              <Flame
                className="mx-auto mb-3 text-amber-300 sm:mb-4"
                size={54}
              />

              <p className="text-xl font-bold sm:text-2xl">
                One candle. One name. One moment of love.
              </p>

              <p className="mt-3 text-sm leading-6 text-white/70">
                Every candle tells a story.
              </p>

            </motion.div>
          </div>
        </section>

        <section className="mt-5 grid gap-5 sm:mt-8 sm:gap-6 lg:grid-cols-[360px_1fr]">

          <form
            onSubmit={addCandle}
            className="rounded-3xl bg-white p-4 shadow-xl sm:rounded-[2rem] sm:p-6"
          >

            <h2 className="text-xl font-black text-slate-900 sm:text-2xl">
              Light a candle
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Keep the message short, kind and respectful.
            </p>

            <label className="mt-5 block text-sm font-semibold">
              Name being honoured
            </label>

            <input
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
              placeholder="Example: Mom, Johan..."
              className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-base outline-none focus:ring-2 focus:ring-purple-300"
            />

            <label className="mt-4 block text-sm font-semibold">
              Candle type
            </label>

            <select
              value={form.type}
              onChange={(e) =>
                setForm({ ...form, type: e.target.value })
              }
              className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-base outline-none focus:ring-2 focus:ring-purple-300"
            >
              <option>Warrior</option>
              <option>Survivor</option>
              <option>In memory</option>
              <option>Supporter</option>
            </select>

            <label className="mt-4 block text-sm font-semibold">
              Message
            </label>

            <textarea
              value={form.message}
              onChange={(e) =>
                setForm({ ...form, message: e.target.value })
              }
              rows={4}
              maxLength={180}
              className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-base outline-none focus:ring-2 focus:ring-purple-300"
            />

            <p className="mt-1 text-right text-xs text-slate-400">
              {form.message.length}/180
            </p>

            <label className="mt-2 block text-sm font-semibold">
              From / signed by
            </label>

            <input
              value={form.from}
              onChange={(e) =>
                setForm({ ...form, from: e.target.value })
              }
              placeholder="Optional"
              className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-base outline-none focus:ring-2 focus:ring-purple-300"
            />

            <button className="mt-6 w-full rounded-2xl bg-gradient-to-r from-purple-600 to-pink-500 px-5 py-3 font-bold text-white shadow-lg hover:opacity-95 sm:py-4">
              Light this candle
            </button>

          </form>

          <div>

            <div className="mb-4 flex flex-col gap-3 rounded-3xl bg-white/90 p-3 shadow-xl sm:mb-5 sm:p-4 md:flex-row md:items-center md:justify-between">

              <div className="flex w-full flex-col gap-2 md:w-auto md:flex-row md:items-center">

                <label className="text-sm font-bold text-slate-700">
                  Show candles:
                </label>

                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-base outline-none focus:ring-2 focus:ring-purple-300 md:w-auto"
                >
                  <option>All</option>
                  <option>Warrior</option>
                  <option>Survivor</option>
                  <option>In memory</option>
                  <option>Supporter</option>
                </select>

              </div>

              <button
                type="button"
                onClick={copyShareLink}
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 font-semibold text-white md:w-auto"
              >
                {copied ? <Check size={17} /> : <Share2 size={17} />}
                {copied ? "Link copied" : "Share / Copy link"}
              </button>

            </div>

            <AnimatePresence mode="popLayout">

              {filteredCandles.length > 0 ? (

                <motion.div
                  layout
                  className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 xl:grid-cols-4"
                >

                  {filteredCandles.map((candle) => (
                    <Candle
                      key={candle.id}
                      candle={candle}
                      onDelete={deleteCandle}
                      onOpen={setSelectedCandle}
                    />
                  ))}

                </motion.div>

              ) : (
                <div className="rounded-3xl bg-white/90 p-10 text-center shadow-xl">
                  No candles found
                </div>
              )}

            </AnimatePresence>

          </div>
        </section>
      </div>

      <AnimatePresence>
        {selectedCandle && (

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-3 backdrop-blur-sm sm:p-4"
            onClick={() => setSelectedCandle(null)}
          >

            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-3xl bg-white p-5 text-center shadow-2xl sm:rounded-[2rem] sm:p-7"
            >

              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                {selectedCandle.type}
              </p>

              <h2 className="mt-2 text-xl font-black text-slate-900 sm:text-2xl">
                {selectedCandle.name}
              </h2>

              <p className="mt-4 text-sm leading-6 text-slate-600 sm:mt-5 sm:text-base sm:leading-7">
                “{selectedCandle.message}”
              </p>

              {selectedCandle.from && (
                <p className="mt-5 text-sm font-medium text-slate-500">
                  — {selectedCandle.from}
                </p>
              )}

              <button
                onClick={() => setSelectedCandle(null)}
                className="mt-7 rounded-2xl bg-slate-900 px-6 py-3 font-bold text-white"
              >
                Close
              </button>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
