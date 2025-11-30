// api/save-note.js
import { kv } from "@vercel/kv";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  const { text } = req.body || {};
  if (!text || !text.trim()) {
    return res.status(400).json({ ok: false, error: "Empty note" });
  }

  const now = new Date().toISOString().replace("T", " ").slice(0, 19);

  const note = {
    ts: now,
    text: text.trim(),
  };

  try {
    // list key: "blx:notes"
    await kv.rpush("blx:notes", JSON.stringify(note));
    return res.json({ ok: true });
  } catch (err) {
    console.error("KV error:", err);
    return res.status(500).json({ ok: false, error: "KV write failed" });
  }
}
