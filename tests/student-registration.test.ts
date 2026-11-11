import { describe, expect, it } from "vitest";
import { gradeBandForStandard, normalizeSection, standardsForGradeBand } from "@/lib/student-registration";

describe("school student class and section", () => {
  it.each([[6, "6-8"], [7, "6-8"], [8, "6-8"], [9, "9-10"], [10, "9-10"], [11, "11-12"], [12, "11-12"]] as const)(
    "maps class %i into the existing %s grade band",
    (standard, gradeBand) => expect(gradeBandForStandard(standard)).toBe(gradeBand),
  );

  it.each([5, 13, "LKG", "", null])("rejects unsupported class %s", (standard) => {
    expect(gradeBandForStandard(standard)).toBeNull();
  });

  it("offers only classes within the selected grade band", () => {
    expect(standardsForGradeBand("9-10")).toEqual([9, 10]);
  });

  it("trims and validates section names", () => {
    expect(normalizeSection("  Blue   House ")).toBe("Blue House");
    expect(normalizeSection("")).toBeNull();
    expect(normalizeSection("!invalid")).toBeNull();
  });
});
