"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { getTemplates } from "@/lib/domain/templates/store";
import { getDesigns } from "@/lib/domain/designs/store";
import TemplateCard from "@/components/templates/TemplateCard";
import DesignCard from "@/components/templates/DesignCard";

import type { Template } from "@/lib/domain/templates/types";

export default function TemplatesPage() {
  const router = useRouter();

  const [templates, setTemplates] = useState<Template[]>([]);
  const [designs, setDesigns] = useState<Template[]>([]);
  const [hasHydrated, setHasHydrated] = useState(false);

  const [search, setSearch] = useState("");
  const [channelFilter, setChannelFilter] = useState<
    "all" | "facebook" | "instagram"
  >("all");

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTemplates(getTemplates());
    setDesigns(getDesigns());
    setHasHydrated(true);
  }, []);

  // Simple SSR-safe fallback
  if (!hasHydrated) {
    return (
      <main className="min-h-screen flex items-center justify-center text-neutral-500">
        Loading…
      </main>
    );
  }

  // -------- Filtering logic --------
  const filteredTemplates = templates.filter((tpl) => {
    const matchesSearch = tpl.name.toLowerCase().includes(search.toLowerCase());
    const matchesChannel =
      channelFilter === "all" ? true : tpl.channel === channelFilter;
    return matchesSearch && matchesChannel;
  });

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* ================= HEADER ================= */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
          {/* Branding */}
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary text-sm font-semibold">
              TC
            </div>
            <div className="flex flex-col leading-tight">
              <span className="font-semibold text-base">TemplateCraft</span>
              <span className="text-xs text-foreground/60">
                Creative templates &amp; designs
              </span>
            </div>
          </div>

          {/* New Template */}
          <button
            onClick={() => router.push("/templates/new")}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary/90 transition cursor-pointer"
          >
            <span className="text-lg leading-none">+</span>
            <span>New Template</span>
          </button>
        </div>
      </header>

      {/* ================= CONTENT ================= */}
      <div className="max-w-6xl mx-auto px-6 py-8 space-y-10">
        {/* ------ Templates Section ------ */}
        <section className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h1 className="text-2xl font-semibold tracking-tight">Templates</h1>

            <div className="flex flex-col md:flex-row gap-3 md:items-center">
              {/* Search bar */}
              <input
                type="text"
                placeholder="Search templates..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full md:w-72 border border-border rounded-lg px-3 py-2 text-sm bg-card focus:outline-none focus:ring-2 focus:ring-primary/40"
              />

              {/* Channel Filter */}
              <div className="inline-flex rounded-full border border-border bg-card overflow-hidden text-sm">
                {["all", "facebook", "instagram"].map((ch) => (
                  <button
                    key={ch}
                    onClick={() =>
                      setChannelFilter(ch as "all" | "facebook" | "instagram")
                    }
                    className={`px-4 py-1.5 ${
                      channelFilter === ch
                        ? "bg-primary text-white"
                        : "text-foreground/70 hover:bg-muted"
                    }`}
                  >
                    {ch[0].toUpperCase() + ch.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Templates grid */}
          {filteredTemplates.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border bg-card/60 p-8 text-sm text-foreground/60">
              No templates found. Click <strong>New Template</strong> to create
              your first one.
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredTemplates.map((tpl) => (
                <TemplateCard
                  key={tpl.id}
                  template={tpl}
                  onClick={() => router.push(`/templates/${tpl.id}`)}
                />
              ))}
            </div>
          )}
        </section>

        {/* ------ Designs Section ------ */}
        <section className="space-y-4 pb-10">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Saved Designs</h2>
            <span className="text-xs uppercase tracking-wide text-foreground/50">
              {designs.length} saved
            </span>
          </div>

          {designs.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border bg-card/60 p-6 text-sm text-foreground/60">
              Designs created from templates will appear here.
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {designs.map((design) => (
                <DesignCard
                  key={design.id}
                  design={design}
                  onClick={() => router.push(`/designs/${design.id}`)}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
