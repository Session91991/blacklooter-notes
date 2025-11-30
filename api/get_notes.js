// api/get-notes.js
import { kv } from "@vercel/kv";

export default async function handler(req, res) {
  try {
    const raw = await kv.lrange("blx:notes", 0, -1); // all list
    const notes = (raw || []).map((s) => {
      try {
        return JSON.parse(s);
      } catch {
        return { ts: "??", text: String(s) };
      }
    });
    return res.json({ ok: true, notes });
  } catch (err) {
    console.error("KV read error:", err);
    return res.status(500).json({ ok: false, error: "KV read failed" });
  }
}