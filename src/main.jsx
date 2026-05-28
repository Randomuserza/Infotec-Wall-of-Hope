import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { createClient } from '@supabase/supabase-js';
import { Flame, Heart, Search, Share2, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './style.css';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

const colourClass = {
  gold: 'flame-gold',
  pink: 'flame-pink',
  purple: 'flame-purple',
  blue: 'flame-blue',
  white: 'flame-white'
};

function App() {
  const [candles, setCandles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('All');
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
    'I visited the Candle Wall of Hope. Light a candle for someone you love.'
  );

  if (!supabase) {
    return (
      <main className="page centered">
        <div className="error-card">
          <h1>Almost there 💛</h1>
          <p>Your Supabase keys still need to be added in Vercel environment variables.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="page">
      <section className="hero">
        <div>
          <div className="pill">
            <Heart size={16} /> We Can Together
          </div>

          <h1>Candle Wall of Hope</h1>

          <p className="hero-text">
            Light a candle to honour cancer survivors, warriors, and the beautiful lives we carry in our hearts.
          </p>

          <div className="stats">
            <span>{candles.length} candles lit</span>
            <span>Messages are approved before appearing</span>
          </div>
        </div>

        <motion.div
          className="hero-card"
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          <Flame size={72} />
          <h2>One candle. One name. One moment of love.</h2>
          <p>A quiet online space for remembrance, encouragement and hope.</p>
        </motion.div>
      </section>

      <section className="content-grid">
        <form onSubmit={addCandle} className="form-card">
          <h2>Light a candle</h2>
          <p>Keep it short, kind and respectful.</p>

          <label>Name being honoured *</label>
          <input
            value={form.honoured_name}
            onChange={(e) => setForm({ ...form, honoured_name: e.target.value })}
            placeholder="Example: Mom, Johan, All survivors"
          />

          <label>Candle type</label>
          <select
            value={form.candle_type}
            onChange={(e) => setForm({ ...form, candle_type: e.target.value })}
          >
            <option>Warrior</option>
            <option>Survivor</option>
            <option>In memory</option>
            <option>Supporter</option>
          </select>

          <label>Message *</label>
          <textarea
            rows="4"
            maxLength="180"
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            placeholder="Write a short message..."
          />

          <small>{form.message.length}/180</small>

          <label>From / signed by</label>
          <input
            value={form.from_name}
            onChange={(e) => setForm({ ...form, from_name: e.target.value })}
            placeholder="Optional"
          />

          <label>Candle colour</label>
          <div className="colour-buttons">
            {['gold', 'pink', 'purple', 'blue', 'white'].map((colour) => (
              <button
                key={colour}
                type="button"
                className={form.colour === colour ? 'active' : ''}
                onClick={() => setForm({ ...form, colour })}
              >
                {colour}
              </button>
            ))}
          </div>

          <button className="submit-button">Light this candle</button>

          {submitted && (
            <div className="success">
              Thank you 💛 Your candle was submitted and will appear once approved.
            </div>
          )}

          <div className="note">
            <ShieldCheck size={18} /> This version uses moderation, so new candles do not appear publicly until approved.
          </div>
        </form>

        <section>
          <div className="toolbar">
            <div className="search-box">
              <Search size={18} />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search candles..."
              />
            </div>

            <select value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option>All</option>
              <option>Warrior</option>
              <option>Survivor</option>
              <option>In memory</option>
              <option>Supporter</option>
            </select>

            <a className="share" href={`https://wa.me/?text=${shareText}`} target="_blank">
              <Share2 size={17} /> Share
            </a>
          </div>

          {loading ? (
            <div className="empty">Loading candles...</div>
          ) : (
            <AnimatePresence>
              {filteredCandles.length ? (
                <div className="candle-grid">
                  {filteredCandles.map((c) => (
                    <Candle key={c.id} candle={c} />
                  ))}
                </div>
              ) : (
                <div className="empty">
                  No candles showing yet. Once approved, candles will appear here.
                </div>
              )}
            </AnimatePresence>
          )}
        </section>
      </section>
    </main>
  );
}

function Candle({ candle }) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="candle-card"
    >
      <div className="candle">
        <motion.div
          className={`flame ${colourClass[candle.colour] || 'flame-gold'}`}
          animate={{ scale: [1, 1.08, 0.96, 1], rotate: [-2, 2, -1, 1] }}
          transition={{ duration: 1.8, repeat: Infinity }}
        />
        <div className="wax">
          <div className="wick" />
        </div>
      </div>

      <p className="type">{candle.candle_type}</p>
      <h3>{candle.honoured_name}</h3>
      <p className="message">“{candle.message}”</p>

      {candle.from_name && <p className="from">— {candle.from_name}</p>}
    </motion.article>
  );
}

createRoot(document.getElementById('root')).render(<App />);
