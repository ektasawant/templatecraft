import {
  createTemplate,
  getTemplateById,
  saveTemplate,
  getTemplates,
} from "@/lib/domain/templates/store";

import type { Template } from "@/lib/domain/templates/types";

describe("Template Store", () => {
  beforeEach(() => {
    // reset localStorage before every test
    localStorage.clear();
  });

  test("createTemplate creates a valid template", () => {
    const tpl = createTemplate({
      name: "Test Template",
      channel: "facebook",
    });

    expect(tpl).toBeDefined();
    expect(tpl.id).toContain("tpl-");
    expect(tpl.name).toBe("Test Template");
    expect(tpl.channel).toBe("facebook");
    expect(tpl.canvas.layers.length).toBe(0);

    const stored = getTemplateById(tpl.id);

    expect(stored).not.toBeNull();
    expect(stored?.name).toBe("Test Template");
  });

  test("saveTemplate updates an existing template", () => {
    const tpl = createTemplate({
      name: "Original Name",
      channel: "facebook",
    });

    const updated: Template = {
      ...tpl,
      name: "Updated Name",
    };

    saveTemplate(updated);

    const result = getTemplateById(tpl.id);
    expect(result?.name).toBe("Updated Name");
  });

  test("getTemplates returns full list", () => {
    createTemplate({ name: "A", channel: "facebook" });
    createTemplate({ name: "B", channel: "facebook" });

    const all = getTemplates();

    expect(all.length).toBe(2);
  });
});
