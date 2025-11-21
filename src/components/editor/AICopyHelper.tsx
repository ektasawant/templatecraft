"use client";

import { useState } from "react";

type Props = {
  selectedLayerId: string | null;
  onInsert: (text: string) => void;
};

export default function AICopyHelper({ selectedLayerId, onInsert }: Props) {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = () => {
    if (!selectedLayerId) return;
    setIsGenerating(true);

    const suggestion =
      prompt.trim().length > 0
        ? `${prompt.trim()} – limited time only!`
        : "Big Sale – up to 50% off this week only!";

    setTimeout(() => {
      onInsert(suggestion);
      setIsGenerating(false);
    }, 400);
  };

  const disabled = !selectedLayerId || isGenerating;

  return (
    <div className="space-y-3 text-sm">
      {!selectedLayerId && (
        <p className="text-xs text-red-500">
          Select a text layer to insert AI suggestions.
        </p>
      )}

      <div className="space-y-1">
        <label className="text-xs font-medium text-neutral-700">
          Product / message description
        </label>
        <textarea
          rows={3}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g., Luxury running shoes for marathon runners..."
          className="w-full rounded-md border border-neutral-300 px-2 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-purple-500/40"
        />
      </div>

      <button
        type="button"
        disabled={disabled}
        onClick={handleGenerate}
        className={`w-full rounded-md px-3 py-2 text-sm font-medium transition ${
          disabled
            ? "bg-neutral-200 text-neutral-500 cursor-not-allowed"
            : "bg-purple-600 text-white hover:bg-purple-700"
        }`}
      >
        {isGenerating ? "Generating…" : "Generate Ideas"}
      </button>
    </div>
  );
}
