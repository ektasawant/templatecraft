"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Props = {
  selectedLayerId: string | null;
  onInsert: (text: string) => void;
};

type FormState = {
  prompt: string;
};

const defaultSuggestions: string[] = [];

export default function AICopyHelper({ selectedLayerId, onInsert }: Props) {
  const [form, setForm] = useState<FormState>({ prompt: "" });
  const [suggestions, setSuggestions] = useState<string[]>(defaultSuggestions);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const hasSelection = !!selectedLayerId;
  const disabled = !hasSelection || isGenerating;

  const buildSuggestions = useCallback((base: string) => {
    const topic = base || "your offer";
    return [
      `${topic}: save big today`,
      `${topic}: limited time only`,
      `${topic}: shop now and enjoy perks`,
    ];
  }, []);

  const handleGenerate = useCallback(() => {
    if (!hasSelection) return;
    setIsGenerating(true);
    const next = buildSuggestions(form.prompt.trim());
    timeoutRef.current = setTimeout(() => {
      setSuggestions(next);
      setHasGenerated(true);
      setIsGenerating(false);
    }, 350);
  }, [buildSuggestions, form.prompt, hasSelection]);

  const handleInsert = useCallback(
    (text: string) => {
      if (!hasSelection) return;
      onInsert(text);
    },
    [hasSelection, onInsert]
  );

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <div className="space-y-3 text-sm">
      {!hasSelection && (
        <p className="text-xs text-red-500">
          Select a text layer to insert AI suggestions.
        </p>
      )}

      <div className="space-y-1">
        <label className="text-xs font-medium text-neutral-700" htmlFor="ai-copy-prompt">
          Product / message description
        </label>
        <textarea
          id="ai-copy-prompt"
          rows={3}
          value={form.prompt}
          onChange={(e) => setForm({ prompt: e.target.value })}
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
        {isGenerating ? "Generating..." : "Generate Ideas"}
      </button>

      <div className="space-y-1">
        <p className="text-xs font-medium text-neutral-700">Suggestions</p>
        {!hasGenerated ? (
          <p className="text-xs text-neutral-500">
            Click “Generate Ideas” to see suggestions.
          </p>
        ) : (
          <div className="grid gap-2">
            {suggestions.map((text) => (
              <button
                key={text}
                type="button"
                onClick={() => handleInsert(text)}
                disabled={!hasSelection}
                className={`w-full rounded-md border px-3 py-2 text-left text-sm transition ${
                  hasSelection
                    ? "hover:border-purple-400 hover:bg-purple-50"
                    : "cursor-not-allowed text-neutral-400"
                }`}
              >
                {text}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
