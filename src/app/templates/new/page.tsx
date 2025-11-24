"use client";

import { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { createTemplate } from "@/lib/domain/templates/store";
import type { TemplateChannel } from "@/lib/domain/templates/types";

type FormState = {
  name: string;
  channel: TemplateChannel;
};

const channelOptions: { value: TemplateChannel; label: string }[] = [
  { value: "facebook", label: "Facebook" },
  { value: "instagram", label: "Instagram" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "twitter", label: "Twitter" },
];

export default function NewTemplatePage() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>({
    name: "",
    channel: channelOptions[0].value,
  });
  const [touched, setTouched] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const isNameInvalid = useMemo(() => !form.name.trim(), [form.name]);
  const isSubmitDisabled = submitting || isNameInvalid;

  const handleSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setTouched(true);
      if (isNameInvalid) return;

      setSubmitting(true);
      const created = createTemplate({
        name: form.name.trim(),
        channel: form.channel,
      });
      router.push(`/templates/${created.id}`);
    },
    [form.channel, form.name, isNameInvalid, router]
  );

  const handleCancel = useCallback(() => {
    router.push("/templates");
  }, [router]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-neutral-50 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-2xl bg-white shadow-md border border-neutral-200 p-8 space-y-6"
      >
        <header className="space-y-1">
          <h1 className="text-xl font-semibold text-neutral-900">
            New Template
          </h1>
          <p className="text-sm text-neutral-500">
            Define the basics now. You can refine the layout on the canvas later.
          </p>
        </header>

        <div className="space-y-1">
          <label className="text-sm font-medium text-neutral-800" htmlFor="template-name">
            Template name <span className="text-red-500">*</span>
          </label>
          <input
            id="template-name"
            name="name"
            value={form.name}
            onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
            onBlur={() => setTouched(true)}
            className={`w-full rounded-lg border px-3 py-2 text-sm outline-none transition ${
              touched && isNameInvalid
                ? "border-red-400 focus:ring-2 focus:ring-red-200"
                : "border-neutral-300 focus:ring-2 focus:ring-primary/30"
            }`}
            placeholder="Black Friday Ad"
            autoFocus
            aria-invalid={touched && isNameInvalid}
            required
          />
          {touched && isNameInvalid && (
            <p className="text-xs text-red-500 mt-1">Name is required.</p>
          )}
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-neutral-800" htmlFor="template-channel">
            Channel <span className="text-red-500">*</span>
          </label>
          <select
            id="template-channel"
            name="channel"
            value={form.channel}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                channel: e.target.value as TemplateChannel,
              }))
            }
            className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30"
          >
            {channelOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-2 pt-2">
          <button
            type="submit"
            disabled={isSubmitDisabled}
            className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? "Creating..." : "Create & Open Editor"}
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="text-sm text-neutral-600 hover:text-neutral-900 hover:underline"
          >
            Cancel
          </button>
        </div>

        <div className="text-xs text-neutral-400">
          <Link href="/templates" className="hover:text-neutral-600 hover:underline">
            Back to templates
          </Link>
        </div>
      </form>
    </main>
  );
}
