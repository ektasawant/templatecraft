"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { createTemplate } from "@/lib/domain/templates/store";
import type { TemplateChannel } from "@/lib/domain/templates/types";

export default function NewTemplatePage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [channel, setChannel] = useState<TemplateChannel>("facebook");
  const [touched, setTouched] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const hasNameError = touched && name.trim().length === 0;

  const handleSubmit = () => {
    setTouched(true);
    if (!name.trim()) return;

    setSubmitting(true);

    const tpl = createTemplate({
      name: name.trim(),
      channel,
    });

    router.push(`/templates/${tpl.id}`);
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-neutral-50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-md border border-neutral-200 p-8 space-y-6">
        <header className="space-y-1">
          <h1 className="text-xl font-semibold text-neutral-900">
            New Template
          </h1>
          <p className="text-sm text-neutral-500">
            Define the basics now. You can refine the layout on the canvas
            later.
          </p>
        </header>

        <div className="space-y-1">
          <label className="text-sm font-medium text-neutral-800">
            Template name <span className="text-red-500">*</span>
          </label>
          <input
            className={`w-full rounded-lg border px-3 py-2 text-sm outline-none transition
              ${
                hasNameError
                  ? "border-red-400 focus:ring-2 focus:ring-red-200"
                  : "border-neutral-300 focus:ring-2 focus:ring-primary/30"
              }`}
            placeholder="Black Friday Ad"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={() => setTouched(true)}
          />
          {hasNameError && (
            <p className="text-xs text-red-500 mt-1">
              Name is required.
            </p>
          )}
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-neutral-800">
            Channel <span className="text-red-500">*</span>
          </label>
          <select
            className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30"
            value={channel}
            onChange={(e) => setChannel(e.target.value as TemplateChannel)}
          >
            <option value="facebook">Facebook</option>
            <option value="instagram">Instagram</option>
            <option value="linkedin">LinkedIn</option>
            <option value="twitter">Twitter</option>
          </select>
        </div>

        <div className="flex flex-col gap-2 pt-2">
          <button
            disabled={submitting}
            onClick={handleSubmit}
            className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? "Creating..." : "Create & Open Editor"}
          </button>

          <button
            type="button"
            onClick={() => router.push("/templates")}
            className="text-sm text-neutral-600 hover:text-neutral-900 hover:underline"
          >
            Cancel
          </button>
        </div>
      </div>
    </main>
  );
}
