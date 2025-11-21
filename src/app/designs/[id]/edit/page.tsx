"use client";

import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";

import {
  getDesignById,
  updateDesignMeta,
} from "@/lib/domain/designs/store";

import type { TemplateChannel } from "@/lib/domain/templates/types";

export default function EditDesignPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [name, setName] = useState("");
  const [channel, setChannel] = useState<TemplateChannel>("facebook");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const design = getDesignById(id);
    if (design) {
      setName(design.name);
      setChannel(design.channel);
    }
    setLoaded(true);
  }, [id]);

  if (!loaded) return <div className="p-6">Loading…</div>;

  return (
    <main className="min-h-screen bg-neutral-50 p-8">
      <div className="max-w-lg mx-auto bg-white border rounded-xl shadow-sm p-6 space-y-6">
        <h1 className="text-xl font-semibold">Edit Design</h1>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Channel
            </label>
            <select
              value={channel}
              onChange={(e) =>
                setChannel(e.target.value as TemplateChannel)
              }
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
            updateDesignMeta(id, { name, channel });
            router.push(`/designs/${id}`);
          }}
          className="w-full bg-primary text-white py-2 rounded hover:bg-primary/90"
        >
          Save
        </button>

        <button
          onClick={() => router.push(`/designs/${id}`)}
          className="w-full text-neutral-600 py-2 text-sm"
        >
          Cancel
        </button>
      </div>
    </main>
  );
}
