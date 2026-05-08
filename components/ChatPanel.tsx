"use client";

import { useState, useRef, useEffect } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatPanelProps {
  pageContext: string;
}

export default function ChatPanel({ pageContext }: ChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    const newMessages: Message[] = [...messages, { role: "user", content: text }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages, pageContext }),
      });
      const data = await res.json();
      setMessages([...newMessages, { role: "assistant", content: data.content }]);
    } catch {
      setMessages([
        ...newMessages,
        { role: "assistant", content: "Error connecting to assistant. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Desktop panel */}
      <div className="hidden lg:flex flex-col w-80 flex-shrink-0 bg-bg-secondary border-l border-border">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <div>
            <div className="text-xs font-semibold text-accent-gold tracking-widest uppercase">
              AI Instructor
            </div>
            <div className="text-xs text-text-secondary">Senior RE Finance Advisor</div>
          </div>
          <div className="w-2 h-2 rounded-full bg-success-green" title="Active" />
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3">
          {messages.length === 0 && (
            <div className="text-xs text-text-secondary leading-relaxed">
              Ask me anything about {pageContext}. I use real deal numbers and real-world examples.
              No filler, no hand-holding — straight professional-level analysis.
            </div>
          )}
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`text-xs leading-relaxed ${
                msg.role === "user"
                  ? "text-text-primary bg-bg-card border border-border px-3 py-2"
                  : "text-text-secondary"
              }`}
            >
              {msg.role === "assistant" && (
                <div className="text-accent-gold text-xs font-semibold mb-1 uppercase tracking-wider">
                  Instructor
                </div>
              )}
              {msg.role === "user" && (
                <div className="text-text-secondary text-xs mb-1 uppercase tracking-wider">You</div>
              )}
              <div className="whitespace-pre-wrap">{msg.content}</div>
            </div>
          ))}
          {loading && (
            <div className="text-xs text-text-secondary animate-pulse">
              Instructor is composing a response...
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <form onSubmit={sendMessage} className="border-t border-border p-3">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question..."
              className="flex-1 bg-bg-card border border-border text-text-primary text-xs px-3 py-2 outline-none focus:border-accent-gold placeholder:text-text-secondary"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="bg-accent-gold text-bg-primary text-xs font-semibold px-3 py-2 uppercase tracking-wider hover:bg-accent-gold-light disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Send
            </button>
          </div>
        </form>
      </div>

      {/* Mobile floating button + drawer */}
      <div className="lg:hidden">
        {!open && (
          <button
            onClick={() => setOpen(true)}
            className="fixed bottom-4 right-4 bg-accent-gold text-bg-primary w-12 h-12 flex items-center justify-center text-lg font-bold shadow-lg z-50"
            title="Open AI Instructor"
          >
            AI
          </button>
        )}
        {open && (
          <div className="fixed inset-0 z-50 flex flex-col bg-bg-secondary">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <div className="text-xs font-semibold text-accent-gold tracking-widest uppercase">
                AI Instructor
              </div>
              <button
                onClick={() => setOpen(false)}
                className="text-text-secondary hover:text-text-primary text-lg"
              >
                ×
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3">
              {messages.length === 0 && (
                <div className="text-xs text-text-secondary">
                  Ask me anything about {pageContext}.
                </div>
              )}
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`text-xs leading-relaxed ${
                    msg.role === "user"
                      ? "text-text-primary bg-bg-card border border-border px-3 py-2"
                      : "text-text-secondary"
                  }`}
                >
                  {msg.role === "assistant" && (
                    <div className="text-accent-gold text-xs font-semibold mb-1">Instructor</div>
                  )}
                  <div className="whitespace-pre-wrap">{msg.content}</div>
                </div>
              ))}
              {loading && (
                <div className="text-xs text-text-secondary animate-pulse">Thinking...</div>
              )}
              <div ref={bottomRef} />
            </div>
            <form onSubmit={sendMessage} className="border-t border-border p-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask a question..."
                  className="flex-1 bg-bg-card border border-border text-text-primary text-xs px-3 py-2 outline-none focus:border-accent-gold"
                  disabled={loading}
                />
                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  className="bg-accent-gold text-bg-primary text-xs font-semibold px-3 py-2 uppercase tracking-wider disabled:opacity-40"
                >
                  Send
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </>
  );
}
