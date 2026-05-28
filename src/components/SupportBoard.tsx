import { useState, useEffect } from "react";
import { MessageSquare, Send, Heart, Loader2, Sparkles, Feather, Calendar } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Message } from "../types";

export default function SupportBoard() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [messageText, setMessageText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackError, setFeedbackError] = useState("");

  // AI gratitude letter state
  const [aiLetter, setAiLetter] = useState<string | null>(null);
  const [isGeneratingLetter, setIsGeneratingLetter] = useState(false);

  // Fetch initial messages on mount
  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const res = await fetch("/api/messages");
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages || []);
      }
    } catch (err) {
      console.error("Error fetching support messages:", err);
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!name.trim() || !messageText.trim()) {
      setFeedbackError("Please supply your name and a heartfelt message.");
      return;
    }

    setIsSubmitting(false);
    setFeedbackError("");
    setIsGeneratingLetter(true);
    setAiLetter(null);

    try {
      // 1. Post the support message to the message board
      const postRes = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          location: location.trim() || "Anonymous",
          message: messageText.trim()
        })
      });

      if (!postRes.ok) throw new Error("Faulty message post");
      const savedMsg = await postRes.json();

      // Instantly prepend message to UI state for maximum fluid responsiveness
      setMessages((prev) => [savedMsg, ...prev]);

      // 2. Fetch standard AI Reflection / Gratitude letter based on their sentiment
      const aiRes = await fetch("/api/reflect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ feedback: messageText.trim() })
      });

      if (aiRes.ok) {
        const aiData = await aiRes.json();
        setAiLetter(aiData.text || "");
      } else {
        setAiLetter("Thank you deeply for sharing your precious support. Each voice matters!");
      }

      // Reset form on success
      setName("");
      setLocation("");
      setMessageText("");
    } catch (err: any) {
      console.error(err);
      setFeedbackError("Failed submitting. Please try once again.");
    } finally {
      setIsGeneratingLetter(false);
    }
  };

  const formatDate = (isoStr: string) => {
    try {
      const d = new Date(isoStr);
      return d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
      });
    } catch (e) {
      return "Recently";
    }
  };

  return (
    <div id="support-board-container" className="space-y-8">
      {/* Upper Grid: Left Form, Right AI Gratitude Envelope */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch">
        
        {/* Write message Card */}
        <div className="md:col-span-7 rounded-2xl border border-neutral-800 bg-neutral-950/40 p-5 md:p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
              <h4 className="text-xl font-serif-sub tracking-wide text-neutral-100">
                Write a Message of Support
              </h4>
            </div>
            <p className="text-xs text-neutral-400 mb-5 leading-relaxed">
              Your encourage can inspire courage! Type a reflection or supportive note for the student, teenage mothers, and families at Hope House.
            </p>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-mono text-neutral-500 mb-1">
                    Your Name
                  </label>
                  <input
                    id="support-name-input"
                    type="text"
                    required
                    placeholder="e.g. Sarah J."
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 rounded bg-neutral-950 text-sm text-neutral-200 placeholder-neutral-700 border border-neutral-800 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-mono text-neutral-500 mb-1">
                    Location
                  </label>
                  <input
                    id="support-location-input"
                    type="text"
                    placeholder="e.g. Arvada, CO"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-3 py-2 rounded bg-neutral-950 text-sm text-neutral-200 placeholder-neutral-700 border border-neutral-800 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-widest font-mono text-neutral-500 mb-1">
                  Message Details
                </label>
                <textarea
                  id="support-message-input"
                  required
                  rows={3}
                  placeholder="Share your encouragement or write a reflection..."
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  className="w-full px-3 py-2 rounded bg-neutral-950 text-sm text-neutral-200 placeholder-neutral-700 border border-neutral-800 focus:outline-none focus:ring-1 focus:ring-amber-500 resize-none"
                />
              </div>

              {feedbackError && (
                <p className="text-xs text-rose-400 font-sans font-medium flex items-center gap-1.5">
                  <span>⚠</span> {feedbackError}
                </p>
              )}

              <button
                id="submit-support-btn"
                type="submit"
                disabled={isSubmitting || isGeneratingLetter}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-xs font-mono text-amber-400 hover:text-amber-300 font-medium transition cursor-pointer self-start disabled:opacity-50"
              >
                {isGeneratingLetter ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Analyzing & Posting...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Publish Reflection</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Dynamic AI Gratitude envelope */}
        <div className="md:col-span-5 rounded-2xl border border-neutral-800 bg-neutral-900/20 p-5 md:p-6 shadow-xl flex flex-col justify-between relative overflow-hidden">
          {/* Subtle logo bg */}
          <div className="absolute right-3 bottom-3 opacity-[0.02] transform translate-y-4 translate-x-4">
            <Feather className="w-48 h-48" />
          </div>

          <AnimatePresence mode="wait">
            {isGeneratingLetter ? (
              <motion.div
                key="generating"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center text-center h-full min-h-[180px] space-y-3"
              >
                <Feather className="w-8 h-8 text-amber-500 animate-bounce" />
                <div>
                  <span className="text-[10px] font-mono tracking-widest text-amber-400 uppercase font-semibold animate-pulse block">
                    AI Reflection In Progress
                  </span>
                  <p className="text-xs text-neutral-400 max-w-[180px] mt-1 mx-auto leading-relaxed">
                    Gemini is generating a personalized letter of gratitude for your supportive words...
                  </p>
                </div>
              </motion.div>
            ) : aiLetter ? (
              <motion.div
                key="rendered-letter"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4 flex flex-col justify-between h-full"
              >
                <div>
                  <div className="flex items-center gap-1.5 text-[10px] text-amber-400 font-mono tracking-widest uppercase mb-1 font-semibold">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Personal AI Acknowledgment</span>
                  </div>
                  <h5 className="font-serif-sub italic text-xl text-neutral-200 leading-normal border-b border-neutral-800/80 pb-2">
                    Dear Advocate,
                  </h5>
                  <p className="text-xs text-neutral-300 italic leading-relaxed mt-3 font-light">
                    "{aiLetter}"
                  </p>
                </div>

                <div className="pt-3 border-t border-dashed border-neutral-800 text-[10px] font-mono text-neutral-500 flex items-center justify-between">
                  <span>Hope House Colorado Ambassador</span>
                  <span>Reciprocal Gratitude</span>
                </div>
              </motion.div>
            ) : (
              /* IDLE / EMPTY STATE */
              <motion.div
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center text-center h-full min-h-[180px] space-y-2 p-4"
              >
                <Feather className="w-8 h-8 text-neutral-600 mb-1" />
                <span className="text-xs font-mono text-neutral-500 uppercase tracking-widest">
                  Personalized Envelope
                </span>
                <p className="text-[11px] text-neutral-500 max-w-[180px] leading-relaxed mx-auto">
                  When you submit a message, Gemini will analyze your text and write a beautiful letter in real-time.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* LOWER ROW: Scrollable message feed */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase tracking-widest font-mono text-neutral-400 flex items-center gap-1.5">
            <MessageSquare className="w-3.5 h-3.5 text-amber-500" /> Message Board Activity
          </span>
          <span className="text-xs font-mono text-neutral-500">{messages.length} Posts</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[400px] overflow-y-auto pr-2">
          <AnimatePresence initial={false}>
            {messages.map((msg, index) => (
              <motion.div
                id={`msg-card-${msg.id}`}
                key={msg.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: index * 0.05 }}
                className="rounded-xl border border-neutral-800 bg-neutral-900/30 p-4 shadow flex flex-col justify-between text-xs"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="font-bold text-neutral-200 truncate pr-2">
                      {msg.name}
                    </span>
                    <span className="text-[9px] font-mono text-neutral-500 bg-neutral-950 border border-neutral-900 px-1.5 py-0.5 rounded uppercase">
                      {msg.location || "Colorado"}
                    </span>
                  </div>
                  <p className="text-neutral-400 leading-relaxed italic mb-3">
                    "{msg.message}"
                  </p>
                </div>

                <div className="flex items-center gap-1 text-[9px] font-mono text-neutral-500/80 border-t border-neutral-900/60 pt-2 shrink-0">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{formatDate(msg.date)}</span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
