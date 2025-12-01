"use client";

import React, { useState } from "react";

type FormState = {
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  capacity: string;
  posterUrl: string;
  createdBy: string;
};

export default function HomePage() {
  const [form, setForm] = useState<FormState>({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    capacity: "1",
    posterUrl: "",
    createdBy: "",
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function onChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  }

  function validate(): string | null {
    if (!form.title.trim()) return "Title is required";
    if (!form.description.trim()) return "Description is required";
    if (!form.date) return "Date is required";
    if (!form.time) return "Time is required";
    if (!form.location.trim()) return "Location is required";
    const cap = Number(form.capacity);
    if (Number.isNaN(cap) || cap <= 0) return "Capacity must be a positive number";
    if (!form.createdBy.trim()) return "CreatedBy is required";
    return null;
  }

  async function handleSubmit(e?: React.FormEvent<HTMLFormElement>) {
    if (e) e.preventDefault();
    setError(null);
    setResult(null);

    const v = validate();
    if (v) {
      setError(v);
      return;
    }

    setLoading(true);
    try {
      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        date: form.date,
        time: form.time,
        location: form.location.trim(),
        capacity: Number(form.capacity),
        posterUrl: form.posterUrl.trim(),
        createdBy: form.createdBy.trim(),
      };

      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const raw = (await res.json()) as unknown;
      const parsed = typeof raw === "object" && raw !== null ? (raw as Record<string, unknown>) : {};
      const out = JSON.stringify(parsed, null, 2);

      if (!res.ok) {
        setError(typeof parsed?.error === "string" ? parsed.error : "Server error");
        setResult(out);
      } else {
        setResult(out);
        setError(null);
        setForm({
          title: "",
          description: "",
          date: "",
          time: "",
          location: "",
          capacity: "1",
          posterUrl: "",
          createdBy: "",
        });
      }
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("Unknown error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Create Event</h1>

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div>
          <label className="block text-sm font-medium">Title</label>
          <input name="title" value={form.title} onChange={onChange} className="mt-1 block w-full rounded border px-3 py-2" />
        </div>

        <div>
          <label className="block text-sm font-medium">Description</label>
          <textarea name="description" value={form.description} onChange={onChange} className="mt-1 block w-full rounded border px-3 py-2" rows={4} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Date</label>
            <input name="date" type="date" value={form.date} onChange={onChange} className="mt-1 block w-full rounded border px-3 py-2" />
          </div>

          <div>
            <label className="block text-sm font-medium">Time</label>
            <input name="time" type="time" value={form.time} onChange={onChange} className="mt-1 block w-full rounded border px-3 py-2" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium">Location</label>
          <input name="location" value={form.location} onChange={onChange} className="mt-1 block w-full rounded border px-3 py-2" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Capacity</label>
            <input name="capacity" type="number" min={1} value={form.capacity} onChange={onChange} className="mt-1 block w-full rounded border px-3 py-2" />
          </div>

          <div>
            <label className="block text-sm font-medium">Poster URL</label>
            <input name="posterUrl" value={form.posterUrl} onChange={onChange} className="mt-1 block w-full rounded border px-3 py-2" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium">Created By (organizer id)</label>
          <input name="createdBy" value={form.createdBy} onChange={onChange} className="mt-1 block w-full rounded border px-3 py-2" />
        </div>

        <div className="flex items-center gap-3">
          <button type="submit" disabled={loading} className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-60">
            {loading ? "Creating..." : "Create Event"}
          </button>

          <button type="button" onClick={() => { setForm({ title: "", description: "", date: "", time: "", location: "", capacity: "1", posterUrl: "", createdBy: "" }); setResult(null); setError(null); }} className="bg-gray-200 px-3 py-2 rounded">
            Reset
          </button>
        </div>
      </form>

      {error && <div className="mt-4 p-3 bg-red-200 text-red-800 rounded">{error}</div>}

      {result && <pre className="mt-4 bg-gray-100 p-3 rounded whitespace-pre-wrap text-sm">{result}</pre>}
    </main>
  );
}
