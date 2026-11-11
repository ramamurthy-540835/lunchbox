import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const read = (path: string) => readFileSync(new URL(path, import.meta.url), "utf8");

describe("LunchBox V2 customer pages", () => {
  it("puts the promise preview before the preserved hero and menu", () => {
    const home = read("../app/page.tsx");
    expect(home.indexOf("className=\"promise-preview\"")).toBeLessThan(home.indexOf("className=\"hero\""));
    expect(home.indexOf("className=\"hero\"")).toBeLessThan(home.indexOf("className=\"menu-section\""));
    expect(home).toContain("Big nutrition for");
    expect(home).toContain("startLunchStory()");
    expect(home).toContain("Read more");
  });

  it("uses an accessible grouped menu with real routes and Escape handling", () => {
    const menu = read("../components/PrimaryMenu.tsx");
    expect(menu).toContain("<summary aria-controls=\"primary-menu-panel\">Menu</summary>");
    expect(menu).toContain("event.key !== \"Escape\"");
    expect(menu).toContain("/our-promise");
    expect(menu).toContain("/how-it-works");
    expect(menu).toContain("/register/college");
  });

  it("provides separate promise and ordering guide pages", () => {
    expect(read("../app/our-promise/page.tsx")).toContain("Trusted by Schools");
    const how = read("../app/how-it-works/page.tsx");
    expect(how).toContain("Choose an eligible school");
    expect(how).toContain("Complete checkout");
    expect(how).toContain("School-based delivery");
  });
});
