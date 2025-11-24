"use client";

import { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import { getDesignById, updateDesignMeta } from "@/lib/domain/designs/store";
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
const defaultChannel = channelOptions[0].value;

export default function EditDesignPage() {
  const router = useRouter();
  const params = useParams();

  const designId = useMemo(() => {
    const raw = params?.id;
    if (typeof raw === "string") return raw;
    if (Array.isArray(raw) && raw.length > 0) return raw[0];
    return "";
  }, [params]);

  const design = useMemo(
    () => (designId ? getDesignById(designId) : null),
    [designId]
  );

  const isMissing = !designId || !design;

  const handleSave = useCallback(
    (form: FormState) => {
      if (isMissing) return;
      updateDesignMeta(designId, {
        name: form.name.trim(),
        channel: form.channel,
      });
      router.push(`/designs/${designId}`);
    },
    [designId, isMissing, router]
  );

  const handleCancel = useCallback(() => {
    router.push(designId ? `/designs/${designId}` : "/designs");
  }, [designId, router]);

  if (isMissing) {
    return (
      <main className="min-h-screen bg-neutral-50 p-8">
        <div className="max-w-lg mx-auto space-y-4 text-neutral-600">
          <div className="text-sm">Design not found.</div>
          <Link
            href="/designs"
            className="inline-flex items-center rounded-md border border-neutral-300 px-4 py-2 text-sm hover:bg-neutral-100"
          >
            Back to designs
          </Link>
        </div>
      </main>
    );
  }

  const formKey = `${designId}-${design.name}-${design.channel}`;

  return (
    <main className="min-h-screen bg-neutral-50 p-8">
      <EditDesignForm
        key={formKey}
        initialName={design.name}
        initialChannel={design.channel}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    </main>
  );
}

type EditDesignFormProps = {
  initialName: string;
  initialChannel: TemplateChannel;
  onSave: (form: FormState) => void;
  onCancel: () => void;
};

function EditDesignForm({
  initialName,
  initialChannel,
  onSave,
  onCancel,
}: EditDesignFormProps) {
  const [form, setForm] = useState<FormState>({
    name: initialName ?? "",
    channel: initialChannel ?? defaultChannel,
  });

  const isNameInvalid = !form.name.trim();
  const isDirty =
    form.name !== (initialName ?? "") ||
    form.channel !== (initialChannel ?? defaultChannel);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isNameInvalid) return;
    onSave(form);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-lg mx-auto bg-white border rounded-xl shadow-sm p-6 space-y-6"
    >
      <h1 className="text-xl font-semibold">Edit Design</h1>

      <div className="space-y-4">
        <div>
          <label
            className="block text-sm font-medium mb-1"
            htmlFor="design-name"
          >
            Name
          </label>
          <input
            id="design-name"
            name="name"
            value={form.name}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, name: e.target.value }))
            }
            className="w-full border rounded px-3 py-2 text-sm"
            aria-invalid={isNameInvalid}
            required
            autoFocus
          />
        </div>

        <div>
          <label
            className="block text-sm font-medium mb-1"
            htmlFor="design-channel"
          >
            Channel
          </label>
          <select
            id="design-channel"
            name="channel"
            value={form.channel}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                channel: e.target.value as TemplateChannel,
              }))
            }
            className="w-full border rounded px-3 py-2 text-sm"
          >
            {channelOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <button
          type="submit"
          disabled={!isDirty || isNameInvalid}
          className="w-full bg-primary text-white py-2 rounded-md text-sm font-medium hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Save changes
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="w-full text-neutral-600 py-2 text-sm hover:text-neutral-800"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
