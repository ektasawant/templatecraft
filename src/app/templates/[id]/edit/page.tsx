"use client";

import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";

import {
  getTemplateById,
  updateTemplateMeta,
} from "@/lib/domain/templates/store";

import type { TemplateChannel } from "@/lib/domain/templates/types";

export default function EditTemplatePage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [name, setName] = useState("");
  const [channel, setChannel] = useState<TemplateChannel>("facebook");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const tpl = getTemplateById(id);
    if (tpl) {
      setName(tpl.name);
      setChannel(tpl.channel as TemplateChannel);
    }
    setLoaded(true);
  }, [id]);

  if (!loaded) return <div className="p-6">Loading...</div>;

  return (
    <main className="min-h-screen bg-neutral-50 p-8">
      <div className="max-w-lg mx-auto bg-white border rounded-xl shadow-sm p-6 space-y-6">

        <h1 className="text-xl font-semibold">Edit Template</h1>

        <div className="space-y-4">

          {/* NAME FIELD */}
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border rounded px-3 py-2"
              placeholder="Template name"
            />
          </div>

          {/* CHANNEL FIELD */}
          <div>
            <label className="block text-sm font-medium mb-1">Channel</label>
            <select
              value={channel}
              onChange={(e) => setChannel(e.target.value as TemplateChannel)}
              className="w-full border rounded px-3 py-2"
            >
              <option value="facebook">Facebook</option>
              <option value="instagram">Instagram</option>
              <option value="linkedin">LinkedIn</option>
              <option value="twitter">Twitter</option>
            </select>
          </div>

        </div>

        <button
          onClick={() => {
            updateTemplateMeta(id, { name, channel });
            router.push(`/templates/${id}`);
          }}
          className="w-full bg-primary text-white py-2 rounded hover:bg-primary/90"
        >
          Save
        </button>

        <button
          onClick={() => router.push(`/templates/${id}`)}
          className="w-full text-neutral-600 py-2 text-sm"
        >
          Cancel
        </button>

      </div>
    </main>
  );
}
