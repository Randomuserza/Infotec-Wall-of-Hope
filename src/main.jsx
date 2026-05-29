import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { createClient } from '@supabase/supabase-js';
import { Flame, Heart, Search, Share2, ShieldCheck, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

const candleColours = {
  gold: 'from-[#FFD166] via-[#F59E0B] to-[#EC008C]',
  pink: 'from-[#EC008C] via-[#EC008C] to-[#7C2FC4]',
  purple: 'from-[#7C2FC4] via-[#6D28D9] to-[#4C1D95]',
  blue: 'from-[#00AEEF] via-[#0284C7] to-[#7C2FC4]',
  white: 'from-white via-sky-100 to-[#00AEEF]'
};

function App() {
  const [candles, setCandles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('All');
  const [selectedCandle, setSelectedCandle] = useState(null);

  const [form, setForm] = useState({
    honoured_name: '',
    candle_type: 'Warrior',
    message: '',
    from_name: '',
    colour: 'gold'
  });

  async function loadCandles() {
    if (!supabase) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('candles')
      .select('*')
      .eq('approved', true)
      .order('created_at', { ascending: false });

    if (!error) setCandles(data || []);
    setLoading(false);
  }

  useEffect(() => {
    loadCandles();
  }, []);

  async function addCandle(e) {
    e.preventDefault();
    setSubmitted(false);

    const clean = {
      honoured_name: form.honoured_name.trim(),
      candle_type: form.candle_type,
      message: form.message.trim(),
      from_name: form.from_name.trim(),
      colour: form.colour,
      approved: false
    };

    if (!clean.honoured_name || !clean.message) return;

    const { error } = await supabase.from('candles').insert(clean);

    if (error) {
      alert('Something went wrong. Please try again.');
      console.error(error);
      return;
    }

    setForm({
      honoured_name: '',
      candle_type: 'Warrior',
      message: '',
      from_name: '',
      colour: 'gold'
    });

    setSubmitted(true);
  }

  const filteredCandles = useMemo(() => {
    return candles.filter((c) => {
      const haystack = `${c.honoured_name} ${c.message} ${c.from_name}`.toLowerCase();
      const matchesSearch = haystack.includes(query.toLowerCase());
      const matchesType = filter === 'All' || c.candle_type === filter;
      return matchesSearch && matchesType;
    });
  }, [candles, query, filter]);

  const shareText = encodeURIComponent(
    'I visited the Infotec Wall of Hope. Light a candle for someone you love.'
  );

  if (!supabase) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-[#EC008C] via-[#7C2FC4] to-[#00AEEF] flex items-center justify-center px-4">
        <div className="rounded-[2rem] bg-white/95 p-8 text-center shadow-2xl">
          <h1 className="text-3xl font-black text-[#7C2FC4]">Almost there 💛</h1>
          <p className="mt-3 font-semibold text-[#4A4A55]">
            Your Supabase keys still need to be added in Vercel environment variables.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#EC008C] via-[#7C2FC4] to-[#00AEEF] px-4 py-8 text-[#4A4A55]">
      <div className="mx-auto max-w-6xl">
        <section className="rounded-[2rem] bg-white/95 p-6 shadow-2xl md:p-10">
          <div className="grid gap-8 md:grid-cols-[1.2fr_0.8fr] md:items-center">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-[#EC008C] px-4 py-2 text-sm font-bold text-white">
                <Heart size={16} /> #WeCanTogetherInfotec
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
              transition={{ duration: 4, repeat: Infinity }}
              className="rounded-3xl bg-gradient-to-br from-[#EC008C]/10 via-[#7C2FC4]/10 to-[#00AEEF]/10 p-6 text-center ring-1 ring-[#EC008C]/20"
            >
              <Flame className="mx-auto mb-4 text-[#EC008C]" size={72} />
              <h2 className="text-2xl font-black leading-tight text-[#4A4A55]">
                One candle. One name. One moment of love.
              </h2>
            </motion.div>
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[360px_1fr]">
          <form onSubmit={addCandle} className="rounded-[2rem] bg-white/95 p-6 shadow-xl">
            <h2 className="text-2xl font-black text-[#4A4A55]">Light a candle</h2>
            <p className="mt-2 text-sm font-semibold leading-6 text-[#4A4A55]/75">
              Keep it short, kind and respectful.
            </p>

            <label className="mt-5 block text-sm font-bold">Name being honoured *</label>
            <input
              value={form.honoured_name}
              onChange={(e) => setForm({ ...form, honoured_name: e.target.value })}
              placeholder="Example: Mom, Johan, All survivors"
              className="mt-2 w-full rounded-2xl border border-[#EC008C]/20 px-4 py-3 outline-none focus:ring-2 focus:ring-[#EC008C]/40"
            />

            <label className="mt-4 block text-sm font-bold">Candle type</label>
            <select
              value={form.candle_type}
              onChange={(e) => setForm({ ...form, candle_type: e.target.value })}
              className="mt-2 w-full rounded-2xl border border-[#7C2FC4]/20 px-4 py-3 outline-none focus:ring-2 focus:ring-[#7C2FC4]/40"
            >
              <option>Warrior</option>
              <option>Survivor</option>
              <option>In memory</option>
              <option>Supporter</option>
            </select>

            <label className="mt-4 block text-sm font-bold">Message *</label>
            <textarea
              rows="4"
              maxLength="180"
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              placeholder="Write a short message..."
              className="mt-2 w-full rounded-2xl border border-[#00AEEF]/25 px-4 py-3 outline-none focus:ring-2 focus:ring-[#00AEEF]/40"
            />

            <p className="mt-1 text-right text-xs text-[#4A4A55]/60">{form.message.length}/180</p>

            <label className="mt-2 block text-sm font-bold">From / signed by</label>
            <input
              value={form.from_name}
              onChange={(e) => setForm({ ...form, from_name: e.target.value })}
              placeholder="Optional"
              className="mt-2 w-full rounded-2xl border border-[#EC008C]/20 px-4 py-3 outline-none focus:ring-2 focus:ring-[#EC008C]/40"
            />

            <label className="mt-4 block text-sm font-bold">Candle colour</label>
            <div className="mt-3 flex flex-wrap gap-2">
              {['gold', 'pink', 'purple', 'blue', 'white'].map((colour) => (
                <button
                  key={colour}
                  type="button"
                  onClick={() => setForm({ ...form, colour })}
                  className={`rounded-full px-4 py-2 text-sm capitalize ring-1 ${
                    form.colour === colour
                      ? 'bg-[#EC008C] text-white ring-[#EC008C]'
                      : 'bg-white text-[#4A4A55] ring-[#EC008C]/20'
                  }`}
                >
                  {colour}
                </button>
              ))}
            </div>

            <button className="mt-6 w-full rounded-2xl bg-gradient-to-r from-[#7C2FC4] to-[#EC008C] px-5 py-4 font-black text-white shadow-lg">
              Light this candle
            </button>

            {submitted && (
              <div className="mt-5 rounded-2xl bg-[#EC008C]/10 p-4 text-sm font-semibold text-[#4A4A55]">
                Thank you 💛 Your candle was submitted and will appear once approved.
              </div>
            )}

            <div className="mt-5 flex gap-2 rounded-2xl bg-[#00AEEF]/10 p-4 text-sm font-semibold leading-6 text-[#4A4A55]">
              <ShieldCheck size={18} /> This version uses moderation, so new candles do not appear publicly until approved.
            </div>
          </form>

          <section>
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

              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="rounded-2xl border border-[#7C2FC4]/20 px-4 py-3 outline-none focus:ring-2 focus:ring-[#7C2FC4]/40"
              >
                <option>All</option>
                <option>Warrior</option>
                <option>Survivor</option>
                <option>In memory</option>
                <option>Supporter</option>
              </select>

              <a
                href={`https://wa.me/?text=${shareText}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#4A4A55] px-4 py-3 font-bold text-white"
              >
                <Share2 size={17} /> Share
              </a>
            </div>

            {loading ? (
              <div className="rounded-[2rem] bg-white/95 p-10 text-center font-black shadow-xl">
                Loading candles...
              </div>
            ) : (
              <AnimatePresence mode="popLayout">
                {filteredCandles.length ? (
                  <motion.div layout className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                    {filteredCandles.map((candle) => (
                      <CandleCard
                        key={candle.id}
                        candle={candle}
                        onClick={() => setSelectedCandle(candle)}
                      />
                    ))}
                  </motion.div>
                ) : (
                  <div className="rounded-[2rem] bg-white/95 p-10 text-center shadow-xl">
                    No candles showing yet. Once approved, candles will appear here.
                  </div>
                )}
              </AnimatePresence>
            )}
          </section>
        </section>

        <section className="mt-12 rounded-[2rem] bg-gradient-to-r from-[#EC008C] via-[#7C2FC4] to-[#00AEEF] p-8 text-center text-white shadow-2xl">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.3em] text-white/80">
            #WeCanTogetherInfotec
          </p>
          <h2 className="text-3xl font-black md:text-5xl">No one fights cancer alone.</h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg font-semibold leading-8 text-white/90">
            Thank you for lighting a candle, sharing a memory, supporting a warrior, or simply standing
            with those affected by cancer.
          </p>
        </section>
      </div>

      <AnimatePresence>
        {selectedCandle && (
          <CandleModal candle={selectedCandle} onClose={() => setSelectedCandle(null)} />
        )}
      </AnimatePresence>
    </main>
  );
}

function FlameIcon({ colour }) {
  const gradient = candleColours[colour] || candleColours.gold;

  return (
    <div className="mx-auto flex h-28 items-end justify-center">
      <div className="relative h-16 w-12 rounded-b-2xl bg-gradient-to-b from-white to-pink-50 shadow-inner">
        <div className="absolute left-1/2 top-[-40px] h-14 w-9 -translate-x-1/2">
          <motion.div
            animate={{
              scale: [1, 1.13, 0.96, 1.08, 1],
              rotate: [-4, 3, -2, 2, -3],
              x: [0, 1, -1, 1, 0]
            }}
            transition={{ duration: 1.35, repeat: Infinity, ease: 'easeInOut' }}
            className={`absolute inset-0 bg-gradient-to-b ${gradient} shadow-[0_0_32px_rgba(236,0,140,0.65)]`}
            style={{ borderRadius: '70% 30% 55% 45% / 65% 45% 55% 35%' }}
          />

          <motion.div
            animate={{
              scale: [1, 0.85, 1.05, 0.9, 1],
              y: [0, 1, -1, 0]
            }}
            transition={{ duration: 1.05, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute left-1/2 top-5 h-6 w-4 -translate-x-1/2 bg-white/90"
            style={{ borderRadius: '70% 30% 55% 45% / 65% 45% 55% 35%' }}
          />
        </div>

        <div className="absolute left-1/2 top-[-5px] h-5 w-1 -translate-x-1/2 rounded-full bg-[#4A4A55]" />
      </div>
    </div>
  );
}

function CandleCard({ candle, onClick }) {
  return (
    <motion.button
      type="button"
      layout
      onClick={onClick}
      initial={{ opacity: 0, y: 18, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.96 }}
      whileHover={{ y: -5, scale: 1.02 }}
      className="rounded-3xl bg-white/95 p-6 text-center shadow-lg ring-1 ring-white/80 transition hover:shadow-2xl"
    >
      <FlameIcon colour={candle.colour} />

      <p className="mt-3 text-xs font-black uppercase tracking-wide text-[#EC008C]">
        {candle.candle_type}
      </p>

      <h3 className="mt-2 text-xl font-black leading-tight text-[#4A4A55]">
        {candle.honoured_name}
      </h3>

      <p className="mt-3 text-xs font-semibold text-[#7C2FC4]">
        Click to view message
      </p>
    </motion.button>
  );
}

function CandleModal({ candle, onClose }) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 px-4 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md rounded-[2rem] bg-white p-7 text-center shadow-2xl"
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full bg-[#4A4A55]/10 p-2 text-[#4A4A55]"
        >
          <X size={18} />
        </button>

        <FlameIcon colour={candle.colour} />

        <p className="mt-2 text-sm font-black uppercase tracking-wide text-[#EC008C]">
          {candle.candle_type}
        </p>

        <h2 className="mt-2 text-3xl font-black text-[#4A4A55]">
          {candle.honoured_name}
        </h2>

        <p className="mt-5 text-lg font-semibold leading-8 text-[#4A4A55]">
          “{candle.message}”
        </p>

        {candle.from_name && (
          <p className="mt-5 text-sm font-black uppercase tracking-wide text-[#7C2FC4]">
            — {candle.from_name}
          </p>
        )}

        <button
          onClick={onClose}
          className="mt-7 rounded-2xl bg-gradient-to-r from-[#7C2FC4] to-[#EC008C] px-6 py-3 font-black text-white"
        >
          Close
        </button>
      </motion.div>
    </motion.div>
  );
}

createRoot(document.getElementById('root')).render(<App />);
